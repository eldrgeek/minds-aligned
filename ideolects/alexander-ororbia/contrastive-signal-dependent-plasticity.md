---
slug: "contrastive-signal-dependent-plasticity"
letter: "C"
title: "Contrastive Signal-Dependent Plasticity"
subtitle: "Local, parallel self-supervised synaptic update rule for spiking circuits"
authored_by: "Grok (xAI) - unverified draft"
source: "Alexander G. Ororbia (2024) \"Contrastive signal–dependent plasticity: Self-supervised learning in spiking neural circuits.\" Science Advances. DOI 10.1126/sciadv.adn6076."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1126-sciadv-adn6076"
related:
  - "spiking-neural-predictive-coding"
  - "neurobiologically-plausible-credit-assignment"
  - "predictive-forward-forward"
tags:
  - "contrastive-learning"
  - "spiking-networks"
  - "self-supervised-learning"
is_new: true
---

Contrastive signal-dependent plasticity (CSDP) is a synaptic adaptation process that generalizes self-supervised, contrastive learning to spiking neural circuits: event-based layers running in parallel adjust their efficacies from locally available signals that distinguish preferred from non-preferred patterns, without a global backward pass of errors. Plasticity is therefore both contrastive (driven by relative quality of co-occurring signals) and signal-dependent (modulated by the circuit’s own activity), yielding unsupervised or self-supervised learning in architectures of spiking units.

<strong>Alexander Ororbia's lens:</strong> Ororbia introduces CSDP as a neurobiologically motivated answer to how spiking networks should adapt when backpropagation is ruled out by energy, locality, and biological constraints. In his Science Advances formulation, CSDP is not merely “contrastive learning on spikes,” but a local plasticity law for parallel event-based layers that inherit the forward-only spirit of forward-forward schemes while remaining native to neuromorphic substrate. The term therefore excludes global contrastive losses differentiated through non-local pathways; under Ororbia it names a credit-assignment mechanism in which self-supervised structure emerges from local, signal-dependent updates suited to brain-inspired machine intelligence.
