# papers-REPORT.md

**Track:** papers adapter + academic corpora (Friston, Goertzel)  
**Date:** 2026-06-21  
**Worker:** agi-2026 papers (deterministic adapter)  
**Rules followed:** ONLY edited in `adapters/papers/`, wrote outputs to `raw/` + `sites/<slug>/`; no netlify, no git push, no deploy, no secrets printed.

## Summary
Built reusable deterministic (no-LLM) OpenAlex adapter at `adapters/papers/pull_papers.mjs`.

Pulled corpora for the two academic anchors:
- **Karl Friston** (most-cited 400 of ~1960)
- **Ben Goertzel** (all 413)

All records written in:
- Verbatim raw: `raw/papers-<slug>.jsonl`
- Site-ready Levinese schema: `sites/<slug>/papers/<doi-ish>.json` (one per work)

## Author IDs resolved
- **Karl Friston**
  - OpenAlex: `A5086852785`
  - ORCID: `0000-0001-7984-8909` (resolved via ORCID filter first, name confirmed)
  - Works in OpenAlex: ~1960; cited_by_count ~305k
- **Ben Goertzel**
  - OpenAlex: `A5038877365`
  - ORCID: `0000-0002-2787-3464`
  - Name search disambiguated (improved scorer prefers display_name containing query tokens + "Goertzel")

## Counts
- Friston (capped): 400 works
- Goertzel: 413 works
- Total raw lines: 813
- Total site-ready JSON: 813 (guaranteed 1:1 via unique `doi-slug--W<openalex-id>`; handled rare same-doi cases e.g. book + chapter variants)

## Output paths
- `raw/papers-karl-friston.jsonl` (11.5 MB)
- `raw/papers-ben-goertzel.jsonl` (4.4 MB)
- `sites/karl-friston/papers/*.json` (400 files)
- `sites/ben-goertzel/papers/*.json` (413 files)

## Caps and notes
- Friston: `--cap 400 --sort cited_by_count:desc` (per brief; noted here for v0)
- Paging: cursor-based, per-page=200, polite delays + UA + retries
- Abstract: reconstructed from `abstract_inverted_index` when `abstract` field null (standard OpenAlex)
- Journal: `primary_location.source.display_name` (host_venue fallback)
- DOI handling: bare `doi`, full `doi_url`, slug = doi with [/. :] → `-` + `--W<id>` suffix for uniqueness
- Schema emitted (Levinese papers content):
  ```json
  {
    "doi": "10.1002/...",
    "doi_url": "https://doi.org/10.1002/...",
    "title": "...",
    "year": "1994",
    "journal": "Human Brain Mapping",
    "authors": ["Karl Friston", ...],
    "abstract": "...",
    "link": "https://doi.org/..."
  }
  ```
- Some records lack DOI (rare) → slug falls back to `openalex-W...`

## Sample titles + years
**Friston (top cited):**
- 1994  Statistical parametric maps in functional imaging: A general linear approach
- 2000  Voxel-Based Morphometry—The Methods
- 2010  The free-energy principle: a unified brain theory?
- 2005  Unified segmentation
- 2005  A theory of cortical responses

**Goertzel:**
- 2014  Artificial General Intelligence: Concept, State of the Art, and Future Prospects
- 2007  Artificial General Intelligence
- 2012  Mapping the Landscape of Human‐Level Artificial General Intelligence
- 2018  Distributed, decentralized, and democratized artificial intelligence
- 2010  A world survey of artificial brain projects, Part II: Biologically inspired cognitive architectures

## Reusability
The adapter (`pull_papers.mjs`) is general:
- `--name`, `--orcid`, `--author-id`, `--slug`, `--cap N`, `--sort ...`
- Exports helpers for future thinkers (Fields, Spivak, Koch, ...)

## Verification steps performed
- Author resolution via ORCID + name search (with name-match scoring)
- Cursor pagination loop + 200/page
- Raw verbatim round-trip check
- Site schema fields present + abstract reconstruction tested on real inverted_index records
- 1:1 work→file after handling DOI collisions
- File counts, sample titles, bare DOI, doi_url, link all sane
- No network secrets, no deploy steps executed

## Next
Ready for reuse on additional academic anchors. Raw + sites/ populated per BUILD.md layout. Report complete.

---

**Adapter entrypoint:** `adapters/papers/pull_papers.mjs`  
**Invocation examples (for future):**  
`node adapters/papers/pull_papers.mjs --name "Chris Fields" --slug chris-fields --cap 300 --sort cited_by_count:desc`  
`node adapters/papers/pull_papers.mjs --orcid 0000-... --slug ...`