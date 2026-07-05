# Worker brief: the papers adapter + academic corpora (Friston, Goertzel)

You are an engineering worker on Mike's Mac. Read `~/Projects/agi-2026/BUILD.md` first.
Work ONLY in `~/Projects/agi-2026/adapters/papers` (script) and write corpus output to
`~/Projects/agi-2026/raw/` and `~/Projects/agi-2026/sites/<slug>/`-ready JSON. HARD RULES:
no `netlify`, no `git push`, no deploy. Don't print secrets. Write `papers-REPORT.md`.

## Build `adapters/papers/pull_papers.mjs` (or .py)
A deterministic adapter (no LLM) that pulls a thinker's scholarly works from **OpenAlex**
(free, no API key: `https://api.openalex.org/works?filter=author.id:<OAID>` or
`...author.orcid:<orcid>` or a name search to resolve the author id first via
`https://api.openalex.org/authors?search=<name>`). Page through results (per-page 200,
cursor paging). For each work emit a record matching the Levinese `papers` content schema:
`{ doi, doi_url, title, year, journal (host_venue/primary_location), authors[], abstract
(reconstruct from abstract_inverted_index), link }`. Write:
- raw: `raw/papers-<slug>.jsonl` (one work per line, verbatim from OpenAlex)
- site-ready: `sites/<slug>/papers/*.json` (one file per work, Levinese schema), slug = DOI-ish

## Run it for the two academic anchors
- **Karl Friston** — resolve his OpenAlex author id (ORCID 0000-0001-7984-8909 if it
  resolves; else name search "Karl Friston" UCL). VERY prolific (1000+ works) — cap at
  the most-cited ~400 (sort by cited_by_count desc) for v0; note the cap in the report.
- **Ben Goertzel** — name search "Ben Goertzel" / "Benjamin Goertzel"; pull works.

Verify counts are sane (Friston should be hundreds). Print a few sample titles+years.
Report: author ids resolved, counts per thinker, output paths, any caps. This adapter is
reused for every academic thinker (Fields, Spivak, Koch, …) later.
