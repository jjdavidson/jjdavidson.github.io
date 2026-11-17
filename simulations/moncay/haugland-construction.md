---
layout: default
title: Haugland's Graph
parent: Monomial Cayley Graphs
grand_parent: Simulations
nav_order: 4
permalink: /simulations/moncay/haugland-construction/
---

# Haugland's Spindle-Free 5-Chromatic UDG

{% include demos/embed.html name="haugland-construction" id="moncay-haugland-construction" %}

## Haugland Seed Graph

The 21-vertex seed is the generalized I-graph $GI(7;1,2,3)$. Its three rings are a heptagon with step $1$ and two heptagrams with steps $2$ and $3$. At each index, the vertices from the three rings form a unit triangle. Taking any two rings keeps their rim edges and the spokes joining vertices with the same index. This gives the three ordinary I-graphs $I(7,1,2)$, $I(7,1,3)$, and $I(7,2,3)$. Their union recovers the seed, with each pair of I-graphs sharing one ring. Conder, Pisanski, and Žitnik gave the same concentric unit-distance drawing in their 2012 preprint. [Conder, Pisanski, and Žitnik, Figure 3](https://arxiv.org/pdf/1207.2752#page=19)

Haugland chooses the radii of the heptagon and the two heptagrams so their edges have length one. For seven equally spaced points on a circle of radius $r$, a chord joining vertices $k$ steps apart has length $2r\sin(k\pi/7)$. The three radii are therefore

$$
\frac{1}{2\sin(\pi/7)},\qquad \frac{1}{2\sin(2\pi/7)},\qquad \frac{1}{2\sin(3\pi/7)}.
$$

To check the edges between the polygons, put $a=1/\sin(2\pi/7)$, $b=1/\sin(4\pi/7)$, and $c=1/\sin(8\pi/7)$. Haugland uses the identities

$$
a+b+c=0,\qquad a^2+b^2+c^2=8.
$$

The two heptagram vertices in each triangle subtend $120^\circ$ at the common center. By the law of cosines, their squared distance is

$$
\frac{a^2+ab+b^2}{4}=\frac{a^2+b^2+c^2}{8}=1.
$$

The other two sides follow from the same identities. [Haugland, Proposition 2.1](https://arxiv.org/html/2608.04542v5#S2)

## References

- Jan Kristian Haugland. “A Moser-spindle-free 5-chromatic unit distance graph on 2131 vertices in the plane” (2026). [arXiv:2608.04542](https://arxiv.org/abs/2608.04542)
- Marston D. E. Conder, Tomaž Pisanski, and Arjana Žitnik. “GI-graphs: a new class of graphs with many symmetries.” *Journal of Algebraic Combinatorics* **40** (2014), 209–231. [Article](https://doi.org/10.1007/s10801-013-0484-3)
