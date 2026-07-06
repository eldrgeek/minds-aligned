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
- To create a Netlify site, wire GitHub CD, or deploy: use the **`netlify-deploy`** skill (`~/.claude/skills/netlify-deploy/`). It has the expect recipe for the interactive `netlify init` — do NOT pipe input into `netlify init`, it mangles. Driving it with expect is safe/reversible; don't hand deploy steps back to Mike for lack of a TTY.

## Live topology (canonical — verified 2026-07-05)

The hub is NOT a single obvious thing; there are look-alike Netlify projects. Ground truth:

- **The hub** = `hub/` (Astro) → Netlify project **`agi2026`** → live at **agi2026.netlify.app**. This is the home page for the whole roster. (Renamed 2026-07-05 from `minds-aligned`; the old `minds-aligned.netlify.app` URL is retired. A *separate* project `minds-aligned-soma` → `minds-aligned.org` builds from `hub-public/` and is a different, simpler static build — do not confuse the two.)
- **Per-thinker sites are split across two homes.** Don't assume a thinker lives in this monorepo:
  - **Michael Levin** and **Joscha Bach** are rich, standalone repos OUTSIDE this monorepo: `~/Projects/Levinese` → **levinese-preview.netlify.app**, and `~/Projects/Joscha` (aka "Joschese") → **joschese.netlify.app**. These are the real, content-rich Levin/Bach sites. The `sites/michael-levin` and `sites/joscha-bach` dirs here are thin stubs, NOT the live sites.
  - Other anchors/keynotes (Friston, Goertzel, Ororbia, Marcus, Seth, …) live in `sites/<slug>/` here and deploy as `agi26-<slug>.netlify.app`.
- **Navigation is bidirectional and must feel like one app.** Hub roster cards (`hub/src/data/roster.ts` → `subsiteUrl`, rendered by `hub/src/components/RosterCard.astro`) link out to each thinker; keep them **same-tab** (no `target="_blank"`). Each thinker site carries a "← Back to AGI 2026" bar in its shared `src/layouts/Base.astro` pointing to agi2026.netlify.app. When you add/repoint a thinker, update `roster.ts` to the site's REAL live URL (the earlier `<slug>.agi-2026.netlify.app` pattern was dead/never deployed).

**Depends on / used by:** reuses the `Levinese`/`Joscha` Astro+Tailwind template for per-thinker subsites (here named for the thinker, e.g. `sites/michael-levin`).

**Gotchas**
- `raw/` is sacred + append-only (gitignored); `derive/` is disposable — never edit raw to "fix" derived output.
- Hard rule for workers: stay in your assigned subdir, no `netlify`, no `git push`, no public site creation; local build must pass.
- Many `*-run.log` / `*-REPORT.md` at root are worker artifacts, not reference docs; `index.html.bak` is cruft.
