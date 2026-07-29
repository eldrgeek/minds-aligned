---
slug: "model-evidence"
letter: "M"
title: "Model Evidence"
subtitle: "The marginal likelihood of data under a generative model; the quantity free energy bounds and model selection maximises"
authored_by: "Grok (xAI) - unverified draft"
source: "W.D. Penny, Klaas E. Stephan, Jean Daunizeau, Maria João Rosa, Karl Friston, Thomas M. Schofield, Alexander Leff (2010) \"Comparing Families of Dynamic Causal Models.\" PLoS Computational Biology. DOI 10.1371/journal.pcbi.1000709."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1371-journal-pcbi-1000709"
related:
  - "variational-free-energy"
  - "surprise"
  - "self-evidencing"
tags:
  - "bayesian-model-selection"
  - "free-energy-principle"
  - "model-comparison"
is_new: true
---

Model evidence is the marginal probability of observed data given a generative model—the integral of the likelihood over the prior on parameters and latent variables. In Friston's programme it is the formal score of how well a model explains sensory (or experimental) data after paying the complexity cost of its free parameters; free energy is constructed as a tractable lower bound on the log of this quantity, so that minimising free energy maximises (a bound on) model evidence.

<strong>Karl Friston's lens:</strong> Friston elevates model evidence from a technical criterion for Bayesian model selection to the objective that living systems appear to maximise—self-evidencing. Agents do not maximise reward or minimise error as primitive goals; they maximise the evidence for a model of their preferred world (equivalently, minimise surprise under that model). In the laboratory, comparing families of dynamic causal models by evidence (and averaging within families) replaces brittle "best model" pick-and-stick analysis. That rules out pure goodness-of-fit without complexity penalisation, and it unifies statistics and process theory: the same evidence objective that selects among DCMs is the quantity whose bound perception, learning, and policy selection optimise in active inference.
