#!/usr/bin/env python3
"""Usage: grade.py file.md|dist/page/index.html [file2 ...]"""
import re, sys

def syllables(w):
    w = re.sub(r'[^a-z]', '', w.lower())
    if not w: return 0
    if len(w) <= 3: return 1
    w = re.sub(r'(?:[^laeiouy]es|ed|[^laeiouy]e)$', '', w)
    w = re.sub(r'^y', '', w)
    return max(1, len(re.findall(r'[aeiouy]{1,2}', w)))

def prose(text):
    faq = []
    m = re.match(r'^---\n(.*?)\n---\n', text, re.S)
    if m:
        faq = re.findall(r'^\s+a:\s*"(.*)"\s*$', m.group(1), re.M)
        text = text[m.end():]
    lines = [s.strip() for s in text.split('\n')]
    lines = [s for s in lines if s and not s.startswith(('|', '#', '<div', '<figure'))]
    body = ' '.join(lines + faq)
    body = re.sub(r'<[^>]+>', ' ', body)
    body = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', body)
    return re.sub(r'[*_`]', '', body)

def html_prose(text):
    m = re.search(r'<main[^>]*>(.*)</main>', text, re.S)
    text = m.group(1) if m else text
    for tag in ('script', 'style', 'svg', 'table', 'h1', 'h2', 'h3', 'h4', 'figcaption'):
        text = re.sub(rf'<{tag}[^>]*>.*?</{tag}>', ' ', text, flags=re.S)
    text = re.sub(r'<(span|p|dt)[^>]*class="(kicker|pill|specs-title|answer-label|spec-label|spec-value)[^"]*"[^>]*>.*?</\1>', ' ', text, flags=re.S)
    text = re.sub(r'</(p|li|dd|dt)>', '. ', text)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'&[a-z]+;|&#\d+;', ' ', text)
    text = re.sub(r'\.\s*\.', '.', text)
    return re.sub(r'\s+', ' ', text)

def sentences(body):
    parts = re.split(r'(?<=[.!?])\s+(?=[A-Z0-9"“(])', body)
    return [p.strip() for p in parts if re.search(r'[A-Za-z]', p)]

def fk(sents):
    words = [w for s in sents for w in re.findall(r"[A-Za-z0-9'’.-]+", s) if re.search(r'[A-Za-z]', w)]
    if not sents or not words: return 0
    syl = sum(syllables(w) for w in words)
    return 0.39 * len(words) / len(sents) + 11.8 * syl / len(words) - 15.59

for path in sys.argv[1:]:
    raw = open(path).read()
    s = sentences(html_prose(raw) if path.endswith('.html') else prose(raw))
    print(f'{path}: grade {fk(s):.1f}')
    for h in sorted(s, key=lambda x: fk([x]), reverse=True)[:8]:
        print(f'   {fk([h]):5.1f}  {h[:160]}')
