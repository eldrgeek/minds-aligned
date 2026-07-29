---
slug: "algebraic-database"
letter: "A"
title: "Algebraic Database"
subtitle: "schemas and instances enriched by multi-sorted algebraic theories for concrete data"
authored_by: "Grok (xAI) - unverified draft"
source: "Patrick Schultz, David I. Spivak, Christina Vasilakopoulou, Ryan Wisnesky (2017) \"Algebraic Databases.\" Theory and applications of categories. DOI 10.70930/tac/lf9k6awo."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-70930-tac-lf9k6awo"
related:
  - "functorial-data-migration"
  - "olog"
tags:
  - "databases-as-categories"
  - "algebraic-theories"
is_new: true
---

An algebraic database extends the set-valued functor model of categorical databases by incorporating multi-sorted algebraic theories (Lawvere theories) so that attributes may carry equationally specified structure—integers, strings, and other concrete datatypes—rather than living only as unstructured sets. Schemas, instances, and the morphisms between them are thereby defined in a way that unifies relational shape with algebraic operations and equations on data values.

<strong>David Spivak's lens:</strong> Spivak’s line of work treats databases as categories and instances as functors; the algebraic-database refinement exists precisely to overcome the limitation that pure Set-valued models struggle to represent concrete typed data. What it rules out is a false choice between elegant but value-blind categorical schemas and ad hoc SQL types bolted on outside the mathematics. The distinctive move is to make Lawvere theories part of the database doctrine itself, so functorial data migration and integrity constraints continue to work when attributes are rings, monoids, or other algebraic sorts—departing from both classical relational algebra and earlier purely set-valued categorical database models.
