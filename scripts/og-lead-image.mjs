// Astro integration: each page's social image is its own lead image, never a site-wide text banner.
// After the build, for every HTML page it finds the first content image in the page body (logos, icons and thumbnails are skipped), writes a 1200 x 630 JPG to /img/og/,
// and points og:image, twitter:image and schema image at it. Pages with no image of their own use the homepage's.
// Usage in astro.config.mjs: integrations: [ogLeadImage({ placeholder: '/og-image.png' })]
// `placeholder` is the site-wide image path the layout emits. Every absolute URL to it is rewritten.
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

// Largest local raster candidate from an <img>: the widest srcset entry, or src.
function source(tag) {
  const candidates = (attr(tag, 'srcset') ?? '').split(',').map(c => c.trim().split(/\s+/)).filter(c => c[0]).map(([url, w]) => ({ url, w: parseInt(w) || 0 }));
  candidates.push({ url: attr(tag, 'src') ?? '', w: Number(attr(tag, 'width')) || 0 });
  return candidates.filter(c => c.url.startsWith('/') && /\.(webp|jpe?g|png|avif)$/i.test(c.url.split('?')[0])).sort((a, b) => b.w - a.w)[0];
}

function lead(html) {
  const body = html.slice(html.indexOf('<body'));
  for (const [tag] of body.matchAll(/<img\s[^>]*>/g)) {
    const pick = source(tag);
    // Skip logos, icons and thumbnails.
    if (!pick || /\/(logos?|icons?|usa-icons|favicons)\//.test(pick.url) || (pick.w && pick.w < 400)) continue;
    return { url: pick.url.split('?')[0], alt: attr(tag, 'alt') ?? '' };
  }
}

export default function ogLeadImage({ placeholder }) {
  let site;
  return {
    name: 'og-lead-image',
    hooks: {
      'astro:config:done': ({ config }) => { site = config.site.replace(/\/$/, ''); },
      'astro:build:done': async ({ dir, logger }) => {
        const pages = (await readdir(dir, { recursive: true })).filter(f => f.endsWith('.html'));
        const html = Object.fromEntries(await Promise.all(pages.map(async p => [p, await readFile(new URL(p, dir), 'utf8')])));
        const home = lead(html['index.html'] ?? '');
        await mkdir(new URL('img/og/', dir), { recursive: true });
        const written = new Set();
        for (const page of pages) {
          if (!html[page].includes(site + placeholder)) continue;
          const image = lead(html[page]) ?? home;
          if (!image) throw new Error(`og-lead-image: ${page} has no lead image and the homepage has none to fall back on`);
          const name = decodeURIComponent(image.url.split('/').pop()).replace(/\.[^.]+$/, '').replace(/[^\w-]+/g, '-');
          if (!written.has(name)) {
            const photo = sharp(fileURLToPath(new URL(decodeURIComponent(image.url.slice(1)), dir)));
            const { width, height } = await photo.metadata();
            const ratio = width / height;
            // Photos close to the social shape are cropped to fill it. Others are fitted whole on white so the subject is not cut off.
            const fit = ratio >= 1.4 && ratio <= 2.4 ? { fit: 'cover', position: 'attention' } : { fit: 'contain', background: '#ffffff' };
            await photo.resize({ width: 1200, height: 630, ...fit }).flatten({ background: '#ffffff' }).jpeg({ quality: 82, mozjpeg: true }).toFile(fileURLToPath(new URL(`img/og/${name}.jpg`, dir)));
            written.add(name);
          }
          let out = html[page].replaceAll(site + placeholder, `${site}/img/og/${name}.jpg`).replaceAll('content="image/png"', 'content="image/jpeg"');
          if (image.alt) out = out.replace(/(<meta (?:property="og:image:alt"|name="twitter:image:alt") content=")[^"]*"/g, `$1${image.alt}"`);
          await writeFile(new URL(page, dir), out);
        }
        logger.info(`${written.size} social images for ${pages.length} pages`);
      },
    },
  };
}
