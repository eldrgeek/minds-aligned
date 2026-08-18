# FACTCHECK — Josef Urban archive

Independent verification pass, 2026-08-18, run before first deploy. Every factual claim
on the site was checked against either (a) a record present in this archive's own
`papers/` corpus, or (b) Urban's CIIRC profile page. Claims that could not be grounded
in one of those two were cut, not softened.

## Corpus integrity — the biggest finding

**"Josef Urban" is a common Czech name and the OpenAlex harvest returned at least four
different people.** The raw pull was 233 records. A co-author-network audit (seed on
automated-reasoning vocabulary, then grow by shared co-authors, then inspect the residue
by hand) isolated 21 records belonging to other people:

- a clinical geneticist (Human Genetics 1977, Mutation Research 1979, with K. Michalová)
- a polymer chemist (Polymer 1990, Polymer International 1993, with Jaroslav Stejskal)
- a medicinal chemist (Czechoslovak Chemical Communications 1990)
- a Brno telecom engineer working on OFDM/PAPR reduction (2007–2009, with Roman Maršálek)
  and, on the same evidence, the 2022 "Six Questions about 6G" arXiv pair
- **Joseph E. Urban**, a software-engineering academic (three papers with Patrick O. Bobbie,
  2002–2003) — a different person whose name normalizes to the same string
- Czech-language grey literature on football-club history, potato-crop density, and the
  Luxembourg dynasty, plus a German social-science paper

These were **moved, not deleted**, to `papers-excluded/` with a per-record reason in
`papers-excluded/MANIFEST.json`, so the judgement is auditable and reversible.

Two records the automated pass flagged were **restored by hand** as genuinely his:
"Content-based encoding of mathematical and code libraries" (Radboud Repository, 2011 —
sole-author, his Nijmegen period) and "Auto-hyperlinking the Stacks Project." (2015, with
Johan Commelin). The published corpus is **212 records, 167 unique titles**, spanning
2003–2026.

## Quotations — each located in the source

| Quote on the site | Source | Verified |
|---|---|---|
| "Automated deductive reasoning (automated theorem proving), inductive reasoning (machine learning and discovery) and their combining." | CIIRC profile | ✅ |
| "one of the main bottlenecks in the formalization of mathematics" | DeepMath (2016) abstract | ✅ |
| "avoiding the hand-engineered features of existing state-of-the-art models" | DeepMath abstract | ✅ |
| "the first time deep learning has been applied to theorem proving on a large scale" | DeepMath abstract | ✅ |
| "practically no domain heuristics" / "guided by reinforcement learning from previous proof attempts" | Reinforcement Learning of Theorem Proving (2018) abstract | ✅ |
| "in theory capable of proving arbitrarily hard theorems" / "face large combinatorial explosion, and therefore include many heuristics and choice points that considerably influence their performance" | Learning Guided Automated Reasoning survey (2024) abstract | ✅ |
| "a large portion of the general topology from the Munkres textbook (which has in total 241 pages in 7 chapters and 39 sections)" | 130k Lines (2026) abstract | ✅ |
| 160k lines total, "about 130k lines" in two weeks | 130k Lines abstract | ✅ |
| "a Machine Learner for Automated Reasoning" | MaLARea (2007) abstract | ✅ |

## Corrections made during this pass

1. **DeepMath's "first" claim was initially mis-stated.** A draft sentence read that the
   paper claimed the first application of deep learning "to premise selection without
   hand-engineered features." The abstract makes two separate statements — it avoids
   hand-engineered features, *and* claims to be the first large-scale application of deep
   learning to theorem proving. Rewritten to quote both accurately rather than fuse them.
2. **The conjecturing result was under-specified.** Now carries the paper's own numbers:
   5,565 problems solved versus 2,265 for CVC5, Vampire or Z3 at 60 seconds.
3. **Author positions are computed, not asserted.** Every "first of N authors" line on the
   home page is derived at build time from that record's own author list, so a re-harvest
   cannot leave a stale hand-written claim behind.

## Deliberately not claimed

- **No publication counts as achievement.** The corpus keeps preprints and versions of
  record side by side, so its size is a reading index, not a bibliometric measure. The
  page says so.
- **No claim about his AGI-26 session.** Nothing in the corpus or on his profile states
  what he will present; the site does not guess.
- **No attribution of the dictionary definitions to him.** They are the field's standard
  senses, written to get a reader into the papers, and the page says the citation is the
  part that is his.
- **No h-index, citation totals, or "leading researcher" framing.** Unverifiable from
  these sources and not needed.
- **Prize, grant and award claims** beyond the ERC AI4REASON project named on his own
  profile were not sought and are not made.

## Standing caveat

Not written by, reviewed by, or endorsed by Josef Urban. The ClaimBar on every page
offers him the site.
