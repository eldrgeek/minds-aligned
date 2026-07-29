---
slug: "sheaf"
letter: "S"
title: "Sheaf"
subtitle: "local-to-global assignment of system behaviors over intervals and interfaces"
authored_by: "Grok (xAI) - unverified draft"
source: "Patrick Schultz, David I. Spivak, Christina Vasilakopoulou (2019) \"Dynamical Systems and Sheaves.\" Applied Categorical Structures. DOI 10.1007/s10485-019-09565-x."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1007-s10485-019-09565-x"
related:
  - "open-dynamical-system"
  - "temporal-type-theory"
tags:
  - "applied-category-theory"
  - "compositionality"
is_new: true
---

A sheaf, in the sense Spivak applies to dynamical and event-based systems, is a structure that assigns to each open region (typically a time interval or a window of observation) a set of local sections—possible behaviors on that region—together with restriction maps that say how a longer behavior cuts down to a shorter one, subject to the gluing axiom: compatible local behaviors assemble uniquely to a global one. Composition of open systems then becomes a limit or matching condition on sheaves of behavior rather than an ad hoc product of trajectories.

<strong>David Spivak's lens:</strong> Spivak deploys sheaves as the semantics of continuous- and hybrid-time behavior—what a system can do on every interval—rather than as a tool only for algebraic geometry or cohomology. This rules out equating a dynamical system with a single global trajectory space that ignores locality and restriction: behavior is inherently local-to-global. The departure from the textbook geometric reading is that the base site is often time or interface topology for machines, and the sheaf condition becomes the compositionality and contract language for systems of systems, linking open dynamical systems, temporal type theory, and event-based robotics under one formal roof.
