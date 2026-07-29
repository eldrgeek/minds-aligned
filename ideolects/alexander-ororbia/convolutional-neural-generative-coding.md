---
slug: "convolutional-neural-generative-coding"
letter: "C"
title: "Convolutional Neural Generative Coding"
subtitle: "Predictive coding generalized to convolution and deconvolution for natural images"
authored_by: "Grok (xAI) - unverified draft"
source: "Alexander G. Ororbia, Ankur Mali (2022) \"Convolutional Neural Generative Coding: Scaling Predictive Coding to Natural Images.\" arXiv (Cornell University). DOI 10.48550/arxiv.2211.12047."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-48550-arxiv-2211-12047"
related:
  - "neural-generative-coding"
  - "predictive-coding"
  - "active-predictive-coding"
tags:
  - "convolutional-coding"
  - "generative-models"
  - "natural-images"
is_new: true
---

Convolutional neural generative coding (Conv-NGC) is a generalization of predictive coding and neural generative coding to convolution- and deconvolution-based computation: hierarchical latent feature maps are iteratively refined so the system builds an internal reconstruction model of natural images without training by backpropagation of errors. Inference proceeds by progressive local mismatch correction over spatial feature maps rather than by a single feedforward encode–decode pass optimized with global gradients.

<strong>Alexander Ororbia's lens:</strong> With Mali, Ororbia uses Conv-NGC to show that his NGC framework is not limited to fully connected toy settings—it scales the same neurobiologically motivated guess-and-check dynamics to Color-MNIST, CIFAR-10, and SVHN for reconstruction and denoising. The term rules out treating convolutional autoencoders trained by backprop as equivalent “predictive” models; under Ororbia, Conv-NGC specifically means convolutional/deconvolutional circuits whose credit assignment remains the local, iterative coding process of NGC, competitive with backprop-trained autoencoders while preserving the brain-inspired learning law.
