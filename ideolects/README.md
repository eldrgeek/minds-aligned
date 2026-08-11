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

## The other nine thinkers — audited 2026-08-11, and the answer is "mostly no"

The 2026-07-29 session that built these closed by naming nine more speakers with
"corpora and no ideolect" and offering "the same dispatch whenever you want them":
Wissner-Gross, Lerchner, Hulme, Mostaque, Meredith, Hazan, Urban, Gershenfeld,
Rassool. It was never dispatched. Audited tonight, **the premise is false for
eight of the nine.**

`run_ideolects.py` requires `sites/<slug>/src/data/papers.json` — the aggregated
corpus it copies into the working dir as the builder's *only* citation source, and
the file `verify_ideolects.py` matches every DOI against afterwards. That file is
what makes 300/300 mean anything.

| Thinker | site slug | `src/data/papers.json` | raw `papers/*.json` | verdict |
|---|---|---|---:|---|
| Hananel Hazan | `hananel-hazan` | **yes — 68 papers** | — | **ready to build today** |
| Josef Urban | `josef-urban` | no | 233 | needs a papers.json build first |
| Neil Gershenfeld | `neil-gershenfeld` | no | 195 | needs a papers.json build first |
| Alexander Lerchner | `alexander-lerchner` | no | 53 | needs a papers.json build first |
| Alex Wissner-Gross | `alex-wissner-gross` | no | 21 | thin; borderline |
| Daniel Hulme | `daniel-hulme` | no | 13 | **too thin — don't** |
| Greg Meredith | `greg-meredith` | no | 13 | **too thin — don't** |
| Reza Rassool | `reza-rassool` | no | 5 | **too thin — don't** |
| Emad Mostaque | `emad-mostaque` | no | 3 | **too thin — don't** |

Thirty citation-grounded terms cannot be drawn from a three-paper corpus. Running
the generator anyway would produce definitions written from the model's memory
with a citation veneer over them — the exact failure the "every `source:` must
name a paper present in this file" rule exists to prevent, and the thing that
currently makes these drafts worth anything.

**Decision (2026-08-11): do not generate the nine.** Three conditions gate it, in
order, and none is met:

1. A corpus per thinker, thick enough to ground 30 terms. Four are simply too
   thin at any effort level.
2. **The faithfulness review the existing 300 have never had.** See "Not checked"
   above — nobody has confirmed a single definition characterises its thinker
   correctly. Generating 270 more unreviewed drafts about living people, while
   300 sit unreviewed, multiplies the liability instead of the value.
3. The terms collection actually being wired (next section) — today these render
   nowhere.

Only `hananel-hazan` is buildable as-is, and it is not in the `THINKERS` dict, so
even the ready one could not have run. It is added there now (topics from its own
corpus) so the decision above is the only thing standing between us and the build,
rather than a missing dict entry nobody noticed.

_Audit by Dee (Claude Opus 5), 2026-08-11 overnight sweep._

## Not yet wired to anything

These are content, not a site. The AGI-26 thinker sites under `sites/` declare
`export const collections = {}` — there is no terms collection, no route, no renderer.
Dropping these into `sites/<slug>/src/content/terms/` today would render nothing.

Wiring them up means porting the terms collection, the term page, and the index page
from Levinese into the shared AGI-26 template — a change that touches all 21 sites and
should be decided deliberately, not assumed.
