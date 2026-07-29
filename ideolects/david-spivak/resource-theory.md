---
slug: "resource-theory"
letter: "R"
title: "Resource Theory"
subtitle: "monoidal preorders that formalize convertibility of resources"
authored_by: "Grok (xAI) - unverified draft"
source: "Brendan Fong, David I. Spivak (2019) \"Resource Theories: Monoidal Preorders and Enrichment.\" Cambridge University Press eBooks. DOI 10.1017/9781108668804.003."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1017-9781108668804-003"
related:
  - "compositionality"
  - "profunctor"
tags:
  - "monoidal-preorders"
  - "compositionality"
is_new: true
---

A resource theory, in the sense developed in Spivak and Fong’s applied category theory, is a monoidal preorder whose elements are resource types, whose order \(x\leq y\) says that \(y\) can be obtained from \(x\) (convertibility), and whose monoidal product models combining resources. Enrichment over such preorders then yields categories in which hom-objects measure the resource cost or feasibility of morphisms, giving a uniform language for chemistry-style convertibility, economic exchange, and other “what can be turned into what” problems.

<strong>David Spivak's lens:</strong> Spivak treats resource theories as a first sketch of applied category theory rather than a niche import from quantum information: monoidal preorders and enrichment are introduced through concrete resource-conversion examples so that order, combination, and cost become categorical from the start. This rules out discussing “resources” only informally or only as vectors of quantities without a composition law. The departure from the standard physics literature on resource theories is pedagogical and structural—resources are the gateway into monoidal preorders, V-categories, and enrichment, not an after-the-fact application of already-assumed pure theory.
