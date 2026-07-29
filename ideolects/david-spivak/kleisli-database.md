---
slug: "kleisli-database"
letter: "K"
title: "Kleisli Database"
subtitle: "database instances valued in a monad so fields may hold lists, sets, or nulls"
authored_by: "Grok (xAI) - unverified draft"
source: "David I. Spivak (2012) \"Kleisli Database Instances.\" arXiv (Cornell University). DOI 10.48550/arxiv.1209.1011."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-48550-arxiv-1209-1011"
related:
  - "functorial-data-migration"
  - "algebraic-database"
  - "simplicial-database"
tags:
  - "databases"
  - "monads"
  - "compositionality"
is_new: true
---

A Kleisli database instance is a database instance in which atomic values are replaced by values in the Kleisli category of a monad: depending on the monad, a field may contain a list or set of values, an exception or null, or other generalized data, while the monad’s unit and bind ensure ordinary instances embed and that foreign-key paths still compose coherently under joins.

<strong>David Spivak's lens:</strong> Spivak uses monads not as a programming convenience layered on SQL but as a systematic relaxation of atomicity inside the categorical model of databases: schemas stay categories (or similar), and instances become functors into a Kleisli category so nulls, multisets, and other “impure” values are still morphisms with well-behaved composition. This rules out treating nulls and multi-valued attributes as ad hoc exceptions to the functorial instance story, and departs from standard relational theory by making the choice of monad a first-class parameter of what counts as a legal instance—continuous with his functorial data migration program.
