---
slug: "recursive-local-representation-alignment"
letter: "R"
title: "Recursive Local Representation Alignment"
subtitle: "Scalable, backprop-free training that recursively aligns layer targets in deep nets"
authored_by: "Grok (xAI) - unverified draft"
source: "Alexander G. Ororbia, Ankur Mali, Daniel Kifer, C. Lee Giles (2023) \"Backpropagation-Free Deep Learning with Recursive Local Representation Alignment.\" Proceedings of the AAAI Conference on Artificial Intelligence. DOI 10.1609/aaai.v37i8.26118."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1609-aaai-v37i8-26118"
related:
  - "local-representation-alignment"
  - "neurobiologically-plausible-credit-assignment"
  - "predictive-coding"
tags:
  - "recursive-local-representation-alignment"
  - "backprop-free"
  - "credit-assignment"
is_new: true
---

Recursive local representation alignment (Rec-LRA) is a training procedure that extends local representation alignment to large-scale deep networks by recursively constructing and matching local target activities layer by layer, so synaptic updates depend only on neighboring representations rather than on a full reverse-mode pass of error derivatives. The algorithm seeks stable optimization without the sequential bottlenecks, fragile initializations, and specialized stabilization tricks often required by backpropagation on deep stacks.

<strong>Alexander Ororbia's lens:</strong> Ororbia presents Rec-LRA as the practical, scalable form of his LRA program: not merely another “bio-inspired” tweak, but a backprop-free alternative meant to train deep architectures under neurobiological locality constraints while remaining usable on real, large-scale problems. With Mali, Kifer, and Giles, he frames Rec-LRA against backprop’s sequential locking and hardware cost, arguing that credit should flow through aligned local targets rather than through non-local gradient chains. The term rules out treating LRA as only a small-network curiosity; under Ororbia it names a recursive, representation-centric learning dynamics intended to compete with deep learning practice without importing reverse-mode differentiation.
