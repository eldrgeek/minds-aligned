---
slug: "wiring-diagram"
letter: "W"
title: "Wiring Diagram"
subtitle: "nested graphical morphisms that assemble open systems and queries"
authored_by: "Grok (xAI) - unverified draft"
source: "David I. Spivak (2013) \"The operad of wiring diagrams: formalizing a graphical language for databases, recursion, and plug-and-play circuits.\" arXiv (Cornell University). DOI 10.48550/arxiv.1305.0297."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-48550-arxiv-1305-0297"
related:
  - "operad"
  - "polynomial-functor"
tags:
  - "operads"
  - "compositionality"
is_new: true
---

A wiring diagram is a hierarchical graphical presentation of how black-box components with typed ports are interconnected: boxes expose interfaces, wires identify ports, and diagrams nest inside larger diagrams. In Spivak’s formalization they are the morphisms of an operad, so composition of diagrams is the algebraic operation that builds complex interconnection patterns from simpler ones, usable alike for relational queries, recursive definitions, and plug-and-play circuits.

<strong>David Spivak's lens:</strong> Spivak uses wiring diagrams not as informal engineering sketches but as the syntax of an operad (and later of related monoidal categories) whose algebras include relations, open dynamical systems, and mode-dependent networks. What the framework rules out is ad hoc composition of systems without a shared interface grammar: every legal assembly is a morphism, and nesting is operadic composition rather than an afterthought. This departs from the usual picture of a wiring diagram as a mere illustration by making the diagram the mathematical object that defines how open systems, databases, and circuits compose.
