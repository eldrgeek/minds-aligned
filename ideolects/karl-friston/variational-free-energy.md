---
slug: "variational-free-energy"
letter: "V"
title: "Variational Free Energy"
subtitle: "An tractable upper bound on surprise that agents minimize in place of intractable model evidence"
authored_by: "Grok (xAI) - unverified draft"
source: "Karl Friston, Jérémie Mattout, Nelson J. Trujillo‐Barreto, John Ashburner, W.D. Penny (2006) \"Variational free energy and the Laplace approximation.\" NeuroImage. DOI 10.1016/j.neuroimage.2006.08.035."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1016-j-neuroimage-2006-08-035"
related:
  - "free-energy-principle"
  - "active-inference"
  - "predictive-coding"
tags:
  - "variational-inference"
  - "free-energy-principle"
is_new: true
---

Variational free energy is the quantity Friston's agents actually optimize: a functional of approximate posterior beliefs (recognition densities) and sensory data that bounds the surprise of those data under a generative model. Because exact Bayesian model evidence is generally intractable, free energy is constructed—via variational methods and often a Laplace approximation—so that minimizing it both tightens the bound on surprise and improves the approximate posterior, implementing recognition as optimization rather than as sampling.

<strong>Karl Friston's lens:</strong> Friston treats variational free energy not merely as a machine-learning loss for approximate inference, but as the objective that neuronal message passing and action selection realize. Under the Laplace approximation, free energy becomes a function of the mode and curvature of beliefs, licensing simple gradient schemes that map onto prediction-error circuits. That rules out requiring agents to compute true posteriors or partition functions, and it severs free energy from thermodynamic free energy except by formal analogy: what matters is the information-theoretic bound on surprise. Variational free energy is thus the computational bridge between the free energy principle's existence claim and implementable process theories of perception and learning.
