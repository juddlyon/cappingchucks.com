// Checks the built site in dist/: routes, one H1, unique titles, canonicals,
// internal links and anchors, robots.txt, sitemap, and no hotlinked images.
import { readFileSync, existsSync } from 'node:fs';
import { globSync } from 'node:fs';

const SITE = 'https://cappingchucks.com';
const errors = [];
const pages = {};

for (const f of globSync('dist/**/index.html')) {
    const url = '/' + f.slice('dist/'.length, -'index.html'.length);
    pages[url] = readFileSync(f, 'utf8');
}
if (existsSync('dist/404.html')) pages['/404/'] = readFileSync('dist/404.html', 'utf8');
else errors.push('dist/404.html missing');
if (!Object.keys(pages).length) errors.push('No pages in dist/. Run npm run build first.');

const ids = {};
const titles = {};
for (const [url, html] of Object.entries(pages)) {
    ids[url] = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    const h1 = (html.match(/<h1[\s>]/g) || []).length;
    if (h1 !== 1) errors.push(`${url}: ${h1} H1 tags`);
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
    if (!title) errors.push(`${url}: no <title>`);
    else if (titles[title]) errors.push(`${url}: title duplicates ${titles[title]}`);
    else titles[title] = url;
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    if (canonical !== SITE + url) errors.push(`${url}: canonical is ${canonical}`);
    if (/\s(src|srcset)="https?:/.test(html)) errors.push(`${url}: hotlinked src or srcset`);
}

for (const [url, html] of Object.entries(pages)) {
    for (const [, href] of html.matchAll(/href="(\/[^"]*|#[^"]*)"/g)) {
        const [path, frag] = href.startsWith('#') ? [url, href.slice(1)] : href.split('#');
        if (path.startsWith('/_astro/') || /\.[a-z0-9]+$/i.test(path)) {
            if (!existsSync('dist' + path)) errors.push(`${url}: missing file ${href}`);
            continue;
        }
        if (!pages[path]) errors.push(`${url}: broken link ${href}`);
        else if (frag && !ids[path].has(frag)) errors.push(`${url}: missing anchor ${href}`);
    }
}

const robots = existsSync('dist/robots.txt') ? readFileSync('dist/robots.txt', 'utf8') : '';
if (!/Allow: \//.test(robots) || !robots.includes(`${SITE}/sitemap-index.xml`)) errors.push('robots.txt missing Allow or Sitemap');

const sitemap = globSync('dist/sitemap-*.xml').filter((f) => !f.endsWith('index.xml')).map((f) => readFileSync(f, 'utf8')).join('');
for (const url of Object.keys(pages)) {
    if (url === '/404/') continue;
    if (!sitemap.includes(`<loc>${SITE}${url}</loc>`)) errors.push(`sitemap missing ${url}`);
}

if (errors.length) {
    console.error(`verify: ${errors.length} problem(s)`);
    for (const e of errors) console.error('  ' + e);
    process.exit(1);
}
console.log(`verify: ${Object.keys(pages).length} pages OK`);
