---
slug: "olog"
letter: "O"
title: "Olog"
subtitle: "ontology log as a category-theoretic knowledge representation schema"
authored_by: "Grok (xAI) - unverified draft"
source: "David I. Spivak, Robert E. Kent (2012) \"Ologs: A Categorical Framework for Knowledge Representation.\" PLoS ONE. DOI 10.1371/journal.pone.0024274."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1371-journal-pone-0024274"
related:
  - "functorial-data-migration"
  - "simplicial-database"
tags:
  - "knowledge-representation"
  - "databases-as-categories"
is_new: true
---

An olog (ontology log) is a category-theoretic model for knowledge representation in which types are objects, aspects (meaningful relationships) are morphisms, and facts are equational path constraints. Grounded in formal mathematics, an olog is structurally akin to a relational database schema and can serve as a data repository, yet is designed so that domain experts can author and revise it in ordinary language while retaining a precise categorical semantics.

<strong>David Spivak's lens:</strong> Spivak treats the olog not as informal diagramming or as a mere abbreviation of SQL, but as a small category whose instances are set-valued functors—so that composition of aspects, path equations, and schema morphisms become the working vocabulary of meaning. This rules out loosely drawn semantic networks that cannot be rigorously compared or transformed; the olog is the user-facing face of the same functorial database story that later appears as data migration and algebraic databases, departing from standard KR by making every “is-a” and “has-a” a verifiable arrow subject to universal categorical laws.
