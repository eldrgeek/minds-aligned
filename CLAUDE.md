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

## The AI hosts (2026-07-22)

Every property has a **named AI host** that converses and cites the archive it stewards
(SOMA-APP-STANDARD §1 host pair, §6 named minds). Before this pass the hosts were
walkthrough-only: `soma-guide.js` supports a `cfg.inferenceUrl` hook and no site in the
estate had ever set it, so every "AI guide" was a keyword matcher with a persona name.

- **Roster + personas:** `sites/_shared/host/hosts.json` — thirteen hosts (Chora on the hub;
  Markov, Atom, Lantern, Ember, Phi, Umwelt, Olog, Scaffold, Holo, Synapse, Morph, Animus).
  Each is named for a concept from the work it stewards, deliberately **not** the thinker's
  name and never `V'<FirstName>` — these are living people who have not consented to an
  impersonation, and every host says so in its greeting. Renaming one is a config edit here
  plus a regen.
- **Regenerate everything:** `node sites/_shared/host/build-hosts.mjs [slug ...]`. It writes
  `netlify/edge-lib/corpus-index.js`, `netlify/edge-functions/ask.js`, `public/<slug>-host.js`
  and a per-site `netlify.toml`. Hand-authored walkthroughs in `<slug>-guide-config.js` are
  never touched — the generated host layer merges *over* them at load time.
- **How an answer happens:** the widget POSTs to `/api/ask`; a BM25 pass over that thinker's
  corpus (papers + talks + dictionary terms) picks six passages; those are stapled to the
  context and forwarded to the canonical infer service at
  `https://vpsmikewolf.duckdns.org/infer/ask`. No per-site `ANTHROPIC_API_KEY` anywhere.
- **Deploy:** `bash sites/_shared/host/deploy-all.sh [slug ...]`
- **Verify (live, spends real inference):** `bash sites/_shared/host/verify-all.sh`

**Traps this cost a session to learn — all encoded in the scripts, don't re-derive them:**

- **Edge, not serverless.** The infer upstream runs ~9s with outliers past 20s; this account
  is on Netlify's **Free** plan, where synchronous functions die at **10s**. Edge functions
  allow 40s to first byte and their 50ms CPU budget excludes fetch wait.
- **`corpus-index.js` must NOT live in `netlify/edge-functions/`.** Netlify treats every
  top-level file there as a function and rejects a data module — the deploy fails with a
  swallowed error whose only visible text is "error while bundling edge functions". It lives
  in `netlify/edge-lib/`.
- **`--dir` is resolved against the git root, not the cwd.** Always absolute.
- **Retrieval failures are silent and look like honest answers.** Two found this way, both
  of which made a host say "I don't see that in the archive" about content the archive
  *contained*: (a) the `terms/*.md` dictionaries weren't indexed, and they are the densest
  grounding in Levinese/Joscha; (b) hyphenation — the query token `cyber-animism` could
  never match an indexed `cyberanimism`, so tokenize now expands every hyphenated token to
  the hyphenated form, the joined form, and its parts. When a host pleads ignorance, check
  retrieval before believing the corpus is thin.
- **Every property deploys from its own directory, hub included.** A root-level
  `[[edge_functions]]` block is not picked up by a `--filter hub` deploy: the hub reported a
  successful deploy while `/api/ask` 404'd in production. Hence `hub/netlify.toml`.

## SOMA Onboard (2026-07-22)

Join-by-QR/link/email across the constellation, via `@soma/onboard`. **One membership for
all thirteen properties**, not one per archive — §15b federation is about separate *apps*,
and the constellation is one app with thirteen surfaces. Tables are `agi26_*` in the shared
SOMA Auth project (`omfwcodoimjmbrhssvfl`), created 2026-07-22 from the package's schema
template. Server: `hub/netlify/functions/onboard.js` (+ `_onboard.js` config) behind
`/api/onboard/*`. Landing: `hub/src/pages/join.astro`. Affordance: `JoinBar.astro` in
`packages/feedback`, rendered by every layout; inlined by hand in Levinese/Joscha, which
cannot import the workspace package.

**SOMA-app status (verified 2026-07-15):** all 13 live properties (hub + 10 monorepo thinker sites + Levinese + Joscha) carry the canonical `soma-feedback` widget (SOMA-APP-STANDARD §8) at the shared-layout level, so every page inherits it. App identity is the bare thinker slug (`site="karl-friston"`, `site="minds-aligned-hub"`, etc.) — the pre-existing convention from an earlier pass, kept rather than introduced-anew. `soma-ship-check.py` passes hard checks on all 13. Widget source: `packages/feedback` workspace package inside this monorepo (imported via `@soma/feedback/components`); Levinese/Joscha vendor the standalone JS/CSS directly since they're outside the monorepo and can't reach the workspace package. `sites/michael-levin` and `sites/joscha-bach` remain undeployed stubs — not wired for a live deploy, only patched for build-parity. Full report: `SOMA/audits/20260715T0633XX-agi2026-soma-apps.md`.

**Depends on / used by:** reuses the `Levinese`/`Joscha` Astro+Tailwind template for per-thinker subsites (here named for the thinker, e.g. `sites/michael-levin`).

**Gotchas**
- `raw/` is sacred + append-only (gitignored); `derive/` is disposable — never edit raw to "fix" derived output.
- Hard rule for workers: stay in your assigned subdir, no `netlify`, no `git push`, no public site creation; local build must pass.
- Many `*-run.log` / `*-REPORT.md` at root are worker artifacts, not reference docs; `index.html.bak` is cruft.
