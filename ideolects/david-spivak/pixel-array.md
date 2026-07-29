---
slug: "pixel-array"
letter: "P"
title: "Pixel Array"
subtitle: "discretized relation matrices composed by shared-variable multiplication to solve nonlinear systems"
authored_by: "Grok (xAI) - unverified draft"
source: "David I. Spivak, Magdalen R. C. Dobson, Sapna Kumari, Lawrence Wu (2016) \"Pixel Arrays: A fast and elementary method for solving nonlinear systems.\" arXiv (Cornell University). DOI 10.48550/arxiv.1609.00061."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-48550-arxiv-1609-00061"
related:
  - "wiring-diagram"
  - "hypergraph-category"
tags:
  - "applied-category-theory"
  - "compositionality"
is_new: true
---

A pixel array is a finite, grid-discretized presentation of a relation among real (or continuous) variables: each relation in a system is plotted as an \(n\)-dimensional array of filled or empty cells inside a bounding box, and the simultaneous solution set—projected onto a chosen set of exposed variables—is obtained by a sequence of array multiplications (and related boolean matrix operations) dictated by how variables are shared among the relations. Latent variables are summed out; exposed variables remain as the axes of the resulting pixel graph of approximate solutions.

<strong>David Spivak's lens:</strong> Spivak frames the pixel array method as elementary relational composition—compositionality made computational—rather than as a classical numerical solver (Newton, continuation, Gröbner bases). What this rules out is treating nonlinear systems only as maps \(f(x)=0\) whose zeros are hunted by local iteration: the unit of work is a relation, and the algebra is wiring of shared variables. The distinctive move is to force the user to declare which variables are exposed versus latent, so solution geometry is always relative to an interface, aligning the method with wiring diagrams and relational categories rather than with opaque black-box optimization.
