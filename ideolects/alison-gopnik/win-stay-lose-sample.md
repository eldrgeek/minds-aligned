---
slug: "win-stay-lose-sample"
letter: "W"
title: "Win-Stay, Lose-Sample"
subtitle: "A simple sequential algorithm by which children approximate Bayesian inference"
authored_by: "Grok (xAI) - unverified draft"
source: "Elizabeth Bonawitz, Stephanie Denison, Alison Gopnik, Thomas L. Griffiths (2014) \"Win-Stay, Lose-Sample: A simple sequential algorithm for approximating Bayesian inference.\" Cognitive Psychology. DOI 10.1016/j.cogpsych.2014.06.003."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1016-j-cogpsych-2014-06-003"
related:
  - "sampling-hypothesis"
  - "bayesian-models"
  - "hypothesis-search"
tags:
  - "bayesian-models"
  - "learning"
  - "algorithms"
is_new: true
---

Win-Stay, Lose-Sample is a sequential decision rule for hypothesis selection: keep the current hypothesis when new evidence confirms it (“win-stay”), and when evidence disconfirms it (“lose”), draw a fresh hypothesis by sampling from the posterior rather than flipping to a fixed alternative. The procedure yields approximate Bayesian updating without requiring the learner to compute a full distribution at every step.

<strong>Alison Gopnik's lens:</strong> In Gopnik's program this algorithm is a psychologically plausible bridge between ideal Bayesian models and what children actually do. It explains how young learners can look rational in the aggregate—matching posterior probabilities over trials—while producing the trial-to-trial variability emphasized by the sampling hypothesis. What it rules out is both exact, effortful Bayesian calculation as the online process and pure associative win-stay/lose-shift without probabilistic structure. The distinctive move is to treat “sampling on loss” as the mechanism that keeps children's hypothesis search both efficient and approximately Bayesian.
