---
slug: "duoidal-structure"
letter: "D"
title: "Duoidal Structure"
subtitle: "two monoidal products sharing a unit to encode independent and dependent composition"
authored_by: "Grok (xAI) - unverified draft"
source: "Brandon T. Shapiro, David I. Spivak (2022) \"Duoidal Structures for Compositional Dependence.\" arXiv (Cornell University). DOI 10.48550/arxiv.2210.01962."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-48550-arxiv-2210-01962"
related:
  - "polynomial-functor"
  - "compositionality"
tags:
  - "monoidal-categories"
  - "compositionality"
is_new: true
---

A duoidal structure on a category is a pair of monoidal products linked by interchange morphisms so that both ways of composing coexist coherently. In Spivak’s work with Shapiro, the relevant case is a duoidal category in which the two monoidal structures share a unit and the first is symmetric: one product models “independent” juxtaposition, the other “dependent” composition, with free such expressions corresponding to finite posets built by disjoint unions and joins.

<strong>David Spivak's lens:</strong> Spivak deploys duoidal structure specifically to make *compositional dependence* formal—when later stages of an assembly may depend on earlier ones, while other parts remain independent. This rules out treating all composition as either purely parallel (symmetric monoidal only) or purely sequential (ordinary category only). The distinctive move is to use a shared-unit duoidal signature, not as abstract 2-monoidal decoration, but as the algebra of dependent versus independent assembly—tying hierarchical, order-sensitive systems (including structures on \(\mathbf{Poly}\)) to a single compositional language.
