# CappingChucks.com

B2B technical reference site for precision capping chucks and headsets. Built to season the domain with high-intent industrial packaging keywords.

## Stack

- Astro (static output)
- Tailwind CSS v4 (`@tailwindcss/vite`)
- `astro-seo` for meta/OG/Twitter cards
- `@astrojs/sitemap` for sitemap generation

## Build & Deploy

- `npm run build` outputs to `dist/`. `npm run verify` checks it.
- Deploy with `npm run deploy` (local build, verify, CLI upload to Netlify), then push. Netlify Git builds are stopped, so pushing alone deploys nothing. Follows `~/projects/emd-site-sop.md`.
- Hosted on Netlify (project: `cappingchucks`). Hosting details are in `README.md`.
- GitHub repo: `juddlyon/cappingchucks.com`
- Custom domain: `cappingchucks.com` (DNS via Cloudflare)

## Project Structure

```
src/
├── assets/images/    # Pexels photos (free license), optimized by astro:assets
├── components/       # PageHero, ChuckDiagram, FAQ (other components are unused)
├── layouts/          # BaseLayout.astro (SEO, fonts, nav, footer, schema.org)
├── pages/            # One .astro file per page, plus 404.astro
└── styles/           # global.css (Tailwind @theme tokens, component styles)
public/               # favicon.svg, apple-touch-icon.png, og-image.png, robots.txt, _redirects
scripts/              # verify.mjs, linkmap.py, grade.py
```

## SEO/AEO

- Schema.org WebPage/TechArticle, BreadcrumbList, FAQPage (homepage), DefinedTermSet (glossary)
- Twitter cards + Open Graph via astro-seo
- Semantic HTML: `<dl>/<dt>/<dd>` for glossary, `<figure>/<figcaption>` for images
- Sitemap at `/sitemap-index.xml` (submitted to GSC)
- Lighthouse: 100 a11y, 100 best practices, 100 SEO

## Design

- Light theme: white background, blue hero (#0057b8), yellow answer box, red/green/yellow accents
- Typography: Jost (headings), Nunito Sans (body), self-hosted via Astro `fonts` config
- Cards, spec boxes, and numbered steps inside a max-w-64rem wrap. CSS is inlined at build.
- All color tokens pass WCAG AA contrast

## CLI Tools (global Node)

- `seo-pulse` — GSC client for search performance data (impressions, clicks, ranking queries)
- `internal-linker` — internal linking utility

## Content Notes

- No em dashes in copy
- Direct, engineer-to-engineer tone (not marketing/AI voice)
- OEM brand references verified: Zalkin/ProMach, Krones, AROL (independent, Canelli, Italy), CSI, Tedelta
- Standards referenced: ASTM D2063 and D7860 (D3198 was withdrawn in 2016, don't cite it), ISBT threadspecs, CETIE GME data sheets, 16 CFR §1700, EU SUPD (Directive 2019/904)
