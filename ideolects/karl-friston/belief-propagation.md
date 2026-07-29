---
slug: "belief-propagation"
letter: "B"
title: "Belief Propagation"
subtitle: "Neuronal message passing that implements Bayesian belief updating on a factor graph under a deep generative model"
authored_by: "Grok (xAI) - unverified draft"
source: "Karl Friston, Thomas Parr, Bert de Vries (2017) \"The graphical brain: Belief propagation and active inference.\" Network Neuroscience. DOI 10.1162/netn_a_00018."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1162-netn-a-00018"
related:
  - "active-inference"
  - "belief-updating"
  - "predictive-coding"
tags:
  - "message-passing"
  - "process-theory"
  - "active-inference"
is_new: true
---

Belief propagation is the form of message passing Friston assigns to neuronal circuits under active inference: approximate posterior beliefs about latent variables are refined by exchanging local messages on a Forney factor graph that encodes a deep generative model. Discrete-state and continuous-state factors induce different update rules, but they play out on the same hierarchical architecture, so that perceptual inference, policy evaluation, and continuous sensorimotor control share one computational anatomy of directed, context-sensitive connectivity.

<strong>Karl Friston's lens:</strong> Friston does not treat belief propagation as a generic AI algorithm bolted onto the brain; he asks what message passing is *mandated* if cortex implements active inference under deep generative models. That rules out purely feedforward feature extraction and purely undirected association networks: functional integration must look like scheduled, precision-weighted messages among factors representing causes, states, and policies. Link factors that couple discrete and continuous representations explain how categorical decisions can drive continuous movement (and vice versa) without a separate control theory. Belief propagation thus becomes the process-theory bridge between abstract free-energy minimization and the graphical, laminar structure of cortical hierarchies.
