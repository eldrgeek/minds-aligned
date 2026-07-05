---
district: thinker-sites
status: active
depends_on: [Levinese, Joscha]
capabilities: [astro, netlify, rag]
last_reviewed: 2026-06-23
---

# agi-2026 — "Society of Minds Aligned": hub of per-thinker corpora + AI community-managers + rooms, anchored on the AGI-26 conference roster

**Where work happens:** layered pipeline — `scraper/` (X harvest → `raw/`) · `adapters/` (papers via OpenAlex, youtube, rss) · `derive/` → `index/` (one vector store, per-thinker namespaces) · `hub/` (landing) · `room/` (multi-agent cited conversation) · per-track `.briefs/*.md` drive workers, each writes `<track>-REPORT.md`

**Key docs** (read in this order):
- [BUILD.md](BUILD.md) — repo layout, subsite naming, worker tracks, hard rules.
- [README.md](README.md) — the vision and build order.
- [IDEAS.md](IDEAS.md) — design backlog.

**Skills**
- gap: orchestrated parallel-worker run (brief → subdir → REPORT) is a recurring pattern across this and `_estate` sweeps.

**Depends on / used by:** reuses the `Levinese`/`Joscha` Astro+Tailwind template for per-thinker subsites (here named for the thinker, e.g. `sites/michael-levin`).

**Gotchas**
- `raw/` is sacred + append-only (gitignored); `derive/` is disposable — never edit raw to "fix" derived output.
- Hard rule for workers: stay in your assigned subdir, no `netlify`, no `git push`, no public site creation; local build must pass.
- Many `*-run.log` / `*-REPORT.md` at root are worker artifacts, not reference docs; `index.html.bak` is cruft.
