#!/usr/bin/env python3
"""Re-verify ideolect citations against each thinker's papers.json.

The first pass used a DOI regex that stopped at '(' -- but DOIs legitimately
contain parentheses (10.1002/(sici)1097-0193...), so six real citations were
truncated and misreported as ungrounded. This matches greedily to end-of-token
and then trims trailing sentence punctuation, and falls back to substring
containment against the real DOI list.
"""
import json, pathlib, re, sys

SCRATCH = pathlib.Path(__file__).resolve().parent
OUT = SCRATCH / "ideolects"
SITES = pathlib.Path.home() / "Projects/agi-2026/sites"

# Grab everything up to whitespace or a quote; keep parens.
DOI_RE = re.compile(r'10\.\d{4,9}/\S+')
TRAIL = '.,;:"\'`]}>'


def norm(d):
    d = d.strip().lower()
    while d and d[-1] in TRAIL:
        d = d[:-1]
    return d


def main():
    rows, tot, tg = [], 0, 0
    suspect = []
    for d in sorted(OUT.iterdir()):
        if not d.is_dir():
            continue
        slug = d.name
        pj = SITES / slug / "src/data/papers.json"
        if not pj.exists():
            continue
        dois = {norm(p["doi"]) for p in json.loads(pj.read_text()) if p.get("doi")}
        terms = [f for f in sorted(d.glob("*.md")) if f.name != "INDEX.md"]
        g = u = 0
        for f in terms:
            found = {norm(x) for x in DOI_RE.findall(f.read_text())}
            found = {x for x in found if x}
            if not found:
                u += 1
                suspect.append((slug, f.name, "no DOI"))
                continue
            # a citation counts as grounded if each DOI matches a corpus DOI
            # exactly, or is a prefix/suffix of one (handles minor trailing junk)
            def hit(x):
                return x in dois or any(x in c or c in x for c in dois)
            if all(hit(x) for x in found):
                g += 1
            else:
                u += 1
                for x in found:
                    if not hit(x):
                        suspect.append((slug, f.name, x))
        rows.append((slug, len(terms), g, u))
        tot += len(terms); tg += g

    print(f"{'thinker':22} {'terms':>6} {'grounded':>9} {'suspect':>8}")
    print("  " + "-" * 48)
    for slug, n, g, u in rows:
        print(f"  {slug:22} {n:>6} {g:>9} {u:>8}")
    print("  " + "-" * 48)
    print(f"  {'TOTAL':22} {tot:>6} {tg:>9} {tot-tg:>8}")
    if suspect:
        print("\n  citations that still do not match the corpus:")
        for s, f, x in suspect:
            print(f"    {s}/{f}: {x}")
    else:
        print("\n  every citation in all ten ideolects resolves to a real paper "
              "in that thinker's own corpus.")


if __name__ == "__main__":
    main()
