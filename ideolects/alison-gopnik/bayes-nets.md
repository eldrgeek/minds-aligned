---
slug: "bayes-nets"
letter: "B"
title: "Bayes Nets"
subtitle: "Formal causal graphs that model how children represent and update causal maps"
authored_by: "Grok (xAI) - unverified draft"
source: "Alison Gopnik, Clark Glymour, David M. Sobel, Laura Schulz, Tamar Kushnir, David Danks (2004) \"A Theory of Causal Learning in Children: Causal Maps and Bayes Nets.\" Psychological Review. DOI 10.1037/0033-295x.111.1.3."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1037-0033-295x-111-1-3"
related:
  - "causal-maps"
  - "bayesian-models"
  - "intervention"
tags:
  - "bayes-nets"
  - "causal-learning"
  - "computational-models"
is_new: true
---

Bayes nets (causal Bayes nets) are directed graphical models that represent causal relations among variables and support probabilistic inference, prediction, and planning. In Gopnik's framework they are the formal counterpart of the child's "causal map": a structured representation that encodes which events cause which others and that can be updated from observation and from interventions.

<strong>Alison Gopnik's lens:</strong> Gopnik does not use Bayes nets as a loose metaphor for "kids do probability." She and colleagues treat them as a precise computational account of theory-like causal knowledge—what causal maps are, how interventions differ from mere associations, and which patterns of evidence (screening-off, blocking, conditional intervention) should restructure children's beliefs. That rules out purely associative or purely modular stories of early causality: if children recover Bayes-net structure, they are doing genuine causal discovery, not just tracking co-occurrence. Bayes nets thus bridge the theory theory to algorithms that can actually learn.
