# CORPUS-CATALOG.md — per-thinker corpus inventory + gap list

**Purpose:** dispatch board for harvest agents + public task board for distributed contributors.
**Compiled:** 2026-07-17, Dee (Sonnet), via direct filesystem audit — `wc -l` on every `raw/*.jsonl`,
a live LanceDB query against `index/store/`, `curl` HTTP checks on every claimed-live URL, and
cross-checks against `.briefs/*-REPORT.md`, `gather-run.log`, `scrape-more.log`, `IDEAS.md`.
No web search was used to invent identifiers — anything not confirmed on disk is marked
**UNVERIFIED** and must be resolved before a harvest agent can run.

**Repo:** `~/Projects/agi-2026` (this monorepo) + two external sibling repos that are the REAL
homes for the two richest anchors: `~/Projects/Levinese` (Michael Levin, live at
levinese-preview.netlify.app) and `~/Projects/Joscha` (Joscha Bach, live at joschese.netlify.app).
`sites/michael-levin` and `sites/joscha-bach` inside this monorepo are thin, undeployed stubs —
do not confuse them with the real sites. See `~/Projects/agi-2026/CLAUDE.md` "Live topology" for
the canonical map; this catalog does not repeat deploy mechanics.

---

## Headline numbers

- **Roster = 20** confirmed AGI-26 keynotes (`BUILD.md`). Of those:
  - **4 fully covered** (anchor tier, live site + papers or X corpus + index namespace): Levin, Bach, Friston, Goertzel.
  - **5 partial** (live subsite deployed, but thin — video-metadata-only, zero papers, zero real transcripts): Gopnik, Eagleman, Seth, Marcus*, Ororbia* (*Marcus and Ororbia also have papers, so they're the strongest of the "partial" tier).
  - **11 empty** (no `raw/`, no `sites/<slug>/`, no index namespace, nothing): Gershenfeld, Blackburn, Mostaque, Lerchner, Hulme, Wissner-Gross, Meredith, Rassool, Habibi, Hazan, Urban. This exact 11-name list is self-identified in `IDEAS.md:98` (2026-06-21) — confirmed still true today, zero progress since.
- **3 bonus marquee-tier entries** have partial data but are NOT in the confirmed roster and have NO deployed site: Christof Koch (200 papers + 25 video stubs), David Spivak (25 video stubs only), Chris Fields (25 video stubs only, OpenAlex resolution failed).
- **Universal gap, no exceptions:** nobody has a real video transcript. Every video record in `raw/videos-*.jsonl` (283 records across 12 people) has `has_transcript:false` / `transcript_chars:null`. The "video corpus" today is yt-dlp flat-playlist metadata (title/url/duration/channel/views) only — not content. (Note: the task brief's estimate of "~8K stubs" for `videos-*.jsonl` overstates actual volume — verified total is **283 records**, not 8K.)
- **X/Twitter corpus exists for exactly 2 people**: Joscha Bach (`raw/Plinz.jsonl`, 2,206 tweets) and Ben Goertzel (`raw/bengoertzel.jsonl`, 318 tweets — scraper hit "X search-history wall," this is the full available history, not a partial pull). One additional handle (`@philiprosedale`, not on the roster) was attempted and returned 0 — likely wrong/protected handle, not investigated further.
- **LanceDB index (`index/store/`) currently holds 4,303 chunks across 12 thinker namespaces** (verified live query, 2026-07-17 — supersedes the 3,500-chunk figure in the stale `index-REPORT.md`): michael-levin, joscha-bach, karl-friston, ben-goertzel, alexander-ororbia, gary-marcus, christof-koch, alison-gopnik, anil-seth, david-eagleman, chris-fields, david-spivak. **8 of the 20 roster names have zero index presence** even beyond the 11 fully-empty (i.e., no namespace exists for anyone not already covered above).

---

## 1. Inventory table

Legend: **P**=papers jsonl count, **X**=X/tweet count, **V**=video-stub count, **Ext**=external
corpus dir, **Idx**=present in `index/store/` LanceDB namespace, **Site**=`sites/<slug>/` built
locally, **Live**=deployed URL returns HTTP 200 (checked 2026-07-17).

| Thinker | Tier (BUILD.md) | Papers (P) | X scrape | Videos (V) | External corpus | Index namespace | Site built | Live URL (verified 200) |
|---|---|---|---|---|---|---|---|---|
| Michael Levin | anchor | 0 in-repo (→ external) | none in-repo | 25 stub (agi-2026) | **`~/Projects/Levinese`**: 364 papers, 119 terms, 340 videos (title+excerpt, no transcript), 349 blog, 35 magazine, 7 substack, 4 xposts | `michael-levin`: 370 paper-chunks + 119 term-chunks = 489 (from Levinese, not from in-repo stub) | stub only (`sites/michael-levin`, undeployed) | **levinese-preview.netlify.app** |
| Joscha Bach | anchor | 0 (de-emphasized per spec) | **`raw/Plinz.jsonl`**: 2,206 tweets | 25 stub (agi-2026, unindexed) | **`~/Projects/Joscha`**: 298 curated xposts + 60 terms (Grok x_search, run 2026-06-18; re-run now BLOCKED — `XAI_API_KEY` missing from `.env`), videos:0, papers:0 (by design) | `joscha-bach`: 2,191 tweet-chunks (from `raw/Plinz.jsonl` directly, NOT from the Joscha repo's curated xposts — two different corpora, not reconciled) | stub only (`sites/joscha-bach`, undeployed) | **joschese.netlify.app** |
| Karl Friston | anchor | **`raw/papers-karl-friston.jsonl`**: 400 (capped, most-cited of ~1,960; OpenAlex `A5086852785`, ORCID `0000-0001-7984-8909`) | none | 25 stub | none | `karl-friston`: 403 paper-chunks + 25 video-chunks | yes, 4 pages | **agi26-karl-friston.netlify.app** |
| Ben Goertzel | anchor | **`raw/papers-ben-goertzel.jsonl`**: 413 (all; OpenAlex `A5038877365`, ORCID `0000-0002-2787-3464`) | **`raw/bengoertzel.jsonl`**: 318 tweets (full available history) | 25 stub | none | `ben-goertzel`: 417 paper-chunks + 25 video-chunks | yes, 4 pages | **agi26-ben-goertzel.netlify.app** |
| Alison Gopnik | keynote | 0 — OpenAlex author resolution **failed** (`gather-run.log`: "author not resolved") | none | 25 stub | none | `alison-gopnik`: 25 video-chunks only | yes | **agi26-alison-gopnik.netlify.app** |
| David Eagleman | keynote | 0 — OpenAlex resolution failed | none | 25 stub | none | `david-eagleman`: 25 video-chunks only | yes | **agi26-david-eagleman.netlify.app** |
| Gary Marcus | keynote | **`raw/papers-gary-marcus.jsonl`**: 200 (OpenAlex `A5110126701`) | none | 25 stub | none | `gary-marcus`: 202 paper-chunks + 25 video-chunks | yes | **agi26-gary-marcus.netlify.app** |
| Anil Seth | keynote | 0 — OpenAlex resolution failed | none | 25 stub | none | `anil-seth`: 25 video-chunks only | yes | **agi26-anil-seth.netlify.app** |
| Alexander Ororbia | keynote | **`raw/papers-alexander-ororbia.jsonl`**: 172 (OpenAlex `A5084332360`) | none | 8 stub (short — query returned fewer results) | none | `alexander-ororbia`: 165 paper-chunks + 8 video-chunks | yes | **agi26-alexander-ororbia.netlify.app** |
| Neil Gershenfeld | keynote | **NOTHING** | **NOTHING** | **NOTHING** | none | none | none | none |
| Camron Blackburn | keynote | **NOTHING** | **NOTHING** | **NOTHING** | none | none | none | none |
| Emad Mostaque | keynote | **NOTHING** | **NOTHING** | **NOTHING** | none | none | none | none |
| Alexander Lerchner | keynote | **NOTHING** | **NOTHING** | **NOTHING** | none | none | none | none |
| Daniel Hulme | keynote | **NOTHING** | **NOTHING** | **NOTHING** | none | none | none | none |
| Alex Wissner-Gross | keynote | **NOTHING** | **NOTHING** | **NOTHING** | none | none | none | none |
| Greg Meredith | keynote | **NOTHING** | **NOTHING** | **NOTHING** | none | none | none | none |
| Reza Rassool | keynote | **NOTHING** | **NOTHING** | **NOTHING** | none | none | none | none |
| Faezeh Habibi | keynote | **NOTHING** | **NOTHING** | **NOTHING** | none | none | none | none |
| Hananel Hazan | keynote | **NOTHING** | **NOTHING** | **NOTHING** | none | none | none | none |
| Josef Urban | keynote | **NOTHING** | **NOTHING** | **NOTHING** | none | none | none | none |
| *(bonus, marquee, not on confirmed roster)* | | | | | | | | |
| Christof Koch | marquee | **`raw/papers-christof-koch.jsonl`**: 200 (OpenAlex `A5084822308`) | none | 25 stub | none | `christof-koch`: 203 paper-chunks + 25 video-chunks | yes, local only | not deployed, no `subsiteUrl` in `roster.ts` |
| David Spivak | marquee | 0 — OpenAlex resolution failed | none | 25 stub | none | `david-spivak`: 25 video-chunks only | local only | not deployed |
| Chris Fields | marquee | 0 — OpenAlex resolution failed | none | 25 stub | none | `chris-fields`: 25 video-chunks only | local only | not deployed |
| *(marquee list from BUILD.md, zero work started)* | Bengio, Sutton, Norvig, Chollet, Schmidhuber, Hutter, Geordie Rose, Rachel St.Clair, Paul Rosenbloom | — no raw/, no sites/, no index namespace for any of these 9 | | | | | | |

**Corroborating source:** `IDEAS.md:98` (2026-06-21) independently lists the same 11 corpus-less
roster names — this gap has had zero remediation in the ~4 weeks since it was first flagged.

**Drift note (not a gap, but worth fixing while a harvest agent is in the file):**
`dashboard/artifacts.json` still points Michael Levin's card at `levinese.netlify.app` — the
canonical URL per `CLAUDE.md` is `levinese-preview.netlify.app`. Stale, one-line fix, out of
scope for this catalog pass.

---

## 2. Gap list, prioritized

### Tier A — anchors (Levin, Bach, Friston, Goertzel)

Even the "fully covered" anchors have real gaps:

1. **Bach: X ingestion pipeline is dead.** `~/Projects/Joscha/ingest/pull_joscha_x.py` needs
   `XAI_API_KEY` in `~/Projects/Joscha/.env`; currently only stale `PUBLIC_LEVIN_ASK_*` tokens are
   present (per `~/Projects/Joscha/CLAUDE.md`). The existing 298 xposts + 60 terms are from a
   one-time successful run on 2026-06-18 and have not been refreshed since — a month of new posts
   is missing, and the pipeline can't currently be re-run at all.
2. **Bach: two X corpora are not reconciled.** `raw/Plinz.jsonl` (2,206 raw scraped tweets, indexed
   into LanceDB as `joscha-bach`) and `~/Projects/Joscha/src/content/xposts` (298 Grok-curated,
   summarized posts, NOT indexed into LanceDB, powers the live site instead) are two independent
   pipelines over the same person with no dedup/cross-reference between them.
3. **Bach: zero video/lecture transcripts.** 25 video stubs exist in `raw/videos-joscha-bach.jsonl`
   but are explicitly excluded from indexing (`build_sites_index.py` `ANCHORS_SKIP_ALL`), and
   `~/Projects/Joscha/src/content/videos` is empty (BUILD-REPORT.md item 4: "Videos/talks — ingest
   YouTube/podcast transcripts... v1").
4. **Friston: capped at 400 of ~1,960 works** (most-cited only, per `papers-fanout.md`/`papers.md`
   brief's `--cap 400`). The long tail — including anything from 2025-2026 that hasn't accrued
   citations yet — is missing. Recent Friston output is systematically underrepresented by a
   citation-sort cap.
5. **Goertzel: no video corpus indexed beyond the 25 stubs**, and the X pull (318 tweets) already
   hit the platform's search-history wall — that's the ceiling, not a gap to re-harvest, but it
   means Goertzel's pre-2024 X history (per `scrape-more.log`, search returns 0 further back than
   ~2024) is **structurally unrecoverable via this method** — would need X's official archive
   export or a different source.
6. **Levin: in-repo `sites/michael-levin` is a disconnected stub** (25 unindexed video records,
   0 papers) while the real 489-chunk corpus lives entirely in the external `~/Projects/Levinese`
   repo. Not urgent (the real site is live and rich) but it means anyone grepping this monorepo
   for Levin data will find almost nothing and could waste time re-harvesting what already exists
   elsewhere.

### Tier B — roster with partial coverage (Gopnik, Seth, Eagleman, Marcus, Ororbia) + bonus (Koch, Fields, Spivak)

7. **Gopnik, Seth, Eagleman: OpenAlex author resolution failed outright** (`gather-run.log`:
   "papers: author not resolved" for all three, plus Fields and Spivak). `gather_all.mjs`'s
   auto-resolver (`authors?search=<hint>&per-page=1`, takes result[0] blind) is too naive for
   common names / ambiguous affiliations. `adapters/papers/pull_papers.mjs` (the more robust
   adapter used for Friston/Goertzel, with `--orcid`/`--author-id` override and a scored
   name-matcher) was never re-run against these five — that's the actual fix, not a new adapter.
8. **Marcus, Ororbia: no X corpus at all**, despite both being active X posters on AI topics —
   handles never identified/pulled.
9. **Koch, Spivak, Fields: not on the confirmed roster, not deployed** — `papers-fanout.md` brief
   pulled their data as a batch alongside the real gaps (Gopnik/Seth/Eagleman/Ororbia) but they
   were never scaffolded into `sites/` as deployable subsites or added to `hub/src/data/roster.ts`.
   Decide: promote to marquee-tier hub cards, or archive the harvested data as reference-only.

### Tier C — roster with NOTHING (11 names)

Gershenfeld, Blackburn, Mostaque, Lerchner, Hulme, Wissner-Gross, Meredith, Rassool, Habibi, Hazan,
Urban. `gather_all.mjs`'s `SPEAKERS` array does not even list these 11 — the harvest was never
attempted, not attempted-and-failed. This is the single highest-leverage bucket: same proven
adapters (`pull_papers.mjs`, `gather_all.mjs`'s yt-dlp video step, `x_scrape.mjs` once handles are
known), just need name/affiliation hints added and the run kicked off.

---

## 3. Per-gap harvest spec (task cards)

Format: **[card-id] Name — gap** · source type · identifier · target path · effort.
UNVERIFIED = could not confirm on disk; a harvest agent must resolve this first (OpenAlex author
search / manual lookup), not invent it.

### Tier C — no-corpus roster (highest volume, proven adapters, just needs execution)

- **[C-01] Neil Gershenfeld — papers.** OpenAlex author search, hint `"Neil Gershenfeld MIT"`.
  UNVERIFIED author id (MIT Center for Bits and Atoms is distinctive enough the naive resolver
  will likely work, but verify against known titles like "Fab" / "When Things Start to Think").
  → `raw/papers-neil-gershenfeld.jsonl`, `sites/neil-gershenfeld/papers/*.json`. Effort: **S**.
- **[C-02] Neil Gershenfeld — video.** `yt-dlp ytsearch25:"Neil Gershenfeld fab lab talk"` (pattern
  from `gather_all.mjs`). → `raw/videos-neil-gershenfeld.jsonl`. Effort: **S**.
- **[C-03] Camron Blackburn — papers/video.** UNVERIFIED identity — thin public bio in
  `hub/src/data/roster.ts` ("Researcher & builder"). Needs a human/AI research pass to even
  establish affiliation before OpenAlex/YouTube queries can be targeted. Effort: **M** (identity
  resolution first).
- **[C-04] Emad Mostaque — papers.** Low expected yield (Stability AI founder, not primarily an
  academic author) — OpenAlex search `"Emad Mostaque"` UNVERIFIED, may return few/no works.
  → try anyway, cap low. Effort: **S**.
- **[C-05] Emad Mostaque — blog/X.** He's an active X poster and has a Substack-style public
  presence (UNVERIFIED exact handle/URL — needs confirmation, do not guess a handle). If handle
  confirmed → `x_scrape.mjs --handle <handle>`. Effort: **M** (handle discovery + scrape).
- **[C-06] Alexander Lerchner — papers.** DeepMind researcher — OpenAlex hint `"Alexander Lerchner
  DeepMind"`, likely resolves cleanly (distinctive name + affiliation). → `raw/papers-alexander-
  lerchner.jsonl`. Effort: **S**.
- **[C-07] Daniel Hulme — papers/video.** Satalia/AI strategist — OpenAlex hint `"Daniel Hulme
  Satalia"` UNVERIFIED resolution confidence (common first name). Video: `ytsearch25:"Daniel Hulme
  AI talk"`. Effort: **S**.
- **[C-08] Alex Wissner-Gross — papers.** Distinctive name, OpenAlex hint `"Alex Wissner-Gross"` —
  high confidence resolver hit expected (causal entropic forces work is well-indexed). Effort: **S**.
- **[C-09] Greg Meredith — papers.** RChain/formal-methods — OpenAlex hint `"L. Gregory Meredith"`
  (note: publishes under "L.G. Meredith" per common CS-formal-methods convention — UNVERIFIED,
  try both name forms). Effort: **S**.
- **[C-10] Reza Rassool — papers/video.** UNVERIFIED identity beyond "AI & media tech" bio — needs
  identity resolution before harvest (same pattern as Blackburn). Effort: **M**.
- **[C-11] Faezeh Habibi — papers/video.** UNVERIFIED identity, thin bio. Identity resolution
  first. Effort: **M**.
- **[C-12] Hananel Hazan — papers.** Allen Discovery Center/Tufts (same institution as Levin) —
  OpenAlex hint `"Hananel Hazan Tufts"` should resolve cleanly given the institutional overlap
  with the already-successful Levin/Ororbia pattern. Effort: **S**.
- **[C-13] Josef Urban — papers.** Czech Technical University, AI4Math/automated reasoning —
  distinctive name, OpenAlex hint `"Josef Urban CTU"` — high confidence. Effort: **S**.

### Tier B — fix failed resolution + fill missing source types

- **[B-01] Alison Gopnik — papers (RE-RUN with better resolver).** Use
  `adapters/papers/pull_papers.mjs --name "Alison Gopnik" --slug alison-gopnik --cap 300
  --sort cited_by_count:desc` (the scored-matcher adapter, NOT `gather_all.mjs`'s blind
  `result[0]` resolver that failed). UC Berkeley developmental psych — should resolve cleanly once
  routed through the better tool. Effort: **S**.
- **[B-02] David Eagleman — papers (RE-RUN).** Same fix, `--name "David Eagleman" --slug
  david-eagleman`. Stanford neuroscience. Effort: **S**.
- **[B-03] Anil Seth — papers (RE-RUN).** Same fix, `--name "Anil Seth" --slug anil-seth`
  — ORCID likely findable (UNVERIFIED exact ORCID, but he's a highly-cited, unambiguous author;
  try `--orcid` if a name search still misfires on a common surname). Effort: **S**.
- **[B-04] Chris Fields — papers (RE-RUN with ORCID).** `papers-fanout.md` already carries a
  candidate ORCID `0000-0002-4131-7728` marked "if it resolves" — untested against the better
  adapter. → `adapters/papers/pull_papers.mjs --orcid 0000-0002-4131-7728 --slug chris-fields`.
  Effort: **S**.
- **[B-05] David Spivak — papers (RE-RUN).** MIT/Topos Institute, category theory — distinctive
  enough that `--name "David Spivak category theory"` should resolve; the earlier plain-name
  search apparently collided or found nothing. Effort: **S**.
- **[B-06] Gary Marcus — X scrape.** Active, high-volume X poster on AI critique — handle
  UNVERIFIED in this repo (no evidence any handle for Marcus was ever attempted; `@GaryMarcus` is
  the commonly-known handle but must be confirmed live before running `x_scrape.mjs`, not assumed).
  Effort: **M**.
- **[B-07] Alexander Ororbia — X scrape.** Handle UNVERIFIED — needs confirmation before scrape.
  Effort: **M**.
- **[B-08] Joscha Bach — unblock X ingestion.** Not a new source, an unblock: get a live
  `XAI_API_KEY` into `~/Projects/Joscha/.env`, then `python pull_joscha_x.py --since <last-run-
  date> --until <today>` to catch up the 298-post curated corpus. Effort: **S** (once key exists;
  key acquisition itself is outside engineering scope — that's a Mike/procurement task).
- **[B-09] Karl Friston — lift the 400-paper cap.** Re-run
  `pull_papers.mjs --author-id A5086852785 --sort publication_date:desc` (no cap, or a much higher
  one) to recover 2024-2026 output that the citation-sort cap excluded. Effort: **S** (rerun of
  proven tool, larger payload — watch the OpenAlex rate limit, ~1,960 works at 200/page ≈ 10 pages).
- **[B-10] Christof Koch, David Spivak, Chris Fields — decide fate.** Not a harvest gap, a product
  decision: promote to `hub/src/data/roster.ts` as marquee-tier cards (data already exists for
  Koch; Spivak/Fields need B-04/B-05 first) or explicitly park. Flag for Mike, not a harvest task.

### Universal, cross-cutting gaps (apply to everyone with a video stub, i.e. all 12 people who have any video record)

- **[U-01] Video transcripts.** No adapter currently pulls actual transcript text — only yt-dlp
  flat-playlist metadata. `BUILD.md` names `adapters/` "youtube" as a planned adapter type but only
  `adapters/papers/` exists on disk; the youtube step in `gather_all.mjs` is metadata-only, not a
  transcript puller. Real fix: extend `gather_all.mjs`'s `videos()` function (or a new
  `adapters/youtube/pull_transcripts.mjs`) to call `yt-dlp --write-auto-sub --skip-download` (or
  the YouTube Transcript API) per video id, for all 283 existing video stubs across 12 people, then
  backfill `transcript_chars`/`has_transcript`. This is the single highest-value cross-cutting gap
  in the whole system — it would roughly 10x the usable text corpus for 9 people who currently have
  ONLY video stubs as their entire corpus (Gopnik, Eagleman, Seth, Spivak, Fields + the video
  portions of Marcus/Ororbia/Koch/Goertzel/Friston). Effort: **L** (283 videos × transcript
  fetch+parse, plus re-chunk + re-index).
- **[U-02] Substack/blog-RSS adapter.** `BUILD.md` names `blog/rss` as a planned adapter source
  type. Nothing on disk implements it (`adapters/` contains only `gather_all.mjs` and
  `papers/pull_papers.mjs`). Several roster members (Goertzel, Mostaque, possibly Marcus) have
  known Substack/blog presences — UNVERIFIED exact URLs, need per-person confirmation before an RSS
  puller can target them. Effort: **M** to build the adapter once one confirmed feed URL exists to
  test against.

---

## 4. Pipeline notes (for any harvest agent picking up a card above)

**Adapters — what's real vs. planned:**
- `adapters/papers/pull_papers.mjs` — **implemented, proven, reusable.** OpenAlex, no API key.
  Takes `--name`/`--orcid`/`--author-id`, `--slug`, `--cap`, `--sort`. This is the adapter to use
  for every Tier B/C papers card — NOT `gather_all.mjs`'s inline `papers()` function, which uses a
  weaker blind-first-result resolver and is why Gopnik/Seth/Eagleman/Fields/Spivak failed.
- `adapters/gather_all.mjs` — implemented, does papers (weak resolver) + video-metadata (yt-dlp
  flat-playlist) in one pass per speaker, keyed off a hardcoded `SPEAKERS` array that does NOT
  include the 11 Tier-C names. To onboard a new person: add a row to `SPEAKERS`
  (`[slug, displayName, openAlexHint, youtubeQuery]`), then `node gather_all.mjs <slug>
  --skip-existing`.
- `scraper/x_scrape.mjs` — implemented, proven (Bach, Goertzel), but requires an already-running,
  logged-in Chrome on `:9222` (`~/Projects/SOMA/tools/chrome-debug-launcher.sh`) and a **known
  handle** — it does not discover handles. Every Tier B/C X card needs handle confirmation first.
- Youtube-transcript and blog/RSS adapters: **not implemented**, only named as planned in
  `BUILD.md`. See U-01/U-02 above.

**raw/ contract:** append-only, one JSON record per line, verbatim from the source (no LLM
transformation). `raw/` is gitignored (`.gitignore:5`) — it is NOT committed, so any harvest run
only persists on the machine that ran it unless explicitly archived elsewhere. Dedup key is
source-specific: tweets dedup on `id` (status id), papers on `doi` (falls back to OpenAlex work id
when DOI absent, per `doiToSlug()` in `pull_papers.mjs`), videos dedup on YouTube video `id`.
Both adapters are idempotent — re-running skips already-present ids (`x_scrape.mjs`: "already have
N ids"; `gather_all.mjs --skip-existing`: skips dirs with >5/>3 existing files).

**Index rebuild:** two separate scripts, both idempotent (skip existing chunk ids), neither
destructive by default:
- `index/build_index.py` — the four anchors (Levin/Bach/Friston/Goertzel), reads from
  `common.py`'s hardcoded `LEVIN_PAPERS`/`LEVIN_TERMS`/`JOSCHA_JSONL`/`FRISTON_JSONL`/
  `GOERTZEL_JSONL` paths. `--rebuild` drops and rebuilds the whole table — destructive, don't use
  casually.
- `index/build_sites_index.py` — everyone else, walks `sites/<slug>/{papers,videos}/*.json`
  automatically (no hardcoded list — new `sites/<slug>/` dirs are picked up for free). Explicitly
  skips `michael-levin`/`joscha-bach` (`ANCHORS_SKIP_ALL`) to avoid double-indexing against the
  anchor pipeline. **Run this after any new papers/videos land in a `sites/<slug>/` dir** — it's
  the one that actually picks up new harvests without code changes.
- Activate venv first: `cd ~/Projects/agi-2026/index && source .venv/bin/activate`.
- Query/verify: `python query.py --thinkers <slug> "<topic>" --k 8`.

**gitignore status:** `raw/` (all), `derive/out/`, `index/store/`, `node_modules/`, `.env`,
`*.log` are all gitignored (`.gitignore`, 6 lines total). `sites/<slug>/papers/*.json` and
`sites/<slug>/videos/*.json` are NOT gitignored — those DO get committed (verify before a large
harvest run that this is still the desired behavior; nobody has flagged it as a problem, but a
283-video × 12-person transcript backfill (U-01) would add real weight to the repo if transcripts
land in `sites/` rather than staying in gitignored `raw/`).

**derive/ status:** the directory does not exist on disk yet (`bfs: No such file or directory`
when checked 2026-07-17) — the raw→derive organization layer described in `README.md`/`BUILD.md`
has never been built. Every current site build reads `sites/<slug>/{papers,videos}` or `raw/*`
directly; nothing currently depends on `derive/` existing, so its absence isn't blocking anyone,
but any future "themes/threads" work described in `BUILD.md` starts from zero.

**Public contributor hook:** `hub/src/components/RosterCard.astro:41` — every roster card with no
`subsiteUrl` renders a `mailto:claim@societyofminds.org?subject=Claim%20page%20for%20<name>` link
("Confirmed keynotes — pages ready to claim", `hub/src/pages/index.astro:74`). This is the live
public task-board mechanism already wired for the 11 Tier-C names — a distributed contributor
claiming e.g. Gershenfeld's page today lands on that mailto, not a structured task card. Worth
pointing contributors at this catalog's Tier-C cards directly instead/also.
