---
slug: "predictive-coding"
letter: "P"
title: "Predictive Coding"
subtitle: "Hierarchical guess-and-check inference that replaces backprop as the core learning law"
authored_by: "Grok (xAI) - unverified draft"
source: "Tommaso Salvatori, Ankur Mali, Christopher L. Buckley, Thomas Lukasiewicz, Rajesh P. N. Rao, Karl Friston, Alexander G. Ororbia (2025) \"A survey on neuro-mimetic deep learning via predictive coding.\" Neural Networks. DOI 10.1016/j.neunet.2025.108161."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1016-j-neunet-2025-108161"
related:
  - "neural-generative-coding"
  - "local-representation-alignment"
  - "spiking-neural-predictive-coding"
tags:
  - "predictive-coding"
  - "neuro-mimetic-learning"
  - "credit-assignment"
is_new: true
---

Predictive coding is a family of hierarchical neural models in which units at one level generate expectations about activity at another level, then update local states and synapses so that future predictions better match observed signals. Learning proceeds through iterative mismatch (prediction-error) correction rather than through a single global backward pass of derivatives; each layer continuously predicts, checks, and revises until the residual between expectation and input is reduced.

<strong>Alexander Ororbia's lens:</strong> Ororbia treats predictive coding less as a psychophysical hypothesis and more as an implementable deep-learning alternative to error backpropagation. In his usage, PC is the neuro-mimetic substrate for generative modeling, continual adaptation, and credit assignment that can run without non-local error signals, weight transport, or global locking—properties he repeatedly contrasts with standard deep nets. The term therefore rules out “predictive coding” as mere forecasting architecture: it names a local, iterative inference-and-learning dynamics whose survey formulation (with Salvatori, Friston, Rao, and others) positions PC as the principal biologically grounded path toward neuro-mimetic deep learning.
