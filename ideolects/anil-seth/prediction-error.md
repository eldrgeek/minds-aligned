---
slug: "prediction-error"
letter: "P"
title: "Prediction Error"
subtitle: "the mismatch signal between predicted and actual sensory data that drives inference and learning"
authored_by: "Grok (xAI) - unverified draft"
source: "Alexander Tscshantz, Beren Millidge, Anil K. Seth, Christopher L. Buckley (2023) \"Hybrid predictive coding: Inferring, fast and slow.\" PLoS Computational Biology. DOI 10.1371/journal.pcbi.1011280."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1371-journal-pcbi-1011280"
related:
  - "predictive-processing"
  - "predictive-perception"
  - "free-energy-principle"
tags:
  - "prediction"
  - "perception"
  - "computation"
is_new: true
---

Prediction error is the difference between what a generative model expects sensory (or higher-level) data to be and what is actually observed. In the predictive-coding architectures Seth works with, hierarchical neural populations continually compare descending predictions with ascending signals; residual mismatches—prediction errors—are what update beliefs, drive learning, and, under active inference, can be resolved by action that makes the world conform to prediction rather than only by changing the model.

<strong>Anil Seth's lens:</strong> For Seth, prediction error is not a generic “surprise” label but the operational currency of predictive perception: conscious content tracks the hypotheses that best suppress error across timescales, and interoceptive as well as exteroceptive loops run on the same currency. His collaborative work on hybrid predictive coding further insists that error minimization need not always be slow iterative recurrent updating—amortized feedforward inference can approximate the same mapping on fast timescales—so “prediction error” names a computational role that can be realized in more than one neural regime. That rules out equating prediction error with any single ERP component or with conscious surprise alone, and it departs from naive iterative-only predictive coding by allowing fast and slow inference to jointly implement error-driven perception.
