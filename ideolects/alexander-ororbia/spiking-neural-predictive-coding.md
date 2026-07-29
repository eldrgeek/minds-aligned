---
slug: "spiking-neural-predictive-coding"
letter: "S"
title: "Spiking Neural Predictive Coding"
subtitle: "Guess-and-check predictive coding realized with spike-based neural coding for continual streams"
authored_by: "Grok (xAI) - unverified draft"
source: "Alexander G. Ororbia (2023) \"Spiking neural predictive coding for continually learning from data streams.\" Neurocomputing. DOI 10.1016/j.neucom.2023.126292."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1016-j-neucom-2023-126292"
related:
  - "predictive-coding"
  - "neural-generative-coding"
  - "neurobiologically-plausible-credit-assignment"
tags:
  - "spiking-neural-networks"
  - "predictive-coding"
  - "neuromorphic"
  - "continual-learning"
is_new: true
---

Spiking neural predictive coding (also called spiking neural coding in Ororbia’s formulation) is an instantiation of predictive-coding models in which units communicate and adapt using spike-based activity rather than dense real-valued activations. The system runs an ongoing guess-and-check process: neurons predict one another’s activity and revise their own states to improve future predictions, enabling continual learning from streaming data in a form suited to energy-efficient neuromorphic hardware.

<strong>Alexander Ororbia's lens:</strong> Ororbia’s usage fuses two agendas that are often kept separate—predictive coding as a learning theory and spiking nets as a hardware-friendly substrate. Spiking is not an after-the-fact discretization of a backprop-trained network; it is the native medium of a never-ending predictive-coding loop designed for continual streams and neuromorphic deployment. That rules out both non-spiking deep PC trained only as a software curiosity and SNNs whose synapses are still adapted by surrogate-gradient backprop. The distinctive claim is that iterative, interactive prediction error among spiking populations *is* the credit-assignment mechanism, aligning neuromorphic efficiency with his broader rejection of global error transport.
