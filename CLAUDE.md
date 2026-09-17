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

## ⚠️ minds-aligned.org publishes `hub-public/`, NOT `hub/dist` — the root netlify.toml is wrong for it

The root `netlify.toml` says `publish = "hub/dist"`. That is the **hub's** setting
(`agi2026.netlify.app`). The site linked at the repo root is `minds-aligned-soma`
(**minds-aligned.org**), whose real publish dir is **`hub-public/`** — a hand-written
static page, not an Astro build.

Verified 2026-08-02: `hub-public/index.html` is byte-identical to what
minds-aligned.org serves, while `hub/dist/index.html` is a *completely different site*
(the old "Home · AGI-26" Astro hub, 45,827 bytes vs the live 23,988). **A bare
`netlify deploy --prod` from the repo root therefore replaces the front door with the
wrong site** — the same class of accident as the 07-29 near-miss below, but harder to
spot because the result still looks like a real AGI-26 page.

**Since 2026-09-16 the front door deploys from git.** `minds-aligned-soma` is linked to
`eldrgeek/minds-aligned` `master` with **base directory `hub-public`**, so Netlify reads
`hub-public/netlify.toml` (publish `.`, no build command, functions in
`../hub-public-functions`) and never the root `netlify.toml`. To ship a change to
`hub-public/`, push to `master`, then check the deploy reached `ready` and diff the live
page. Every push to `master` redeploys the front door, including pushes that only touch
the thinker sites. Keep `ignore = "exit 1"` in that toml: without it, Netlify cancels a
deploy whose `hub-public/` matches the last cached build, even when the live page differs
(an edit followed by its undo was left live that way on 2026-09-16).

Two consequences:
- **`master` moves on its own.** Mike's in-place edits (SOMA §17 Live Edit, below) commit
  straight to `master` through the GitHub API. Pull before you push, or the push is
  rejected as non-fast-forward.
- **A CLI deploy is now the fallback, not the path.** If you must use one, the 2026-09-14
  traps still apply: copy `hub-public/` outside `~/Projects`, `cd` into the copy, pass
  `--site=3dac5361-f1a6-4027-b57c-261984c1371d --dir=<copy> --no-build`, and compare
  `netlify api listSiteFiles` with the copy first. A CLI deploy does not bundle
  `hub-public-functions/`, so it would take Live Edit's publish step and the feedback
  proxy offline until the next git deploy.

`hub-public/soma-apps/index.html` is the SOMA apps and SOMA sites explainer
(https://minds-aligned.org/soma-apps/). The front-door footer and PlayMaker's How-To link
to it. Its head comment gives the canon source for each claim, and names the two
statements still waiting on Mike's ruling.

**In-place editing on minds-aligned.org is SOMA §17 Live Edit (since 2026-09-16).** Both
pages load it for admins only (`?edit=1`, or an existing SOMA Auth session). An admin
clicks a sentence, types, and "Make canonical" calls `/api/copy-canonize`
(`hub-public-functions/copy-canonize.mjs`). That function checks `is_app_admin('minds-aligned')`,
patches the sentence in `hub-public/*.html` through the GitHub API, and the git-linked
site republishes. `hub-public/js/live-edit.js` must stay byte-identical to
`mike-wolf-com/js/live-edit.js` (`shasum` both; SOMA/standards/soma-live-edit/ADOPT.md §5c).
Netlify env on the site: `GITHUB_TOKEN` (the estate classic PAT, see
`_estate/KEY-REFRESH-LEDGER.md`) and `SOMA_FEEDBACK_ENDPOINT` (for the chip proxy
`hub-public-functions/soma-feedback.cjs`). The `data-soma-editable` keys are unused: Live
Edit matches the sentence itself.

History: until 2026-09-15 both pages loaded `soma-edit.js` and `soma-manager.js` from
`soma-guide.netlify.app`, a CDN deleted in the 2026-08-03 Netlify review, so both 404ed.
Until 2026-09-16 the feedback chip loaded from `vpsmikewolf.duckdns.org/feedback-svc/`,
which by then answered with PlayMaker's HTML page, so the chip was dead too. The chip is
now served from `hub-public/vendor/soma-feedback/` (SOMA/standards/soma-feedback-proxy).

## Money comes in through /support/ — one page, and the price is never in the URL

`minds-aligned.org/support/` is the only place in the estate that takes money.
Every other property links to it with a query string naming what it is asking on
behalf of: `/support/?campaign=garage-door&ref=garage-door-song`. Those sites hold
no Stripe key, no price and no checkout code, so an amount change — or moving a
campaign from the LLC to the 501(c)(3) — re-issues no link anywhere.

**The rule: the client never supplies a price.** The URL carries KEYS; the server
maps a key to a Stripe Price ID. If the amount came out of the query string,
`&amount=0.01` would buy a $50 subscription. The one exception is an open-ended
donation, clamped per campaign. Two more invariants, both covered by tests:
`ref` is an attribution label and NEVER a redirect target (an open redirect on
the checkout domain is what a phishing page wants to borrow), and a campaign
whose Stripe account key is unset fails CLOSED rather than billing the wrong
entity.

| | |
|---|---|
| Page + display copy | `hub-public/support/index.html`, `support/catalog.json` |
| Prices + accounts | `hub-public-functions/support-catalog.mjs` |
| `/api/checkout` | `hub-public-functions/checkout.mjs` (Functions 2.0 `config.path`) |
| `/api/stripe-webhook` | `hub-public-functions/stripe-webhook.mjs` |
| Checks | `node ops/check-support-catalog.mjs && node ops/test-checkout.mjs` |

`catalog.json` is display copy and cannot charge anyone; `support-catalog.mjs`
holds the truth. They share only key names, and the check script fails if they
drift — a page offering a tier the server cannot price turns away someone who
was willing to pay, silently.

**Zero npm dependencies, structurally.** This site deploys `hub-public/` with
`command = ""` and no package.json in the base directory, so nothing is ever
installed. An import here that is not a `node:` builtin or a sibling file 502s in
production and passes every local test. The Stripe SDK would be a build step; one
form-encoded POST is not.

Env on `minds-aligned-soma`: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
`MA_PRICE_INITIATIVE_{FRIEND,SUPPORTER,PATRON,BENEFACTOR}`, and later
`STRIPE_SECRET_KEY_ORG`. `ops/check-support-catalog.mjs` prints which are unset.

[SUPPORT.md](SUPPORT.md) is the companion memo: why a subscription and a
donation are the same thing to the LLC and not to a 501(c)(3), the private-benefit
trap in running both under one name, the Patreon arithmetic (~14.1% vs ~4.6%),
and why the recommendation is a fiscal sponsor before Form 1023.

## AI-related work is published as a ROUTE here, not a new subdomain

**Mike Wolf, 2026-08-02.** A route is cheaper to add than a subdomain, keeps everything
under a name people already have, and — the operational reason — costs the Supabase auth
allow-list **one entry** (`https://minds-aligned.org/**`) no matter how many apps arrive.
That list is hard-capped at 2048 bytes and was at 1948/2048 on 2026-08-02.

Routes live in **`hub-public/_redirects`**. Each app keeps its own repo and its own
Netlify site and stays independently deployable; that file only decides what the public
URL is. First adopter: `/a-different-mind/` → `a-different-mind.netlify.app`.

To add one, the app must be **base-path-agnostic**: relative asset paths, and any
absolute URL it builds (serverless function, auth redirect, invite links) derived from
its own `<script>`'s `src` rather than `location.pathname`.

**Trap:** you cannot 301 `/app` to `/app/`. Netlify normalizes the trailing slash before
matching, so the rule matches its own target and loops forever — verified live. Put the
proxy rules in and let the app canonicalize itself client-side, before its stylesheet.

## ⚠️ NEVER run a bare `netlify deploy` from a `sites/<slug>/` directory

**A near-miss on 2026-07-29: `netlify deploy --prod` run from inside `sites/hananel-hazan/`
published that site's `dist/` over `minds-aligned.org`.** Caught immediately, rolled back
via `restoreSiteDeploy` to the prior good deploy `6a68fac23b58d2cc5dc19368`, and verified
the live page was correct again — but for a few seconds a public domain served the wrong
site. Nothing was lost; it could easily have been worse and gone unnoticed.

**Why:** the Netlify CLI resolves both the site link and the config from the **git repo
root**, not your cwd. From `sites/<slug>/` it therefore:
- takes the **root** `netlify.toml` (`publish = "hub/dist"`, the *hub's* setting),
- resolves `--dir` **relative to the repo root**, so `--dir=dist` means `agi-2026/dist`,
- and picks whichever site the **root** is linked to — which is not your subsite.

The per-site generated `netlify.toml` looks correct and is still ignored. The two
`Error: Error while running build` failures that precede the bad deploy are the tell.

**Always deploy a subsite with an explicit site ID and an absolute path:**

```bash
netlify deploy --prod \
  --site=<SITE_UUID> \
  --dir=/absolute/path/to/sites/<slug>/dist \
  --no-build
```

Build first with `npm run build` inside the subsite. Get `<SITE_UUID>` from
`netlify api listSites` — **not** the site *name*; `listSiteDeploys` and friends 404 on a
name. Known IDs: `agi26-hananel-hazan` = `208eaa16-daea-4268-aeef-7b273db01c4d`,
`minds-aligned-soma` (→ minds-aligned.org) = `3dac5361-f1a6-4027-b57c-261984c1371d`.

After any subsite deploy, **check the Production URL the CLI prints** before believing it
worked. That line is the only thing that reveals a wrong-site publish.

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

## Page QR codes (2026-07-27)

Every page on all thirteen properties carries a QR code that leads back to **that page** —
the conference-floor handoff: open a thinker's archive on a laptop, they scan the strip at
the bottom of the page and walk away with it on their phone. Tapping the code enlarges it
to ~420px so it can be scanned across a table.

- **Source:** `packages/feedback/src/page-qr/page-qr.src.js` (widget + `qrcode` encoder).
- **Rebuild + distribute:** `node packages/feedback/src/page-qr/build.mjs [slug ...]` —
  esbuild-bundles to a single 29 KB IIFE and writes `public/js/soma-page-qr.js` into the
  hub, every `sites/<slug>/` with a `Base.astro`, and `~/Projects/Levinese` +
  `~/Projects/Joscha`. **Never hand-edit the generated copies.**
- **Wiring:** `PageQR.astro` in `packages/feedback` (a script tag) rendered by every
  monorepo layout; the same tag inlined by hand in Levinese/Joscha, same reason as JoinBar.
- **Why the URL is read at runtime, not baked in at build:** several `sites/*/astro.config.mjs`
  still carry the dead `https://<slug>.agi-2026.netlify.app` pattern in `site:`, and the hub
  sets no `site:` at all, so build-time URLs would be wrong on most properties. Reading
  `window.location` is right on every property, on deploy previews, and after a domain move.
  (Those stale `site:` values are still worth fixing for canonical/sitemap purposes — the QR
  no longer depends on them.)
- **Excluded by design:** the Netlify CMS shells at `/admin/` on Levinese/Joscha — backend,
  not a conference page.
- **Verified live 2026-07-27** by decoding the rendered SVG on the deployed pages (jsQR over
  a canvas rasterization) and comparing to `location.href`: exact match on hub and thinker
  pages, sub-pages included.

**Depends on / used by:** reuses the `Levinese`/`Joscha` Astro+Tailwind template for per-thinker subsites (here named for the thinker, e.g. `sites/michael-levin`).

**Gotchas**
- `raw/` is sacred + append-only (gitignored); `derive/` is disposable — never edit raw to "fix" derived output.
- Hard rule for workers: stay in your assigned subdir, no `netlify`, no `git push`, no public site creation; local build must pass.
- Many `*-run.log` / `*-REPORT.md` at root are worker artifacts, not reference docs; `index.html.bak` is cruft.
