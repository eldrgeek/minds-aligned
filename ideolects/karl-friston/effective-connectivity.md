---
slug: "effective-connectivity"
letter: "E"
title: "Effective Connectivity"
subtitle: "The directed, causal influence one neural system exerts over another, as distinct from mere statistical dependence"
authored_by: "Grok (xAI) - unverified draft"
source: "Karl Friston (1994) \"Functional and effective connectivity in neuroimaging: A synthesis.\" Human Brain Mapping. DOI 10.1002/hbm.460020107."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1002-hbm-460020107"
related:
  - "dynamic-causal-modelling"
  - "predictive-coding"
  - "precision"
tags:
  - "connectivity"
  - "neuroimaging"
is_new: true
---

Effective connectivity is the directed influence that one neuronal population or brain region exerts over another: a causal, model-based account of how activity is transmitted and modulated in a distributed system. In Friston's usage it is estimated under an explicit model of how hidden neural states generate measurements, so that connectivity parameters describe mechanisms (coupling strengths, delays, nonlinear interactions) rather than correlations among observed time series.

<strong>Karl Friston's lens:</strong> Friston sharply separates effective connectivity from functional connectivity. Functional connectivity is undirected statistical dependence among measured signals; effective connectivity is the directed, context-sensitive coupling one would need in a generative model of those signals. That distinction rules out treating correlation, coherence, or undirected graphs as explanations of integration, and it licenses later tools—above all dynamic causal modelling—in which hypotheses about directed architecture are scored by model evidence. In the free-energy and predictive-coding setting, effective connectivity becomes the substrate on which precision-weighted prediction errors are passed: what changes with attention, learning, or pathology is not merely co-activation but the directed gains that implement belief updating.
