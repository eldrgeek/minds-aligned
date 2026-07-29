---
slug: "sequential-neural-coding-network"
letter: "S"
title: "Sequential Neural Coding Network"
subtitle: "His lifelong predictive-coding architecture that resists catastrophic forgetting without backprop"
authored_by: "Grok (xAI) - unverified draft"
source: "Alexander G. Ororbia, Ankur Mali, Daniel Kifer, C. Lee Giles (2019) \"Lifelong Neural Predictive Coding: Learning Cumulatively Online without Forgetting.\" arXiv (Cornell University). DOI 10.48550/arxiv.1905.10696."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-48550-arxiv-1905-10696"
related:
  - "lifelong-neural-predictive-coding"
  - "predictive-coding"
  - "continual-competitive-memory"
tags:
  - "sequential-neural-coding-network"
  - "lifelong-learning"
  - "catastrophic-forgetting"
is_new: true
---

The Sequential Neural Coding Network (SNCN) is a connectionist architecture for lifelong, stream-like learning grounded in predictive processing: synapses adapt in a biologically plausible, local fashion while a companion neural system directs and controls the cortex-like coding structure, roughly mimicking basal-ganglia-style task-executive control. The model is designed to retain prior knowledge as new tasks arrive online, without relying on backpropagation of errors.

<strong>Alexander Ororbia's lens:</strong> SNCN is Ororbia’s named answer to catastrophic forgetting that does not default to rehearsal buffers or elastic weight consolidation as the primary story. With Mali, Kifer, and Giles, he pairs local predictive-coding plasticity, lateral competition, and sparse activation so that cumulative online learning itself yields less interference—outperforming many prior remedies on SplitMNIST-style and custom stream benchmarks even when trained purely sequentially. The term rules out treating lifelong learning as an add-on regularizer for backprop nets; under Ororbia, the architecture and the credit-assignment law must co-evolve from neurocognitive principles if forgetting is to be structurally mitigated.
