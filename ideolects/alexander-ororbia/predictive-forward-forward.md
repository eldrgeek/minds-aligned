---
slug: "predictive-forward-forward"
letter: "P"
title: "Predictive Forward-Forward"
subtitle: "Forward-only credit assignment that fuses predictive coding with the forward-forward scheme"
authored_by: "Grok (xAI) - unverified draft"
source: "Alexander G. Ororbia, Ankur Mali (2023) \"The Predictive Forward-Forward Algorithm.\" arXiv (Cornell University). DOI 10.48550/arxiv.2301.01452."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-48550-arxiv-2301-01452"
related:
  - "predictive-coding"
  - "neurobiologically-plausible-credit-assignment"
  - "contrastive-signal-dependent-plasticity"
tags:
  - "forward-forward"
  - "credit-assignment"
  - "predictive-coding"
is_new: true
---

The predictive forward-forward (PFF) algorithm is a credit-assignment procedure for neural systems that updates synapses using only forward passes: a dynamic recurrent architecture jointly trains a directed generative circuit and a representation circuit by integrating predictive-coding dynamics with the forward-forward adaptation scheme. Learning signals propagate without reverse-mode differentiation, and the system can incorporate learnable lateral competition and noise while remaining free of backpropagation’s structural locking constraints.

<strong>Alexander Ororbia's lens:</strong> With Mali, Ororbia casts PFF as more than a hybrid of two trendy algorithms—it is a concrete engineering path toward forward-only deep learning that keeps predictive coding’s generative hierarchy while adopting forward-forward’s local goodness contrasts. In his usage, PFF rules out both pure backprop credit assignment and a bare forward-forward net that lacks a coupled generative circuit; the distinctive move is simultaneous learning of representation and generation under predictive-processing motifs, so that forward passes alone suffice for credit assignment in neurobiologically motivated systems.
