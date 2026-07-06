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

$$n \geq q \geq r \geq 1$$

The vertices are often called **points**, and the hyperedges are often called **blocks**.
Thus an $(n,q,r,\lambda)$-design is a collection of $q$-element blocks on an $n$-element point set, with the rule that every $r$-element set of points appears in exactly $\lambda$ blocks.

Let $b = |E|$ be the number of blocks.
We will count the number of tuples $(R,e)$ where $R$ is an $r$-set contained in a block $e$ in two different ways. 
1. Pick a block and then pick an $r$-set within the block.
2. Pick an $r$-set and observe that it most appear in $\lambda$ blocks.
Therefore,

$$b \binom{q}{r} = \lambda \binom{n}{r}.$$

We can generalize this procedure to double count the number of tuples $(I,e)$ where $I$ is an $i$-set contained in a block $e$ and $0 \leq i \leq r$. We obtain the identity

$$\lambda_i\binom{q-i}{r-i} = \lambda \binom{n-i}{r-i}.$$

where $\lambda_i$ is the number of blocks an $i$-set appears.
In the language of hypergraphs, $(n,q,r,\lambda)$-design are highly regular graphs with uniform $i$-degee $\lambda_i$.

Since these $i$-degrees must be integer quantities, $(n,q,r,\lambda)$-designs must satisfy the following divisibility conditions

> **Divisibility Conditions for $(n,q,r,\lambda)$-designs**
>
>$$
>\binom{q-i}{r-i} \text{ divides } \lambda \binom{n-i}{r-i}
>\,
>\text{for every } 0 \leq i \leq r.
>$$

These are the most basic necessary conditions for the existence of a design.
There are also more subtle restrictions.
One famous example is Fisher's inequality.

> **Fisher's inequality:** 
>If there is a nontrivial $(n,q,2,\lambda)$-design with $2 \leq q < n$, then the number of blocks satisfies $b \geq n$.

Here "nontrivial" means that the blocks are not the whole point set.

## Steiner Systems

A **Steiner system** is the special case of a design where $\lambda = 1$.
Thus an $(n,q,r)$-Steiner system is a $q$-uniform hypergraph $H = (V,E)$ with $\|V\| = n$ such that every set of $r$ vertices is contained in exactly one hyperedge.
Equivalently, for every $R \subseteq V$ with $\|R\| = r$, there is a unique edge $e \in E$ such that $R \subseteq e$.

> **Divisibility Conditions for $(n,q,r)$-Steiner Systems**
>
>$$
>\binom{q-i}{r-i} \text{ divides } \binom{n-i}{r-i}
>\,
>\text{for every } 0 \leq i \leq r.
>$$

We call positive integers $n$, $q$, and $r$ satisfying the divisibility conditions above **admissible**.

When $r \geq 2$, a Steiner system gives rise to a $(n,q,2,\lambda_2)$-design since every pair of points is contained in

$$
\lambda_2 = \frac{\binom{n-2}{r-2}}{\binom{q-2}{r-2}}
$$

blocks.
We can apply Fisher's Inequality to show that

$$
\frac{\binom{n}{r}}{\binom{q}{r}} \geq n.
$$

### The Trivial System $(n = q)$

An $(n,n,r)$-Steiner system is a $n$-uniform hypergraph on $\|V\| = n$ vertices. 
Since the only $n$-subset of $V$ is $V$ itself, this Steiner system consists of a single block.
$(n,n,r)$-Steiner systems exists for all values of $n$ and $r$.

### The Complete Hypergraph $(q = r)$

An $(n,q,q)$-Steiner system is a $q$-uniform hypergraph such that every $q$-set of vertices must be contained in exactly one $q$-edge.
Since the edges themselves have size $q$, this means that the hypergraph is the complete $q$-uniform hypergraph $K_n^{(q)}$.
$(n,q,q)$-Steiner systems exists for all values of $n$ and $q$.

### The Perfect Matching $(r = 1)$

An $(n,q,1)$-Steiner system is a $q$-uniform hypergraph in which every vertex is contained in exactly one edge.
Thus the edges form a partition of the vertex set into blocks of size $q$.
For example, an $(n,2,1)$-Steiner system is just a perfect matching on $n$ vertices.
An $(n,q,1)$-Steiner system exists exactly when $q$ divides $n$.

## Finite Geometry Contructions

For the special case $(n,q,2)$-Steiner systems, Fisher's inequality can be simplified to

$$n \geq q^2-q+1.$$

When equality holds, the number of blocks equals the number of points. 
A design where the number of points is equal to the number of blocks is called a **symmetric block design**.
In the Steiner case, symmetric block designs correpsond to projective planes from finite geometry.
In fact, many Steiner systems can be constructed using finite geometries.

A **finite geometry** is a geometry with finitely many points and lines.
Instead of using coordinates over the real numbers, we use coordinates over a finite field $\mathbb{F}_q$
Using coordinates in $\mathbb{F}_q$, we can build finite versions of familiar geometric objects such as points, lines, and planes.
The important feature for design theory is that finite geometric lines form highly regular collections of subsets.

The **finite projective plane** over $\mathbb{F}_q$ is denoted by $\operatorname{PG}(2,q)$.
It has $q^2+q+1$ points and $q^2+q+1$ lines.
Each line contains $q+1$ points, and every pair of distinct points lies on exactly one line.
Therefore, the lines of $\operatorname{PG}(2,q)$ form a $(q^2+q+1,q+1,2)$-Steiner system.

The **finite affine plane** over $\mathbb{F}_q$ is denoted by $\operatorname{AG}(2,q)$. 
It has $q^2$ points and $q^2+q$ lines.
Each line contains $q$ points, and every pair of distinct points lies on exactly one line.
Therefore, the lines of $\operatorname{AG}(2,q)$ form a $(q^2,q,2)$-Steiner system.

The difference between projective and affine geometry is that affine geometry has parallel lines, while projective geometry does not.
In an affine plane, two lines can be parallel and never meet.
In a projective plane, every pair of lines meets in exactly one point.

### The Fano Plane

The Fano plane is the unique $(7,3,2)$-Steiner system up to isomorphism.
The blocks are 

$$
E = \{123,145,167,246,257,347,356\}
$$

where we use a shorthand that omits the set notation for each hyperedge.
For example, $123$ means the block $\{1,2,3\}$.
The Fano plane is the finite projective plane $\operatorname{PG}(2,2)$.

<figure style="text-align: center;">
  <img
    src="{{ '/assets/images/design-theory/fano-plane.svg' | relative_url }}"
    alt="The projective plane presentation of the Fano plane modeling a (7,3,2)-Steiner System."
    style="max-width: 100%; height: auto;"
  >
</figure>

The picture should be interpreted as an incidence diagram.
The six ordinary-looking straight lines and the circle all count as lines.
Each of these seven lines contains exactly three points, and every pair of points lies on exactly one line.

### The Hesse Configuration

The Hesse configuration, also known as Young's geometry, is the unique $(9,3,2)$-Steiner system up to isomorphism.
The blocks are 

$$
E = \{123,456,789,147,258,369,159,267,348,168,249,357\}.
$$

The Hesse configuration is the finite affine plane $\operatorname{AG}(2,3)$.

<figure style="text-align: center;">
  <img
    src="{{ '/assets/images/design-theory/affine-plane.svg' | relative_url }}"
    alt="The Hesse configuration as an affine plane modeling a (9,3,2)-Steiner System."
    style="width: min(100%, 250px); height: auto;"
  >
</figure>

One way to understand this example is to arrange the points in a $3 \times 3$ grid.
The blocks are the rows, the columns, and the diagonal lines with wrap-around arithmetic modulo $3$.

The affine plane $\operatorname{AG}(2,3)$ has four parallel classes of lines:

1. horizontal lines;
2. vertical lines;
3. diagonals of slope $1$;
4. diagonals of slope $-1$.

Each parallel class contains three disjoint lines, and each class partitions the nine points.
Altogether, this gives $12$ blocks, matching the twelve triples listed above.

## Looking Ahead

The Fano plane and the Hesse configuration are the first two nontrivial examples of **Steiner triple systems**.
Both are $(n,3,2)$-Steiner systems, meaning that every pair of points lies in exactly one triple.
In the next entry, we will focus on Steiner triple systems in their own right.
We will derive their divisibility condition, explain why an $\operatorname{STS}(n)$ can exist only when

$$
n \equiv 1,3 \pmod{6},
$$

and then discuss the surprising fact that this condition is also sufficient.
This leads to the first major existence theorem in design theory.