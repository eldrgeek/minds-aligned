# FACTCHECK — Neil Gershenfeld archive

Independent verification pass, 2026-08-18, run before first deploy. Every factual claim
on the site was checked against either a record in this archive's own `papers/` corpus or
Gershenfeld's own MIT pages (`ng.cba.mit.edu`, `cba.mit.edu/about`). Anything not
groundable in those was cut.

## Corpus integrity

195 records, 180 unique titles, 1981–2026. The corpus was audited for the name-collision
problem that contaminated the Josef Urban harvest. **No exclusions were needed**: every
record retained lists "Neil Gershenfeld" among its authors, including the ones that look
out of place at first glance —

- The 1981 ocean-engineering papers with J. A. Whitehead and the 1983–84 physics papers
  are early-career work and do carry his name.
- The 2014 and 2020 Micro-CT breast-cancer imaging papers were checked individually
  because the topic is far from the rest: both list him in the author block (MIT/MGH
  collaborations), so both were kept.
- The Spanish (*Cómo hacer (casi) cualquier cosa*) and German (*Das Feuer der Renaissance
  neu entfachen*) items are translated editions of his own work, not other authors.

**Caveat retained on the site:** several records are *reviews of* his books rather than
works *by* him — "When Things Start to Think" in *Foreign Affairs* (with Eliot A. Cohen),
in *Physics Today* (with Michael Marder), and "The Nature of Mathematical Modeling" in the
*American Mathematical Monthly* (with Shirley B. Pomeranz). OpenAlex records these with
both the reviewer and the subject in the author list. None of them is used on the home
page, and the About panel states that reviews and translated editions are kept, so the
archive is a reading index rather than a bibliometric count.

## Quotations — each located in the source

| Quote on the site | Source | Verified |
|---|---|---|
| "How to turn data into things, and things into data." | cba.mit.edu/about | ✅ |
| "an interdisciplinary initiative exploring the boundary between computer science and physical science" | cba.mit.edu/about | ✅ |
| "many orders of magnitude more thermodynamic degrees of freedom than information-bearing ones (bits)" / "must be understood together" | Signal entropy and the thermodynamics of computation (1996) abstract | ✅ |
| "the first complete experimental demonstration of loading an initial state into a quantum computer" | Experimental Implementation of Fast Quantum Searching (1998) abstract | ✅ |
| "an elastic solid with an extremely large measured modulus for an ultralight material" | Reversibly Assembled Cellular Composite Materials (2013) abstract | ✅ |
| "exponential space exploration via self-replicating spacecraft (known as Von Neumann probes)" | Hierarchical assembly of a self-replicating spacecraft (2017) abstract | ✅ |
| "capable of serial, recursive" construction | Self-replicating hierarchical modular robotic swarms (2022) abstract | ✅ |
| "continuous, monolithic structures with additive manufacturing" | Discretely assembled mechanical metamaterials (2020) abstract | ✅ |
| "AI-generated meshes are not directly suitable for robotic assembly" | Speech to Reality (2024) abstract | ✅ |
| "Director, The Center for Bits and Atoms" | ng.cba.mit.edu | ✅ |

## Corrections made during this pass

1. **Co-author name corrected.** A draft credited *Designing Reality* to "Alan and Joel
   Gershenfeld." The record lists Alan Gershenfeld and **Joel Cutcher-Gershenfeld**. Fixed.
2. **Author positions are computed, not asserted** — derived at build time from each
   record's own author list, so a re-harvest cannot strand a stale hand-written claim.

## Deliberately not claimed

- **No fab-lab counts.** The global fab lab network is the thing he is best known for
  outside academia, and no number for it is verifiable from this corpus — so the site
  describes the published work and does not quote a network size.
- **No degrees or dates of education.** His own pages link a CV that was not parsed for
  this pass; rather than take a third-party biography, the Background panel confines
  itself to his current role and what the corpus itself shows.
- **No claim about his AGI-26 session.** Nothing in the corpus or on his pages states
  what he will present.
- **No priority claims about quantum computing** beyond what the 1998 paper's own abstract
  says about its demonstration.
- **No citation counts, h-index, or "pioneer/father-of" framing.**

## Standing caveat

Not written by, reviewed by, or endorsed by Neil Gershenfeld. The ClaimBar on every page
offers him the site.
