# Worker brief: build the Friston & Goertzel subsites (from their papers)

Engineering worker on Mike's Mac. Read `~/Projects/agi-2026/BUILD.md`. Work ONLY in
`~/Projects/agi-2026/sites/karl-friston` and `~/Projects/agi-2026/sites/ben-goertzel`.
HARD RULES: no deploy, no git push. Local `npm run build` must pass for each. Append new
ideas to `~/Projects/agi-2026/IDEAS.md`. Write `subsites-REPORT.md`.

## Goal
A subsite per academic anchor, named for the thinker (NOT cute). Reuse the proven Astro +
Tailwind template from `~/Projects/Levinese` (structure, corpus page, dictionary, guide
widget, SomaAuth). Source = the papers already pulled:
- Friston papers: `~/Projects/agi-2026/sites/karl-friston/papers/*.json` (~400, Levinese schema)
- Goertzel papers: `~/Projects/agi-2026/sites/ben-goertzel/papers/*.json` (~413)

## Per subsite
- Scaffold from the Levinese template into the site dir (copy structure, NOT Levin content).
- Home: the thinker's name, a one-paragraph intro (factual, from public bio — NO invented
  quotes), and entry points to Corpus + (stub) Dictionary + (stub) Ask.
- Corpus page: list/search their papers (reuse Levinese corpus page + aggregate-content;
  papers collection is the spine here). Wire MiniSearch over the papers.
- Guide config `public/<slug>-guide-config.js`: an AI guide GROUNDED in their public work,
  NOT impersonation; voiceAgentId null (text-only) with a TODO. Include the SomaAuth block.
- Match the AGI-26 dark theme if easy (navy `#0F141F`, Cormorant Garamond headings, Inter,
  IBM Plex Mono labels, blue `#3C6CDD`); otherwise keep the template theme and note it.
- `npm install && npm run build` must pass. Report pages + paper counts per site.
