---
published: false
layout: default
title: Random EMST
parent: Graphs
grand_parent: Teaching
nav_order: 1
permalink: /teaching/graphs/random-emst/
---

# Random Euclidean Minimum Spanning Tree Statistics

[Open simulation only]({{ '/simulations/graphs/random-emst/' | relative_url }})

{% include demos/embed.html name="random-emst" id="randomEMSTDemo" autoplay=false %}

## What the Simulation Shows

This simulation samples $n$ random points uniformly from a planar region of area $1$ and builds a **Euclidean minimum spanning tree** on those points.
A spanning tree is a connected graph that uses all of the sampled points as vertices and contains no cycles.
Among all possible spanning trees, the Euclidean minimum spanning tree, or **EMST**, is the one whose total Euclidean edge length is as small as possible.
The simulation uses an implicit form of Prim's algorithm to construct the EMST.
The main statistics considered are related to the following quantities:

- The **total length** of the EMST is the sum of all the edge weights.
- The **diameter** of the EMST is the length of the longest path with respect to the edge weights.
- The **leaf frequency** of the EMST is the proportion of vertices of degree 1.
- The **degree distribution** of the EMST is the proportion of vertices of each degree plotted on a histogram.

The simulation repeats this experiment many times.
Each trial produces a new random point set, a new tree, and new values for the tree statistics.
For convex regions, every straight-line edge between two sampled points lies inside the region, so all Euclidean edges are allowed.
For nonconvex regions, an edge is allowed only when the straight segment connecting its two endpoints stays inside the sampling region.
This lets the tree respect the geometry of regions with holes, corners, or narrow corridors.