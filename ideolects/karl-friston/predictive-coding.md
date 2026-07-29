---
slug: "predictive-coding"
letter: "P"
title: "Predictive Coding"
subtitle: "Hierarchical message passing in which top-down predictions meet bottom-up prediction errors"
authored_by: "Grok (xAI) - unverified draft"
source: "André M. Bastos, W. Martin Usrey, Rick A. Adams, George R. Mangun, Pascal Fries, Karl Friston (2012) \"Canonical Microcircuits for Predictive Coding.\" Neuron. DOI 10.1016/j.neuron.2012.10.038."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1016-j-neuron-2012-10-038"
related:
  - "active-inference"
  - "variational-free-energy"
  - "free-energy-principle"
tags:
  - "predictive-coding"
  - "hierarchical-inference"
is_new: true
---

Predictive coding, in Friston's usage, is a hierarchical neuronal message-passing scheme in which higher levels generate top-down predictions of activity at lower levels, and lower levels return only the residual prediction error. Those errors drive belief updates so that the brain continuously revises its generative model until predicted and actual sensory input agree, thereby minimizing free energy (or maximizing model evidence) across cortical hierarchies.

<strong>Karl Friston's lens:</strong> Friston embeds predictive coding inside the free-energy principle and maps it onto canonical cortical microcircuits—distinct laminar pathways for descending predictions and ascending errors, with precision-weighted gain modulating which errors are allowed to update beliefs. That is stronger than the everyday idea that "the brain predicts." It rules out feedforward-only feature detection as a complete account of perception, treats repetition suppression and mismatch responses as consequences of reduced prediction error, and situates motor and interoceptive hierarchies under the same scheme: action and attention become ways of silencing or reweighting prediction error rather than separate computational problems.
