---
layout: default
title: Golomb MonCay
page_heading: Rotating an Offset Hexagonal Lattice
parent: Monomial Cayley Graphs
grand_parent: Simulations
nav_order: 6
permalink: /simulations/moncay/golomb-moncay/
---

# {{ page.page_heading }}

{% include demos/embed.html name="golomb-moncay" id="golomb-moncay" %}

## Reading the presets

Each preset fixes an exact rotation and highlights every unit edge joining the two infinite lattices. The displayed angle is rounded and lies between $0^\circ$ and $30^\circ$ by lattice symmetry. **Show contact circles** marks the radii of the contact endpoints in the current view. A shell pair consists of one radius on the fixed lattice and one on the offset lattice.

**Show witness** switches the same canvas to a finite subgraph at the same scale and position. Both lattices stay visible behind it. The witness uses a triple of contacts at the first contact radius, with its vertices and edges arranged in $120^\circ$ rotational symmetry. The vertex and edge counts follow the active view. In the contact view, three-colorability includes the edges within both lattices.

| Preset | $\theta$ | Contacts by shell pair |
| --- | ---: | ---: |
| Classical Golomb | $16.78^\circ$ | $3$ |
| Six contacts on one shell pair | $11.53^\circ$ | $6$ |
| Six contacts on two shell pairs | $18.96^\circ$ | $3+3$ |
| Nine contacts on two shell pairs | $6.90^\circ$ | $6+3$ |
| Twelve contacts on three shell pairs | $8.05^\circ$ | $6+3+3$ |

## The two lattices

Put $\alpha=(1+i\sqrt3)/2$, $L=\mathbb Z[\alpha]$, and $q=2-\alpha$. The fixed lattice is $L$. The moving lattice is

$$
\sigma\left(\frac1q+L\right),\qquad \sigma=e^{i\theta}.
$$

The origin is a vertex of the fixed lattice and the center of a unit triangular face in the moving lattice. Rotating the second lattice preserves every one of its unit edges.

A fixed endpoint $w\in L$ has radius $r=\sqrt N$, where $N=\lvert w\rvert^2$. An offset endpoint $\sigma y/q$ has radius $s=\sqrt{M/3}$, where $M=\lvert y\rvert^2$ with $y\in1+qL$. The congruence $M\equiv1\pmod3$ makes the squared radii of the two lattices disjoint at every rotation.

## Which rotations make unit contacts?

For a pair of endpoints $w$ and $\sigma y/q$, write

$$
A=3N+M-3,\qquad D=12NM-A^2,\qquad T=\overline q\,\overline w\,y.
$$

The unit-distance condition is $T\sigma+\overline T\sigma^{-1}=A$, or

$$
T\sigma^2-A\sigma+\overline T=0.
$$

The origin cannot be an endpoint of a contact, since that would require $M=3$. For nonzero $w$, a unit contact is possible exactly when $D>0$, equivalently

$$
\left\lvert\sqrt N-\sqrt{M/3}\right\rvert<1.
$$

For a fixed pair $w,y$, the two contact angles are

$$
\theta=\arg(qw)-\arg y
\pm\arccos\left(\frac{3N+M-3}{2\sqrt{3NM}}\right).
$$

The arccosine term is the angle between the endpoint radii. The phase $\arg(qw)-\arg y$ converts it to the lattice rotation. Tangency cannot occur because $D\equiv2\pmod3$.

A contact brings along its two $120^\circ$ rotations. A selected angle can produce contacts at several shell pairs. The highlighted segments show the unit edges between the two lattices.

The **first contact radius** is the radius of the smallest centered disk containing both endpoints of a unit contact.

$$
\min_{\substack{w\in L,\;y\in1+qL\\
\lvert w-\sigma y/q\rvert=1}}
\max\{\lvert w\rvert,\lvert y/q\rvert\}.
$$

### How many contacts can a rotation produce?

The quadratic is irreducible over $\mathbb Q(\alpha)$ because $D\equiv2\pmod3$. At a fixed contact rotation $\sigma$, all contact pairs give the same monic quadratic. Its other root $\sigma^\ast$ also has modulus one. Both $\sigma y/q$ and $\sigma^\ast y/q$ are one unit from $w$, so the triangle inequality bounds the offset radius by $2/\lvert\sigma-\sigma^\ast\rvert$. The same argument with inverse rotations bounds the fixed radius.

Thus all contact endpoints at that angle lie in the centered disk of radius

$$
\frac{2}{\lvert\sigma-\sigma^\ast\rvert}=\sqrt{\frac{12NM}{D}},
$$

using $N,M,D$ from any one contact. This finite bound lets the explorer enumerate the complete contact set for each preset.

The counts are unbounded across angles. Let $\lambda=2+\alpha$ and $P=7^k$. The points $u_j=\lambda^j\overline\lambda^{\,k-j}$ for $0\le j\le k$ all have squared norm $P$ and are $1$ modulo $q$. They give distinct directions up to lattice units, since $\lambda$ and $\overline\lambda$ are nonassociate Eisenstein primes. Take $w_0=P\alpha^2$ and $z_0=w_0+1/q$. Their radii are $P$ and $\sqrt{P^2+1/3}$. The gap is less than $1/\sqrt P$, so one rotation makes $\lvert\sigma z_0-w_0\rvert=1/\sqrt P$. Multiplying this pair by each $u_j$ gives a unit contact at the same angle, with three contacts per $120^\circ$ orbit. This produces at least $3(k+1)$ contacts.

## The finite four-chromatic witness

The witness connects the three tips in each lattice with patches of unit triangles. The triangles share edges, so the colors of one triangle determine the colors throughout its patch in any proper three-coloring. One arm and its two rotated copies give the symmetric geometry. The rotation cycles the three offset colors.

The lattice coloring is $a+b\alpha\mapsto a-b\pmod3$. Multiplication by $\alpha^2$ preserves this class, so the three fixed tips must share a color. On the offset lattice, a $120^\circ$ turn acts on the lattice coordinate $z$ by $z\mapsto\alpha^2z-1$. The offset tips therefore use all three colors. One contact edge must join equal colors in any three-coloring of the witness.

At a fixed contact angle, the common quadratic makes $T/A$ independent of the contact pair. Dividing by $\overline q$ and reducing $\overline w\,y/A$ modulo $q$ shows that every fixed contact endpoint has the same color class, since $y\equiv A\equiv1\pmod q$. Give that class yellow, the rest of the fixed lattice green and blue, and the offset lattice green, blue, and red. This gives a proper four-coloring of the two-lattice graph and of the finite witness.

## The full MonCay

Write a directed contact vector as $\delta=\sigma y/q-w$. Rotating both endpoints by $120^\circ$ gives the triple $\delta,\alpha^2\delta,\alpha^4\delta$. Reversing the edges supplies the other three directions $\alpha^j\delta$.

Each triple gives a distinct class of directions modulo powers of $\alpha$. The contact formula is

$$
\sigma=\frac{qw}{y}\,\frac{A+\varepsilon\sqrt{-D}}{6N},
\qquad \varepsilon\in\{-1,1\}.
$$

Since $\sigma$ has degree two over $\mathbb Q(\alpha)$, $\delta'=\alpha^j\delta$ forces $w'=\alpha^j w$ and $y'=\alpha^j y$. Both moving numerators are $1$ modulo $q$, and $\alpha\equiv-1\pmod q$, so $j$ is even. Each triple gives its own direction class. In the nine-contact example, two triples at the same radii have representative vectors with ratio $(8-5\alpha)/7$, a unit direction outside the six lattice directions.

Choose one representative $\delta_j$ for each triple. The full monomial Cayley graph is

$$
G_\theta=\operatorname{MonCay}(\alpha,\sigma,\delta_1,\ldots,\delta_\ell).
$$

Its steps are signed products of these directions with nonnegative exponents.

There is a prime above $q$ where $A+\varepsilon\sqrt{-D}$ is a unit, since $-D\equiv1\pmod q$. Normalize its valuation by $v(q)=1$. In the formula for $\sigma$, $y$ is a unit and $v(N)=2v(w)$, so $v(\sigma)=-h$ with $h=1+v(w)\ge1$. Every contact vector then has $v(\delta_j)=-(h+1)$ because its term $\sigma y_j/q$ has a pole and $w_j$ is integral. A monomial with that valuation either uses exactly one contact factor and no $\sigma$ factors, or has $h=1$ and direction $\alpha^j\sigma^2$. Thus each triple contributes its own contact generator unless its direction already occurs as $\alpha^j\sigma^2$, as in the classical Golomb example.

### The vertex ring

The contact quadratic gives

$$
\frac{\sigma}{q}
=\frac{T}{q}\sigma^2+\frac{\overline T}{q}
-\frac{A-1}{q}\sigma.
$$

The three coefficients on the right lie in $L$, since $\overline q=\alpha q$ and $A\equiv1\pmod3$. Hence every $\delta_j=(\sigma/q)y_j-w_j$ lies in $R=L[\sigma]$. The full MonCay and $\operatorname{MonCay}(\alpha,\sigma)$ have the same vertex ring. The choice of contact generators determines which further steps are allowed. [MonCay definition](https://arxiv.org/html/2610.09474v1#S1)

### Coloring the full MonCay

Every contact angle gives $\chi(\operatorname{MonCay}(\alpha,\sigma))\ge4$, and therefore $\chi(G_\theta)\ge4$. In a proper three-coloring, the opposite tips of a unit diamond have the same color. For each signed monomial step $s$, there is such a diamond with tips $x$ and $x+qs$, so every element of $qR$ is a color period. The contact relation puts $\sigma$ in $qR$, even though $\sigma$ itself is an allowed step.

For the upper bound, write $d$ for the squarefree part of $D$. The rotation and every contact direction lie in $K=\mathbb Q(\sqrt{-3},\sqrt{-d})$. At a prime preserved by complex conjugation, a unit direction has valuation zero and reduces to an element of norm one. Two primes give four-color tests.

- If $d\not\equiv7\pmod8$, use a conjugation-preserved prime above $2$. Its residue field has four elements.
- If $d\equiv0,2,3\pmod5$, use a conjugation-preserved prime above $5$. Its residue field is $\mathbb F_{25}$, and its norm-one directions form the six steps of the four-colorable Eisenstein quotient $L/5L$. [Eisenstein quotient colorings](https://arxiv.org/html/2610.09474v1#S2.SS3)

Together these give $\chi(G_\theta)=4$ whenever $d\not\equiv71,119\pmod{120}$. The remaining classes contain individual four-colorable examples as well. For instance, an odd leading coefficient of the primitive minimal polynomial of $\sigma$ makes $\sigma$ integral at every prime above $2$. Every contact direction is then integral at those primes too, and its norm-one identity makes it a unit. Reduction to $\mathbb F_4$ again colors the full graph.

There is also a test at $7$. If $-d$ is a square modulo $7$, including zero, there is a prime of $K$ above $7$ with residue field $\mathbb F_7$. When the primitive minimal polynomial of $\sigma$ has leading coefficient prime to $7$, all the directions are units at this prime and its conjugate. Reducing at both sends each direction to a pair $(t,t^{-1})$ with $t\in\mathbb F_7^\times$. These six pairs are the powers of the image of $\alpha$ in $L/7L$, which has a four-coloring. This settles, for example, the contact angle near $25.71^\circ$ from $(N,M)=(48,169)$ with $d=311$.

Because the vertex ring is $L[\sigma]$, a quotient map is determined by the images of $\alpha$ and $\sigma$. Its coloring must accommodate the step images from every contact triple.

Every preset has $\chi(G_\theta)=4$. The finite witness gives the lower bound, and a quotient coloring supplies the upper bound for the full graph. The remaining question for the family is whether every contact rotation has a four-colorable MonCay.

The classical Golomb graph generates the same MonCay as the classical spindle in [Moser MonCay]({{ '/simulations/moncay/moser-moncay/' | relative_url }}). The second offset shell uses the same half-angle formula at squared radius $3/4$, outside the integer squared radii of the Moser explorer. Some Golomb presets have two multiplicatively independent directions modulo the sixth roots of unity, which distinguishes their embedded direction sets from the spindle family with one extra rotation.
