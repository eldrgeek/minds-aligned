---
slug: "graphical-regular-logic"
letter: "G"
title: "Graphical Regular Logic"
subtitle: "string-diagram syntax for regular theories as free regular categories of relations"
authored_by: "Grok (xAI) - unverified draft"
source: "Brendan Fong, David I. Spivak (2018) \"Graphical Regular Logic.\" arXiv (Cornell University). DOI 10.48550/arxiv.1812.05765."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-48550-arxiv-1812-05765"
related:
  - "olog"
  - "functorial-data-migration"
tags:
  - "applied-category-theory"
  - "databases-as-categories"
is_new: true
---

Graphical regular logic is a string-diagram presentation of regular logic—the fragment of first-order logic with truth, conjunction, and existential quantification—in which predicates, contexts, and proofs are drawn as morphisms in a 2-category of relations arising from the free regular category on a signature. A regular theory becomes a suitably structured monoidal 2-functor from that relational syntax to posets of provable formulas, so that soundness and completeness are expressed as free–forgetful and diagrammatic rewriting facts rather than only as sequent-calculus rules.

<strong>David Spivak's lens:</strong> Spivak (with Fong) treats regular logic itself as categorical material—syntax as free regular category, deduction as string diagrams—rather than leaving the logic informal while only the models are regular categories. This rules out equating “relational reasoning” with ad hoc ER diagrams or SQL fragments that lack a proof-theoretic graphical calculus. The departure from the standard reading is ergonomic and foundational at once: the same compositional diagrams used for wiring and databases become the normal form for \(\exists\)-\(\wedge\) reasoning, tying knowledge representation (ologs, constraints) to a precise regular-logic substrate.
