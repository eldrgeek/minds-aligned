---
slug: "indefinite-truth-values"
letter: "I"
title: "Indefinite Truth Values"
subtitle: "Interval-and-confidence truth representation for uncertain logical inference"
authored_by: "Grok (xAI) - unverified draft"
source: "Ben Goertzel, Matthew Iklé, Izabela Freire Goertzel, Ari Heljakka (2008) \"Indefinite Truth Values.\" DOI 10.1007/978-0-387-76872-4_4."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1007-978-0-387-76872-4-4"
related:
  - "probabilistic-logic-networks"
  - "experiential-semantics"
  - "inference-control"
tags:
  - "pln"
  - "uncertain-inference"
  - "truth-values"
is_new: true
---

Indefinite truth values are PLN's primary way of attaching graded belief to logical relationships: instead of a single probability, a proposition carries an interval (or related indefinite distribution) plus confidence-related parameters that express both estimated strength and how much evidence backs that estimate. Inference rules propagate these indefinite values so that conclusions remain usable under sparse, noisy, and partially contradictory experience.

<strong>Ben Goertzel's lens:</strong> Goertzel deploys indefinite truth values as the practical compromise between overconfident point probabilities and unusable full distributions inside a live AGI knowledge graph. They rule out classical two-valued logic for declarative AGI knowledge and also rule out treating every edge weight as a simple floating-point confidence score without interval semantics. What is distinctive is the integration: indefinite values are not a standalone uncertainty calculus; they are the currency of PLN rules (including quantifiers and first-order extensional inference) that must interact with attention, experiential semantics, and resource-bounded inference control inside OpenCog-style architectures.
