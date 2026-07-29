---
slug: "generalised-filtering"
letter: "G"
title: "Generalised Filtering"
subtitle: "Online Bayesian filtering of continuous-time nonlinear state-space models via free-energy optimisation in generalised coordinates of motion"
authored_by: "Grok (xAI) - unverified draft"
source: "Karl Friston, Klaas E. Stephan, Baojuan Li, Jean Daunizeau (2010) \"Generalised Filtering.\" Mathematical Problems in Engineering. DOI 10.1155/2010/621670."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1155-2010-621670"
related:
  - "variational-free-energy"
  - "belief-updating"
  - "predictive-coding"
tags:
  - "bayesian-filtering"
  - "continuous-time"
  - "inference"
is_new: true
---

Generalised filtering is Friston's continuous-time Bayesian filtering scheme for nonlinear state-space models: it furnishes an approximate posterior over time-varying hidden states and time-invariant parameters by assimilating data online and optimising a free-energy bound on model log-evidence. States and parameters are represented in generalised coordinates of motion (value, velocity, acceleration, …), so that the filter tracks not only instantaneous causes but their trajectories under dynamical priors, without requiring a separate backward smoothing pass.

<strong>Karl Friston's lens:</strong> Where classical Kalman or particle methods emphasise recursive estimation under linear-Gaussian or sampling assumptions, generalised filtering is defined as free-energy minimisation under a generative model of continuous dynamics. It refuses the mean-field split that would treat states and parameters as conditionally independent during inversion, and it replaces batch smoothing with online updates under the prior that parameters change slowly. That formalises perceptual inference as dynamical filtering—exactly the continuous-time process theory that predictive coding and active inference need—so that neuronal dynamics can be read as gradient flows on free energy rather than as ad hoc error correction. Generalised filtering is thus the technical heart of Friston's claim that the brain is a Bayesian filter in generalised motion, not merely a static mapper from sensations to causes.
