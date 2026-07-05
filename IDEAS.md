# IDEAS — Society of Minds Aligned (capture everything; ideas are gold)

Append freely. Even rejected ideas explore the state space. Format:
`- [date] (source) idea — why it might matter.` Workers: append yours here too.

## Product / intellectual engine
- (Claude) **Co-owners, not subjects** — "claim your page" lets a thinker correct/curate
  their own manager. Ownership → investment → evangelism. Also the honest answer to
  "are you putting words in my mouth."
- (Claude) **Multi-agent room (HERO)** — thinkers' representatives in cited conversation;
  visitors can join. The Kickstarter demo.
- (Claude) **Comparative concept encyclopedia** — one entry per concept (agency, Markov
  blanket, self) showing how each thinker uses it, side by side, cited. Encyclopedic spine,
  inherently multi-author, grant-worthy.
- (Claude) **Productive-disagreement finder** — surface where thinkers' models diverge
  (high info-gain). Frame the synthesis engine as literal active inference over the joint model.
- (Claude) **Open-problems generator** — cross-corpus gaps → "questions the field hasn't answered."
- (Claude) **Convergence map** published BEFORE the conference — buzz; reason for speakers to share.
- (Claude) **Managers cite each other** — Friston's manager points to Levin's cognitive light cone.
  Interlinks corpora; densifies the whole.
- (Claude) **Temporal views** — how a thinker's stance evolved (X timestamps make this free).
- (Claude) **Kiosk / "Ask the AGI-26 panel"** physical screen at the venue.

## Strategy / growth
- (Claude) Thinkers are content + audience + distribution. Get ONE fired up → they carry it.
- (Claude) **Tier by depth** — deep / papers / stub("claim your page"). Cover a whole roster cheaply.
- (Claude) **Thinker-hub-as-a-service** — same machine for any field's conference. The scalable business.
- (Claude) Roster of the conference = the build manifest. Point factory at any event's speaker page.

## Sustainability (separate cheap from expensive)
- (Claude) Static corpus/encyclopedia = ~0 marginal cost on a CDN; only LIVE inference costs.
  Gate monetization to that surface. Tiers: Free (cached) · BYOK · Subscription · Sponsor · Kickstarter · Grants.
- (Claude) Pre-compute popular Q&A / panels → serve cached; live inference only on novel queries.

## Index / retrieval (KEYSTONE)
- [2026-06-20] (index) **Namespace-scoped prefilter + rerank** — LanceDB `where(thinker IN …)` works but cross-corpus queries may need per-namespace top-k merge + RRF so thin namespaces aren't drowned by tweet volume.
- [2026-06-20] (index) **Chunk lineage field** — store parent doc id + chunk index so managers can cite full paper/thread context, not just the retrieved slice.
- [2026-06-20] (index) **Pre-warm embedder in serve.py** — load fastembed at startup (already via lifespan) and expose `/health` with model name + row count for ops.
- [2026-06-20] (index) **Deterministic rebuild manifest** — hash each source file at ingest time; skip re-embed only when content hash unchanged (idempotency today is id-only).

## Open questions / to explore
- Eventually: get a thinker to ENDORSE their manager as an authorized voice (consent questions, bigger product).
- Naming of the public site / the "rooms"; how visitors "join" a room (text + voice).

## Subsites worker (2026-06-20)
- [2026-06-20] (subsites) **papers.json spine, not Astro collections** — filenames with `#` and nullable fields break content-collection imports; aggregate to JSON like Levinese MiniSearch already does. Reusable for any OpenAlex dump.
- [2026-06-20] (subsites) **Shared scaffold script** — `sites/_shared/scaffold-subsite.mjs` + `site.config.json` per thinker → 4-page papers-only subsite in one command. Scale to AGI-26 roster stubs cheaply.
- [2026-06-20] (subsites) **Dictionary from corpus co-occurrence** — mine abstract n-grams + citation graph for candidate terms (Markov blanket, free energy, OpenCog) before hand-curating entries.
- [2026-06-20] (subsites) **Cross-thinker paper links** — when dictionary lands, link Friston "active inference" papers to Goertzel "AGI architecture" papers via shared concept IDs (feeds convergence map).

## Hub / design (from restyle pass)
- [2026-06-20] (hub-restyle) **Shared design system with agi-conference.org** — extract tokens into a small `@agi-26/tokens` package so hub, subsites, and Kickstarter page stay visually locked to the conference brand.
- [2026-06-20] (hub-restyle) **Per-thinker accent from roster** — use the unused `accent` field in roster data for subtle card glyph color variation while keeping the conference navy/blue shell.
- [2026-06-20] (hub-restyle) **Conference nav cross-link** — mono eyebrow in hero could link to agi-conference.org registration; reinforces hub as official AGI-26 companion, not a side project.

## Community, consent & governance (Mike, 2026-06-20)
- (Mike) Build a community; let it VOTE on what it wants — make votes VISIBLE to the stars, then stars decide. Demand = the invitation.
- (Mike) Per-user consent VETO (not just star-level): if a visitor doesn't want anyone speaking in (e.g.) Michael Levin's voice, they don't see that feature — EVEN IF Levin authorized it. Two-sided consent → a per-user feature-preference layer gating synthesized-voice / representative features.
- (Claude) Homage first; endorsement = the invitation/stretch goal.

## Review UX — "see, don't read" (Mike, 2026-06-20)
- (Mike) Humans review by LOOKING. Docs = direction only; a doc that describes what you see is a distraction. Pages need affordances that say what to interact with.
- (Mike) Unexplored-affordance indicators — a small marker on every affordance the designer hasn't explored/reviewed yet; part of the review process.
- (Mike) Combine doc + page for max human ingestibility — ideas:
- (Claude) Control-room dashboard — one live page, a card per deployed artifact: auto-screenshot thumbnail + one-line direction + live link + status dot.
- (Claude) Inline direction tooltips — the "doc" lives ON the affordance (hover → intent + review state), not a separate file.
- (Claude) "What's new since last review" glow layer — ?review mode highlights changed affordances; click marks "explored" (dismisses marker).
- (Claude) Split view — left: short living outline (direction); right: live page; clicking an outline node highlights the affordance. Reading+looking locked together.

## Dashboard worker (2026-06-21)
- [2026-06-21] (dashboard) **iframe thumbnails are good enough for v0** — scaled 50% iframe previews work for same-origin and permissive sites; X-Frame-Options blocks some Netlify subsites. Fallback overlay + Open link covers the gap until a screenshot cron lands.
- [2026-06-21] (dashboard) **Screenshot cron for review thumbnails** — nightly Playwright pass per artifact URL → `dashboard/thumbs/<id>.webp`; swap iframe for `<img>` when file exists. Removes iframe-block pain and loads faster.
- [2026-06-21] (dashboard) **Per-affordance markers inside subsites** — dashboard card-level review is coarse; next step is injecting `?review=1` mode on each subsite so individual buttons/links get the unexplored dot (feeds Mike's affordance-indicator idea at finer grain).
- [2026-06-21] (dashboard) **"What's new since last review" diff glow** — store last-reviewed timestamp per artifact; on load, highlight cards whose deploy changed since then (Netlify deploy hook or `etag` poll).

## Ops / autonomy (Mike, 2026-06-20)
- (Mike) Adaptive check-in cadence — next-check = (shortest in-flight task est. completion)/N, N starts 10 (estimates ~10x off). Each task posts PROGRESS; on check-in compare done-vs-elapsed, update N PER TASK (faster→raise N→check sooner; on-estimate→lower N <5). Keep a GLOBAL N too. Put a worker on the algorithm details.
- (Mike) Deploy everything AS built (don't batch). Rather waste tokens than time.

## Room worker (2026-06-21)
- [2026-06-21] (room) **Exchange compiler script** — `room/scripts/compile-exchange.mjs` calls `index/query.py`, drafts alternating turns, human-review gate, writes `exchanges.json`. Removes hand-authored drift on regen.
- [2026-06-21] (room) **Citation chip deep-link to subsite** — term citations → Levinese anchor; paper → subsite paper page when available, not raw DOI only.
- [2026-06-21] (room) **Visitor question → nearest seed** — v0 join box fuzzy-matches to closest cached exchange instead of only showing BYOK stub; bridges to live mode later.
- [2026-06-21] (room) **Cross-pair panels** — 3+ representatives (e.g. Levin × Friston × Bach) with RRF merge across namespaces; natural Kickstarter demo escalation.
- [2026-06-21] (room) **Turn-level disagree highlight** — when retrieved passages score divergent claims on same question, UI badges "productive disagreement" (feeds convergence map).
- [2026-06-21] (ops) **Cadence shipped** — `ops/cadence.py` + `check_workers.sh` + `PROGRESS.md`; pace-ratio N update with on-pace damp to N=4, global EMA, persisted state.
- [2026-06-21] (ops) **Stale-heartbeat poke** — if `ts` on a progress file is older than 2× `next_check_interval`, auto-nudge or escalate (no silent stuck workers).
- [2026-06-21] (ops) **Per-task cadence in dashboard** — control-room card shows pct, pace, N, and countdown to next check for each in-flight worker.
- [2026-06-21] (ops) **Estimate calibration log** — append `(elapsed, pct, est_total)` tuples to `ops/calibration.jsonl` per check-in; offline fit to replace static N=10 prior.

## Standing directive (Mike, 2026-06-21)
- (Mike) When idle: discuss new ideas with the BRAIN TRUST and implement the best — use CONVICTION, not just consensus. (Brain trust = CIE multi-persona fan-out, or multi-angle self-critique.) X scraping stays on the deterministic x_scrape.mjs script, not Grok.

## Resume wave (Claude, 2026-06-21)
- [2026-06-21] (build) **Full speaker set is live** — scaffolded + deployed 8 keynote subsites (ororbia, gopnik, seth, fields, koch, eagleman, spivak, marcus) from existing corpora via sites/_shared. Hub now deep-links 9 live spaces. Pattern proven: write site.config.json → scaffold-subsite.mjs → npm i → build → netlify create+deploy.
- [2026-06-21] (gap) **Site template is papers+ask only** — videos/ and collaborators.json exist in sites/<slug>/ and are now in the central index, but the scaffolded pages don't render them. Next: extend sites/_shared/scaffold (corpus-template) to add a Videos section (yt cards) + a Collaborators graph/list. High visible payoff per "grab EVERYTHING, show it."
- [2026-06-21] (BLOCKER) **Managers aren't live in prod** — index/serve.py binds 127.0.0.1:8765 (local only), so the deployed subsites' ask pages can't actually retrieve. To ship the per-thinker manager (cited RAG, AI-guide-not-impersonation), host retrieval: either a Netlify Function wrapping a hosted vector store, or run serve.py on the VPS (vpsmikewolf) behind https + CORS, and point each subsite's guide-config at it. This is the single highest-leverage next step.
- [2026-06-21] (data) **11 of 20 keynotes still corpus-less** — Gershenfeld, Mostaque, Lerchner, Hulme, Wissner-Gross, Meredith, Rassool, Habibi, Hazan, Urban, Blackburn have no sites/<slug>/ corpora. Run adapters/gather_all.mjs <slug> for each in a future wave, then scaffold+deploy the same way.
- [2026-06-21] (index) **Generic site ingester added** — index/build_sites_index.py walks sites/<slug>/{papers,videos} into the shared chunks table (additive, idempotent). Index now 4303 chunks across 12 namespaces (was 3500/4). Videos are searchable. Anchors' papers left to the raw/ jsonl path to avoid dup namespaces.
