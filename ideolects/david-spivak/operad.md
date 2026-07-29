---
slug: "operad"
letter: "O"
title: "Operad"
subtitle: "algebra of hierarchical wiring for open systems and databases"
authored_by: "Grok (xAI) - unverified draft"
source: "Dmitry Vagner, David I. Spivak, Eugene Lerman (2015) \"Algebras of open dynamical systems on the operad of wiring diagrams.\" Theory and applications of categories. DOI 10.70930/tac/7tz1nkbd."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-70930-tac-7tz1nkbd"
related:
  - "wiring-diagram"
  - "polynomial-functor"
tags:
  - "operads"
  - "compositionality"
is_new: true
---

An operad, in the applied sense Spivak develops, is an algebraic structure whose operations are multi-input, single-output composition patterns—prototypically the operad of wiring diagrams—whose algebras are the systems that can be plugged into those patterns. Objects are typed interfaces (black boxes with ports); morphisms are hierarchical interconnection layouts; algebras assign to each interface a set of concrete systems and interpret wiring as assembly of open dynamical systems from simpler ones.

<strong>David Spivak's lens:</strong> Spivak deploys operads as the formal backbone of compositionality for real-world systems—databases, circuits, continuous- and discrete-time dynamics—rather than as a tool only for higher algebra or homotopy theory. What this rules out is composing open systems by informal “put boxes side by side” without a specified operad of legal wirings and without algebras that respect that syntax. The departure from the classical operad reading is the emphasis on visual wiring-diagram operads and their algebras of open systems: the operad is the language of plug-and-play architecture, not merely a multi-ary monoid in an abstract symmetric monoidal category.
