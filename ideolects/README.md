# Ideolects — corpus dictionaries for the AGI-26 speakers

An **ideolect** is a corpus dictionary: the characteristic working vocabulary of one
thinker, defined the way *they* use each term, grounded in their own published work.

The form comes from [`Levinese`](../../Levinese) (Michael Levin, 119 terms) and
[`Joscha`](../../Joscha) (Joscha Bach, 60 terms), which remain the reference standard.
These ten were generated 2026-07-28 to cover the remaining speakers listed at
<https://mike-wolf.com/agi/#speakers>.

| Thinker | Terms | Citations grounded |
|---|---:|---:|
| Alexander Ororbia | 30 | 30 / 30 |
| Alison Gopnik | 30 | 30 / 30 |
| Anil Seth | 30 | 30 / 30 |
| Ben Goertzel | 30 | 30 / 30 |
| Chris Fields | 30 | 30 / 30 |
| Christof Koch | 30 | 30 / 30 |
| David Eagleman | 30 | 30 / 30 |
| David Spivak | 30 | 30 / 30 |
| Gary Marcus | 30 | 30 / 30 |
| Karl Friston | 30 | 30 / 30 |
| **Total** | **300** | **300 / 300** |

## How they were built

Each was written by **Grok (xAI)**, working only from that thinker's own corpus —
`sites/<slug>/src/data/papers.json`, 154–427 real papers with titles, journals, DOIs
and abstracts. The brief forbade writing citations from memory: every `source:` had to
name a paper present in that file, with the DOI slug repeated in `provenance:`.

Grok cannot write thirty term files in one turn — it exceeds the per-turn output budget
and stops after narrating its plan, exiting 0 with an empty directory. So each ideolect
was built in five sequential batches of six terms, each batch told which slugs already
existed so it would not repeat itself. Builder: `run_ideolects.py`.

## Verification — what has and has not been checked

**Checked mechanically.** Every DOI in all 300 terms was extracted and matched against
the cited thinker's own `papers.json`. **300 of 300 resolve to a real paper in that
person's corpus. Zero fabricated citations.** Re-runnable with `verify_ideolects.py`.

> A note on that number: the first verification pass reported 294/300, flagging six
> citations as ungrounded. That was a bug in the *verifier* — its DOI pattern stopped at
> the first `(`, and DOIs legitimately contain parentheses
> (`10.1002/(sici)1097-0193...`). All six were real. Corrected before publication.

**Not checked.** That a citation exists is not that a definition is *faithful*. Nobody
has yet confirmed that each term is defined as that thinker actually uses it, that the
"lens" paragraph characterises their position correctly, or that the chosen paper is the
right one to hang the term on. That is a claim-to-evidence review and it has not been done.

Every term therefore carries `authored_by: "Grok (xAI) - unverified draft"` and
`provenance: ideolect-draft-2026-07-28`. **Do not publish any of this under a living
person's name until it has had that review.** These are drafts about real people who
will read them.

## Not yet wired to anything

These are content, not a site. The AGI-26 thinker sites under `sites/` declare
`export const collections = {}` — there is no terms collection, no route, no renderer.
Dropping these into `sites/<slug>/src/content/terms/` today would render nothing.

Wiring them up means porting the terms collection, the term page, and the index page
from Levinese into the shared AGI-26 template — a change that touches all 21 sites and
should be decided deliberately, not assumed.
