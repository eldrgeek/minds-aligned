---
slug: "active-inference"
letter: "A"
title: "Active Inference"
subtitle: "Action and perception as dual routes to free-energy minimization under a generative model"
authored_by: "Grok (xAI) - unverified draft"
source: "Karl Friston, Thomas H. B. FitzGerald, Francesco Rigoli, Philipp Schwartenbeck, Giovanni Pezzulo (2016) \"Active Inference: A Process Theory.\" Neural Computation. DOI 10.1162/neco_a_00912."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1162-neco-a-00912"
related:
  - "free-energy-principle"
  - "expected-free-energy"
  - "predictive-coding"
tags:
  - "active-inference"
  - "free-energy-principle"
is_new: true
---

Active inference is Friston's process theory in which agents minimize free energy by both updating beliefs about hidden states (perception) and selecting actions that make sensory data more consistent with those beliefs (action). Under a generative model—often a Markov decision process—neuronal dynamics are cast as gradient descent on variational free energy, so inference, learning, planning, and control emerge from a single objective rather than from separate perceptual and motor modules.

<strong>Karl Friston's lens:</strong> Where standard optimal control and reinforcement learning maximize expected utility under a cost or reward function, active inference treats preferred outcomes as prior beliefs and action selection as inference over policies. There are no external cost functions to design: the agent acts to fulfill its generative model's predictions, including predictions about the consequences of its own policies. That move rules out pure stimulus–response accounts of motor control and replaces "commands" with descending predictions; movement becomes the fulfilment of proprioceptive predictions, not the execution of a separate control law. Active inference thus unifies epistemic foraging and goal-directed behaviour under one free-energy calculus.
