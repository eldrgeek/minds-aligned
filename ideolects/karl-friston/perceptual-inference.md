---
slug: "perceptual-inference"
letter: "P"
title: "Perceptual Inference"
subtitle: "Updating beliefs about hidden causes so that the generative model better explains sensory data"
authored_by: "Grok (xAI) - unverified draft"
source: "Karl Friston, Jean Daunizeau, James M. Kilner, Stefan J. Kiebel (2010) \"Action and behavior: a free-energy formulation.\" Biological Cybernetics. DOI 10.1007/s00422-010-0364-z."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1007-s00422-010-0364-z"
related:
  - "active-inference"
  - "prediction-error"
  - "generative-model"
tags:
  - "active-inference"
  - "predictive-coding"
  - "free-energy-principle"
is_new: true
---

Perceptual inference is the process of optimizing probabilistic beliefs about the latent variables in a generative model so as to explain current sensory input. Under the free-energy principle it is cast as minimizing a free-energy bound on the (negative log) likelihood of sensations given that model—Helmholtz's unconscious inference rewritten as variational optimization rather than as a separate "perception module."

<strong>Karl Friston's lens:</strong> Friston pairs perceptual inference with active inference as two complementary routes to the same objective: either change beliefs to fit the data, or change the data (via action) to fit the beliefs. Perception is therefore not passive readout of the world but model inversion—typically hierarchical and predictive—whose neuronal implementation is gradient descent on variational free energy (or equivalently prediction-error minimization under predictive coding). That rules out pure bottom-up feature detection as a complete account, and it makes "seeing" continuous with "acting": both are free-energy-reducing operations on the agent–world coupling.
