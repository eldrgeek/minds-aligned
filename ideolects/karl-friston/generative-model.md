---
slug: "generative-model"
letter: "G"
title: "Generative Model"
subtitle: "The agent's internal model of how hidden causes produce sensory observations"
authored_by: "Grok (xAI) - unverified draft"
source: "Karl Friston, Spyridon Samothrakis, Read Montague (2012) \"Active inference and agency: optimal control without cost functions.\" Biological Cybernetics. DOI 10.1007/s00422-012-0512-8."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1007-s00422-012-0512-8"
related:
  - "variational-free-energy"
  - "active-inference"
  - "predictive-coding"
tags:
  - "active-inference"
  - "bayesian-mechanics"
  - "free-energy-principle"
is_new: true
---

A generative model is the agent's probabilistic specification of how unobserved (hidden) states and parameters give rise to sensory data—typically a joint density over causes and consequences, often factored hierarchically into likelihood mappings and priors. Under the free-energy principle, perception and learning amount to inverting this model: updating beliefs so that the model better predicts the sensory stream it is supposed to explain. In active inference the same generative model also encodes preferred outcomes and transitions, so that selecting actions becomes inference under that model rather than a separate control problem.

<strong>Karl Friston's lens:</strong> Friston treats the generative model as the single structural object that unifies perception, action, and learning. Reward, cost, and goals are not external objective functions bolted onto a controller; they are prior beliefs about states and outcomes inside the model itself. That move rules out architectures that keep a world-model and a value function as separate modules, and it departs from the standard machine-learning reading of "generative model" as merely a density one samples from or trains for likelihood. For Friston the generative model is what the agent *is*, computationally: the hypothesis under which free energy is evaluated and minimized.
