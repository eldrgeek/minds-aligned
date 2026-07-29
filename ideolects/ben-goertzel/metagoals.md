---
slug: "metagoals"
letter: "M"
title: "Metagoals"
subtitle: "Higher-order goals that stabilize or moderately evolve a self-modifying AGI's goal system"
authored_by: "Grok (xAI) - unverified draft"
source: "Ben Goertzel (2024) \"Metagoals Endowing Self-Modifying AGI Systems with Goal Stability or Moderated Goal Evolution: Toward a Formally Sound and Practical Approach.\" arXiv (Cornell University). DOI 10.48550/arxiv.2412.16559."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-48550-arxiv-2412-16559"
related:
  - "golem"
  - "openpsi"
  - "action-selection"
tags:
  - "agi"
  - "alignment"
  - "goals"
is_new: true
---

Metagoals are higher-order goals whose content concerns the structure and dynamics of the goal system itself. In Goertzel's usage they are specific, articulate control targets for self-modifying AGI: series of goal-stability metagoals that push a system toward states where flexible self-modification remains compatible with invariant core goals, and series of moderated-goal-evolution metagoals that allow controlled change of goals rather than free drift or total freeze.

<strong>Ben Goertzel's lens:</strong> Metagoals are Goertzel's operational answer to how an AGI can rewrite itself without losing (or recklessly discarding) what it cares about. They do work inside motivational architectures such as OpenPsi/MetaMo by sitting above ordinary object-level goals and shaping which self-modifications are selected. This rules out both rigid hard-coded utility functions that forbid deep self-change and unconstrained goal mutation under intelligence growth. The usage departs from ordinary “meta-reasoning” talk by treating goal-system invariants as first-class goals the agent actively pursues, and by distinguishing stability versus moderated evolution as two deliberate design regimes rather than accidents of training.
