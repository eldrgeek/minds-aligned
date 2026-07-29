---
slug: "economic-attention-networks"
letter: "E"
title: "Economic Attention Networks"
subtitle: "STI/LTI attention dynamics that jointly allocate CPU and memory in OpenCog-class minds"
authored_by: "Grok (xAI) - unverified draft"
source: "Joel Pitt, Matthew Iklé, George Sellmann, Ben Goertzel (2009) \"Economic Attention Networks: Associative Memory and Resource Allocation for General Intelligence.\" DOI 10.2991/agi.2009.19."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-2991-agi-2009-19"
related:
  - "atomspace"
  - "cognitive-synergy"
  - "probabilistic-logic-networks"
tags:
  - "attention"
  - "opencog"
  - "agi"
is_new: true
---

Economic Attention Networks (ECANs) are Goertzel's mechanism for treating attention as a scarce resource allocated across an Atomspace-like graph: atoms carry importance values that spread, decay, and compete so that limited processing and storage go to the structures most worth keeping active. The design explicitly splits two roles of “activation”—Short Term Importance (STI), tied to immediate processor allocation, and Long Term Importance (LTI), tied to memory retention—and updates them with economics-inspired equations rather than with a single neural activation scalar.

<strong>Ben Goertzel's lens:</strong> Goertzel uses ECAN not as a side module for saliency scoring but as the mind’s online resource market: attention economics is how combinatorial explosion in inference and memory is kept under control while still allowing associative retrieval. That rules out pure “fire everything” forward chaining and pure fixed-budget priority queues that ignore long-term retention, and it departs from standard attractor-network spreading-activation by making the dual STI/LTI distinction and economic transfer rules first-class—so that forgetting, focus of attention, and associative memory are one coupled dynamical system serving general intelligence under resource bounds.
