---
slug: "functorial-data-migration"
letter: "F"
title: "Functorial Data Migration"
subtitle: "schema morphisms induce canonical translations of database instances"
authored_by: "Grok (xAI) - unverified draft"
source: "David I. Spivak (2012) \"Functorial data migration.\" Information and Computation. DOI 10.1016/j.ic.2012.05.001."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1016-j-ic-2012-05-001"
related:
  - "olog"
  - "simplicial-database"
tags:
  - "databases-as-categories"
  - "compositionality"
is_new: true
---

Functorial data migration is the doctrine that a database schema is a small category, an instance is a set-valued functor on that schema, and a morphism of schemas induces three canonical data-migration functors (adjoints along the schema map) that translate instances from one schema to another. Those functors simultaneously parameterize projections, unions, and joins over tables, and can stand in for families of conjunctive and disjunctive queries.

<strong>David Spivak's lens:</strong> Spivak replaces the usual view of a schema as a bag of tables-plus-SQL with the claim that schemas are categories and instances are functors, so migration is not an ad hoc ETL script but the adjoint triple induced by a functor between schemas. What this rules out is treating graph-based schemas as mere abbreviations of relational schemas whose meaning lives only in SQL; the categorical reading makes every schema map produce mathematically forced, compositionally well-behaved migrations. The departure from standard database theory is that queries and data movement become instances of universal constructions (Kan extensions / adjoints) rather than a separate query language bolted onto tables.
