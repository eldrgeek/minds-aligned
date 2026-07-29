---
slug: "hypergraph-category"
letter: "H"
title: "Hypergraph Category"
subtitle: "symmetric monoidal categories whose string diagrams are hypergraphs with frobenius structure"
authored_by: "Grok (xAI) - unverified draft"
source: "Brendan Fong, David I. Spivak (2019) \"Hypergraph categories.\" Journal of Pure and Applied Algebra. DOI 10.1016/j.jpaa.2019.02.014."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1016-j-jpaa-2019-02-014"
related:
  - "wiring-diagram"
  - "operad"
tags:
  - "compositionality"
  - "string-diagrams"
is_new: true
---

A hypergraph category is a symmetric monoidal category in which every object carries a special commutative Frobenius algebra structure that is coherent with the monoidal product, so that morphisms may be drawn as hypergraphs: wires are objects, boxes are morphisms, and the Frobenius structure supplies the ability to split, merge, create, and discard wires. Composition and tensor of morphisms become the geometric operations of plugging boxes together and placing them side by side, with the Frobenius data ensuring that connectivity—not linear order of ports alone—determines equality of diagrams.

<strong>David Spivak's lens:</strong> Spivak (with Fong) treats hypergraph categories as the ambient setting in which circuits, relations, belief-propagation networks, and other “web-like” systems live as morphisms whose syntax is literally a hypergraph, not a mere directed string diagram. What this rules out is modeling such systems only with ordinary compact closed or traced categories that lack a uniform, objectwise Frobenius supply for copying and discarding; the distinctive move is to axiomatize that supply once and for all so that the same graphical language serves electric circuits, databases, and operadic wiring, departing from one-off reinventions of the same structure under names such as well-supported compact closed or dungeon categories.
