---
slug: "left-kan-extension"
letter: "L"
title: "Left Kan Extension"
subtitle: "the universal push of instance data along a schema functor in categorical databases"
authored_by: "Grok (xAI) - unverified draft"
source: "J. Meyers, David I. Spivak, Ryan Wisnesky (2022) \"Fast Left Kan Extensions Using the Chase.\" Journal of Automated Reasoning. DOI 10.1007/s10817-022-09634-2."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1007-s10817-022-09634-2"
related:
  - "functorial-data-migration"
  - "algebraic-database"
tags:
  - "databases-as-categories"
  - "kan-extensions"
is_new: true
---

A left Kan extension along a functor F between categories is the universal way to push a Set-valued (or more generally cocomplete-valued) functor forward along F, producing a new functor on the codomain that is free relative to precomposition with F. In the database reading, if F is a schema translation, the left Kan extension of an instance along F is the universal migrated instance on the target schema—often computed by generating the free data required by the new schema’s constraints.

<strong>David Spivak's lens:</strong> Spivak makes left Kan extension the workhorse of functorial data migration: it is not an abstract existence theorem left on the page but the constructive “chase-able” operation that moves instance data across schema morphisms. What this rules out is ad hoc ETL scripts with no universal property—migrated data should be characterized by a mapping property, not by an opaque procedure. The distinctive emphasis is algorithmic and applied: reduce left Kan extensions to free models of cartesian theories and compute them with chase-like procedures, departing from pure category theory’s non-constructive Kan extensions and from database practice that never names the universal construction it is approximating.
