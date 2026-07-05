# Worker brief: the hub — "Society of Minds Aligned"

You are an engineering worker on Mike's Mac. Read `~/Projects/agi-2026/BUILD.md` first.
Work ONLY in `~/Projects/agi-2026/hub`. Read `~/Projects/Levinese` and `~/Projects/Joscha`
as the template (Astro + Tailwind, same look). HARD RULES: no `netlify`, no `git push`,
no site creation, no deploy. Local `npm run build` must pass. Write `hub-REPORT.md`. Don't print secrets.

## Build `hub/` — an Astro+Tailwind landing for "Society of Minds Aligned"
Scaffold from the Levinese template's structure/aesthetic (parchment, serif headings,
teal accent). Pages:

1. **Home** — masthead "Society of Minds Aligned", tagline tying it to AGI-26
   (27–30 July 2026, San Francisco). A short vision paragraph: a living, queryable
   weave of the thought-streams of the thinkers building toward AGI — corpus,
   AI community manager, and a room per thinker, plus cross-corpus synthesis.
   Prominent **roster grid** (below). A Kickstarter teaser CTA (placeholder link).

2. **Roster grid** — a card per AGI-26 confirmed keynote (list in BUILD.md). Each card:
   name, role/affiliation, glyph/accent. Tier visually:
   - **Anchor** (Michael Levin, Joscha Bach, Karl Friston, Ben Goertzel) — card links
     to that thinker's subsite (use placeholder routes `/t/<slug>/` for now; Levin →
     https://levinese.netlify.app and Joscha → https://joschese.netlify.app as live links).
   - **Others** — card shows bio stub + a "Claim your page" button (mailto or a
     placeholder form) — the co-ownership hook.

3. **About / vision** — the "co-owners not subjects" framing, the cross-domain
   synthesis idea (active inference across combined corpora), and how a thinker
   can claim/curate their manager. Keep it grounded: managers are AI guides trained
   on public work, never impersonations.

## Data
Put the roster in `hub/src/data/roster.ts` (name, slug, affiliation, tier:'anchor'|'keynote',
accent, glyph, subsiteUrl?). Affiliations are in BUILD.md / the AGI-26 site text.

## Verify
`cd hub && npm install && npm run build` must pass. Report pages built + the roster count.
