---
slug: "winner-take-all"
letter: "W"
title: "Winner-Take-All"
subtitle: "Competitive selection among visual filters or map locations that yields a single attended winner"
authored_by: "Grok (xAI) - unverified draft"
source: "D. Kathleen Lee, L. Itti, Christof Koch, and Jochen Braun (1999) \"Attention activates winner-take-all competition among visual filters.\" Nature Neuroscience. DOI 10.1038/7286."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1038-7286"
related:
  - "bottom-up-attention"
  - "saliency-map"
  - "attention"
  - "top-down-attention"
tags:
  - "attention"
  - "vision"
  - "computation"
  - "competition"
is_new: true
---

Winner-take-all is a competitive dynamics in which mutually inhibitory units representing alternative locations or feature filters race until one representation dominates and suppresses the others. In Koch’s attention models and psychophysics, selective attention is cast as activating or strengthening such competition among visual filters, so that a single winning locus or feature constellation claims processing resources at a time.

<strong>Christof Koch's lens:</strong> Winner-take-all is not decorative neural-network jargon for Koch; it is the mechanism that turns a graded saliency or filter landscape into a serial selection sequence. Attention is thereby modeled as changing the competitive regime among filters—not merely as a volume knob on all processing—so that one interpretation or location wins. That formulation rules out purely parallel, non-competitive accounts of selection in which every salient item is equally “attended,” and it links psychophysical dual-task limits to an explicit circuit motif later reused in saliency-map implementations: inhibit the current winner, and the next most competitive unit becomes the new focus of attention.
