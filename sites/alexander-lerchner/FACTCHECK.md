# FACTCHECK — Alexander Lerchner archive

Independent verification pass, 2026-08-18, run before first deploy. Every factual claim on
the site was checked against a record in this archive's own `papers/` corpus or against his
own Google Scholar profile. Anything not groundable in those was cut.

## Corpus integrity

53 records, 40 unique titles, 2004–2026 — **the smallest corpus in this constellation, and
the site says so on its own About panel.** The duplication rate is high because arXiv
preprints and conference versions of record are both retained (e.g. β-VAE appears as ICLR
and as preprint; Alchemy appears three times under two title spellings).

A co-author-network audit for the name-collision problem returned **two** records outside
the main component: "Synaptic model for spontaneous activity in developing networks" (2004,
with John Rinzel) and "Knowing without doing" (2006, with Giancarlo La Camera and Barry J.
Richmond). Both were inspected by hand and **kept** — they are consistent with his NIH-era
computational-neuroscience period and the co-authors are that community, not a different
Lerchner. **No exclusions were necessary.**

## Quotations — each located in the source

| Quote on the site | Source | Verified |
|---|---|---|
| "Senior Staff Scientist, Google DeepMind" | his Google Scholar profile | ✅ |
| "without being restricted to specific neuron models" | Mean field theory for a balanced hypercolumn model (2006) abstract | ✅ |
| "an important precursor for the development of artificial intelligence that is able to learn and reason in the same way that humans do" | β-VAE (2017) abstract | ✅ |
| "a relatively small set of coherent rules, such as the laws of physics or chemistry" | SCAN (2017) abstract | ✅ |
| "learns to see before learning to act" | DARLA (2017) abstract | ✅ |
| "no generally agreed-upon definition of disentangling" | Towards a Definition of Disentangled Representations (2018) abstract | ✅ |
| "The ability to decompose scenes in terms of abstract building blocks is crucial for general intelligence" | MONet (2019) abstract | ✅ |
| "either too simple to be inherently interesting, or too ill-defined" | Alchemy (2021) abstract | ✅ |
| "a key challenge for creating general AI" | Scaling Instructable Agents (2024) abstract | ✅ |
| "has moved from far-fetched speculation to being a concrete next-decade target for many of the largest AI organisations" / "profound and far-reaching impacts on human society" | From AGI to ASI (2026) abstract | ✅ |
| Author list of *From AGI to ASI* (Legg, Hutter, Leibo, Gabriel, Dafoe and others) | the record's own author list | ✅ |

## Corrections made during this pass

1. **An unverifiable system name was removed.** A draft listed "IODINE" among the
   object-centric line of work. That name does not appear in any record title in this
   corpus — the paper is titled "Multi-Object Representation Learning with Iterative
   Variational Inference". Replaced with the descriptive phrase.
2. **Author positions are computed, not asserted.** This matters more here than on any
   other archive in the constellation: Lerchner is *last author* on most of the DeepMind
   papers, which is the senior slot, and stating it by hand would be both fragile and easy
   to inflate. It is derived at build time from each record's author list.

## Deliberately not claimed

- **No claim that he is "the author of β-VAE".** He is last of eight; the site says so, and
  attributes the opening quotation to the paper, not to him personally.
- **No public statements outside the corpus.** Secondary reporting exists online about
  views he has expressed on machine consciousness, including a coined term. None of it was
  traced to a primary source during this pass, so **none of it appears on the site** —
  this is a living person, and a paraphrase of a paraphrase is not evidence.
- **No employment dates or education.** Third-party aggregator profiles give both; his own
  profile does not, so the site gives neither.
- **No claim about his AGI-26 session.**
- **No citation counts, h-index, or "pioneered" framing.**

## Standing caveat

Not written by, reviewed by, or endorsed by Alexander Lerchner. The ClaimBar on every page
offers him the site.
