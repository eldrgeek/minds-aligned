---
slug: "guess-and-check"
letter: "G"
title: "Guess-and-Check"
subtitle: "His operational phrase for never-ending local prediction and mismatch correction"
authored_by: "Grok (xAI) - unverified draft"
source: "Alexander G. Ororbia (2023) \"Spiking neural predictive coding for continually learning from data streams.\" Neurocomputing. DOI 10.1016/j.neucom.2023.126292."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1016-j-neucom-2023-126292"
related:
  - "predictive-coding"
  - "spiking-neural-predictive-coding"
  - "neural-generative-coding"
tags:
  - "guess-and-check"
  - "predictive-coding"
  - "local-learning"
is_new: true
---

Guess-and-check is Ororbia’s plain-language name for the iterative dynamics of predictive coding: neurons continually form expectations about one another’s activity (“guess”), compare those expectations to what is observed, and adjust their own activities and synapses so future predictions improve (“check”). The process is ongoing rather than a single train-then-deploy pass, fitting continuous-time sensory streams and online adaptation.

<strong>Alexander Ororbia's lens:</strong> Where textbook predictive coding may be stated as free-energy minimization or hierarchical Bayesian message passing, Ororbia repeatedly reduces the mechanism to this engineering slogan—especially in spiking neural coding, where binary spike trains are the communication medium and local synaptic updates can complement or replace online STDP. The phrase rules out one-shot forward inference followed by a global backward pass: learning and inference are the same never-ending mismatch-correction loop. In his vocabulary, “guess-and-check” is the operational core that makes predictive coding implementable on neuromorphic hardware and competitive for continual pattern recognition with less forgetting than standard networks.
