---
slug: "novelty"
letter: "N"
title: "Novelty"
subtitle: "Expected information gain about model parameters that drives epistemic foraging"
authored_by: "Grok (xAI) - unverified draft"
source: "Raphael Kaplan, Karl Friston (2018) \"Planning and navigation as active inference.\" Biological Cybernetics. DOI 10.1007/s00422-018-0753-2."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1007-s00422-018-0753-2"
related:
  - "epistemic-value"
  - "expected-free-energy"
  - "ambiguity"
  - "active-inference"
tags:
  - "active-inference"
  - "exploration"
  - "learning"
is_new: true
---

Novelty is the epistemic drive to sample contingencies that are expected to reduce uncertainty about the parameters (or structure) of the generative model—what the world is like in general, not merely which state it occupies right now. In decompositions of expected free energy, novelty sits with information gain about parameters, while ambiguity concerns uncertainty about hidden states given those parameters. Policies that visit unfamiliar contexts score high in novelty and therefore in epistemic value, contextualising later pragmatic, goal-directed navigation once the model has been sufficiently constrained.

<strong>Karl Friston's lens:</strong> Friston does not treat novelty as a raw stimulus property (“new thing”) or as an ad hoc exploration bonus. It is the parameter-learning counterpart of epistemic value: the imperative to close explanatory gaps by actively sampling unpredictable contingencies, so that expected surprise falls. That rules out casting exploration as random noise or ε-greedy search, and it dissolves the exploration–exploitation dilemma into sequential regimes of one free-energy objective—novelty-seeking forages until uncertainty is resolved, then prior preferences dominate planning. Novelty is thus how curiosity and maze-like epistemic behaviour fall out of active inference rather than being imported from outside it.
