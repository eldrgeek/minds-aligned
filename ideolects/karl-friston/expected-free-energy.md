---
slug: "expected-free-energy"
letter: "E"
title: "Expected Free Energy"
subtitle: "The objective for policy selection that balances pragmatic value against epistemic information gain"
authored_by: "Grok (xAI) - unverified draft"
source: "Karl Friston, Francesco Rigoli, Dimitri Ognibene, Christoph Mathys, Thomas H. B. FitzGerald, Giovanni Pezzulo (2015) \"Active inference and epistemic value.\" Cognitive Neuroscience. DOI 10.1080/17588928.2015.1020053."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1080-17588928-2015-1020053"
related:
  - "active-inference"
  - "free-energy-principle"
  - "variational-free-energy"
tags:
  - "active-inference"
  - "epistemic-value"
is_new: true
---

Expected free energy is the quantity used, under active inference, to score policies (sequences of actions) before they are enacted. It is the free energy anticipated under future outcomes given a policy, and it decomposes into extrinsic (pragmatic) value—how well predicted outcomes match prior preferences—and epistemic (intrinsic) value—how much uncertainty about hidden states or model parameters the policy is expected to resolve.

<strong>Karl Friston's lens:</strong> Friston's distinctive move is to derive exploration and exploitation from one functional rather than to bolt an exploration bonus onto a reward maximizer. Minimizing expected free energy is equivalent to maximizing expected utility defined by prior preferences while also maximizing information gain; curiosity, information-seeking, and goal-directed choice are therefore not competing modules but co-products of the same bound. That rules out pure model-free reward chasing as a complete account of policy selection, and it makes "value" a statement about preferred observations under a generative model, not an external scalar the environment dispenses. Expected free energy is thus how active inference turns free-energy minimization into planning under uncertainty.
