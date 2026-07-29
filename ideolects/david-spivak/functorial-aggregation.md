---
slug: "functorial-aggregation"
letter: "F"
title: "Functorial Aggregation"
subtitle: "polynomial comonads and bicomodules as data-migration functors"
authored_by: "Grok (xAI) - unverified draft"
source: "David I. Spivak, Garner, Richard, Fairbanks, Aaron David (2021) \"Functorial aggregation.\" arXiv (Cornell University). DOI 10.48550/arxiv.2111.10968."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-48550-arxiv-2111-10968"
related:
  - "polynomial-functor"
  - "functorial-data-migration"
  - "algebraic-database"
tags:
  - "polynomial-functors"
  - "databases"
  - "compositionality"
is_new: true
---

Functorial aggregation is the study of how data and structure are combined and transported along morphisms of categories when those categories are presented as polynomial comonads and the transporters are polynomial bicomodules—equivalently, parametric right adjoint functors between copresheaf categories that generalize ordinary polynomial functors and implement data-migration-style aggregation.

<strong>David Spivak's lens:</strong> Spivak (with Garner and Fairbanks) makes aggregation itself a functorial operation in the framed bicategory of categories and retrofunctors: polynomial comonads are categories, bicomodules are generalized data-migration functors, and universal constructions (limits, colimits, duals) become algebraic tools for composing queries and schemas. This rules out treating “aggregate then join” as an ad hoc SQL idiom outside the category, and departs from both naive fold/reduce and from plain left Kan extension alone by packaging aggregation as the algebra of polynomial bicomodules continuous with Spivak’s database and \(\mathbf{Poly}\) work.
