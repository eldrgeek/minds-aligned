---
slug: "precision"
letter: "P"
title: "Precision"
subtitle: "The estimated reliability that weights prediction errors and selects attention"
authored_by: "Grok (xAI) - unverified draft"
source: "Harriet R. Brown, Rick A. Adams, Isabel Pareés, Mark J. Edwards, Karl Friston (2013) \"Active inference, sensory attenuation and illusions.\" Cognitive Processing. DOI 10.1007/s10339-013-0571-3."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1007-s10339-013-0571-3"
related:
  - "prediction-error"
  - "predictive-coding"
  - "active-inference"
tags:
  - "predictive-coding"
  - "active-inference"
  - "attention"
is_new: true
---

Precision is the inverse variance (or, more generally, the inverse covariance) of a probability density in the generative model—formally, how much confidence is invested in a prediction or in sensory evidence. In hierarchical predictive coding, ascending prediction errors are weighted by precision before they update higher-level beliefs: high-precision errors dominate inference; low-precision errors are effectively ignored. Attention, sensory attenuation, and the balance between prior and likelihood are therefore all expressions of precision control, often linked neurobiologically to neuromodulatory gain on error units.

<strong>Karl Friston's lens:</strong> Precision is not a secondary "noise parameter" for Friston; it is a first-class object of inference and the computational substrate of attention. Agents must estimate and set precision at every level—including attenuating the precision of proprioceptive evidence during self-generated movement so that descending predictions can enlist reflexes without being overridden by the fact that one is not yet moving. That account rules out treating attention as a separate spotlight mechanism outside Bayesian updating, and it departs from RL-style temperature or softmax parameters by making them *Bayes-optimal expected precisions* of beliefs about policies. Many of Friston's clinical readings (psychosis, functional motor disorders, autism) turn on pathological precision rather than on wrong content alone.
