---
slug: "dynamic-causal-modelling"
letter: "D"
title: "Dynamic Causal Modelling"
subtitle: "A Bayesian framework for inferring directed neuronal coupling from neuroimaging time series under biophysically motivated generative models"
authored_by: "Grok (xAI) - unverified draft"
source: "Karl Friston, L. Harrison, W.D. Penny (2003) \"Dynamic causal modelling.\" NeuroImage. DOI 10.1016/s1053-8119(03)00202-7."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1016-s1053-8119-03-00202-7"
related:
  - "effective-connectivity"
  - "generative-model"
  - "variational-free-energy"
tags:
  - "connectivity"
  - "bayesian-inference"
  - "neuroimaging"
is_new: true
---

Dynamic causal modelling (DCM) is Friston's method for estimating effective connectivity: one specifies a generative model in which hidden neuronal states evolve under directed coupling and experimental inputs, and observed data (fMRI, EEG/MEG, LFPs) are produced by a forward observation model. Model inversion yields posterior densities over connectivity parameters and a free-energy approximation to the evidence for each candidate network architecture, so that competing directed graphs can be compared formally.

<strong>Karl Friston's lens:</strong> DCM is not a black-box Granger or correlation pipeline; it is Bayesian inversion of a dynamical systems model of how the brain could have generated the data. That rules out equating directed statistical prediction among time series with synaptic influence, and it forces hypotheses about hierarchy, context-sensitive gain, and nonlinear interactions to be stated as alternative generative models. DCM is the empirical arm of Friston's larger programme: the same variational free-energy machinery that implements active inference in process theory is used in the laboratory to score models of effective connectivity, linking neuroimaging practice to Bayesian mechanics rather than to descriptive connectivity maps alone.
