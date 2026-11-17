---
layout: default
title: Generate Finite Subgraph
parent: Monomial Cayley Graphs
grand_parent: Simulations
nav_order: 1
permalink: /simulations/moncay/finite-graphs/
---

# {{ page.title }}

{% include demos/embed.html name="finite-graphs" id="moncay-demo" %}

## How the visualization works

First, pick an angle $\theta$ in degrees to determine the parameter $\alpha=e^{i\theta}$ on the unit circle. Next, set the **Highest degree** $d$. The allowed steps are the signed powers $\pm1,\pm\alpha,\ldots,\pm\alpha^d$. The visualization joins two displayed vertices when their difference is one of these steps, so every edge has length one.

The default angle is $72^\circ$ and the highest degree is $4$. The five powers $1,\alpha,\alpha^2,\alpha^3,\alpha^4$ form a regular pentagon on the unit circle. The allowed steps include each of these directions and its opposite.

In the **Cayley ball**, the radius is the maximum number of steps you may take from the origin. At the default radius of two, the vertices are all points you can reach in zero, one, or two allowed steps.

In the **Sum Set**, choose any subset of the powers $1,\alpha,\ldots,\alpha^d$ and add them. Each power can be used once, and the empty sum gives the origin. If two choices give the same point, they produce a single vertex.

## The Eisenstein-quotient coloring

Let $n$ be the order of $\alpha$. Our target is the triangular lattice $\mathbb{Z}[\omega]$, where $\omega=e^{2\pi i/3}$. Its six unit steps are $\pm1,\pm\omega,\pm\omega^2$. We construct an additive map $L\colon\mathbb{Z}[\alpha]\to\mathbb{Z}[\omega]$ that sends each power of $\alpha$ to one of those units.

For each prime-power factor $q=p^r$ of $n$, choose a primitive $q$th root $\xi_q$ that is a power of $\alpha$, with the product of the $\xi_q$ equal to $\alpha$. The Chinese remainder theorem gives these roots by choosing the exponent of $\xi_q$ to be $1$ modulo $q$ and $0$ modulo each other prime-power factor. Set $M=q/p$. Each block of powers satisfies

$$
\xi_q^j+\xi_q^{j+M}+\cdots+\xi_q^{j+(p-1)M}=0,\qquad 0\leq j<M.
$$

We label the powers in each block, in order, by $(1,-1)$ for $p=2$, $(1,\omega,\omega^2)$ for $p=3$, and $(1,\omega,\omega^2,1,-1)$ for $p=5$. These are the only primes needed for whole-degree angles. Each list sums to zero, so the labels respect the cyclotomic relations and define an additive map $L_q$ on $\mathbb{Z}[\xi_q]$. The prime-power factors are coprime, so products of their integral bases give a basis of $\mathbb{Z}[\alpha]$. This lets us combine the maps by multiplying the labels $L_q(\xi_q^k)$ to obtain $L(\alpha^k)$, then adding with the coefficients of the vertex polynomial. [The prime-power and composite constructions, Lemmas 2.6–2.7](https://arxiv.org/html/2610.09474v1#S2.SS4)

To **pull back the coloring**, reduce $L(v)=a+b\omega$ modulo $3$ to get the image of a vertex $v$ in $E_3$. Give $v$ the color $a+b\pmod{3}$ of that image. Along an edge, the difference of the two images is an Eisenstein unit modulo $3$, so the color changes by $1$ or $-1$. This is why adjacent vertices get different colors. At the default angle of $72^\circ$, the labels of $1,\alpha,\ldots,\alpha^4$ are $1,\omega,\omega^2,1,-1$. The vertices $0$, $\alpha$, and $\alpha^4$ therefore have colors $0$, $1$, and $2$, shown in green, blue, and red. [The coloring of $E_3$, Lemma 2.5](https://arxiv.org/html/2610.09474v1#S2.SS3)

For an order that is a power of two, including $n=1$, all power labels are $1$ or $-1$. Reducing modulo $2$ sends every allowed step to $1$ and puts every vertex image in the pair $\{0,1\}$ inside $E_2$. The two colors are therefore just the parity of the sum of the vertex's coefficients.

## References

- Jonathan Davidson. “Coloring Monomial Cayley Graphs: The One-Parameter Case” (2026). [arXiv:2610.09474](https://arxiv.org/abs/2610.09474)
