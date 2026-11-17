---
layout: default
title: Moser MonCay
page_heading: Rotating a Hexagonal Lattice
parent: Monomial Cayley Graphs
grand_parent: Simulations
nav_order: 5
permalink: /simulations/moncay/moser-moncay/
---

# {{ page.page_heading }}

{% include demos/embed.html name="moser-moncay" id="moser-moncay" %}

## The two MonCay parameters

The original truss uses signed powers of $\alpha=(1+i\sqrt{3})/2$. For a turn through angle $\theta$, choose $\beta=e^{i\theta/2}$ so that multiplication by $\beta^2$ makes the full turn. If $N=r^2$ is the squared radius, the second parameter is

$$
\beta=\sqrt{1-\frac{1}{4N}}+\frac{i}{2\sqrt{N}}.
$$

The rotated truss uses the original directions multiplied by $\beta^2$. At $N=3$, each truss is a diamond and the edge joining the tips has direction $\alpha^2\beta$. Together they form the Moser spindle inside $\operatorname{MonCay}(\alpha,\beta)$. [The spindle parameters in *Coloring Monomial Cayley Graphs*](https://arxiv.org/html/2610.09474v1#S1)

## When three colors fail

For a squared radius that occurs on the triangular lattice, **$\operatorname{MonCay}(\alpha,\beta)$ is not 3-colorable exactly when $3$ divides $N$.** For example, $N=3$ and $N=39$ give graphs that require at least four colors, while $N=4$ gives a 3-colorable graph.

The rotation formula gives

$$
\beta^2=N(2\beta^2-1-\beta^4).
$$

In a proper three-coloring of a triangular lattice, the colors repeat every three unit steps along a lattice direction. In the MonCay, every monomial step $s$ belongs to a copy of that lattice with directions $s$, $\alpha s$, and $\alpha^2s$. Thus moving by $3s$ preserves the color from any starting vertex.

If $3$ divides $N$, move from $0$ by the displacements $-N$, $2N\beta^2$, and $-N\beta^4$. Each move preserves the color, and the identity says they end at $\beta^2$. But $0$ and $\beta^2$ are adjacent, so a proper three-coloring is impossible.

Otherwise $N\equiv1\pmod 3$, since $m^2+mn+n^2\equiv(m-n)^2\pmod 3$. Both parameters are integral over $\mathbb{Z}[1/N]$, so we can reduce them in a residue field of characteristic three. There $\alpha$ reduces to $-1$ by $\alpha^2-\alpha+1=0$, and $\beta$ reduces to an element $u$ with $u^2=-1$ by the rotation identity. [Existence of a prime above $3$](https://stacks.math.columbia.edu/tag/00GQ)

Every vertex then reduces to $a+bu$ with $a,b\in\mathbb{F}_3$. Use $a+b$ as its color. Every signed monomial reduces to one of $\pm1$ or $\pm u$, so each edge changes the color by a nonzero amount.

## Why four colors suffice

**Four colors suffice for every lattice radius in this family.** The cases $3\nmid N$ already have the three-coloring above. For $3\mid N$, we can color the whole MonCay by mapping it into a finite triangular lattice with its opposite boundaries identified.

Write $\eta$ for the image of $\alpha$ in

$$
E_q=\mathbb{Z}[\alpha]/q\mathbb{Z}[\alpha].
$$

A vertex of this finite graph is $a+b\eta$, with both coefficients taken modulo $q$. Choose the parameter images as follows.

| Squared radius | Modulus $q$ | Image of $\alpha$ | Image of $\beta$ |
| --- | --- | --- | --- |
| $3\mid N$ and $N\neq3s^2$ for any integer $s$ | $3N-1$ | $\eta$ | $\eta$ |
| $N=3s^2$ | $3s+1$ | $\eta$ | $-\eta$ |

Every allowed step $\pm\alpha^a\beta^b$ maps to a signed power of $\eta$, one of the six triangular-lattice directions. Thus a proper coloring of $E_q$ gives a proper coloring of the MonCay.

These moduli satisfy $q\geq4$ and $q\neq5$. Write $q=3A+4B$ with $A,B\geq0$ and arrange the color labels in a cyclic word

$$
h_q=(012)^A(0123)^B.
$$

Color $a+b\eta$ by the entry of $h_q$ at position $a+2b\pmod q$. A triangular-lattice step changes this position by $\pm1$ or $\pm2$. Every three consecutive entries have distinct labels, including across block boundaries and around the end of the word, so adjacent vertices receive different colors. This is the four-color construction for Eisenstein quotients. [Eisenstein quotient colorings, Lemma 2.5](https://arxiv.org/html/2610.09474v1#S2.SS3)

### Why the parameter substitutions are well-defined

The field $\mathbb{Q}(\beta)$ is biquadratic, with quadratic subfields $\mathbb{Q}(\sqrt{-N})$, $\mathbb{Q}(\sqrt{N(4N-1)})$, and $\mathbb{Q}(\sqrt{-(4N-1)})$. When $3\mid N$, it contains $\mathbb{Q}(\alpha)=\mathbb{Q}(\sqrt{-3})$ exactly when $N=3s^2$. This accounts for the two rows of the table.

For $3\mid N$ with $N\neq3s^2$, the minimal polynomial of $\beta$ over $\mathbb{Q}(\alpha)$ is

$$
X^4-\left(2-\frac1N\right)X^2+1.
$$

Substituting $X=\alpha$ into its numerator gives

$$
N\alpha^4-(2N-1)\alpha^2+N=(3N-1)(1-\alpha),
$$

which vanishes modulo $q=3N-1$. Since $N$ is invertible modulo $q$, this defines the parameter map on $\mathbb{Z}[1/N,\alpha,\beta]$ and hence on the vertex ring.

When $N=3s^2$, the minimal polynomial over $\mathbb{Q}(\alpha)$ instead comes from

$$
3s\beta^2-(2\alpha-1)\beta-3s=0.
$$

Substituting $\beta=-\alpha$ gives $(3s+1)(\alpha-2)$, which vanishes modulo $q=3s+1$. Here $3s$ is invertible modulo $q$, so this substitution also defines a map on the vertex ring.

The lower bound and the four-coloring together show that every case $3\mid N$ has chromatic number exactly four.

## Four-chromatic graphs without a Moser spindle

**For $N>3$ with $3\mid N$, these MonCays are Moser-spindle-free.** The obstruction to three colors comes from a larger finite configuration.

To see this, let $\rho_N=\beta^2$. A Moser spindle consists of two unit diamonds whose far tips are a unit apart. Their orientation ratio must be

$$
\zeta=\frac{5\pm i\sqrt{11}}6.
$$

In this MonCay, any diamond uses one monomial direction and its sixth-root rotations. Thus two diamond orientations differ by $\alpha^a\beta^b$ for integers $a,b$. If they formed a spindle, taking sixth powers would give

$$
\rho_N^{3b}=\zeta^6.
$$

Now $\rho_N+\rho_N^{-1}=(2N-1)/N$. The recurrence

$$
T_0=2,\qquad T_1=\frac{2N-1}{N},\qquad
T_{k+1}=\frac{2N-1}{N}T_k-T_{k-1}
$$

gives $T_k=\rho_N^k+\rho_N^{-k}$ with reduced denominator exactly $N^k$. For $k\geq1$, the numerator after multiplication by $N^k$ is congruent to $(-1)^k\pmod N$, so no factor of $N$ cancels. Comparing the two sides of the spindle equation therefore forces

$$
N^{3\lvert b\rvert}=3^6,\qquad\text{or equivalently}\qquad N^{\lvert b\rvert}=9.
$$

For integer $N>1$, only $N=3$ and $N=9$ survive. At $N=9$, the equation forces $\lvert b\rvert=1$ and $\beta=(\sqrt{35}+i)/6$. Every sixth-root rotation of $\beta$ or $\beta^{-1}$ has irrational real part, whereas the spindle ratio has real part $5/6$. This rules out $N=9$, leaving $N=3$ as the sole spindle-containing case.
