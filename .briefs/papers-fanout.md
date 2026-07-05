# Worker brief: fan the papers adapter out to more AGI-26 speakers

Engineering worker on Mike's Mac. Read `~/Projects/agi-2026/BUILD.md`. Reuse the proven
adapter `~/Projects/agi-2026/adapters/papers/` (OpenAlex, no key). Work in `adapters/` and
write outputs to `~/Projects/agi-2026/raw/papers-<slug>.jsonl` and
`~/Projects/agi-2026/sites/<slug>/papers/*.json`. HARD RULES: no deploy, no git push.
Append new ideas to `~/Projects/agi-2026/IDEAS.md`. Write `papers-fanout-REPORT.md`.

## Goal — "speaker by speaker": pull scholarly corpora for these AGI-26 keynotes
Resolve each via OpenAlex author search (name + affiliation hint), pick the best-matched
author id, pull works (cap most-cited ~300 each for v0), emit the Levinese papers schema.
Verify counts are sane and not a name collision (check affiliation/top-titles).

- **Chris Fields** — independent / quantum information, cognition (ORCID 0000-0002-4131-7728 if it resolves)
- **Christof Koch** — Allen Institute; consciousness, neuroscience
- **David Spivak** — applied category theory (MIT/Topos Institute)
- **Anil Seth** — University of Sussex; consciousness
- **Alison Gopnik** — UC Berkeley; developmental cognition
- **David Eagleman** — Stanford; neuroscience
- **Alexander Ororbia** — RIT; neural adaptive computing / predictive coding
- **Karl Friston** and **Ben Goertzel** are already done — skip them.

For each: print resolved author id, work count pulled, 3 sample titles+years. Note any you
could NOT confidently resolve (leave them for Mike rather than pulling the wrong person).
This is deterministic (no LLM). Report a table of slug → count.
