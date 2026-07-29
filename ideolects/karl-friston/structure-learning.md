---
slug: "structure-learning"
letter: "S"
title: "Structure Learning"
subtitle: "Bayesian model selection that infers the form of the generative model, not only its parameters"
authored_by: "Grok (xAI) - unverified draft"
source: "Karl Friston, Marco Lin, Chris Frith, Giovanni Pezzulo, J. Allan Hobson, Sasha Ondobaka (2017) \"Active Inference, Curiosity and Insight.\" Neural Computation. DOI 10.1162/neco_a_00999."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1162-neco_a_00999"
related:
  - "generative-model"
  - "novelty"
  - "curiosity"
  - "variational-free-energy"
tags:
  - "active-inference"
  - "learning"
  - "model-selection"
is_new: true
---

Structure learning is the inference of the form of a generative model—which hidden states, factors, and contingencies exist—over and above estimating continuous parameters within a fixed model. Under active inference it proceeds as Bayesian model selection or comparison: alternative model structures are scored by their free energy (negative evidence), while curious sampling solicits the few observations needed to expose explanatory gaps and favour one structure over others. Insight is the moment when a simpler or better structure wins, collapsing uncertainty that parameter learning alone could not resolve.

<strong>Karl Friston's lens:</strong> Friston treats structure learning as continuous with state inference and curiosity, not as a separate symbolic discovery stage. Minimising expected free energy drives agents to test plausible hypotheses about how the world is put together; abductive “aha” moments are model-selection events under free-energy scoring, often from a handful of carefully chosen samples rather than big-data fitting. That rules out reducing learning to gradient updates inside a pre-specified deep network, and it makes understanding—attaining the right generative model—an epistemic act of active sampling and evidence accumulation. Structure learning is thus how free-energy minimisation scales from perception of states to insight about the world’s causal form.
