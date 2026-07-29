---
slug: "deep-temporal-models"
letter: "D"
title: "Deep Temporal Models"
subtitle: "Hierarchical generative models in which higher states encode sequences of transitions over nested timescales"
authored_by: "Grok (xAI) - unverified draft"
source: "Karl Friston, Richard Rosch, Thomas Parr, Cathy J. Price, Howard Bowman (2017) \"Deep temporal models and active inference.\" Neuroscience & Biobehavioral Reviews. DOI 10.1016/j.neubiorev.2017.04.009."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1016-j-neubiorev-2017-04-009"
related:
  - "active-inference"
  - "generative-model"
  - "expected-free-energy"
tags:
  - "active-inference"
  - "hierarchical-inference"
  - "temporal-depth"
is_new: true
---

Deep temporal models are hierarchical generative models of state transitions in which the hidden state at each level entails a sequence of transitions at the level below. Inverting them under active inference implements sequential, multi-timescale inference: evidence is accumulated over nested temporal scales so that agents can infer narratives or temporal scenes, not only instantaneous hidden causes.

<strong>Karl Friston's lens:</strong> Friston uses depth in time—not only depth in cortical hierarchy—to explain epistemic foraging, reading, and electrophysiological signatures such as mismatch negativity versus P300 as responses to local versus global violations. Higher levels set slow contexts that generate fast lower-level sequences; policy selection and belief updating thus inherit temporal thickness. That rules out flat, single-timescale POMDP sketches as a complete process theory of planning and perception, and it makes "how long a belief lasts" part of the generative model's structure rather than an extra memory buffer bolted on after inference.
