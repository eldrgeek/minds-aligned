---
slug: "mode-dependent-network"
letter: "M"
title: "Mode-Dependent Network"
subtitle: "networks whose interconnection pattern can change with the internal state of modules"
authored_by: "Grok (xAI) - unverified draft"
source: "David I. Spivak, Joshua Tan (2016) \"Nesting of dynamical systems and mode-dependent networks.\" Journal of Complex Networks. DOI 10.1093/comnet/cnw022."
provenance:
  - "ideolect-draft-2026-07-28"
  - "10-1093-comnet-cnw022"
related:
  - "open-dynamical-system"
  - "wiring-diagram"
  - "polynomial-functor"
tags:
  - "dynamical-systems"
  - "compositionality"
is_new: true
---

A mode-dependent network is a network of dynamical modules in which the wiring—the pattern of who talks to whom—is allowed to vary as a function of the modules’ collective state, so that the topology itself is part of the dynamics rather than a fixed graph. Nesting such networks means treating a whole mode-dependent subnetwork as a single module inside a larger network, with interfaces that expose only the ports needed at the next level.

<strong>David Spivak's lens:</strong> Spivak uses mode dependence to insist that compositional systems theory cover reconfiguration, not only fixed interconnection: the same operadic or polynomial language that wires open systems must also allow the wiring diagram to be chosen dynamically. What this rules out is a permanent separation between “structure” (a static graph) and “behavior” (dynamics on nodes); here structure can flip with mode. The distinctive contribution is hierarchical nesting of such mode-dependent systems so that local rewiring abstracts cleanly as a single higher-level module—departing from classical network science, where topology is usually exogenous and nesting is informal.
