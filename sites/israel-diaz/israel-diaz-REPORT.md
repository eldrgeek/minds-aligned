# israel-diaz-REPORT.md

Worker: Claude (Sonnet 5, CCc), dispatched via cc-dispatch. 2026-09-22.

## What was built

A thinker subsite for **Israel Diaz** (conxiOS/consciOS creator, founder of
ZeroThreeSixNine Ventures and Sunday+Night, formerly CCO Y&R Canada) at
`~/Projects/agi-2026/sites/israel-diaz/`, scaffolded from the same factory as the other
AGI-26 subsites (`ops/scaffold-site.mjs` off the `hananel-hazan` reference build).

Tiered as **"invited thinker (non-roster)"** in `site.config.json` — Diaz is not on the
AGI-26 keynote roster and was **not** added to `hub/src/data/roster.ts`, per the task
instructions.

### Pages
- `/` — career arc timeline (verified vs. unverified stops marked separately), the
  conxiOS framework claims in attributed voice, a dedicated "NeedState — could not
  verify" section, the Max-Neef correspondence note, and an "about this archive"
  disclosure.
- `/corpus/` — reused Levinese corpus template (MiniSearch, year filter, sort) over the
  4-record papers.json.
- `/dictionary/` — 10 terms from Diaz's own vocabulary (zero state, the nine needs,
  polarity, transmute, NeedState, Satori, Return on Energy, Magnum Opus, etc.), each
  sourced or explicitly marked as unenumerated/unverified.
- `/ask/` — "Ask Zero State" page; widget wiring inherited from the shared layout
  (`AIHost`, `ClaimBar`, `JoinBar`, `SocietyBar`, `PageQR`, `FeedbackWidget` all present
  in `Base.astro`, so the "claim your page" hook is live by inheritance).
- `public/israel-diaz-guide-config.js` — grounded guide config, persona "Zero State,"
  `voiceAgentId: null`, SomaAuth block inherited from Base.astro (unchanged from the
  reference site's auth wiring).

## Sources captured (by type)

| Type | Count | Notes |
|---|---|---|
| Site text (verbatim, full page) | 1 | conxiOS.com home page — single long-scroll page; `/framework` and `/about` both 404 |
| Site text (summarized by fetch) | 1 | sundayandnight.global |
| Press release (summarized by fetch) | 1 | GlobeNewswire, 2011 Y&R CCO appointment — sole source for pre-2017 career |
| Interview (partial — 2 quotes only) | 1 | Beachhead Strategic; full page would not fetch, quotes recovered via search snippet |
| **Total raw files in `raw/`** | 5 | 4 source captures + 1 `gaps-not-captured.md` log |
| **Total papers/ JSON records** | 4 | Levinese schema, `journal` field repurposed as source name, no DOIs |

## Gaps (explicit, not silently dropped)

1. **Kaggle "NeedState" benchmark writeup — the intended centerpiece — not found.**
   Kaggle's `kaggle-measuring-agi/writeups` page is JS-rendered; WebFetch returned only
   the page title. Targeted WebSearch queries for "Israel Diaz" + "NeedState" + Kaggle
   returned nothing. The site surfaces this gap explicitly on the home page rather than
   asserting the benchmark's scenario count or failure pattern as fact.
2. **LinkedIn — both candidate profile URLs blocked with HTTP 999** (LinkedIn's bot
   block). Per instructions, no login/CAPTCHA bypass was attempted. This is also where
   the Satori/Bali/Jan-29-2025 genesis account reportedly lives — only a secondhand
   WebSearch-summary paraphrase was recoverable, not a primary quote. The dictionary
   entry for "Satori" flags it as unverified.
3. **strategyonline.ca "joins Jackman Reinvents" (2015)** — WebFetch returned empty
   content twice. Shown on the home-page timeline as an explicitly unverified stop
   (dashed marker, no role/dates asserted).
4. **Arca Futura PYPER3 / "Kindling by Shawna"** — not researched (time/budget); no
   "about/around" third-party section built. Flagged in IDEAS.md as a follow-up.
5. **Medium/Substack/podcast transcripts** — targeted searches for the Zero/3/6/9
   Framework and for NeedState on those platforms returned nothing attributable to Diaz.

All five gaps are also logged verbatim in `raw/gaps-not-captured.md` and in
`FACTCHECK.md` §4 ("DO NOT PUBLISH — could not verify").

## FACTCHECK status

`FACTCHECK.md` written with the same structure as the `hananel-hazan` reference
(§1 verified claims by source, §2 framing discipline, §3 the Max-Neef correspondence —
stated plainly, not as an accusation, §4 do-not-publish list). Every direct quote on the
site traces to a specific line in `FACTCHECK.md` §1; nothing is stated in the site's own
voice about conxiOS's efficacy or deployment status.

## Build

```
cd ~/Projects/agi-2026/sites/israel-diaz
npm install
npm run build
```

Confirmed: `npm run build` exits 0, 4 pages generated (`/`, `/corpus/`, `/dictionary/`,
`/ask/`) into `dist/`.

Local preview: `npm run preview` (Astro's built-in static preview server).

## Deploy command for Mike to approve (NOT run by this worker — no netlify/git-push per hard rules)

Per `~/Projects/agi-2026/CLAUDE.md`'s "NEVER run a bare `netlify deploy`" warning, a new
site needs the `netlify-deploy` skill's site-creation flow first (no site ID exists yet
for `israel-diaz`). Once a site is created and its UUID known:

```bash
cd ~/Projects/agi-2026/sites/israel-diaz
npm run build
netlify deploy --prod \
  --site=<ISRAEL_DIAZ_SITE_UUID> \
  --dir=/Users/mikewolf/Projects/agi-2026/sites/israel-diaz/dist \
  --no-build
```

Always pass an explicit `--site` UUID (not name) and an absolute `--dir`, and check the
printed Production URL before trusting the deploy — per the documented 2026-07-29
near-miss in `CLAUDE.md`.

## Not done (out of scope per hard rules)

- No netlify site created, no deploy run, no git push.
- No addition to `hub/src/data/roster.ts` (correct — Diaz is non-roster).
- No AI-host retrieval backend wiring beyond the generated config (matches the state of
  the other 13 properties per `CLAUDE.md`'s "SOMA Onboard" section — this is a
  known/accepted pattern, not a regression).

## Pass 2 (2026-09-22, same-day second pass)

### Sources now covered

10 new primary sources ingested into `papers/` (14 total, up from 4):

- **6 LinkedIn articles**, full text with publish dates (`raw/linkedin/articles/*.md`,
  supplied by the orchestrator — not fetched by this worker, per instructions not to
  re-fetch LinkedIn): How I Met Satori (2025-02-11), The Framework That Broke the Scale
  (2025-08-25), The Death of Demographics (2025-09-03), You Are the Last Original
  (2026-02-26), We're Not Engineering AI. We're Raising It. (2026-07-24), What's up
  Sunday+Night? (2020-11-15).
- **1 LinkedIn activity-feed capture** (`raw/linkedin/posts.md`, 5 of 12 items) —
  confirms the Magnum Opus product launch and the recycled Harvard-score caption.
- **3 Kaggle pages** (`raw/kaggle/*.md`): the NeedState writeup (the intended corpus
  centerpiece, previously a hard gap — now resolved), its discussion thread (the Tariq
  scenario), and its notebook page (code cells did not render — treated as a partial
  source, cited only to confirm the notebook exists, no code/output claims taken from it).

### What changed on the site

- **Home page (`src/pages/index.astro`):** NeedState is now a full centerpiece section
  (design, scoring, 12 models, headline results, the two zero-scoring scenarios, five
  named failure modes, Diaz's stated conclusion), replacing the pass-1 "could not verify"
  placeholder. Added a dedicated section for "We're Not Engineering AI. We're Raising
  It." and a dedicated "Harvard benchmark claim" section that states plainly what is and
  isn't independently confirmed (see below).
- **Dictionary (`src/pages/dictionary/index.astro`):** the nine needs are now named
  (Freedom, Identity, Creation, Leisure, Belonging, Understanding, Affection, Safety,
  Subsistence — sourced to the NeedState writeup, which itself credits Max-Neef by name,
  unlike the conxiOS home page). Satori's entry now cites Diaz's own primary-source
  article instead of a secondhand paraphrase. Added: 14 dimensions, "Raising" AI,
  Generational intelligence, Motivational depth, Decoy, Surface statement; expanded
  Magnum Opus to cover its 2026 product launch.

### Independent verification performed (task item 4)

Web search confirms the **FAI Benchmark**, **Tamara Lechner**, and **Harvard's Human
Flourishing Program** are real, and that a public paper (arXiv 2507.07787) reports the
same seven dimensions and the same public-study figures (28 models, o3 best at 72/100)
that Diaz's article cites. **consciOS's own reported score (100%/94%) is not
independently verifiable** — Diaz's own article states it came from a private email, not
the public study, and no public record of that score exists. The site states this
distinction explicitly rather than repeating the score as fact. Full writeup:
`FACTCHECK.md` §0.

### FACTCHECK status

`FACTCHECK.md` §0 added (pass-2 summary + the Harvard verification finding); §4 (do-not-
publish) extended with the unverifiable consciOS score and a note that NeedState's own
headline numbers are self-reported, not independently re-run. `raw/gaps-not-captured.md`
marks items 1 (LinkedIn) and 2 (Kaggle) RESOLVED.

### Remaining gaps (unchanged from pass 1, still open)

- strategyonline.ca "Jackman Reinvents" (2015) — still unfetchable, still shown as
  unverified on the timeline.
- Arca Futura PYPER3 / "Kindling by Shawna" — still not researched (flagged in
  `IDEAS.md` as a follow-up, not pursued this pass either — time/budget).
- Medium/Substack/podcast transcripts — still nothing found attributable to Diaz.

### Local preview

```bash
cd ~/Projects/agi-2026/sites/israel-diaz
npm run build   # confirmed exit 0, 4 pages generated
npm run preview
```

### Exact safe deploy command (for Mike to approve — NOT run by this worker)

Same constraint as pass 1: no Netlify site exists yet for `israel-diaz`, so a site must
first be created via the `netlify-deploy` skill's flow (interactive `netlify init` cannot
be piped — see that skill). Once a site UUID exists:

```bash
cd ~/Projects/agi-2026/sites/israel-diaz
npm run build
netlify deploy --prod \
  --site=<ISRAEL_DIAZ_SITE_UUID> \
  --dir=/Users/mikewolf/Projects/agi-2026/sites/israel-diaz/dist \
  --no-build
```

Always pass an explicit `--site` UUID (not name) and an absolute `--dir`, and check the
printed Production URL before trusting the deploy.
