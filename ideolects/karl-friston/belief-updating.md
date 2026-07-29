---
slug: "belief-updating"
letter: "B"
title: "Belief Updating"
subtitle: "Variational inference over states, parameters, and policies as gradient descent on free energy"
authored_by: "Grok (xAI) - unverified draft"
source: "Karl Friston, Thomas H. B. FitzGerald, Francesco Rigoli, Philipp Schwartenbeck, Giovanni Pezzulo (2016) \"Active Inference: A Process Theory.\" Neural Computation. DOI 10.1162/neco_a_00912."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1162-neco_a_00912"
related:
  - "variational-free-energy"
  - "perceptual-inference"
  - "active-inference"
  - "policy"
tags:
  - "active-inference"
  - "inference"
  - "process-theory"
is_new: true
---

Belief updating is the process by which an agent revises approximate posterior beliefs about hidden states, model parameters, and policies so as to minimise variational free energy (equivalently, to maximise a lower bound on Bayesian model evidence). Under the process theory of active inference, neuronal dynamics implement a gradient descent on free energy: message passing among populations realises variational or belief-propagation updates, while action selection is itself belief updating over policies. The same scheme spans perception, learning, and planning as successive time scales of the same inference problem.

<strong>Karl Friston's lens:</strong> Friston collapses the usual split between “perception updates beliefs” and “decision systems pick actions.” Action is the fulfilment of predictions about proprioceptive and other outcomes, and policy choice is inference under expected free energy—so behaviour is continuous with Bayesian belief updating, not a downstream consumer of it. That rules out treating motor commands as set-points distinct from predictions, and it makes phenomena such as mismatch negativity, evidence accumulation, and dopamine transfer responses readouts of one free-energy geometry rather than of separate modules. Belief updating is therefore not a preprocessing stage for cognition; it *is* the process theory of brain function under active inference.
