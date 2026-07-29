---
slug: "parallel-temporal-neural-coding-network"
letter: "P"
title: "Parallel Temporal Neural Coding Network"
subtitle: "Recurrent predictive-coding model trained by local representation alignment without BPTT"
authored_by: "Grok (xAI) - unverified draft"
source: "Alexander G. Ororbia, Ankur Mali, C. Lee Giles, Daniel Kifer (2020) \"Continual Learning of Recurrent Neural Networks by Locally Aligning Distributed Representations.\" IEEE Transactions on Neural Networks and Learning Systems. DOI 10.1109/tnnls.2019.2953622."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1109-tnnls-2019-2953622"
related:
  - "local-representation-alignment"
  - "sequential-neural-coding-network"
  - "backpropagation-free-learning"
tags:
  - "parallel-temporal-neural-coding-network"
  - "recurrent-networks"
  - "continual-learning"
is_new: true
---

The Parallel Temporal Neural Coding Network (P-TNCN) is a biologically inspired recurrent architecture for sequence modeling that is trained by local representation alignment rather than backpropagation through time. It requires neither unrolling the network over time steps nor derivatives of internal activation functions, enabling parallelizable credit assignment while a hidden-unit correction phase supports adaptation even when synaptic weights are held fixed.

<strong>Alexander Ororbia's lens:</strong> P-TNCN is Ororbia’s concrete assault on BPTT’s structural problems—sequential unrolling, nondifferentiable activations forbidden, and fragile long-horizon credit assignment. With Mali, Giles, and Kifer he shows the model can match or beat full BPTT and online alternatives (RTRL, echo-state nets, UORO) on Bouncing MNIST, Bouncing NotMNIST, and Penn Treebank, while also enabling zero-shot adaptation and online continual sequence modeling via local activity correction. The term rules out treating temporal deep learning as inherently BPTT-bound: recurrence is kept, but credit stays local, and generative knowledge can be retained across task sequences without reverse-mode unrolling.
