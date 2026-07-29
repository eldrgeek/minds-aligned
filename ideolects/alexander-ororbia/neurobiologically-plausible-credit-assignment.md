---
slug: "neurobiologically-plausible-credit-assignment"
letter: "N"
title: "Neurobiologically-Plausible Credit Assignment"
subtitle: "The central question of where teaching signals come from and how synapses use them"
authored_by: "Grok (xAI) - unverified draft"
source: "Alexander G. Ororbia (2023) \"Brain-Inspired Machine Intelligence: A Survey of Neurobiologically-Plausible Credit Assignment.\" arXiv (Cornell University). DOI 10.48550/arxiv.2312.09257."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-48550-arxiv-2312-09257"
related:
  - "local-representation-alignment"
  - "predictive-coding"
  - "contrastive-signal-dependent-plasticity"
tags:
  - "credit-assignment"
  - "brain-inspired"
  - "synaptic-plasticity"
is_new: true
---

Neurobiologically-plausible credit assignment denotes algorithms that apportion responsibility for network performance to individual synapses using mechanisms that could, in principle, be realized by biological neurons—local activity, local errors, neuromodulatory or spike-timing cues—rather than reverse-mode automatic differentiation. The phrase names both the engineering problem (how each weight knows how to change) and a class of solutions surveyed against that biological constraint.

<strong>Alexander Ororbia's lens:</strong> For Ororbia this is the organizing problem of brain-inspired machine intelligence, not a side constraint. In his 2023 survey he taxonomizes algorithms by a single diagnostic: *where do the signals that drive learning in individual elements come from, and how are they produced?* That framing rules out treating “biologically inspired” as surface analogy (spiking units trained with backprop, or Hebbian slogans without a credit path). Credit assignment is successful only when the teaching signals themselves are locally generable—aligning his LRA, NGC, spiking, and contrastive-plasticity lines under one evaluative criterion that backprop systematically fails.
