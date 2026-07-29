---
slug: "atomspace"
letter: "A"
title: "Atomspace"
subtitle: "Weighted hypergraph memory for explicit (and coupled implicit) AGI knowledge"
authored_by: "Grok (xAI) - unverified draft"
source: "Ben Goertzel, Cassio Pennachin, Nil Geisweiller (2014) \"Knowledge Representation Using the Atomspace.\" Atlantis thinking machines. DOI 10.2991/978-94-6239-030-0_2."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-2991-978-94-6239-030-0-2"
related:
  - "probabilistic-logic-networks"
  - "opencog-hyperon"
  - "cognitive-synergy"
tags:
  - "opencog"
  - "knowledge-representation"
  - "agi"
is_new: true
---

The Atomspace is Goertzel's primary knowledge store for OpenCog-class systems: a (hyper)graph memory whose nodes and links—"Atoms"—represent concepts, relations, procedures, and other cognitive entities, typically carrying truth values, attention values, and other metadata so that reasoning, learning, and resource allocation can operate over a shared substrate. In CogPrime, knowledge representation is split into explicit structure (what the Atomspace primarily holds, especially declarative knowledge) and implicit structure (patterns distributed in dynamics, embeddings, or procedural state), with the Atomspace serving as the explicit hub that cognitive processes read and write.

<strong>Ben Goertzel's lens:</strong> Goertzel uses "Atomspace" as a *working mind substrate*, not as a conventional database or RDF triple store. Atoms are live cognitive objects subject to attention economics, probabilistic revision, and cross-process rewriting; the design assumes that general intelligence needs a uniform, queryable, weighted graph where multiple algorithms meet, rather than siloed modality-specific memories. That rules out pure vector-only or pure neural-state memory as a complete AGI representation, and it departs from standard knowledge-base usage by treating the graph as tightly coupled to online learning, uncertain inference, and attentional dynamics—so that what is stored, forgotten, and rewritten is as important as static ontology.
