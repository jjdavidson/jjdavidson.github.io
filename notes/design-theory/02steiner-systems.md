---
title: Steiner Systems
parent: Design Theory
nav_order: 2
layout: default
has_toc: true
---

# Steiner Systems

## Combinatorial Designs

A **design** is a highly regular uniform hypergraph.
For these notes, we will use the following notation.
An $(n,q,r,\lambda)$-design is a $q$-uniform hypergraph $H = (V,E)$ with $\|V\| = n$ such that every set of $r$ vertices is contained in exactly $\lambda$ hyperedges.
Equivalently, for every $R \subseteq V$ with $\|R\| = r$, there are exactly $\lambda$ edges $e \in E$ such that $R \subseteq e$.
By definition, the parameters must satisfy

$$
n \geq q \geq r \geq 1
$$

and $\lambda$ must be a positive integer.

The vertices are often called **points**, and the hyperedges are often called **blocks**.
Thus an $(n,q,r,\lambda)$-design is a collection of $q$-element blocks on an $n$-element point set, with the rule that every $r$-element set of points appears in exactly $\lambda$ blocks.

Let $b = |E|$ be the number of blocks.
By counting pairs $(R,e)$ where $R$ is a fixed $r$-set contained in a block $e$, we get the fundamental identity

$$
b \binom{q}{r} = \lambda \binom{n}{r}.
$$

More generally, fix an $i$-element set $I \subseteq V$ with $0 \leq i \leq r$.
Let $\lambda_i$ denote the number of blocks containing $I$.
Every block containing $I$ contains

$$
\binom{q-i}{r-i}
$$

different $r$-sets that contain $I$.
On the other hand, there are

$$
\binom{n-i}{r-i}
$$

different $r$-sets containing $I$, and each one is contained in exactly $\lambda$ blocks.
Therefore,

$$
\lambda_i\binom{q-i}{r-i} = \lambda \binom{n-i}{r-i}.
$$

Thus an $(n,q,r,\lambda)$-design must satisfy the divisibility conditions

$$
\binom{q-i}{r-i} \mid \lambda \binom{n-i}{r-i}
\qquad
\text{for every } 0 \leq i \leq r.
$$

These are the most basic necessary conditions for the existence of a design.
There are also more subtle restrictions.
One famous example is Fisher's inequality.

> **Fisher's inequality:** If there is a nontrivial $(n,q,2,\lambda)$-design with $2 \leq q < n$, then the number of blocks satisfies $b \geq n$.

Here "nontrivial" means that the blocks are not simply the whole point set.
So Fisher's inequality says that any nontrivial 2-design must have at least as many blocks as points.
Therefore, passing arithmetic tests alone is not enough for a design to exist.

## Steiner Systems

A **Steiner system** is the special case of a design where

$$
\lambda = 1.
$$

Thus an $(n,q,r)$-Steiner system is a $q$-uniform hypergraph $H = (V,E)$ with $\|V\| = n$ such that every set of $r$ vertices is contained in exactly one hyperedge.
Equivalently, for every $R \subseteq V$ with $\|R\| = r$, there is a unique edge $e \in E$ such that $R \subseteq e$.
In other words, every $r$-set extends to exactly one block.
Some sources denote an $(n,q,r)$-Steiner system by $S(r,q,n)$.
The order of the parameters is different, but the meaning is the same.

For Steiner systems, the divisibility conditions for designs become

$$
\binom{q-i}{r-i} \mid \binom{n-i}{r-i}
\qquad
\text{for every } 0 \leq i \leq r.
$$

The number of blocks is

$$
b = \frac{\binom{n}{r}}{\binom{q}{r}}.
$$

The number of blocks containing a fixed point is

$$
\lambda_1 = \frac{\binom{n-1}{r-1}}{\binom{q-1}{r-1}}.
$$

More generally, the number of blocks containing a fixed $i$-set is

$$
\lambda_i = \frac{\binom{n-i}{r-i}}{\binom{q-i}{r-i}}.
$$

Each of these quantities must be an integer.

When $r \geq 2$, a Steiner system also gives a pair design.
Indeed, every pair of points is contained in

$$
\lambda_2
=
\frac{\binom{n-2}{r-2}}{\binom{q-2}{r-2}}
$$

blocks.
So an $(n,q,r)$-Steiner system with $r \geq 2$ is also an $(n,q,2,\lambda_2)$-design.

Therefore Fisher's inequality applies to any nontrivial Steiner system with $r \geq 2$.
It implies

$$
b \geq n.
$$

Since

$$
b
=
\frac{\binom{n}{r}}{\binom{q}{r}},
$$

we get the inequality

$$
\frac{\binom{n}{r}}{\binom{q}{r}}
\geq n.
$$

For the special case $r=2$, this becomes especially simple.
An $(n,q,2)$-Steiner system has

$$
b
=
\frac{\binom{n}{2}}{\binom{q}{2}}
=
\frac{n(n-1)}{q(q-1)}
$$

blocks.
Fisher's inequality gives

$$
\frac{n(n-1)}{q(q-1)}
\geq n,
$$

so

$$
n-1 \geq q(q-1).
$$

Thus the parameters of a Steiner system must pass both arithmetic tests and structural tests.

A major theme in design theory is understanding when the obvious necessary conditions are also sufficient.
For Steiner triple systems, this question has a beautiful complete answer.
For general designs, the analogous existence question became one of the major problems in modern combinatorics.

Before specializing to Steiner triple systems, we first look at a few edge cases where the definition becomes much simpler.

## The Trivial System $(n = q)$

An $(n,n,r)$-Steiner system is a $n$-uniform hypergraph on $\|V\| = n$ vertices. Since the only $n$-subset of $V$ is $V$ itself, this Steiner system consists of a single block.

$(n,n,r)$-Steiner systems exists for all values of $n$ and $r$.


## The Complete Hypergraph $(q = r)$

An $(n,q,q)$-Steiner system is a $q$-uniform hypergraph such that every $q$-set of vertices must be contained in exactly one $q$-edge.
Since the edges themselves have size $q$, this means that the hypergraph is the complete $q$-uniform hypergraph $K_n^{(q)}$.

$(n,q,q)$-Steiner systems exists for all values of $n$ and $q$.

## The Perfect Matching $(r = 1)$

An $(n,q,1)$-Steiner system is a $q$-uniform hypergraph in which every vertex is contained in exactly one edge.
Thus the edges form a partition of the vertex set into blocks of size $q$.

For example, an $(n,2,1)$-Steiner system is just a perfect matching on $n$ vertices.

> An $(n,q,1)$-Steiner system exists exactly when $q$ divides $n$.

Indeed, if the vertices are partitioned into blocks of size $q$, then $n$ must be a multiple of $q$.
Conversely, if $q \mid n$, then we can simply divide the vertex set into $n/q$ disjoint blocks of size $q$. $\blacksquare$

This case is useful as a first example because it shows that Steiner systems often come with divisibility conditions.
For more interesting values of $r$, the divisibility conditions become more subtle.

## Steiner Triple Systems

A **Steiner triple system** of order $n$ is an $(n,3,2)$-Steiner system.
Equivalently, it is a collection of triples on an $n$-element vertex set such that every pair of vertices appears in exactly one triple.
Steiner triple systems are usually denoted by $\operatorname{STS}(n)$.

Thus an $\operatorname{STS}(n)$ is a $3$-uniform hypergraph $H = (V,E)$ with the property that for every pair $\{x,y\} \subseteq V$, there is a unique vertex $z \in V$ such that

$$
\{x,y,z\} \in E.
$$

> **Proposition:** An $\operatorname{STS}(n)$ has $n(n-1)/6$ edges.

Each block contains three pairs. The blocks partition the $\binom{n}{2}$ pairs. Therefore, the number of blocks is

$$\frac{1}{3} \binom{n}{2} = \frac{n(n-1)}{6}$$

This completes the proof. $\blacksquare$

> **Proposition:** An $\operatorname{STS}(n)$ is $(n-1)/2$ regular.

For each vertex $v$, it is contained in $n-1$ pairs. Each block accounts for exactly two pairs containing $v$. Therefore, the degree vertex $v$ satisfies

$$ \deg(v) = \frac{n-1}{2}$$

Since this holds for an arbitrary vertex, the proposition follows. $\blacksquare$

## Finite Geometry Contructions

Many Steiner triple systems can be built using constructions from finite geometries.
[Explain what a finite geometry is here]

### The Fano Plane

The Fano plane is the unique $(7,3,2)$-Steiner system up to isomorphism.
The blocks are 

$$
E = \{123,145,167,246,257,347,356\}
$$

where we use a shorthand that omits the set notation for each hyperedge. 
The Fano plane is the finite projective plane $\operatorname{PG}(2,2)$ which is pictured below:

<figure style="text-align: center;">
  <img
    src="{{ '/assets/images/design-theory/fano-plane.svg' | relative_url }}"
    alt="The projective plane presentation of the Fano plane modeling a (7,3,2)-Steiner System."
    style="max-width: 100%; height: auto;"
  >
</figure>

In general, the finite projective plane $\operatorname{PG}(q,2)$ corresponds to a $(q^2+q+1,q+1,2)$-Steiner system.

### The Hesse Configuration

The Hesse configuration (Young's Geometry) is the unique $(9,3,2)$-Steiner system up to isomorphism.
The blocks are 

$$
E = \{123,456,789,147,258,369,159,267,348,168,249,357\}
$$

The Hesse configuration is the finite affine plane $\operatorname{AG}(2,3)$ which is pictured below.

<figure style="text-align: center;">
  <img
    src="{{ '/assets/images/design-theory/affine-plane.svg' | relative_url }}"
    alt="The Hesse configuration as an affine plane modeling a (9,3,2)-Steiner System."
    style="width: min(100%, 250px); height: auto;"
  >
</figure>

## Algebraic Constructions

[Talk about steiner triple systems as an indempotent comuutative quasigroup. Explain what a quasigroup is and its relationship to latin squares. Show how Bose and Skolem used this idea to come up with their constructions.]

### Bose Construction

### Skolem Construction
