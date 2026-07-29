---
slug: "bottom-up-attention"
letter: "B"
title: "Bottom-Up Attention"
subtitle: "Stimulus-driven selection guided by a saliency map rather than by task goals"
authored_by: "Grok (xAI) - unverified draft"
source: "Laurent Itti, Christof Koch, and Ernst Niebur (1998) \"A model of saliency-based visual attention for rapid scene analysis.\" IEEE Transactions on Pattern Analysis and Machine Intelligence. DOI 10.1109/34.730558."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1109-34-730558"
related:
  - "saliency-map"
  - "top-down-attention"
  - "attention"
  - "visual-awareness"
tags:
  - "attention"
  - "vision"
  - "computation"
is_new: true
---

Bottom-up attention is the rapid, stimulus-driven capture of selective processing by locations or features that stand out from their surroundings. In Koch's computational framework, multiscale image features (intensity, color, orientation, and related cues) are combined into a topographic saliency map; a dynamical selection network then picks attended locations in order of decreasing saliency so that conspicuous regions can be analyzed in detail without an explicit task set.

<strong>Christof Koch's lens:</strong> Koch treats bottom-up attention as an autonomous early-selection architecture inspired by primate visual circuitry, not as a loose synonym for “noticing.” The saliency-map model does real explanatory work: it predicts where gaze and covert selection should go when goals are weak or absent, and it separates pure sensory conspicuity from top-down, task-driven control. That split rules out equating all selective enhancement with voluntary attention, and it underwrites later dual-task and dissociation experiments in which awareness and attentional load can be manipulated somewhat independently. Bottom-up selection can feed object recognition and scene analysis without requiring that every selected item already be a fully reportable conscious content.
