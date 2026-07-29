---
slug: "backpropagation-free-learning"
letter: "B"
title: "Backpropagation-Free Learning"
subtitle: "Training deep systems without reverse-mode error transport or a locked backward pass"
authored_by: "Grok (xAI) - unverified draft"
source: "Alexander G. Ororbia, Ankur Mali, Daniel Kifer, C. Lee Giles (2023) \"Backpropagation-Free Deep Learning with Recursive Local Representation Alignment.\" Proceedings of the AAAI Conference on Artificial Intelligence. DOI 10.1609/aaai.v37i8.26118."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1609-aaai-v37i8-26118"
related:
  - "recursive-local-representation-alignment"
  - "predictive-forward-forward"
  - "neurobiologically-plausible-credit-assignment"
tags:
  - "backprop-free"
  - "credit-assignment"
  - "forward-only"
is_new: true
---

Backpropagation-free learning denotes any training regime that adapts multi-layer neural parameters without reverse-mode differentiation through the full forward computation graph—eliminating the sequential backward pass, weight-transport symmetries, and global locking that characterize error backpropagation. Credit is instead produced by local targets, prediction errors, contrastive or forward-only signals, evolutionary search, or other layer-wise mechanisms that can often run more asynchronously and with simpler hardware assumptions.

<strong>Alexander Ororbia's lens:</strong> For Ororbia, “backpropagation-free” is not a marketing label for minor gradient approximations; it is the design constraint that unifies LRA/Rec-LRA, neural generative coding, predictive forward-forward, contrastive signal-dependent plasticity, and related neuro-mimetic schemes. The phrase rules out methods that still rely on a non-local error pathway dressed in biological vocabulary. In his usage it simultaneously names a scientific critique of deep learning’s credit-assignment engine and a positive research program: scalable algorithms that remain local enough to be neurobiologically plausible and efficient enough to train deep models without backprop’s sequential burden.
