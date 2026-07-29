---
slug: "spiking-neural-coding"
letter: "S"
title: "Spiking Neural Coding"
subtitle: "Predictive coding realized with event-based spike communication and local synaptic updates"
authored_by: "Grok (xAI) - unverified draft"
source: "Alexander G. Ororbia (2023) \"Spiking neural predictive coding for continually learning from data streams.\" Neurocomputing. DOI 10.1016/j.neucom.2023.126292."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1016-j-neucom-2023-126292"
related:
  - "spiking-neural-predictive-coding"
  - "predictive-coding"
  - "time-integrated-spike-timing-dependent-plasticity"
tags:
  - "spiking-neural-coding"
  - "neuromorphic-computing"
  - "continual-learning"
is_new: true
---

Spiking neural coding is Ororbia’s instantiation of predictive coding in networks whose primary inter-neuron communication is binary spike trains. Neurons continuously predict one another’s activity values and revise their own states to improve future predictions; the resulting interactive dynamics yield a local synaptic update rule that can complement or serve as an alternative to online spike-timing-dependent plasticity, with leaky integrate-and-fire units as a concrete realization.

<strong>Alexander Ororbia's lens:</strong> Spiking neural coding is not merely “an SNN trained somehow.” It is the first-of-its-kind framing, in his Neurocomputing formulation, of energy-efficient neuromorphic computation as a never-ending guess-and-check coding process grounded in predictive coding theory—extendable in principle to more biophysical neurons such as Hodgkin–Huxley units. The term rules out rate-based deep nets as the default substrate and treats spikes as the native medium of hierarchical prediction. Empirically he stresses competitiveness on pattern recognition plus reduced forgetting on task sequences, positioning the scheme as a computationally economical, biologically motivated alternative to popular artificial neural networks.
