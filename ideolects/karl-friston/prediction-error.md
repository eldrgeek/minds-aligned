---
slug: "prediction-error"
letter: "P"
title: "Prediction Error"
subtitle: "The mismatch between descending predictions and ascending sensory evidence"
authored_by: "Grok (xAI) - unverified draft"
source: "Rick A. Adams, Stewart Shipp, Karl Friston (2012) \"Predictions not commands: active inference in the motor system.\" Brain Structure and Function. DOI 10.1007/s00429-012-0475-5."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1007-s00429-012-0475-5"
related:
  - "predictive-coding"
  - "precision"
  - "variational-free-energy"
tags:
  - "predictive-coding"
  - "active-inference"
is_new: true
---

Prediction error is the discrepancy between what a hierarchical generative model predicts at a given level and the sensory (or lower-level) evidence that actually arrives. In Friston's formulation it is the quantity carried by ascending connections in a predictive-coding hierarchy: higher levels send descending predictions of the causes of sensory input, and lower levels return the residual that those predictions fail to explain. Minimizing (precision-weighted) prediction error is how variational free energy is driven down in continuous-state schemes, whether by revising beliefs (perception) or by acting to make sensations conform to predictions (action).

<strong>Karl Friston's lens:</strong> Friston does not treat prediction error as a mere teaching signal for supervised learning, nor as the scalar reward-prediction error of classical reinforcement learning. It is a distributed, multimodal residual that is message-passed through a cortical hierarchy, and it is always precision-weighted—so the same raw mismatch can drive strong or weak updates depending on estimated reliability. Crucially, in the motor system he reinterprets descending signals as proprioceptive *predictions*, not commands: movement is the suppression of proprioceptive prediction error by classical reflex arcs. That rules out a strict perception-versus-action dualism and extends predictive coding from sensation into agency.
