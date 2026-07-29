---
slug: "policy"
letter: "P"
title: "Policy"
subtitle: "A sequence of actions scored by expected free energy under a generative model"
authored_by: "Grok (xAI) - unverified draft"
source: "Karl Friston, Thomas H. B. FitzGerald, Francesco Rigoli, Philipp Schwartenbeck, John P. O’Doherty, Giovanni Pezzulo (2016) \"Active inference and learning.\" Neuroscience & Biobehavioral Reviews. DOI 10.1016/j.neubiorev.2016.06.022."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1016-j-neubiorev-2016-06-022"
related:
  - "active-inference"
  - "expected-free-energy"
  - "belief-updating"
  - "epistemic-value"
tags:
  - "active-inference"
  - "planning"
  - "decision-making"
is_new: true
---

A policy is a candidate sequence of control states (actions) entertained by an agent under a generative model—typically a partially observed Markov decision process. Policies are not executed by maximising external reward; they are selected by inferring which policy best minimises expected free energy, thereby balancing pragmatic value (preferred outcomes) against epistemic value (ambiguity- and novelty-resolving information gain). Habitual, belief-free policies and goal-directed, belief-based policies both live inside this same calculus and contextualise each other as learning proceeds.

<strong>Karl Friston's lens:</strong> Friston treats policy selection as inference, not as a separate decision module bolted onto perception. The quality of a policy is its (negative) expected free energy under prior preferences encoded in the generative model, so “value” is always a statement about preferred observations, not a scalar the environment dispenses. That rules out pure model-free reinforcement learning as a complete account of choice, and it dissolves the exploration–exploitation dilemma into one objective: explorative (ambiguity-resolving) policies enable later pragmatic (risk-sensitive) exploitation and the autodidactic emergence of habits. Action is thus belief updating about *what I am doing*, continuous with perceptual belief updating about *what is the case*.
