---
slug: "action-selection"
letter: "A"
title: "Action Selection"
subtitle: "Resource-bounded choice of which actions best advance current goals"
authored_by: "Grok (xAI) - unverified draft"
source: "Ben Goertzel, Cassio Pennachin, Nil Geisweiller (2014) \"Economic Goal and Action Selection.\" Atlantis thinking machines. DOI 10.2991/978-94-6239-030-0_6."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-2991-978-94-6239-030-0-6"
related:
  - "economic-attention-networks"
  - "openpsi"
  - "procedure-learning"
tags:
  - "cognitive-architecture"
  - "motivation"
  - "opencog"
is_new: true
---

Action selection, in Goertzel's CogPrime usage, is the goal-driven process of deciding—within available computational resources—which actions will best help the system achieve its goals in the current context. It is not a thin controller layered on top of cognition after thinking is finished; it is a core dynamical loop in which goals, context, learned procedures, and attention economics jointly determine what the agent attempts next.

<strong>Ben Goertzel's lens:</strong> Goertzel frames action selection as *economic* and integrative: candidate actions compete under scarcity much as attention does in ECAN-style mechanisms, and selection must draw on procedural knowledge, motivational (OpenPsi-style) urges, and declarative context rather than a single planner. That rules out both reactive policy nets that ignore explicit goals and classical planners that assume exhaustive search is feasible. The distinctive claim is that human-level AGI needs ongoing, resource-aware goal-and-action selection tightly coupled to the rest of the synergetic architecture—not a separate “executive module” that merely executes finished plans.
