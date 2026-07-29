---
slug: "planning-as-inference"
letter: "P"
title: "Planning-as-Inference"
subtitle: "Action selection cast as hierarchical inference inside predictive-coding agents"
authored_by: "Grok (xAI) - unverified draft"
source: "Alexander G. Ororbia, Ankur Mali (2023) \"Active Predictive Coding: Brain-Inspired Reinforcement Learning for Sparse Reward Robotic Control Problems.\" DOI 10.1109/icra48891.2023.10160530."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1109-icra48891-2023-10160530"
related:
  - "active-predictive-coding"
  - "active-neural-generative-coding"
  - "active-inference"
tags:
  - "planning-as-inference"
  - "robotic-control"
  - "predictive-coding"
is_new: true
---

Planning-as-inference is the treatment of control as an inference problem: rather than training a separate policy by reverse-mode policy gradients, an agent infers actions (or action sequences) that make preferred sensory outcomes likely under a generative model of the environment. In Ororbia’s systems, this means the same hierarchical predictive-processing circuits used for perception also support goal-directed behavior by reconciling internal expectations with sparse extrinsic feedback.

<strong>Alexander Ororbia's lens:</strong> Ororbia does not import planning-as-inference as abstract cognitive theory alone; with Mali he *embodies* it in active predictive coding and active neural generative coding agents built entirely from neural generative coding circuits. Exploration and goal seeking become internally generated epistemic and instrumental signals balanced inside the coding dynamics, not separate RL heads trained by backpropagation. The term therefore rules out “planning” as a bolted-on planner or actor-critic stack: under his usage, intelligent control is an extension of local guess-and-check inference, competitive with deep Q-learning on sparse-reward robotic tasks while remaining backprop-free.
