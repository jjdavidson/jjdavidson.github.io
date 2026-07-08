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

Surprisingly, the necessary divisibility conditions are also sufficient for the existence of nontrivial Steiner triple systems.

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
If $x$ and $y$ lie in a triple with third point $z$, then $x \circ y = z$.
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

The Bose construction builds Steiner triple systems of order $n \equiv 3 \pmod 6$. Observe that we can rewrite

$$n = 6k+3 = 3(2k+1)$$

This suggests that we can build an $\operatorname{STS}(n)$ from the cartesian product of an odd sized set and a set of size 3.
To this end, we will look for a quasigroup of size $m = 2k+1$.
Moreover, we would like this quasigroup to be idempotent and commutative.

For a concrete example, we can take $Q = \mathbb{Z}_m$ with the operation

$$x \circ y = \frac{x+y}{2} \pmod{m}.$$

This is well-defined because $m$ is odd, so $2$ has an inverse modulo $m$.

The point set of the Bose construction is $Q \times \mathbb{Z}_3$.
There are two kinds of triples.

- Vertical triples: $\\{(x,0),(x,1),(x,2)\\}$ for each $x \in Q$.
- Quasigroup triples: $\\{(x,i),(y,i),(x \circ y,i+1)\\}$ for each distinct pair $x,y \in Q$ and each $i = 0,1,2$.

> **Claim:** The Bose construction is a Steiner triple system.

Let $(x_1,y_1)$ and $(x_2,y_2)$ be elements of $Q \times \mathbb{Z}_3$.
- If $x_1 = x_2$, then the pair is contained in a vertical triple 
- If $y_1 = y_2$, then the pair is contained in a quasigroup triple where the third element of the triple is $(x_1 \circ x_2,y_1+1)$.
- Otherwise, $x_1 \neq x_2$ and we may assume $y_2 = y_1+1$. Then, the pair is contained in the triple where the third element is $(x_3,y_1)$ where $x_3$ is the unique element of $Q$ such that $x_1 \circ x_3 = x_2$.

Thus, every pair is contained in one of the triples of the Bose construction. $\blacksquare$.

### Example: $\operatorname{STS}(9)$

Since $n = 9$ we wil take $m = 3$. The idempotent commutative quasigroup $Q$ will be the set $\mathbb{Z}_3$ with the binary operation

$$x \circ y = \frac{x+y}{2} = 2(x+y)$$

The Latin square of this quasigroup is 

$$
\begin{array}{c|ccc}
    \circ & 0 & 1 & 2 \\ \hline
    0 & 0 & 2 & 1 \\
    1 & 2 & 1 & 0 \\
    2 & 1 & 0 & 2
\end{array}
$$

The points are the set $Q \times \mathbb{Z_3}$ which has $9$ elements. 
For the sake of brevity, $(a,b)$ will be written as $ab$.
The vertical blocks are

$$
\{00,01,02\}, \{10,11,12\}, \{20,21,22\}
$$

The quasigroup blocks are listed below by entry in the upper half of the Latin square.

$$
\begin{align}
    0 \circ 1 = 2:\quad & \{00,10,21\}, \{01,11,22\}, \{02,12,20\} \\
    0 \circ 2 = 1:\quad & \{00,20,11\}, \{01,21,12\}, \{02,22,10\} \\
    1 \circ 2 = 0:\quad & \{10,20,01\}, \{11,21,02\}, \{12,22,00\}
\end{align}
$$

The symmetry of the quasigroup blocks is shown in the figure below.

<figure style="text-align: center;">
  <img
    src="{{ '/assets/images/design-theory/bose-sts9.svg' | relative_url }}"
    alt="The Bose construction for the Steiner Triple System on 9 points for the triples of the form (x,i),(x+1,i),(x+2,i+1)."
    style="width: min(100%, 400px); height: auto;"
  >
</figure>

The unique Steiner triple system of order $9$ is the affine plane $\operatorname{AG}(2,3)$. The Bose construction above is isomorphic under the vertex bijection

$$
\begin{array}{ccc}
    00 \mapsto 1 & 01 \mapsto 4 & 02 \mapsto 7 \\
    10 \mapsto 2 & 11 \mapsto 5 & 12 \mapsto 8 \\
    21 \mapsto 3 & 22 \mapsto 6 & 20 \mapsto 9
\end{array}
$$

### Example: $\operatorname{STS}(15)$

Since $n = 15$ we take $m = 5$. The idempotent commutative quasigroup $Q$ will be the set $\mathbb{Z}_5$ with the binary operation

$$
x \circ y = \frac{x+y}{2} = 3(x+y) \pmod 5.
$$

The Latin square of this quasigroup is

$$
\begin{array}{c|ccccc}
    \circ & 0 & 1 & 2 & 3 & 4 \\ \hline
    0 & 0 & 3 & 1 & 4 & 2 \\
    1 & 3 & 1 & 4 & 2 & 0 \\
    2 & 1 & 4 & 2 & 0 & 3 \\
    3 & 4 & 2 & 0 & 3 & 1 \\
    4 & 2 & 0 & 3 & 1 & 4
\end{array}
$$

The points are the set $Q \times \mathbb{Z}_3$, which has $15$ elements. As before, for the sake of brevity, $(a,b)$ will be written as $ab$.

The vertical blocks are

$$
\{00,01,02\}, \{10,11,12\}, \{20,21,22\}, \{30,31,32\}, \{40,41,42\}.
$$

There are $10$ entries in the upper half of the Latin square, so there are $30$ quasigroup blocks in total. Rather than listing all $30$ blocks individually, it is more convenient to group them into two cyclic families.

The first family comes from pairs of the form $(x,x+1)$. Since

$$
x \circ (x+1) = x+3 \pmod 5,
$$

the corresponding quasigroup blocks are

$$\{(x,i),(x+1,i),(x+3,i+1)\}$$

for $x \in \mathbb{Z}_5$ and $i \in \mathbb{Z}_3$.
These are exactly the blocks shown in the figure below.

<figure style="text-align: center;">
  <img
    src="{{ '/assets/images/design-theory/bose-sts15-1.svg' | relative_url }}"
    alt="The Bose construction for the Steiner Triple System on 15 points for the triples of the form (x,i),(x+1,i),(x+3,i+1)."
    style="width: min(100%, 500px); height: auto;"
  >
</figure>

The second family comes from pairs of the form $(x,x+2)$. Since

$$x \circ (x+2) = x+1 \pmod 5,$$

the corresponding quasigroup blocks are

$$\{(x,i),(x+2,i),(x+1,i+1)\}$$

for $x \in \mathbb{Z}_5$ and $i \in \mathbb{Z}_3$.
These are exactly the blocks shown in the next figure.

<figure style="text-align: center;">
  <img
    src="{{ '/assets/images/design-theory/bose-sts15-2.svg' | relative_url }}"
    alt="The Bose construction for the Steiner Triple System on 15 points for the triples of the form (x,i),(x+2,i),(x+1,i+1)."
    style="width: min(100%, 500px); height: auto;"
  >
</figure>

Thus the Bose construction for $\operatorname{STS}(15)$ consists of

- $5$ vertical blocks,
- $15$ quasigroup blocks of the form $\{(x,i),(x+1,i),(x+3,i+1)\}$,
- $15$ quasigroup blocks of the form $\{(x,i),(x+2,i),(x+1,i+1)\}$.

In total this gives $35$ blocks matching the formula

$$\lvert\operatorname{STS}(15)\rvert = \frac{15 \cdot 14}{6}.$$

There are $80$ nonisomorphic Steiner triple systems of order $15$, and the Bose construction gives one particularly symmetric example.

## Skolem Construction

The Skolem construction builds Steiner triple systems of order $n \equiv 1 \pmod{6}$. Observe that we can rewrite

$$n = 6k+1 = 3(2k)+1$$

Similar to the Bose construction, this arithmetic relationship suggests that we can build a Steiner triple system from the cartesian product of an even sized set and a set of size 3 plus an additional point.

If we try to copy the Bose construction, we run into a problem: there is no idempotent commutative quasigroup of even order. To get around this, Skolem used a **half-idempotent** commutative quasigroup $Q$ constructed with the following steps:
1. Construct a $2k \times 2k$ Latin square from the addition table of $\mathbb{Z}_{2k}$.
2. Map the even elements to the set $\\{0,1,\dots,k-1\\}$ via $\pi(2i) = i$ for $i = 0,\dots,k-1$.
3. Map the odd elements to the set $\\{k,k+1,\dots,2k-1\\}$ via $\pi(2i+1) = k+i$ for $i = 0,\dots,k-1$.

The permutation ensures that the Latin square property holds, commutativity holds, and the diagonal is half-idempotent, i.e. the diagonal is $(0,1,\dots,k-1,0,1,\dots,k-1)$.

The Skolem construction proceeds by defining the point set to be

$$Q \times \mathbb{Z}_3 \cup \{\infty\}$$

with three types of triples:

- Vertical triples: $\\{(x,0),(x,1),(x,2)\\}$ for each $x = 0,\dots,k-1$.
- Infinity triples: $\\{\infty,(x,i),(x-k,i+1)\\}$ for each $x = k,\dots,2k-1$ and each $i = 0,1,2$.
- Quasigroup triples: $\\{(x,i),(y,i),(x \circ y,i+1)\\}$ for each distinct pair $x,y \in Q$ and each $i = 0,1,2$.

> **Claim:** The Skolem construction is a Steiner triple system.

Let $A = \\{0,1,\dots,k-1\\}$ and $B = \\{k,k+1,\dots,2k-1\\}$.
The half-idempotent condition says that for every $a \in A$,

$$
a \circ a = a \quad \text{and} \quad (k+a) \circ (k+a) = a.
$$

Let us check that every pair of points is contained in one of the triples of the Skolem construction.
All second coordinates are taken modulo $3$.

First, consider a pair containing $\infty$.

- If the other point is $(x,i)$ with $x \in B$, then the pair is contained in the infinity triple
  $$
  \{\infty,(x,i),(x-k,i+1)\}.
  $$

- If the other point is $(a,i)$ with $a \in A$, then the pair is contained in the infinity triple
  $$
  \{\infty,(k+a,i-1),(a,i)\}.
  $$

Now consider a pair not containing $\infty$.
Let the pair be $(x_1,y_1)$ and $(x_2,y_2)$.

- If $x_1 = x_2 \in A$, then the pair is contained in the vertical triple
  $$
  \{(x_1,0),(x_1,1),(x_1,2)\}.
  $$

- If $x_1 = x_2 \in B$, then we may assume $y_2 = y_1+1$. Since $Q$ is a quasigroup, there is a unique $z \in Q$ such that
  $$
  x_1 \circ z = x_1.
  $$
  The half-idempotent condition implies $z \neq x_1$, because
  $$
  x_1 \circ x_1 = x_1-k.
  $$
  Therefore the pair is contained in the quasigroup triple
  $$
  \{(x_1,y_1),(z,y_1),(x_1,y_1+1)\}.
  $$

- If $x_1 \neq x_2$ and $y_1 = y_2$, then the pair is contained in a quasigroup triple where the third element is $$(x_1 \circ x_2,y_1+1)$$.

- Finally, suppose $x_1 \neq x_2$ and $y_1 \neq y_2$. We may assume $y_2 = y_1+1$. Since $Q$ is a quasigroup, there is a unique $z \in Q$ such that $$x_1 \circ z = x_2$$.
If $z \neq x_1$, then the pair is contained in the quasigroup triple
$$\{(x_1,y_1),(z,y_1),(x_2,y_1+1)\}$$.
If $z = x_1$, then $x_2 = x_1 \circ x_1$.
Since $x_1 \neq x_2$, this can only happen when $x_1 \in B$.
Writing $x_1 = k+a$, the half-idempotent condition gives $x_2 = a = x_1-k$.
Hence the pair is contained in the infinity triple
$$\{\infty,(x_1,y_1),(x_1-k,y_1+1)\}.$$

Thus, every pair is contained in one of the triples of the Skolem construction.

The choices made above are unique because the operation on $Q$ is a quasigroup operation.
Therefore every pair is contained in exactly one triple, so the Skolem construction is a Steiner triple system. $\blacksquare$.

### Example: $\operatorname{STS}(7)$

Since $n = 7$ we take $k = 1$. The half-idempotent commutative quasigroup $Q$ will be the set $\mathbb{Z}_2$.
We start with the addition table of $\mathbb{Z}_2$:

$$
\begin{array}{c|cc}
+ & 0 & 1 \\ \hline
0 & 0 & 1 \\
1 & 1 & 0
\end{array}
$$

Since $k=1$, the relabeling map is trivial.
Therefore the half-idempotent quasigroup operation is

$$
x \circ y = x+y \pmod 2.
$$

The Latin square of this quasigroup is half-idempotent because the first half of the diagonal is repeated.

The points are the set

$$
Q \times \mathbb{Z}_3 \cup \{\infty\},
$$

which has $7$ elements.
For the sake of brevity, $(a,b)$ will be written as $ab$.

The vertical block is

$$
\{00,01,02\}.
$$

The infinity blocks are

$$
\{\infty,10,01\}, \{\infty,11,02\}, \{\infty,12,00\}.
$$

The quasigroup blocks are listed below by entry in the upper half of the Latin square.

$$
\begin{align}
    0 \circ 1 = 1:\quad & \{00,10,11\}, \{01,11,12\}, \{02,12,10\}.
\end{align}
$$

Thus the Skolem construction for $\operatorname{STS}(7)$ consists of

- $1$ vertical block,
- $3$ infinity blocks,
- $3$ quasigroup blocks.

In total this gives $7$ blocks matching the formula

$$
\lvert\operatorname{STS}(7)\rvert = \frac{7 \cdot 6}{6}.
$$

The unique Steiner triple system of order $7$ is the Fano plane.
The Skolem construction above is isomorphic to the standard Fano plane.
One isomorphism is given by the vertex bijection

$$
\begin{array}{cccc}
    \infty \mapsto 1 & 00 \mapsto 2 & 01 \mapsto 4 & 02 \mapsto 6 \\
    10 \mapsto 5 & 11 \mapsto 7 & 12 \mapsto 3
\end{array}
$$

### Example: $\operatorname{STS}(13)$

Since $n = 13$ we take $k = 2$. The half-idempotent commutative quasigroup $Q$ will be the set $\mathbb{Z}_4$ with a relabeled addition operation.

We start with the addition table of $\mathbb{Z}_4$:

$$
\begin{array}{c|cccc}
+ & 0 & 1 & 2 & 3 \\ \hline
0 & 0 & 1 & 2 & 3 \\
1 & 1 & 2 & 3 & 0 \\
2 & 2 & 3 & 0 & 1 \\
3 & 3 & 0 & 1 & 2
\end{array}
$$

Now relabel the symbols using the map $\pi : \mathbb{Z}_4 \to \mathbb{Z}_4$ defined by

$$
\pi(0)=0, \qquad \pi(2)=1, \qquad \pi(1)=2, \qquad \pi(3)=3.
$$

Define

$$
x \circ y = \pi(x+y \pmod 4).
$$

Since this is just a relabeling of the symbols in the addition table, the operation is still a commutative quasigroup.
The Latin square of this quasigroup is

$$
\begin{array}{c|cccc}
    \circ & 0 & 1 & 2 & 3 \\ \hline
    0 & 0 & 2 & 1 & 3 \\
    1 & 2 & 1 & 3 & 0 \\
    2 & 1 & 3 & 0 & 2 \\
    3 & 3 & 0 & 2 & 1
\end{array}
$$

This is half-idempotent because the first half of the diagonal is repeated.

The points are the set

$$
Q \times \mathbb{Z}_3 \cup \{\infty\},
$$

which has $13$ elements.
As before, for the sake of brevity, $(a,b)$ will be written as $ab$.

The vertical blocks come from the first half $\{0,1\}$ of $Q$:

$$
\{00,01,02\}, \{10,11,12\}.
$$

The infinity blocks connect the second half $\{2,3\}$ of $Q$ to the first half $\{0,1\}$:

$$
\{\infty,20,01\}, \{\infty,21,02\}, \{\infty,22,00\},
$$

$$
\{\infty,30,11\}, \{\infty,31,12\}, \{\infty,32,10\}.
$$

The quasigroup blocks are listed below by entry in the upper half of the Latin square.

$$
\begin{align}
    0 \circ 1 = 2:\quad & \{00,10,21\}, \{01,11,22\}, \{02,12,20\} \\
    0 \circ 2 = 1:\quad & \{00,20,11\}, \{01,21,12\}, \{02,22,10\} \\
    0 \circ 3 = 3:\quad & \{00,30,31\}, \{01,31,32\}, \{02,32,30\} \\
    1 \circ 2 = 3:\quad & \{10,20,31\}, \{11,21,32\}, \{12,22,30\} \\
    1 \circ 3 = 0:\quad & \{10,30,01\}, \{11,31,02\}, \{12,32,00\} \\
    2 \circ 3 = 2:\quad & \{20,30,21\}, \{21,31,22\}, \{22,32,20\}.
\end{align}
$$

Thus the Skolem construction for $\operatorname{STS}(13)$ consists of

- $2$ vertical blocks,
- $6$ infinity blocks,
- $18$ quasigroup blocks.

In total this gives $26$ blocks matching the formula

$$
\lvert \operatorname{STS}(13)\rvert = \frac{13 \cdot 12}{6}.
$$

There are exactly two nonisomorphic Steiner triple systems of order $13$.
The Skolem construction above gives one of them.

One way to distinguish the two systems is by symmetry.
The system constructed above is **cyclic**: it has an automorphism that cycles through all $13$ points.
The other $\operatorname{STS}(13)$ is not cyclic.
Using the vertex labels from the Skolem construction, one cyclic automorphism is

$$
\phi =
(\infty\ 20\ 10\ 21\ 02\ 12\ 11\ 32\ 30\ 22\ 01\ 31\ 00).
$$

## Generalizing the Existence Theorem

The Bose and Skolem constructions give explicit algebraic proofs of the existence theorem for Steiner triple systems.
This is one of the pleasant features of the triple-system case: every admissible order can be handled by concrete formulas.

There is also a useful graph-theoretic interpretation.
An $\operatorname{STS}(n)$ is the same thing as a triangle decomposition of the complete graph $K_n$.
Each triple $\\{x,y,z\\}$ corresponds to the triangle with edges

$$
\{x,y\}, \{x,z\}, \{y,z\}.
$$

The condition that every pair of points appears in exactly one triple says exactly that every edge of $K_n$ appears in exactly one triangle.
So the triples of an $\operatorname{STS}(n)$ partition the edge set of $K_n$ into copies of $K_3$.
More generally, an $(n,q,r)$-Steiner system asks us to decompose the complete $r$-uniform hypergraph $K_n^{(r)}$ into copies of $K_q^{(r)}$.

For Steiner triple systems, explicit algebraic constructions are enough to prove the full existence theorem.
For general Steiner systems, this becomes much harder.
The divisibility conditions are easy to state, but it is not at all clear how to write down all of the blocks directly.

Instead of trying to construct the design by hand, one builds an auxiliary hypergraph whose perfect matchings correspond to designs.
Then the problem becomes a perfect matching problem in a carefully structured hypergraph.
Next, we will explore how to construct auxillary hypergraphs for various designs.

## Sources and Further Reading

The exposition above is based on standard references on Steiner triple systems and their classical constructions.

- Thomas P. Kirkman, "On a Problem in Combinations," *Cambridge and Dublin Mathematical Journal*, 2 (1847), 191--204.

- R. C. Bose, "On the Construction of Balanced Incomplete Block Designs," *Annals of Eugenics*, 9 (1939), 353--399. [DOI](https://doi.org/10.1111/j.1469-1809.1939.tb02219.x)

- Th. Skolem, "Some Remarks on the Triple Systems of Steiner," *Mathematica Scandinavica*, 6 (1958), 273--280. [DOI](https://doi.org/10.7146/math.scand.a-10551)

- Charles J. Colbourn and Alexander Rosa, *Triple Systems*, Oxford University Press, 1999.

- Charles C. Lindner and Christopher A. Rodger, *Design Theory*, Second Edition, Chapman and Hall/CRC, 2008.

- Douglas R. Stinson, *Combinatorial Designs: Constructions and Analysis*, Springer, 2004.

- Charles J. Colbourn and Jeffrey H. Dinitz, editors, *Handbook of Combinatorial Designs*, Second Edition, Chapman and Hall/CRC, 2006.