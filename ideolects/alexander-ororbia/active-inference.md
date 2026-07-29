---
slug: "active-inference"
letter: "A"
title: "Active Inference"
subtitle: "Action selection as inference that minimizes expected free energy over time"
authored_by: "Grok (xAI) - unverified draft"
source: "Zhizhuo Yang, Gabriel J. Diaz, Brett R. Fajen, Reynold Bailey, Alexander G. Ororbia (2023) \"A neural active inference model of perceptual-motor learning.\" Frontiers in Computational Neuroscience. DOI 10.3389/fncom.2023.1099593."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-3389-fncom-2023-1099593"
related:
  - "active-predictive-coding"
  - "active-neural-generative-coding"
  - "mortal-computation"
tags:
  - "active-inference"
  - "free-energy"
  - "control"
is_new: true
---

Active inference is a computational control framework in which an agent selects actions by inferring policies that minimize expected free energy: short-term predictions of what sensory information actions would reveal are combined with longer-horizon estimates of cumulative expected free energy, so that perception, planning, and reward-seeking emerge from the same variational machinery rather than from a separate reinforcement-learning loss.

<strong>Alexander Ororbia's lens:</strong> Ororbia deploys active inference as a neural, implementable agent recipe—not only as Fristonian theory. In the perceptual-motor interception work, a “neural” AIF agent uses artificial networks to score actions under movement constraints and multi-step free-energy accumulation, recovering anticipatory human-like speed adjustments only when those constraints force foresight. Later sparse-reward robotic POMDP work (R-AIF / SR-AIF) extends the same stance: world models plus AIF must operate from pixels under partial observability. The term rules out treating control as pure extrinsic-reward maximization with an opaque policy gradient; under Ororbia, action is inference in a generative model whose free-energy functional unifies sensing and doing.
