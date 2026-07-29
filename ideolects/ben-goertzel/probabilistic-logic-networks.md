---
slug: "probabilistic-logic-networks"
letter: "P"
title: "Probabilistic Logic Networks"
subtitle: "Uncertain inference engine for declarative knowledge in integrative AGI"
authored_by: "Grok (xAI) - unverified draft"
source: "Ben Goertzel, Cassio Pennachin, Nil Geisweiller (2014) \"Probabilistic Logic Networks.\" Atlantis thinking machines. DOI 10.2991/978-94-6239-030-0_16."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-2991-978-94-6239-030-0-16"
related:
  - "cognitive-synergy"
  - "atomspace"
  - "opencog-hyperon"
tags:
  - "pln"
  - "uncertain-inference"
  - "agi"
is_new: true
---

Probabilistic Logic Networks (PLN) are Goertzel's framework for uncertain logical reasoning over declarative knowledge: a suite of inference rules and truth-value formulas that combine logical structure with probabilistic and indefinite-probability semantics so that an AGI can draw novel conclusions from incomplete, noisy, and context-dependent evidence. In the CogPrime/OpenCog line, PLN is the primary machinery for handling explicit declarative knowledge—concept membership, inheritance, implication, and related relations—stored in a graph memory and revised as new observations and inferences arrive.

<strong>Ben Goertzel's lens:</strong> Goertzel does not treat PLN as a drop-in Bayesian network package or as classical first-order logic with probabilities bolted on. PLN is designed as one cognitive process among many inside a synergetic architecture: it must accept guidance from attention allocation, feed and receive patterns from procedure learning and concept formation, and operate under resource bounds rather than exhaustive proof search. What it rules out is the idea that uncertain reasoning for AGI can be solved by pure statistical learning alone or by crisp symbolic theorem proving alone; the distinctive claim is that *intensional and extensional* uncertain inference over a shared knowledge graph is a necessary declarative pillar of general intelligence, tightly coupled to the rest of the mind rather than sealed in a probabilistic expert system.
