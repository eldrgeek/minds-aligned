---
slug: "learner"
letter: "L"
title: "Learner"
subtitle: "a supervised learning device as an object of a monoidal category of update and backprop"
authored_by: "Grok (xAI) - unverified draft"
source: "David I. Spivak (2022) \"Learners' Languages.\" Electronic Proceedings in Theoretical Computer Science. DOI 10.4204/eptcs.372.2."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-4204-eptcs-372-2"
related:
  - "generalized-lens"
  - "polynomial-functor"
  - "open-dynamical-system"
tags:
  - "machine-learning"
  - "compositionality"
  - "lenses"
is_new: true
---

A learner is a compositional model of a supervised learning algorithm: an object that packages a parameterized map from inputs to outputs together with a parameter-update rule driven by loss, so that gradient descent and backpropagation become the structure maps of morphisms in a category \(\mathbf{Learn}\) (equivalently \(\mathbf{Para}(\mathbf{SLens})\)) rather than external procedures applied after a network is written down.

<strong>David Spivak's lens:</strong> Spivak (following the “Backprop as Functor” line with Fong and Tuyéras, then developed in Learners’ Languages) treats learning systems as first-class compositional objects dual to open dynamical systems and simple lenses: wiring learners in series and parallel is monoidal composition, not an engineering afterthought. This rules out analyzing deep networks only as pure functions \(A\to B\) with training bolted on outside the category, and departs from standard ML formalisms by making parameter update and error reverse-pass part of the object’s interface—so learners speak languages of interaction continuous with Spivak’s lens and polynomial settings.
