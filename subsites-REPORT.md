# subsites-REPORT — Friston & Goertzel

**Track:** `sites/karl-friston`, `sites/ben-goertzel`  
**Date:** 2026-06-20  
**Status:** Local builds pass. No deploy, no git push.

## Summary

Two thinker-named Astro subsites scaffolded from the Levinese template pattern (structure, corpus search, guide widget, SomaAuth). Papers-only vertical slice — dictionary and ask are stubs.

## Sites

| Site | Papers | Pages | Build |
|------|--------|-------|-------|
| `sites/karl-friston` | 400 | 4 | `npm run build` ✓ |
| `sites/ben-goertzel` | 413 | 4 | `npm run build` ✓ |

### Pages (each site)

- `/` — Home: thinker name, factual bio paragraph, corpus count, entry points
- `/corpus/` — Searchable paper list (MiniSearch over title, abstract, authors, journal)
- `/dictionary/` — Stub ("coming soon")
- `/ask/` — Stub ("coming soon")

## Architecture

- **Template source:** `~/Projects/Levinese` (structure only; no Levin content)
- **Scaffold script:** `sites/_shared/scaffold-subsite.mjs` + `corpus-template.astro`
- **Paper source:** `papers/*.json` (OpenAlex/Levinese schema, pre-pulled)
- **Build pipeline:** `scripts/aggregate-content.mjs` → `src/data/papers.json` → Astro static build
- **Search:** MiniSearch client-side on aggregated `papers.json` (same pattern as Levinese corpus)

### Content-collection decision

Astro content collections were **not** used for papers. Two blockers:

1. Friston corpus filenames contain `#` and other URL-hostile characters → Vite import resolution fails.
2. Goertzel papers have `journal: null` in some entries → strict Zod schema rejects them.

Aggregating to `papers.json` avoids both issues and matches the Levinese MiniSearch import path.

## Theme

Applied AGI-26 dark palette (per brief):

- Background: navy `#0F141F`
- Headings: Cormorant Garamond
- Body: Inter
- Labels/meta: IBM Plex Mono
- Accent: blue `#3C6CDD`

Levinese parchment/teal theme was not retained.

## Guide widget

Per-site configs in `public/`:

- `karl-friston-guide-config.js` — persona `friston`, grounded framing, `voiceAgentId: null` (TODO)
- `ben-goertzel-guide-config.js` — persona `goertzel`, grounded framing, `voiceAgentId: null` (TODO)

Both include SomaAuth block in `Base.astro` (Supabase magic-link, shared config from Levinese).

## Local verification

```bash
cd sites/karl-friston && npm install && npm run build   # 400 papers, 4 pages
cd sites/ben-goertzel && npm install && npm run build     # 413 papers, 4 pages
```

## Not done (by design)

- Deploy / Netlify / git push
- Dictionary term extraction
- Ask RAG endpoint
- ConvAI voice agents
- X/blog/video corpus layers

## Next steps

1. Wire ConvAI `voiceAgentId` per thinker when agents exist.
2. Extract dictionary terms from high-citation papers (free energy, active inference, OpenCog, etc.).
3. Point hub roster cards at these subsite paths.
4. Add LanceDB vector index when `index/` track lands.