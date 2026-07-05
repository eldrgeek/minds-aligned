# Worker brief: the review DASHBOARD ("see, don't read")

Engineering worker on Mike's Mac. Read `~/Projects/agi-2026/BUILD.md` and `IDEAS.md`
(esp. the "Review UX — see, don't read" section). Work ONLY in
`~/Projects/agi-2026/dashboard`. HARD RULES: no git push. Build must pass / page must open.
Append ideas to `IDEAS.md`. Write `dashboard-REPORT.md`. PROGRESS: write
`~/Projects/agi-2026/dashboard-progress.json` each step (same shape as other tasks).

## What — Mike reviews by LOOKING, not reading. Build the "control room".
A single deployable page (single-file HTML+JS is fine; AGI-26 dark theme) that combines the
two representations (direction-doc + live-page) for max human ingestibility:

- A **card per deployed artifact**, data in `dashboard/artifacts.json`:
  - hub → https://minds-aligned.netlify.app
  - Michael Levin → https://levinese.netlify.app
  - Joscha Bach → https://joschese.netlify.app
  - Karl Friston → https://agi26-karl-friston.netlify.app
  - Ben Goertzel → https://agi26-ben-goertzel.netlify.app
  - (room, when live — leave a placeholder card)
  Each card: title, ONE-LINE direction (the "doc"), a LIVE thumbnail (embed the URL in an
  <iframe> preview, or note that a screenshot step is TODO), a "status" dot, and an "Open" link.
- An **"unexplored affordance" indicator concept** — give each card a small dot that is
  "unreviewed" by default; clicking the card toggles it "reviewed" (persist in localStorage).
  This demonstrates Mike's review-marker idea.
- Keep prose minimal: the page IS the review surface. Direction lines are one sentence max.

Build/serve it; report the URL path. (Mike or the wake-up will deploy it as `agi26-review`.)
