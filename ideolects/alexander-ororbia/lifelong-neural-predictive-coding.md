---
slug: "lifelong-neural-predictive-coding"
letter: "L"
title: "Lifelong Neural Predictive Coding"
subtitle: "Stream-trained predictive coding that resists catastrophic forgetting without backprop"
authored_by: "Grok (xAI) - unverified draft"
source: "Alexander G. Ororbia, Ankur Mali, Daniel Kifer, C. Lee Giles (2019) \"Lifelong Neural Predictive Coding: Learning Cumulatively Online without Forgetting.\" arXiv (Cornell University). DOI 10.48550/arxiv.1905.10696."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-48550-arxiv-1905-10696"
related:
  - "predictive-coding"
  - "neural-generative-coding"
  - "spiking-neural-predictive-coding"
tags:
  - "lifelong-learning"
  - "catastrophic-forgetting"
  - "predictive-coding"
is_new: true
---

Lifelong neural predictive coding is a connectionist approach to cumulative online learning in which a predictive-coding architecture—the Sequential Neural Coding Network—adapts synapses in a biologically plausible, backprop-free fashion while a companion neural controller directs task-executive control. The system is built to learn from streams of data points across successive tasks while retaining prior knowledge, rather than to optimize a single static dataset with episodic replay as the default fix for forgetting.

<strong>Alexander Ororbia's lens:</strong> Ororbia treats lifelong NPC as evidence that predictive-processing mechanisms—competition, sparse activation, iterative inference—are themselves anti-forgetting devices, not add-ons to a backprop net. In the 2019 formulation with Mali, Kifer, and Giles, a cortex-like coding hierarchy is steered by a basal-ganglia-like controller; sparsity and local mismatch updates reduce cross-talk that would otherwise overwrite old tasks. The term rules out “continual learning” as merely regularization or buffer rehearsal on a standard deep net: it names a full coding-and-control system whose resistance to catastrophic forgetting is a structural consequence of predictive coding under stream training.
