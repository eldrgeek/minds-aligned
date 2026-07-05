# agi-2026 — build manifest (Society of Minds Aligned)

Destination hub anchored on the **AGI-26** conference (San Francisco, 27–30 Jul 2026).
Each confirmed keynote thinker gets a corpus, an AI **community manager** that RAGs
over all their work, and a **room**; the hub lets representatives converse across
corpora. Sprint goal: a convincing vertical slice + a Kickstarter by end of week.

## Repo layout
```
scraper/         deterministic X harvest → raw/<handle>.jsonl   [DONE, proven]
raw/             append-only verbatim source records (gitignored)
adapters/        source adapters: papers (OpenAlex), youtube, blog/rss
derive/          raw → organized docs (threads, themes)
index/           one vector store, per-thinker NAMESPACES (managers + synthesis)
sites/<slug>/    per-thinker subsite (Astro, named for the thinker — NOT cute)
hub/             "Society of Minds Aligned" landing (roster-driven)
room/            multi-agent room (hero): representatives in cited conversation
kickstarter/     launch page + vision + pricing tiers
```

## Subsite naming
Named for the thinker: `sites/michael-levin`, `sites/joscha-bach`, `sites/karl-friston`,
`sites/ben-goertzel`. (Retire the "Levinese/Joschese" cuteness.) Reuse the proven
Astro+Tailwind template from `~/Projects/Levinese` / `~/Projects/Joscha`.

## Anchors (deep tier — have or are getting full corpora)
Michael Levin (live: ~/Projects/Levinese + LanceDB) · Joscha Bach (live: ~/Projects/Joscha;
full X scrape running) · Karl Friston (papers) · Ben Goertzel (papers + X).

## AGI-26 confirmed keynotes (roster = build manifest; tier the rest as stubs)
Ben Goertzel, Karl J. Friston, Alison Gopnik, Neil Gershenfeld, Camron Blackburn,
David Eagleman, Emad Mostaque, Gary Marcus, Alexander Lerchner, Michael Levin,
Daniel Hulme, Anil Seth, Alex Wissner-Gross, Greg Meredith, Joscha Bach, Reza Rassool,
Alexander Ororbia, Faezeh Habibi, Hananel Hazan, Josef Urban. (Marquee also-listed:
Bengio, Sutton, Norvig, Chollet, Schmidhuber, Hutter, Geordie Rose, Rachel St.Clair,
Paul Rosenbloom, Christof Koch, David Spivak.)

## Parallel worker tracks (run concurrently; separate dirs; NO deploy/push)
- **hub** — `.briefs/hub.md` → builds `hub/`
- **papers** — `.briefs/papers.md` → builds `adapters/papers/` + pulls Friston & Goertzel corpora
- (next) index, managers, room — queued once corpora + hub land

## Hard rules for all workers
Work only in your assigned subdir of `~/Projects/agi-2026`. No `netlify`, no `git push`,
no public site creation. Local build must pass. Write a `<track>-REPORT.md`. Don't print secrets.
