# Worker brief: restyle the hub to match the AGI-26 conference design

Engineering worker on Mike's Mac. Read `~/Projects/agi-2026/BUILD.md`. Work ONLY in
`~/Projects/agi-2026/hub`. HARD RULES: no `netlify`, no `git push`, no deploy. Local
`npm run build` must pass. Append any new ideas to `~/Projects/agi-2026/IDEAS.md`.
Write `hub-restyle-REPORT.md`.

## Goal
Restyle the existing hub (currently light/parchment) to MATCH the AGI-26 conference
aesthetic (agi-conference.org). Keep all content/structure (roster grid, anchors,
claim-your-page, about); change only the visual theme.

## Conference design tokens (measured from the live site — match these)
- Background: very dark navy `#0F141F`; deep section navy `#03122B`; occasional light
  sections `#F5F1EB` / white for contrast.
- Body text: off-white `#E9EAED`. Heading text: warm off-white `#F5F1EB`.
- Headings: **Cormorant Garamond**, weight 700, large and elegant (hero ~clamp(2.5rem,6vw,4rem)).
- Body: **Inter**.
- Labels / eyebrows / buttons: **IBM Plex Mono**, uppercase, small, letter-spaced.
- Accent: electric blue `#3C6CDD` (links, CTAs, active states); secondary deep blue `#143D9F`.
- Feel: modern-academic, dark, lots of negative space, restrained. Cards = subtle
  border `rgba(255,255,255,0.10)` on slightly lighter navy, blue accent on hover.

## Implementation
- Update `tailwind.config.*` theme colors + fonts; load Cormorant Garamond, Inter, IBM
  Plex Mono via Google Fonts in the base layout. Replace the parchment/teal palette
  throughout (layout, index, about, roster cards, footer) with the tokens above.
- Hero: big Cormorant Garamond headline on dark navy, mono eyebrow "AGI-26 · SAN
  FRANCISCO · 27–30 JULY 2026", electric-blue CTA.
- Roster cards: dark cards, mono affiliation, blue accent for anchors; "Claim your page"
  as a blue-outline button.
- Keep it accessible (contrast AA). `npm run build` must pass. Report what changed.
