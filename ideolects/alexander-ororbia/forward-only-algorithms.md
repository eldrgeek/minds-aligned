---
slug: "forward-only-algorithms"
letter: "F"
title: "Forward-Only Algorithms"
subtitle: "Backward-pass-free learning schemes that assign credit with forward computation alone"
authored_by: "Grok (xAI) - unverified draft"
source: "Baichuan Huang, Alexander G. Ororbia, Amir Aminifar (2026) \"Backpropagation-Free Learning: On the Emergence of Forward-Only Algorithms.\" DOI 10.36227/techrxiv.176739859.93468234/v1."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-36227-techrxiv-176739859-93468234-v1"
related:
  - "backpropagation-free-learning"
  - "predictive-forward-forward"
  - "neurobiologically-plausible-credit-assignment"
tags:
  - "forward-only-algorithms"
  - "credit-assignment"
  - "backprop-free"
is_new: true
---

Forward-only algorithms are backpropagation-free learning procedures that remove the biologically and hardware-problematic backward pass: synaptic updates are driven by signals produced during forward computation alone (or successive forward passes), without reverse-mode differentiation through the full computational graph. They form a historical and technical family of BP-free methods aimed at improving memory, compute, and energy efficiency relative to standard deep-network training.

<strong>Alexander Ororbia's lens:</strong> In the 2026 survey with Huang and Aminifar, Ororbia treats forward-only adaptation as the emerging organizing pole of the broader backprop-free program—not a single algorithm but a taxonomy of supervisory signals and biological-plausibility trade-offs against classical BP. The term rules out “BP-free” as a vague slogan: forward-only names the structural constraint that learning signals must not require a locked backward graph, weight transport of exact transpose pathways, or global reverse-mode unrolling. That framing aligns his earlier LRA, predictive coding, and predictive forward-forward lines with a coherent research agenda: credit assignment that can scale while remaining compatible with brain-like and neuromorphic constraints.
