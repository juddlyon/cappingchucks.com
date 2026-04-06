# CappingChucks.com

B2B technical reference site for precision capping chucks and headsets. Built to season the domain with high-intent industrial packaging keywords.

## Stack

- Astro (static output)
- Tailwind CSS v4 (`@tailwindcss/vite`)
- `astro-seo` for meta/OG/Twitter cards
- `@astrojs/sitemap` for sitemap generation

## Build & Deploy

- `npm run build` outputs to `dist/`
- Hosted on Netlify (project: `cappingchucks`), auto-deploys from `main` branch
- GitHub repo: `juddlyon/cappingchucks.com`
- Custom domain: `cappingchucks.com` (DNS via Cloudflare)

## Project Structure

```
src/
├── components/       # Section components (Hero, TechnicalOverview, FAQ, etc.)
├── layouts/          # BaseLayout.astro (SEO, nav, footer, schema.org)
├── pages/            # index.astro (imports and composes components)
└── styles/           # global.css (Tailwind @theme tokens, component styles)
public/
├── images/           # Pexels stock photos (free license)
└── robots.txt
```

## SEO/AEO

- Schema.org WebPage + FAQPage structured data
- Twitter cards + Open Graph via astro-seo
- Semantic HTML: `<dl>/<dt>/<dd>` for glossary, `<figure>/<figcaption>` for images
- Sitemap at `/sitemap-index.xml` (submitted to GSC)
- Lighthouse: 100 a11y, 100 best practices, 100 SEO

## Design

- Light theme (warm paper background, teal accents)
- Typography: Outfit (headings), Source Serif 4 (body), IBM Plex Mono (data)
- Single-column document layout (max-w-3xl), technical manual aesthetic
- All color tokens pass WCAG AA contrast

## CLI Tools (global Node)

- `seo-pulse` — GSC client for search performance data (impressions, clicks, ranking queries)
- `internal-linker` — internal linking utility

## Content Notes

- No em dashes in copy
- Direct, engineer-to-engineer tone (not marketing/AI voice)
- OEM brand references verified: Zalkin/ProMach, Krones, AROL/BW Packaging, CSI, Fowler/ProMach, Tedelta
- Standards referenced: ASTM D3198, ISBT Voluntary Standard, 16 CFR §1700, EU SUPD
