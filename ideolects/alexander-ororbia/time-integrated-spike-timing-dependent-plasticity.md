---
slug: "time-integrated-spike-timing-dependent-plasticity"
letter: "T"
title: "Time-Integrated Spike-Timing-Dependent Plasticity"
subtitle: "Unsupervised STDP rule that integrates timing history for continuous spiking adaptation"
authored_by: "Grok (xAI) - unverified draft"
source: "William Gebhardt, Alexander G. Ororbia (2024) \"Time-Integrated Spike-Timing-Dependent-Plasticity.\" arXiv (Cornell University). DOI 10.48550/arxiv.2407.10028."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-48550-arxiv-2407-10028"
related:
  - "spiking-neural-predictive-coding"
  - "contrastive-signal-dependent-plasticity"
  - "neurobiologically-plausible-credit-assignment"
tags:
  - "stdp"
  - "spiking-neural-networks"
  - "synaptic-plasticity"
is_new: true
---

Time-integrated spike-timing-dependent plasticity (TI-STDP) is a mathematical model of synaptic change in which pre- and post-synaptic spike histories are accumulated over time so that weight updates reflect integrated timing relationships rather than only instantaneous spike pairs. The rule supports continuous, unsupervised adaptation of spiking networks to streaming sensory patterns—including full-image and patch-level inputs—while admitting formally stated properties of the resulting synaptic dynamics.

<strong>Alexander Ororbia's lens:</strong> With Gebhardt, Ororbia treats TI-STDP as a controllable, analyzable alternative to classical event-based and trace-based STDP, aimed at deeper jointly trained spiking systems that must learn online without backprop. The emphasis is not on replaying textbook STDP windows but on proving and measuring how time integration stabilizes unsupervised credit assignment in multi-layer spiking nets relative to TR-STDP and EV-STDP baselines. The term rules out treating STDP as an opaque neuromorphic garnish; under Ororbia it is a designable local plasticity law that must scale to deeper circuits and continual sensory streams.
