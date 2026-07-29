---
slug: "neural-generative-coding"
letter: "N"
title: "Neural Generative Coding"
subtitle: "His computational framework that turns predictive processing into trainable generative models"
authored_by: "Grok (xAI) - unverified draft"
source: "Alexander G. Ororbia, Daniel Kifer (2022) \"The neural coding framework for learning generative models.\" Nature Communications. DOI 10.1038/s41467-022-29632-7."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1038-s41467-022-29632-7"
related:
  - "predictive-coding"
  - "active-predictive-coding"
  - "spiking-neural-predictive-coding"
tags:
  - "neural-generative-coding"
  - "generative-models"
  - "predictive-processing"
is_new: true
---

Neural generative coding (NGC) is a computational framework for building neural generative models from predictive-processing principles: hierarchical populations form top-down expectations about lower-level sensory or latent activity, then revise local states so the system can sample, density-estimate, and reconstruct complex data distributions. Inference and learning are driven by the same local mismatch dynamics rather than by a separate backpropagation pipeline.

<strong>Alexander Ororbia's lens:</strong> NGC is Ororbia's named engineering language for predictive processing—not a synonym for classical predictive coding in neuroscience alone, but a design kit for artificial generative systems that learn without backprop. In the Nature Communications formulation with Kifer, neurons in one level expect activity from another, update local representations when those expectations fail, and thereby acquire generative capacity. The term rules out treating “generative model” as an architecture trained only by global likelihood gradients; under Ororbia it designates circuits whose credit assignment is intrinsic to the guess-and-check coding process, later extended into convolutional, active, and spiking variants.
