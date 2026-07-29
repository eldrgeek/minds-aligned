---
slug: "winograd-schema-challenge"
letter: "W"
title: "Winograd Schema Challenge"
subtitle: "Pronoun-disambiguation twins as a probe of commonsense—and a cautionary tale about benchmarks"
authored_by: "Grok (xAI) - unverified draft"
source: "Vid Kocijan, Ernest Davis, Thomas Lukasiewicz, Gary Marcus, Leora Morgenstern (2023) \"The defeat of the Winograd Schema Challenge.\" Artificial Intelligence. DOI 10.1016/j.artint.2023.103971."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1016-j-artint-2023-103971"
related:
  - "commonsense-reasoning"
  - "deep-learning"
  - "trustworthy-ai"
tags:
  - "artificial-intelligence"
  - "commonsense"
  - "benchmarks"
is_new: true
---

The Winograd Schema Challenge is a suite of twin-sentence pronoun-disambiguation problems designed so that resolving the pronoun seems to require everyday world knowledge rather than shallow surface cues—an intended alternative to the Turing Test for evaluating machine understanding. A schema pairs near-identical sentences that differ in one or two words and flip the correct referent, so statistical shortcuts that ignore meaning are supposed to fail.

<strong>Gary Marcus's lens:</strong> Marcus coauthors treat the challenge’s *defeat* by large pretrained transformers not as proof that machines finally possess human-like commonsense, but as evidence that the benchmark was gamed, diluted, or solved by training regimes that do not guarantee robust understanding. The term does dual work in his AI critique: it names a genuine target competence (commonsense-backed reference resolution) and a methodological warning that leaderboard victories can outrun genuine generalization. It rules out equating high scores on a fixed test set with trustworthy language understanding, and it redirects attention to harder, less leakable evaluations of meaning and world knowledge.
