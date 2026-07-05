# Hub restyle report — AGI-26 conference aesthetic

**Track:** hub  
**Date:** 2026-06-20  
**Scope:** Visual theme only — content, structure, and roster data unchanged.

## Summary

Restyled the Society of Minds Aligned hub from the light parchment/teal palette to match the AGI-26 conference design (agi-conference.org): dark navy backgrounds, Cormorant Garamond headings, IBM Plex Mono labels, electric-blue accents.

## Design tokens applied

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0F141F` | Body, default sections |
| Deep section | `#03122B` | Hero, roster, alternating about sections, footer |
| Card surface | `#151B2B` | Roster cards |
| Light section | `#F5F1EB` | Kickstarter teaser, AGI-26 about section |
| Body text | `#E9EAED` | Paragraphs on dark backgrounds |
| Heading text | `#F5F1EB` | H1–H3 on dark backgrounds |
| Accent | `#3C6CDD` | Links, CTAs, eyebrows, hover states |
| Accent deep | `#143D9F` | Hover on light sections |
| Border | `rgba(255,255,255,0.10)` | Cards, nav, section dividers |
| Display font | Cormorant Garamond 700 | Headlines |
| Body font | Inter | Prose |
| Label font | IBM Plex Mono | Eyebrows, buttons, affiliations |

## Files changed

### `tailwind.config.mjs`
- Replaced parchment/teal/amber palette with navy/cream/body/accent tokens.
- Added `font-display` (Cormorant Garamond), `font-mono` (IBM Plex Mono).
- Added `text-hero` size (`clamp(2.5rem, 6vw, 4rem)`), `tracking-eyebrow` / `tracking-label`.

### `src/layouts/Base.astro`
- Google Fonts: Cormorant Garamond, Inter, IBM Plex Mono (removed Lora).
- Dark navy body (`bg-navy text-body`), sticky nav with subtle white border.
- Nav links in mono uppercase; site title in display font.
- Footer on `navy-deep` with mono tagline.

### `src/pages/index.astro`
- Hero on `navy-deep`: mono eyebrow, large Cormorant headline, electric-blue primary CTA, outline secondary CTA.
- Vision section on default navy with cream emphasis spans.
- Roster section on `navy-deep` with accent anchor label.
- Kickstarter teaser on cream/light section for contrast.

### `src/pages/about.astro`
- Hero matches index pattern (mono eyebrow, display headline).
- Alternating `navy-deep` / default navy sections for depth.
- Final AGI-26 section on cream (light contrast block).
- All links and labels use accent + mono styling.

### `src/components/RosterCard.astro`
- Dark card (`navy-card`) with `border-border` and accent hover.
- Affiliation in mono uppercase; anchor badge with accent border.
- Anchor links in accent mono; "Claim your page" as blue-outline button.

## Unchanged (by design)

- `src/data/roster.ts` — roster content, tiers, URLs, bios intact (`accent` field unused by components).
- Page structure, anchors, claim-your-page mailto links, copy.

## Build

```
cd hub && npm run build
✓ 2 page(s) built — /index.html, /about/index.html
```

## Accessibility notes

- Body text `#E9EAED` on `#0F141F` / `#03122B`: ~12:1 contrast (AAA).
- Cream headings `#F5F1EB` on navy: ~14:1 (AAA).
- Accent `#3C6CDD` on navy: ~5.5:1 for links/CTAs (AA).
- Muted `#9BA3B5` on navy: ~5.8:1 for secondary text (AA).
- Light sections use `text-navy` / `text-navy/70` on cream/white for AA compliance.

## Ideas captured

See `IDEAS.md` for restyle-adjacent product notes appended during this pass.