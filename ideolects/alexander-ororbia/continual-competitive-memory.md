---
slug: "continual-competitive-memory"
letter: "C"
title: "Continual Competitive Memory"
subtitle: "Unsupervised competitive learning specialized for task-free lifelong streams"
authored_by: "Grok (xAI) - unverified draft"
source: "Alexander G. Ororbia (2021) \"Continual Competitive Memory: A Neural System for Online Task-Free Lifelong Learning.\" arXiv (Cornell University). DOI 10.48550/arxiv.2106.13300."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-48550-arxiv-2106-13300"
related:
  - "lifelong-neural-predictive-coding"
  - "neurobiologically-plausible-credit-assignment"
  - "predictive-coding"
tags:
  - "continual-learning"
  - "competitive-learning"
  - "catastrophic-forgetting"
is_new: true
---

Continual competitive memory (CCM) is an unsupervised neural system in which units compete for the right to represent input patterns, producing sparse activations that limit interference across a lifelong data stream. Inspired by adaptive resonance and related competitive models, CCM is formulated for online, task-free continual classification: the learner does not receive explicit task-boundary labels and must still avoid overwriting previously acquired categories.

<strong>Alexander Ororbia's lens:</strong> Ororbia uses CCM both as a concrete algorithm and as a unifying frame for competition-based lifelong learning. Sparse, winner-style representations reduce neural cross-talk; the CCM variant adds stream-aware mechanics so that old prototypes are not simply overridden when new classes appear. On Split MNIST–style benchmarks he positions CCM against other competitive learners and against modern continual-learning baselines, arguing that competition is a first-class path to interference-robust codes—especially when the task identity must be inferred rather than supplied. The term rules out treating competitive learning as a static clustering trick; under Ororbia it is a lifelong memory policy.
