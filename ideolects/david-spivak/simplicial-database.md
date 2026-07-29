---
slug: "simplicial-database"
letter: "S"
title: "Simplicial Database"
subtitle: "databases as objects of a category whose schemas are simplicial sets"
authored_by: "Grok (xAI) - unverified draft"
source: "David I. Spivak (2009) \"Simplicial Databases.\" arXiv (Cornell University). DOI 10.48550/arxiv.0904.2012."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-48550-arxiv-0904-2012"
related:
  - "functorial-data-migration"
  - "olog"
tags:
  - "databases-as-categories"
  - "applied-category-theory"
is_new: true
---

A simplicial database is an object of Spivak’s category \(\mathbf{DB}\), in which the schema of a database is represented as a simplicial set: each simplex corresponds to a table (or more generally a relation among attributes), and faces encode projections to subtuples. Morphisms are data-preserving maps; limits and colimits in \(\mathbf{DB}\) exist and correspond to standard query operations such as select, join, and union. The category of ordinary relational databases embeds fully into this simplicial formulation.

<strong>David Spivak's lens:</strong> Spivak uses the simplicial structure not as decorative geometry but as the native shape of multi-attribute tables and their projections, so that geometric assembly of simplices becomes the calculus of table manipulation. This rules out treating schemas as flat lists of independent relations with no compositional geometry of attributes. The departure from standard relational theory is that the schema itself is a combinatorial space—simplicial—whose limits and colimits are the queries, anticipating the later purely categorical (functorial) database language while keeping the table-as-simplex intuition explicit.
