---
title: Steiner Triple Systems
parent: Design Theory
nav_order: 3
layout: default
has_toc: true
---

# Steiner Triple Systems

A **Steiner triple system** of order $n$ is an $(n,3,2)$-Steiner system.
Equivalently, it is a collection of triples on an $n$-element vertex set such that every pair of vertices appears in exactly one triple.
Steiner triple systems are usually denoted by $\operatorname{STS}(n)$.

Thus an $\operatorname{STS}(n)$ is a $3$-uniform hypergraph $H = (V,E)$ with the property that for every pair $\{x,y\} \subseteq V$, there is a unique vertex $z \in V$ such that

$$\{x,y,z\} \in E.$$

Using the results on $(n,q,r,\lambda)$-designs, we know that for $\operatorname{STS}(n)$

- there are $\frac{n(n-1)}{6}$ edges
- every vertex has degree $\frac{n-1}{2}$
- every pair has codegree 1
- Fisher's Inequality: $n \geq 7$ for nontrivial Steiner triple systems

From these observations, we can derive a small set of necessary divisibility conditions.

> **Divisibility Conditions for Steiner Triple Systems**
>
>$$ \operatorname{STS}(n) \text{ exists } \implies n \equiv 1,3 \pmod{6}$$

Surprisingly, the necessary divisibility conditions are also sufficient.

## Existence of Steiner Triple Systems

The main existence theorem for Steiner triple systems is the following.

> **Theorem:** An $\operatorname{STS}(n)$ exists if and only if
>
>$$
>n \equiv 1,3 \pmod{6}.
>$$

The forward direction comes from the divisibility conditions above.
The hard direction is the converse.
If $n \equiv 1,3 \pmod{6}$, then one must actually construct a collection of triples such that every pair appears exactly once.

Historically, this theorem was first proved by Thomas Kirkman in 1847.
This is one reason the terminology is a little confusing.
The objects are called **Steiner triple systems**, but the general existence theorem was proved by Kirkman before Steiner's later work on related triple systems.

Kirkman's proof was constructive, but not in the clean modern language that we use today.
The argument separated the two admissible cases

$$n = 6t+1 \qquad \text{and} \qquad n = 6t+3.$$

For each case, Kirkman gave algebraic recipes for writing down triples.
The triples were arranged in systematic families so that every pair of symbols appeared exactly once.
Kirkman organized the points into arithmetic patterns and then produced blocks by formulas.
After writing down the families of triples, the proof checked that every possible pair of points occurred in exactly one of them.

From a modern perspective, the proof has the right idea: use algebra to build the design globally.
However, the notation and casework are fairly difficult to read by modern standards.
Later constructions gave a cleaner proofs of the theorem.
The two most important later constructions are the **Bose construction** and the **Skolem construction**.
Together, these constructions give a clean modern proof of the existence theorem for Steiner triple systems.
They also reveal a connection between Steiner triple systems, quasigroups, and Latin squares.

## Steiner Quasigroups

Steiner triple systems can also be encoded algebraically.
Let $(V,E)$ be an $\operatorname{STS}(n)$.
Given two distinct points $x,y \in V$, there is a unique point $z \in V$ such that $\{x,y,z\} \in E$.
This lets us define a binary operation $\circ$ on $V$.
For distinct points, define

$$x \circ y = z$$

where $z$ is the unique third point in the triple containing $x$ and $y$.
We also define

$$x \circ x = x.$$

This operation turns the vertex set into a special kind of quasigroup called a **Steiner quasigroup**.
The operation has three important properties.

1. Idempotent: $x \circ x = x$.

2. Commutative: $x \circ y = y \circ x$.

3. Cancellation: $x \circ (x \circ y) = y$.

The last identity follows from the Steiner property.
If $x$ and $y$ lie in a triple with third point $z$, then $x \circ z$.
But the same triple also contains the pair $\{x,z\}$, whose unique third point is $y$.
Therefore, $x \circ z = y$.

The second and third properties imply that for every fixed $x$, the map

$$ y \mapsto x \circ y$$

is a bijection from $V$ to itself.
Therefore the multiplication table of $\circ$ is a Latin square, and the Steiner quasigroup is a quasigroup.

Conversely, a Steiner quasigroup determines a Steiner triple system.
Given a Steiner quasigroup $(V,\circ)$, form the triples $\{x,y,x \circ y\}$ for all distinct $x,y \in V$.
The quasigroup identities ensure that these triples have three distinct points and that every pair of points appears in exactly one triple.

Thus Steiner triple systems and Steiner quasigroups are two different languages for the same objects.
The design viewpoint emphasizes triples and incidence.
The algebraic viewpoint packages the same information into a Latin square.
This connection is useful for explicit constructions.
The Bose and Skolem constructions use algebraic operations similar to quasigroup operations to build Steiner triple systems for all admissible orders.

## Bose Construction

The Bose construction gives a clean way to build Steiner triple systems of order

$$n \equiv 3 \pmod 6.$$

Write $n = 3m$ where $m$ is odd.
We will build an $\operatorname{STS}(3m)$ using three copies of an $m$-element set.

Let $Q$ be a set of size $m$ equipped with an idempotent commutative quasigroup operation $\circ$.
For a concrete example, we can take $Q = \mathbb{Z}_m$ with the operation

$$x \circ y = \frac{x+y}{2} \pmod m.$$

This is well-defined because $m$ is odd, so $2$ has an inverse modulo $m$.

The point set of the Bose construction is $Q \times \mathbb{Z}_3$.
There are two kinds of triples.
- Vertical triples: $\\{(x,0),(x,1),(x,2)\\}$ for all $x \in Q$.
- Quasigroup triples: $\\{(x,i),(y,i),(x \circ y,i+1)\\}$ for each pair $x,y \in Q$ and $i = 0,1,2$.

By checking all the possible cases, its easy to show that every pair is contained in a unique triple, confirming the Steiner property.

### Example: $\operatorname{STS}(15)$

There are $80$ nonisomorphic Steiner triple systems on 15 vertices. The Bose construction gives the following $\operatorname{STS}(15)$:
- Vertical triples: $\\{(0,0),(0,1),(0,2)\\}$, $\\{(1,0),(1,1),(1,2)\\}$, $\\{(2,0),(2,1),(2,2)\\}$, $\\{(3,0),(3,1),(3,2)\\}$, $\\{(4,0),(4,1),(4,2)\\}$
- The quasigroup triples are partitioned into two sets of triangles pictured below

<figure style="text-align: center;">
  <img
    src="{{ '/assets/images/design-theory/bose-construction1.svg' | relative_url }}"
    alt="The Bose construction for the Steiner Triple System on 15 points for the triples of the form (x,i),(x+1,i),(x+3,i+1)."
    style="width: min(100%, 500px); height: auto;"
  >
</figure>

<figure style="text-align: center;">
  <img
    src="{{ '/assets/images/design-theory/bose-construction2.svg' | relative_url }}"
    alt="The Bose construction for the Steiner Triple System on 15 points for the triples of the form (x,i),(x+2,i),(x+1,i+1)."
    style="width: min(100%, 500px); height: auto;"
  >
</figure>

## Skolem Construction

## Triangle Decompositions
