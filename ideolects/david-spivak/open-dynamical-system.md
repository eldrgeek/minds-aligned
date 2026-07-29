---
slug: "open-dynamical-system"
letter: "O"
title: "Open Dynamical System"
subtitle: "machines with typed ports whose interconnections are algebras of wiring diagrams"
authored_by: "Grok (xAI) - unverified draft"
source: "Dmitry Vagner, David I. Spivak, Eugene Lerman (2015) \"Algebras of open dynamical systems on the operad of wiring diagrams.\" Theory and applications of categories. DOI 10.70930/tac/7tz1nkbd."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-70930-tac-7tz1nkbd"
related:
  - "wiring-diagram"
  - "operad"
tags:
  - "dynamical-systems"
  - "compositionality"
is_new: true
---

An open dynamical system is a dynamical system equipped with an interface of input and output ports so that it can exchange signals with an environment rather than evolving only in isolation. In Spivak’s framework, such systems form algebras of the operad of wiring diagrams: a wiring diagram specifies how component systems are interconnected, and the algebra maps that syntactic interconnection to the composite open system obtained by gluing the components along shared ports.

<strong>David Spivak's lens:</strong> Spivak uses open dynamical systems to replace the classical picture of a single closed trajectory space with a compositional theory of machines that can be nested and rewired. What the algebra-of-wiring-diagrams formulation rules out is treating interconnection as informal block-diagram chat: every legal assembly is an operadic composition with a precise semantics on state spaces and dynamics. This departs from standard dynamical systems theory by making openness and hierarchical composition primary, so that networks of systems—not only autonomous ODEs—are the native objects of study.
