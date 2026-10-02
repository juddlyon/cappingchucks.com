#!/usr/bin/env python3
import re, os, glob, collections, html, sys
pages = {}
for f in glob.glob('dist/**/index.html', recursive=True):
    d = os.path.dirname(f)
    url = '/' if d == 'dist' else '/' + os.path.relpath(d, 'dist') + '/'
    if url == '/404/': continue
    s = open(f).read()
    m = re.search(r'<main[^>]*>(.*)</main>', s, re.S)
    main = m.group(1) if m else ''
    main = re.sub(r'<nav class="page-toc".*?</nav>', '', main, flags=re.S)
    main = re.sub(r'<nav class="usa-breadcrumb".*?</nav>', '', main, flags=re.S)
    links = re.findall(r'<a [^>]*href="(/[^"#]*)(#[^"]*)?"[^>]*>(.*?)</a>', main, re.S)
    pages[url] = [(h, html.unescape(re.sub(r'<[^>]+>', '', t)).strip()) for h, _, t in links]
inb = collections.defaultdict(list)
for src, ls in pages.items():
    for h, t in ls:
        if h != src and h in pages: inb[h].append((src, t))
print(f"{'page':46} in-pages in-links out-uniq")
for p in sorted(pages, key=lambda p: len({s for s, _ in inb[p]})):
    out = {h for h, _ in pages[p] if h != p and h in pages}
    print(f"{p:46} {len({s for s, _ in inb[p]}):>8} {len(inb[p]):>8} {len(out):>8}")
if '-a' in sys.argv:
    for p in sorted(pages):
        print(p, '<-', collections.Counter(t.lower() for _, t in inb[p]).most_common(12))
