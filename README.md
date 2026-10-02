# cappingchucks.com

Plain-English reference site for capping chucks, headsets, cap torque, and cap sizes. Astro static site.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Build to `dist/` |
| `npm run verify` | Check `dist/`: one H1, unique titles, canonicals, links, anchors, robots, sitemap, no hotlinked images |
| `npm run deploy` | Build, verify, and upload `dist/` to Netlify production |
| `npm run deploy:preview` | Same, to a draft URL |
| `python3 scripts/linkmap.py [-a]` | Body-link counts per page (`-a` shows anchor text). Run after build. |
| `python3 scripts/grade.py <file>` | Flesch-Kincaid grade |

Deploy with `npm run deploy`, then push to GitHub so the repo matches production. Pushing alone deploys nothing.

## Hosting

| Setting | Value |
| --- | --- |
| Netlify site | `cappingchucks` (id `b9f74190-8bc2-4222-96ee-d88dfa2e9912`) |
| Deploy method | Local build, CLI upload (`netlify deploy --prod --dir=dist --no-build`). Git builds stopped. |
| Custom domain | `cappingchucks.com`, `www` redirects to apex (Netlify) |
| TLS | Netlify certificate for apex and `www`. Force HTTPS on. |
| Host redirect | `cappingchucks.netlify.app/*` 301 to `cappingchucks.com` (`public/_redirects`) |
| DNS | Cloudflare zone `46f53c3d2e6f6999a59c7f1f62aa41bf`, nameservers `lila` and `wesley.ns.cloudflare.com` |
| DNS records | Proxied CNAMEs for apex and `www` to `cappingchucks.netlify.app`. TXT for Search Console. |
| Registrar | Porkbun |
| Search Console | Domain property `sc-domain:cappingchucks.com` |
| Repo | `juddlyon/cappingchucks.com` |
