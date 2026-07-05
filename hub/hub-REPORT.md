# hub-REPORT.md — Society of Minds Aligned

**Status**: Complete. Local build verified.

## What was built

- Astro 4 + Tailwind site using the exact aesthetic from Levinese / Joscha (parchment `#f7f5f0`, ink, teal `#0c6b5a`, Lora/Inter fonts, clean card + section borders).
- Work strictly limited to `hub/`. No netlify.toml, no deploy, no git push, no external site creation.
- All secrets avoided.

## Pages

1. **Home** (`/`)
   - Masthead: "Society of Minds Aligned" with AGI-26 tagline (27–30 July 2026, San Francisco).
   - Short vision paragraph describing the living weave: corpus + AI community manager + room per thinker + cross-corpus synthesis.
   - Prominent **roster grid** (anchors first, visually tiered).
   - Kickstarter teaser CTA (placeholder link).
   - Clean nav to Home / About.

2. **About** (`/about/`)
   - "Co-owners, not subjects" framing.
   - Cross-domain synthesis via active inference across combined corpora.
   - How a thinker claims/curates their manager.
   - Explicit grounding: managers are AI guides trained on public work, never impersonations.
   - AGI-26 context.

## Data

- `src/data/roster.ts` — canonical source.
- 20 total confirmed keynotes.
- 4 anchors (Michael Levin, Joscha Bach, Karl J. Friston, Ben Goertzel) with tier styling + live/placeholder links.
  - Levin → https://levinese.netlify.app (live)
  - Joscha → https://joschese.netlify.app (live)
  - Friston / Goertzel → placeholder `/t/<slug>/`
- 16 keynotes: each card shows bio stub + "Claim your page" (mailto:claim@...).
- Each card: name, affiliation, glyph (initials), accent tiering.

## Roster count

**20 thinkers** (4 anchors + 16 keynotes)

## Build verification

```bash
cd hub && npm install && npm run build
```

Result:
- 2 page(s) built successfully.
- Output: dist/index.html, dist/about/index.html
- No errors.

## Structure

```
hub/
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── RosterCard.astro
│   ├── data/
│   │   └── roster.ts
│   ├── layouts/
│   │   └── Base.astro
│   └── pages/
│       ├── index.astro
│       └── about.astro
└── hub-REPORT.md
```

## Hard rules followed

- Only edited inside `~/Projects/agi-2026/hub`
- No netlify integration or files
- `npm run build` passes cleanly
- No secrets printed or committed
- Report written

Next parallel tracks (papers, index, room) can now proceed with the hub as the public landing.
