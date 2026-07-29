---
slug: "temporal-type-theory"
letter: "T"
title: "Temporal Type Theory"
subtitle: "a topos-theoretic language whose types are behavior types over time"
authored_by: "Grok (xAI) - unverified draft"
source: "Patrick Schultz, David I. Spivak (2017) \"Temporal Type Theory: A topos-theoretic approach to systems and behavior.\" arXiv (Cornell University). DOI 10.48550/arxiv.1710.10258."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-48550-arxiv-1710-10258"
related:
  - "open-dynamical-system"
  - "olog"
tags:
  - "type-theory"
  - "dynamical-systems"
  - "topos-theory"
is_new: true
---

Temporal type theory is a type theory whose types interpret as behavior types—predicates or spaces of trajectories over continuous or hybrid time—so that propositions about systems are statements about what behaviors are possible, necessary, or composable on intervals, with classical temporal logics such as LTL and MTL embedding into its internal logic.

<strong>David Spivak's lens:</strong> Spivak (with Schultz) builds temporal type theory as a topos-theoretic systems language rather than as another discrete temporal logic: hybrid dynamical systems, continuous-time constraints, and composition of open systems are meant to be written as types and terms, not only as ODEs or state machines outside the logic. This rules out equating “temporal” reasoning with pure path-formula model checking, and departs from standard type theory by taking time-varying behavior—not static data—as the primary semantic domain of types.
