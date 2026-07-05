# Worker brief: the multi-agent ROOM (the hero)

Engineering worker on Mike's Mac. Read `~/Projects/agi-2026/BUILD.md` and `IDEAS.md`.
Work ONLY in `~/Projects/agi-2026/room`. HARD RULES: no deploy, no git push. Build must
pass. Append new ideas to `~/Projects/agi-2026/IDEAS.md`. Write `room-REPORT.md`.
PROGRESS: write `~/Projects/agi-2026/room-progress.json` every major step:
`{"task":"room","pct":<0-100>,"step":"...","ts":"<iso>"}` (overwrite each time).

## What
A deployable page (Astro or single-file HTML+JS, AGI-26 dark theme: navy #0F141F,
Cormorant Garamond, Inter, IBM Plex Mono labels, accent #3C6CDD) where the AI
**representatives** of thinkers converse, grounded + CITED, and a visitor can pose a question.

## Framing (non-negotiable — real living people)
Representatives are AI guides GROUNDED IN PUBLIC CORPORA, clearly labeled as such, NEVER
claiming to BE the person. Every claim cites a source (paper/post URL from the index).
A visible disclaimer + a per-visitor toggle to hide any given representative (consent veto).

## v0 = pre-generated, cited, cacheable (serve-time keyless)
- Use `~/Projects/agi-2026/index/query.py --thinkers <slug> "<topic>" --k 6` to pull REAL
  grounded passages for each representative, then compose a short multi-turn exchange where
  each turn paraphrases + CITES its retrieved source (link). Do this for ~4 seed questions
  (e.g. "Is agency substrate-independent?", "What is a self?") across pairs:
  Levin×Friston, Joscha×Goertzel. Store as JSON in `room/src/data/exchanges.json`.
- UI: pick a question + a pair → render the cited exchange as a chat/transcript; each turn
  shows the citation chip. A "join" input box (v0: posts to a preset; live LLM mode = TODO,
  BYOK). Per-rep hide toggle.
- `npm run build` (or open index.html) must work. Report what's built + sample citations.
