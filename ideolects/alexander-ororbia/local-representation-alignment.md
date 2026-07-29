---
slug: "local-representation-alignment"
letter: "L"
title: "Local Representation Alignment"
subtitle: "Error-driven local targets that align layer activities without backpropagating derivatives"
authored_by: "Grok (xAI) - unverified draft"
source: "Alexander G. Ororbia, Ankur Mali (2019) \"Biologically Motivated Algorithms for Propagating Local Target Representations.\" Proceedings of the AAAI Conference on Artificial Intelligence. DOI 10.1609/aaai.v33i01.33014651."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1609-aaai-v33i01-33014651"
related:
  - "predictive-coding"
  - "neurobiologically-plausible-credit-assignment"
  - "neural-generative-coding"
tags:
  - "local-representation-alignment"
  - "credit-assignment"
  - "backprop-free"
is_new: true
---

Local representation alignment (LRA) is a learning procedure that assigns each layer a local target activity and adjusts synapses so that layer representations move toward those targets. In the error-driven form (LRA-E), mismatches between current and target activities provide the teaching signal, enabling multi-layer training without backpropagating error derivatives through the full forward graph.

<strong>Alexander Ororbia's lens:</strong> Ororbia positions LRA as a concrete, biologically motivated answer to the credit-assignment problem and as algorithmically close to predictive coding: local targets play the role of desired states that layers should realize, rather than scalar losses whose gradients must be reverse-mode differentiated. With Mali, he contrasts LRA-E with standard backprop and with related schemes such as difference target propagation, stressing that learning should propagate *representations* (local activity goals), not non-local error derivatives. Later recursive LRA work extends the same idea to deeper, large-scale nets—still under the constraint that credit remains local and backprop-free.
