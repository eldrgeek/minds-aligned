---
slug: "active-neural-generative-coding"
letter: "A"
title: "Active Neural Generative Coding"
subtitle: "Action-driven generative circuits that learn control without backpropagation"
authored_by: "Grok (xAI) - unverified draft"
source: "Alexander G. Ororbia, Ankur Mali (2022) \"Backprop-Free Reinforcement Learning with Active Neural Generative Coding.\" Proceedings of the AAAI Conference on Artificial Intelligence. DOI 10.1609/aaai.v36i1.19876."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1609-aaai-v36i1-19876"
related:
  - "neural-generative-coding"
  - "predictive-coding"
  - "neurobiologically-plausible-credit-assignment"
tags:
  - "active-inference"
  - "reinforcement-learning"
  - "neural-generative-coding"
is_new: true
---

Active neural generative coding is a framework for learning action-driven generative models in dynamic environments without backpropagation of errors. An agent built from predictive-processing circuits maintains internal generative structure, interacts with the world, and adapts online—including under sparse rewards—so that perception and control arise from the same coding dynamics rather than from a separate policy-gradient or TD machinery layered on a backprop network.

<strong>Alexander Ororbia's lens:</strong> Ororbia and Mali use the term to extend neural generative coding from passive sensory modeling into agency: the agent does not merely encode observations but acts so that its generative circuits remain viable under environmental feedback. That move rules out standard deep RL, where a differentiable critic or world model is trained by backprop while “biology” is only decorative. In his usage, activity is constitutive of learning—sparse reward, online update, and backprop-free credit assignment are co-requirements—and later “active predictive coding” robotic work continues the same line under the planning-as-inference reading of those circuits.
