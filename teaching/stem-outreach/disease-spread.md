---
layout: default
title: Disease Spread
parent: STEM Outreach
grand_parent: Teaching
nav_order: 3
permalink: /teaching/stem-outreach/disease-spread/
---

# Disease Spread

[Open simulation only]({{ '/simulations/probability/disease-spread/' | relative_url }})

{% include demos/embed.html name="disease-spread" id="diseaseSpreadDemo" autoplay=false %}

## What the Simulation Shows

In this simulation, a population of agents moves randomly inside a two-dimensional box. Each agent is in one of two possible states:

- **Susceptible (S)** – healthy but able to become infected  
- **Infected (I)** – currently carrying the infection and able to transmit it

At the beginning of the simulation, most agents are susceptible and only a small number are infected. As the agents move around the plane, infected agents may transmit the disease to nearby susceptible agents.

Transmission occurs through **local interactions**. When a susceptible agent comes sufficiently close to an infected one, the infection spreads with some probability $p$.

Because agents are constantly moving, new encounters occur continuously, allowing the infection to propagate through the population.

This simulation is an example of an **agent-based model**. Instead of describing the population using equations directly, we simulate the behavior of many individual agents and observe the patterns that emerge.

Even though the rules are simple, large-scale structures often appear in the animation. Clusters of infection form, expand, and spread across space as agents interact.

The goal of this page is to understand how these microscopic rules lead to the mathematical models used in epidemiology.
