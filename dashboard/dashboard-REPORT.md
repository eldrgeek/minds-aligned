# dashboard-REPORT.md — AGI-26 Review Control Room

**Status**: Complete. Build verified. Local serve verified.

## What was built

Single-file review dashboard ("see, don't read") combining direction lines + live page previews for every deployed artifact. AGI-26 dark theme (navy `#0F141F`, cream, accent `#3C6CDD`).

Work strictly limited to `dashboard/`. No git push, no deploy.

## Artifacts (6 cards)

| ID | Title | URL | Status |
|----|-------|-----|--------|
| hub | Society of Minds Aligned Hub | https://minds-aligned.netlify.app | live |
| michael-levin | Michael Levin | https://levinese.netlify.app | live |
| joscha-bach | Joscha Bach | https://joschese.netlify.app | live |
| karl-friston | Karl Friston | https://agi26-karl-friston.netlify.app | live |
| ben-goertzel | Ben Goertzel | https://agi26-ben-goertzel.netlify.app | live |
| room | Multi-Agent Room | — | placeholder |

Data source: `dashboard/artifacts.json`

## Features

- **Card per artifact**: title, one-line direction, live iframe thumbnail (scaled 50%), status dot (green=live / amber=placeholder), Open link.
- **Unexplored affordance indicator**: orange pulsing dot per card; click card toggles reviewed state; persists in `localStorage` (`agi26-review-state`).
- **Review counter**: header shows N/M reviewed.
- **Minimal prose**: page is the review surface; direction lines are one sentence max.

## iframe notes

Live sites load in sandboxed iframes at 50% scale for thumbnail effect. Cross-origin sites may block embedding (`X-Frame-Options`); fallback overlay says "iframe blocked — open live site". Static screenshot pipeline is TODO (noted in IDEAS.md).

## Build & serve

```bash
cd dashboard && npm run build    # validates artifacts.json + index.html
cd dashboard && npm run serve    # http://localhost:3456
```

Build output: `build: OK — 6 artifacts validated`

## Structure

```
dashboard/
├── artifacts.json      # artifact registry
├── index.html          # single-file review UI
├── build.mjs           # validation build script
├── package.json
└── dashboard-REPORT.md
```

## Deploy target

Mike / wake-up deploys as **agi26-review** (Netlify or static host). Local path: `dashboard/index.html`.

## Hard rules followed

- Only edited inside `~/Projects/agi-2026/dashboard` (+ root `IDEAS.md`, `dashboard-progress.json` per brief)
- `npm run build` passes
- Page opens at `http://localhost:3456`
- No git push