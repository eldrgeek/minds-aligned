---
slug: "epistemic-value"
letter: "E"
title: "Epistemic Value"
subtitle: "The expected information gain that drives exploration under active inference"
authored_by: "Grok (xAI) - unverified draft"
source: "Karl Friston, Francesco Rigoli, Dimitri Ognibene, Christoph Mathys, Thomas H. B. FitzGerald, Giovanni Pezzulo (2015) \"Active inference and epistemic value.\" Cognitive Neuroscience. DOI 10.1080/17588928.2015.1020053."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1080-17588928-2015-1020053"
related:
  - "expected-free-energy"
  - "active-inference"
  - "surprise"
tags:
  - "active-inference"
  - "expected-free-energy"
  - "exploration"
is_new: true
---

Epistemic value is the component of a policy's quality that scores expected information gain—how much selecting that policy is expected to reduce uncertainty about the hidden causes of valuable outcomes. In the decomposition of (negative) expected free energy, it sits alongside extrinsic value (expected utility under prior preferences): policies that resolve ambiguity or yield novelty score high in epistemic value even when they do not yet deliver preferred outcomes. Once uncertainty is resolved, epistemic value collapses and behaviour shifts toward exploitation of what has been learned.

<strong>Karl Friston's lens:</strong> Friston does not treat curiosity, salience, or exploration as add-on bonuses to a reward maximizer. Epistemic value falls out of minimizing expected free energy under a generative model: the same variational objective that yields pragmatic goal-seeking also mandates information-seeking until there is nothing left to learn. That rules out ad hoc ε-greedy or separate exploration modules, and it generalizes Bayesian surprise and Infomax-style active vision into a single policy-selection calculus. Exploration and exploitation are not rival motives but successive regimes of the same free-energy geometry.
