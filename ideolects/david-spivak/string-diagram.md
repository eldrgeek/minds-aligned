---
slug: "string-diagram"
letter: "S"
title: "String Diagram"
subtitle: "graphical syntax for regular logic, monoidal composition, and proofs"
authored_by: "Grok (xAI) - unverified draft"
source: "Brendan Fong, David I. Spivak (2020) \"String Diagrams for Regular Logic (Extended Abstract).\" Electronic Proceedings in Theoretical Computer Science. DOI 10.4204/eptcs.323.14."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-4204-eptcs-323-14"
related:
  - "graphical-regular-logic"
  - "wiring-diagram"
tags:
  - "graphical-syntax"
  - "compositionality"
is_new: true
---

A string diagram is a planar graphical notation for morphisms in (typically monoidal or relational) categories: wires stand for objects or types, boxes or nodes for maps or relations, and spatial juxtaposition encodes serial and parallel composition. In Spivak’s applied work, string diagrams supply both a syntax for regular logic—predicates and proofs as diagrams in the free regular category on a signature—and a normal-form language for computation in symmetric monoidal settings, closely allied to wiring diagrams and hypergraph categories.

<strong>David Spivak's lens:</strong> Spivak (with collaborators) treats string diagrams not as optional illustrations of already-written algebra but as the primary formal language of regular theories and monoidal proofs—regular logic is read as monoidal 2-functors out of a 2-category of relational contexts. What this rules out is treating diagrammatic reasoning as informal scaffolding: every string diagram is a morphism subject to the same equational laws as the category it presents. The departure from textbook category theory is pedagogical and technical at once—string diagrams become how one *does* applied CT (databases, circuits, signal flow), not merely how one draws it after the fact.
