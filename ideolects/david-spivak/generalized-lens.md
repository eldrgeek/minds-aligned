---
slug: "generalized-lens"
letter: "G"
title: "Generalized Lens"
subtitle: "bidirectional morphisms packaged by a Grothendieck construction on a functor C^op → Cat"
authored_by: "Grok (xAI) - unverified draft"
source: "David I. Spivak (2019) \"Generalized Lens Categories via functors $\mathcal{C}^{\rm op}\to\mathsf{Cat}$.\" arXiv (Cornell University). DOI 10.48550/arxiv.1908.02202."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-48550-arxiv-1908-02202"
related:
  - "polynomial-functor"
  - "wiring-diagram"
tags:
  - "lenses"
  - "compositionality"
is_new: true
---

A generalized lens is a morphism in a category Lens_F built from any category C and any functor F from C^op to Cat by a variant of the Grothendieck construction: objects pair a “view” or base object of C with data in the fiber F, and morphisms package a forward map together with a coherent backward or residual map in the fibers. Ordinary asymmetric lenses, optics, and many bidirectional data accessors arise by specializing C and F.

<strong>David Spivak's lens:</strong> Spivak’s contribution is not a new one-off lens API but a uniform construction that produces a whole family of lens categories from a single functorial recipe, so that databases, dynamical systems, and learners can share the same bidirectional pattern. What this rules out is treating each bidirectional gadget as an ad hoc pair of get/put functions without a common compositional home; the distinctive move is to read lenses as the morphisms of a Grothendieck fibration-style category rather than as isolated programming patterns, departing from the classical database-and-Haskell lens literature by placing them squarely inside applied category theory’s toolkit for open systems.
