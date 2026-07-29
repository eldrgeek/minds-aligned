---
slug: "discrepancy-reduction"
letter: "D"
title: "Discrepancy Reduction"
subtitle: "His early local learning rule that trains temporal generative models without BPTT"
authored_by: "Grok (xAI) - unverified draft"
source: "Alexander G. Ororbia, Patrick Haffner, David Reitter, C. Lee Giles (2017) \"Learning to Adapt by Minimizing Discrepancy.\" arXiv (Cornell University). DOI 10.48550/arxiv.1711.11542."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-48550-arxiv-1711-11542"
related:
  - "predictive-coding"
  - "neural-generative-coding"
  - "local-representation-alignment"
tags:
  - "discrepancy-reduction"
  - "temporal-models"
  - "backprop-free"
is_new: true
---

Discrepancy reduction is a learning algorithm for temporal neural generative models in which synaptic updates are driven by local mismatches between predicted and observed activity rather than by back-propagation through time. Paired with the Temporal Neural Coding Network—a fully recurrent directed generative architecture that uses both structural and temporal feedback—the procedure creates closed information-propagation cycles that yield local teaching signals for unsupervised sequence modeling.

<strong>Alexander Ororbia's lens:</strong> Discrepancy reduction is an early, named statement of Ororbia's lifelong program: replace BPTT and global error derivatives with predictive-coding-style local adaptation. In the 2017 formulation with Haffner, Reitter, and Giles, bottom-up and top-down pathways co-operate inside one recurrent generative model so that credit assignment never requires unrolling a reverse-mode graph through time. The term rules out treating sequence learning as inherently BPTT-bound; it marks the point at which he operationalizes “minimizing discrepancy” as the plasticity law that later matures into neural generative coding, LRA-style local targets, and broader backprop-free frameworks.
