---
slug: "active-predictive-coding"
letter: "A"
title: "Active Predictive Coding"
subtitle: "Planning-as-inference control built entirely from predictive-processing circuits"
authored_by: "Grok (xAI) - unverified draft"
source: "Alexander G. Ororbia, Ankur Mali (2023) \"Active Predictive Coding: Brain-Inspired Reinforcement Learning for Sparse Reward Robotic Control Problems.\" DOI 10.1109/icra48891.2023.10160530."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1109-icra48891-2023-10160530"
related:
  - "neural-generative-coding"
  - "active-neural-generative-coding"
  - "predictive-coding"
tags:
  - "active-predictive-coding"
  - "robotic-control"
  - "reinforcement-learning"
is_new: true
---

Active predictive coding (ActPC) is a backpropagation-free control scheme in which an agent is assembled entirely from neural generative coding / predictive-processing circuits and learns online from sparse rewards by balancing an internally generated epistemic drive (exploration) against an instrumental drive (goal seeking). Action selection is treated as planning-as-inference: policies emerge from the same hierarchical guess-and-check dynamics used for perception and generative modeling, rather than from a separate actor-critic trained by reverse-mode gradients.

<strong>Alexander Ororbia's lens:</strong> Ororbia’s ActPC is not “active inference” renamed, nor standard RL with a predictive world model bolted on. With Mali, he designs the whole agent—including control—from NGC-style predictive circuits so that credit assignment for sparse-reward robotics remains local and online. The term rules out backprop-trained policy gradients as the primary learning law and treats exploration and goal pursuit as dual, internally generated signals within predictive coding. That is the distinctive move: active behavior as an extension of the coding process itself, demonstrated on simulated robots and complex arms without a global backward pass.
