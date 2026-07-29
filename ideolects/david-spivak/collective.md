---
slug: "collective"
letter: "C"
title: "Collective"
subtitle: "interface-plus-protocol for aggregating contributions and distributing returns"
authored_by: "Grok (xAI) - unverified draft"
source: "Nelson Niu, David I. Spivak (2021) \"Collectives: Compositional protocols for contributions and returns.\" arXiv (Cornell University). DOI 10.48550/arxiv.2112.11518."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-48550-arxiv-2112-11518"
related:
  - "polynomial-functor"
  - "functorial-aggregation"
tags:
  - "polynomial-functors"
  - "compositionality"
is_new: true
---

A collective is an interface equipped with a protocol that aggregates many members’ contributions—time, work, ideas, resources—and distributes returns back to those members according to a specified rule. Formally, collectives live in the category of polynomial functors with a monoidal structure that encodes how contribution and return wires compose, so that new collectives can be built from old by nesting, placing in parallel, or otherwise wiring protocols while preserving the contribution–return duality.

<strong>David Spivak's lens:</strong> Spivak (with Niu) uses “collective” as a compositional economic and organizational primitive—not as informal sociology or as a mere multi-agent game—by identifying the protocol with polynomial data and monoidal wiring. This rules out modeling shared endeavors only as untyped pools or as single functions from total input to total output without a typed aggregation/distribution interface. The distinctive move is to place mutual endeavors inside \(\mathbf{Poly}\), so that the same mathematics that governs interaction and dynamics also governs how many participants plug into one cooperative protocol and how returns flow back.
