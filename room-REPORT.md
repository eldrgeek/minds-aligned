# room-REPORT.md — The Room (hero)

**Track:** `room/` · **Date:** 2026-06-21 · **Status:** v0 vertical slice complete

## What was built

A static Astro page (`room/`) — **The Room** — where AI representatives of AGI-26 thinkers hold pre-generated, cited multi-turn exchanges. Visitors pick a **pair** and **seed question**, read a transcript with per-turn citation chips, toggle representatives off (consent veto), and use a join box (v0 preset response; live LLM = TODO).

## Stack

- Astro 4 + Tailwind (AGI-26 dark theme: navy `#0F141F`, accent `#3C6CDD`, Cormorant Garamond / Inter / IBM Plex Mono)
- Data: `room/src/data/exchanges.json` (cacheable, keyless at serve time)
- Build: `npm run build` → `room/dist/index.html`

## Data generation

Passages retrieved via KEYSTONE index CLI:

```bash
cd ~/Projects/agi-2026/index
python3 query.py --thinkers michael-levin,karl-friston "Is agency substrate-independent?" -k 6
python3 query.py --thinkers joscha-bach,ben-goertzel "What is a self?" -k 6
# … (6 exchanges total across 4 seed questions)
```

Each turn paraphrases a retrieved passage and cites its `url` + `source_type`.

## Seed content

| Pair | Questions | Exchange IDs |
|------|-----------|--------------|
| Levin × Friston | Agency, Self, Consciousness | `levin-friston-agency`, `levin-friston-self`, `levin-friston-consciousness` |
| Joscha × Goertzel | Agency, Self, Build AGI | `joscha-goertzel-agency`, `joscha-goertzel-self`, `joscha-goertzel-agi` |

**4 seed questions:** agency substrate-independence, what is a self, consciousness (Levin×Friston), bridging abstract agents to AGI (Joscha×Goertzel).

## Sample citations (verified URLs from index)

1. **Levin — Agent (term):** https://levinese.org/terms/agent  
2. **Friston — Anatomy of choice:** https://doi.org/10.3389/fnhum.2013.00598  
3. **Joscha — substrate-independent agency (tweet):** https://x.com/Plinz/status/1635118745101426689  
4. **Goertzel — Hyperset models of self:** https://doi.org/10.1142/s1793843011000601  

## UI affordances

- Visible disclaimer: representatives are not the thinkers
- Per-representative hide toggles (persisted in `localStorage` key `room-hidden-reps`)
- Citation chips: source type, title, optional date, external link
- Join input: v0 shows preset “BYOK TODO” notice

## Build verification

```
cd room && npm run build
# ✓ 1 page built — room/dist/index.html
```

## Not in v0 (explicit TODOs in page)

- Live LLM inference (BYOK)
- Serve-time retrieval / dynamic exchange generation
- Voice / kiosk mode

## Files

```
room/
├── package.json
├── astro.config.mjs
├── tailwind.config.mjs
├── src/
│   ├── data/exchanges.json
│   ├── layouts/Base.astro
│   └── pages/index.astro
├── public/favicon.svg
└── dist/          (build output)
```