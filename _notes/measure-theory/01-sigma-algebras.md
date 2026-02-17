---
title: Sigma Algebras and Set Systems
parent: Measure Theory
---

{% include breadcrumbs.html series="measure-theory" label="Measure Theory" %}

# Section 1: $\sigma$-Algebras and Set Systems

## Set Notation Conventions
In measure theory and probability, the **sample space**, or simply space will be denoted $\Omega$.
Throughout, $A \subset B$ denotes $A$ is a (possibly equal) subset of $B$, and $A \subsetneq B$ denotes a proper subset of $B$.
For a subset $A \subset \Omega$, the **complement** will be defined as

$$A^c \coloneqq \{x \in \Omega : x \notin A\}$$

sometimes we will use the notation $\Omega \setminus A$ to denote set complements. 
For measure theory and probability theory we will focus on the set operations of **union** and **intersection**.
We say that a collection of sets $\{A_i\}$ is **pairwise disjoint** if for all $i,j \in \N$ with $i \neq j$

$$A_i \cap A_j = \varnothing$$

The set of all subsets of $\Omega$ will be called the **power set**, denoted $2^{\Omega}$. More formally,

$$2^{\Omega} \coloneqq \{A: A \subset \Omega\}$$

In measure theory, we want to measure sets i.e. we want to define a set theoretic function $m: 2^{\Omega} \to [0,\infty]$. 
To define a measure, we usually define the measure on a simpler family of sets such as intervals in $\R$ or rectangles in $\R^2$. 
By studying the geometry of these simple families of sets, we recognize some important properties that motivate the following definition.

## Semi-ring of Sets
A **semi-ring of sets** $\mathcal{S}$ is a family of subsets of $\Omega$ such that
- $\varnothing \in \mathcal{S}$
- $A,B \in \mathcal{S}$ implies $A \cap B \in \mathcal{S}$
- $A,B \in \mathcal{S}$ implies $B \setminus A = \bigcup_{i=1}^n C_i$ for some disjoint $C_1,\dots,C_n \in \mathcal{S}$.

## Example: Half-open Intervals
Consider the set of half-open intervals

$$\mathcal{S} \coloneqq \big\{(a,b]:a,b \in \R \big\}$$

1. The empty set can be represented by $(a,b]$ whenever $b \leq a$, so $\varnothing \in \mathcal{S}$.
2. Let's show closure under intersections.
    - If two half open sets are disjoint, then their intersection is empty and thus contained in $\mathcal{S}$.
    - If $(a,b] \subset (c,d]$, then their intersection is $(a,b] \in \mathcal{S}$. 
    - Lastly, if $a < c < b < d$ then $(a,b] \cap (c,d] = (c,b] \in \mathcal{S}$.
3. Let's show relative complements decompose finitely.
    - If $(a,b]$ is disjoint from $(c,d]$, then $(a,b] \setminus (c,d] = (a,b]$.
    - If $(c,d] \subset (a,b]$, then $(a,b]\setminus (c,d] = (a,c] \sqcup (d,b]$. 
    - Lastly, if $a < c < b < d$, then $(a,b] \setminus (c,d] = (a,c]$ and $(c,d] \setminus (a,b] = (b,d]$.

Observe that neither the set of open intervals nor the set of closed intervals form a semi-ring of sets in $\R$. 
We can also consider higher dimensional versions of half-open intervals called half-open rectangles, where a half-open rectangles is the cartesian product of half-open intervals.
The following lemma makes it easy to show that the set of half-open rectangles is also a semi-ring.

## Proposition 1.1: Products of Semi-rings are a Semi-ring
Let $\mathcal{S}_X$ and $\mathcal{S}_Y$ be semi-rings. Then, $\mathcal{S}_X \times \mathcal{S}_Y$ is a semi-ring.

### Proof.
Let $A,C \in \mathcal{S}_X$ and let $B,D \in \mathcal{S}_Y$. Consider $A \times B$ and $C \times D$.

- Since $\varnothing \in \mathcal{S}_X, \mathcal{S}_Y$, it follows that $\varnothing = \varnothing \times \varnothing \in \mathcal{S}_X \times \mathcal{S}_Y$.
- By assumption, $A \cap C \in \mathcal{S}_X$ and $B \cap D \in \mathcal{S}_Y$.
Using the identity $$(A \times B) \cap (C \times D) = (A \cap C) \times (B \cap D)$$
we have that $(A \times B) \cap (C \times D) \in \mathcal{S}_X \times \mathcal{S}_Y$.
- Consider the identity $$(A \times B) \setminus (C \times D) = \Big((A \setminus C) \times B \Big) \sqcup \Big( (A \cap C) \times (B \setminus D)\Big)$$
By assumption, $$A \setminus C = \bigsqcup_{i=1}^n A_i, \quad B \setminus D = \bigsqcup_{j=1}^m B_j$$
Thus, $$(A \times B) \setminus (C \times D) = \Big(\bigsqcup_{i=1}^n A_i \times B \Big) \sqcup \Big(\bigsqcup_{j=1}^m (A \cap C) \times B_j \Big)$$

Thus, $\mathcal{S}_X \times \mathcal{S}_Y$ is a semi-ring. $\blacksquare$

An immediate corollary is that any finite product of semi-rings is a semi-ring. A problem occurs when we try to look at infinite cartesian products of semi-rings.

## Nonexample: Infinite Products of Semi-rings
Let $\mathcal{S}$ denote the set of half-open intervals of the form $(a,b]$.
Consider the set family
$$S^{\N} = \left\{\prod_{i \in \N} A_i: A_i \in \mathcal{S}\right\}$$
The emptyset is contained in $\mathcal{S}^{\N}$, and $\mathcal{S}^{\N}$ is closed under intersections.
The problem occurs when we try to write a relative complement as a union of finitely many disjoint sets. Let

$$A \coloneqq \prod_{i \in N} (0,1], \quad B \coloneqq \prod_{i\in \N}(0,0.5]$$

Then $B \subset A$ and 

$$A \setminus B = \big\{(x_n) \in (0,1]^{\N}: \exists n,\ x_n > 0.5 \big\}$$

For the sake of contradiction, suppose there exists $S_1,\dots,S_m \in \mathcal{S}^{\N}$ such that
$$A \setminus B = \bigcup_{k=1}^m S_k, \quad S_k = \prod_{n \in \N} I_{k,n}$$

Fix $k \in \{1,\dots,m\}$. 
If $I_{k,n} \cap (0,0.5] \neq \varnothing$ for all $n \in \N$, we can construct a sequence $(y_n)$ such that $y_n \in I_{k,n} \cap (0,0.5]$ for all $n \in \N$.
By construction, $(y_n) \in S_k \subset A \setminus B$ and $(y_n) \in B$, which is impossible.
Therefore, there exists $n_k \in \N$ such that $I_{k,n_k} \cap (0,0.5] = \varnothing$.

Consider a sequence $(y_n) \in (0,1]^{\N}$ such that

$$
y_n = \begin{cases}
    0.25 & n \in \{n_1,\dots,n_m\} \\
    1 & \text{otherwise}
\end{cases}
$$

Observe that for each $k \in \{1,\dots,m\}$, $(y_n) \notin S_k$ since $y_{n_k} \notin I_{k,n_k}$.
Hence, $(y_n) \notin \bigcup_{k=1}^m S_k$.
Since $\{n_1,\dots,n_m\}$ is a finite subset of the natural numbers there exists some natural number $n_0$ not contained in the set. 
By construction, $y_{n_0} > 0.5$ so $(y_n) \in A \setminus B = \bigcup_{k=1}^m S_k$, a contradiction. 

Thus, we cannot write $A \setminus B$ as a finite disjoint union of elements in $\mathcal{S}^{\N}$ and $\mathcal{S}^{\N}$ is not a semi-ring. To deal with sets arising from infinite products, we consider a different family of subsets consisting of cylinder sets.

## Why Infinite Products?

Many objects in probability theory are naturally indexed by an infinite set. For example:
- a sequence of coin flips $(X_n)_{n\in\N}$,
- a stochastic process $(X_t)_{t\in[0,\infty)}$.

In these situations the sample space is typically an infinite product space

$$\Omega \;=\; \prod_{i\in \Gamma}\Omega_i$$

where $\Gamma$ may be finite, countable, or uncountable. To do measure theory on $\Omega$, we need a convenient family of subsets that are simple enough to understand directly, and rich enough to generate the events we care about. The basic observation is that many “natural” events only depend on finitely many coordinates. Let's dive into a concrete example.

## Motivation: Sequences of Coin Flips
Let $\Omega_n=\{0,1\}$, where $1$ means heads and $0$ means tails. A single outcome is an infinite sequence

$$(\omega_n)=\in \{0,1\}^{\N}$$

If we assume the coin flips are independent and fair, then for any fixed string $(a_1,\dots,a_n)\in\{0,1\}^n$ the event $\{\omega_1=a_1,\dots,\omega_n=a_n\}$ has probability $2^{-n}$. 
These are events we can describe and compute with directly.

In contrast, the event that the entire infinite sequence equals one specific $\omega$ has probability

$$\lim_{n\to\infty}2^{-n}=0$$

So in probability theory, the basic “atomic” events are not single sequences, but rather events that constrain only finitely many coordinates.

## Example: Cylinder Sets
Fix a family of spaces $\{\Omega_i\}_{i\in\Gamma}$. For each $i\in\Gamma$, let $\mathcal{S}_i$ be a family of subsets of $\Omega_i$.
Let $F\subset\Gamma$ be a finite set, and let $A_i\in\mathcal{S}_i$ for each $i\in F$.
The corresponding **cylinder set** is
$$
C(F;(A_i)_{i\in F})
\;\coloneqq\;
\left\{\omega=(\omega_i)_{i\in\Gamma}\in\prod_{i\in\Gamma}\Omega_i \;:\; \omega_i\in A_i\ \text{for all } i\in F\right\}.
$$
Equivalently,
$$
C(F;(A_i)_{i\in F})
=
\left(\prod_{i\in F}A_i\right)\times\left(\prod_{i\notin F}\Omega_i\right).
$$

We write $\mathrm{Cyl}(\{\mathcal{S}_i\})$ for the collection of all cylinder sets in $\prod_{i\in\Gamma}\Omega_i$
constructed from the families $\mathcal{S}_i$.

## Proposition 1.2: Cylinder Sets form a Semi-ring
Assume that each $\mathcal{S}_i$ is a semi-ring on $\Omega_i$. Then $\mathrm{Cyl}(\{\mathcal{S}_i\})$ is a semi-ring on $\Omega=\prod_{i\in\Gamma}\Omega_i$

### Proof.
1. Choose some $i_0\in\Gamma$ and take $F=\{i_0\}$ with $A_{i_0}=\varnothing\in\mathcal{S}_{i_0}$. Then
$$\varnothing=\varnothing\times \prod_{i\ne i_0}\Omega_i \in \mathrm{Cyl}(\{\mathcal{S}_i\})$$

2. Let $C_1=C(F;(A_i)_{i\in F})$ and $C_2=C(G;(B_i)_{i\in G})$ be cylinder sets. 
Then $$C_1\cap C_2 = C(F\cup G;(D_i)_{i\in F\cup G})$$ 
where $$D_i=\begin{cases}A_i & i\in F\setminus G,\\ B_i & i\in G\setminus F,\\ A_i\cap B_i & i\in F\cap G \end{cases}$$
Since each $\mathcal{S}_i$ is closed under intersections, $D_i\in\mathcal{S}_i$ and hence $C_1\cap C_2$ is a cylinder set.

3. Let $C_1=C(F;(A_i))$ and $C_2=C(G;(B_i))$, and set $H=F\cup G$.
Both $C_1$ and $C_2$ only restrict coordinates in the finite set $H$, and outside $H$ both sets contain the full factor $\Omega_i$.
Thus, $C_1\setminus C_2$ is determined entirely by the corresponding subsets of the **finite** product space $\prod_{i\in H}\Omega_i$ Since finite products of semi-rings are semi-rings, the set difference in this finite product can be written as a finite disjoint union of product sets built from the $\mathcal{S}_i$.
Extending each such product set by $\prod_{i\notin H}\Omega_i$ gives a finite disjoint union of cylinder sets in $\Omega$.

Therefore, $\mathrm{Cyl}(\{\mathcal{S}_i\})$ is a semi-ring. $\blacksquare$

In an infinite product, the family of all pure products $\prod_{i\in\Gamma}A_i$ is typically too large to be a semi-ring:
relative complements often require infinitely many product pieces.
Cylinder sets avoid this issue by restricting only finitely many coordinates at a time, which keeps the semi-ring decomposition finite.
This is why cylinder sets serve as the main building blocks in constructing product measures and laws of stochastic processes.

## Ring of Sets
Semi-rings capture the idea of geometric atoms: simple sets whose shapes we understand well and on which we can hope to define size directly.
However, many naturally occurring sets cannot be described by a single atom. 
To assign sizes consistently, we must enlarge our collection of measurable sets while preserving enough algebraic structure to control limits and decompositions.
In general, we use union to combine atomic objects together to create more complicated sets. 
We want to study set families that are invariant under the operations of union and intersection.

A **ring of sets** $\mathcal{R}$ is a non-empty family of subsets of $\Omega$ that is closed under unions and relative complements. 
Since the following indentity holds (prove it by using a venn diagram)

$$A \cap B = A \setminus (A \setminus B)$$

it follows that a ring of sets is closed under intersections as well. 
Moreover, the identity

$$A \triangle B =  (A\setminus B) \cup (B \setminus A)$$

shows that a ring of sets is also closed under symmetric difference.
Lastly, observe that for any $A \in \mathcal{R}$, $\varnothing = A \setminus A$ so $\varnothing \in \R$.

The terminology ring comes from the fact that symmetric difference is boolean addition, intersection is boolean multiplication and the emptyset is the additive identity.
Thus, a ring of sets is also a commutative ring (multiplicative identity is not necessarily guaranteed since we do not know if $\Omega \in \mathcal{R}$) in the algebraic sense. This also holds conversely by the next lemma.

## Proposition 1.3: Boolean Ring = Ring of Sets
Suppose that $\mathcal{R}$ is a family of sets forming a boolean ring, i.e.
- $\varnothing \in \R$ (zero)
- $\mathcal{R}$ is closed under symmetric difference (addition)
- $\mathcal{R}$ is closed under intersection (multiplication)

Then, $\mathcal{R}$ is a ring of sets.

### Proof.
Observe the following identities
$$
\begin{align*}
    A \cup B & = (A \triangle B) \triangle (A \cap B)\\
    A \setminus B &= A \triangle ( A \cap B)
\end{align*}
$$
Thus, closure under symmetric difference and intersection implies closure under relative complements and union. $\blacksquare$.

## Example: Semi-ring $\neq$ Ring
A semi-ring is closed only under intersection whereas a ring is closed under
- intersection
- union
- relative complements
- symmetric difference

There are semi-rings that are not rings.
For example, consider the space $\Omega = \{1,2\}$. The set family

$$\mathcal{S} = \big\{\varnothing,\{1\},\{2\}\big\}$$

is a semi-ring, but it is not a ring since it is not closed under unions.

If we only wanted to do measure theory, working with rings would suffice.
Towards that direction we could define $\sigma$-rings and develop the theory of measurable functions and integration theory.
This approach can be uneccessarily messy however.
Moreover, if we want to work in probability theory, we should work with complements of sets instead of relative complements because we often want to define the probability of an event not happening.
Furthermore, to ensure that we have a probability measure, we want the measure of the entire space to be one to ensure that some event in our universe must happen.

## Algebra (Field) of Sets
An **algebra (field) of sets** $\mathcal{F}$ is a collection of subsets of $\Omega$ such that
- $\Omega \in \mathcal{F}$
- $\mathcal{A}$ is closed under taking complements
- $A,B \in \mathcal{F}$ implies $A \cup B \in \mathcal{A}$

An algebra of sets studies collection of sets that are closed under all the familiar set operations. By DeMorgan's Law's and the definition of relative complement

$$
\begin{align*}
    A \cap B &= (A^c)^c \cap (B^c)^c =(A^c \cup B^c)^c \\
    A \setminus B &= A \cap B^c
\end{align*}
$$

This means that a algebra of sets is also a ring of sets. 
Conversely, a ring of sets also containing the space $\Omega$ is automatically a algebra of sets since complements are just relative complements using the entire space. 
In particular, the space $\Omega$ serves as the multiplicative identity for boolean multiplication (i.e. intersection).
Thus, an algebra of sets is equivalent to a boolean ring with identity.

In summary, algebras of sets are closed under
- complments
- relative complements
- union
- intersection
- symmetric difference

In general, algebras of sets are closed under any finite combination of boolean set operations. 

## Lemma 1.4: Intersection of Algebras is an Algebra
Let $\mathcal{A}_1$ and $\mathcal{A}_2$ be algebras on the space $\Omega$.
Then, $\mathcal{A}_1 \cap \mathcal{A}_2$ is also an algebra on the space $\Omega$.

### Proof.
We need to check three properties:

1. Since $\mathcal{A}_1$ and $\mathcal{A}_2$ are algebras, $\Omega \in \mathcal{A}_1, \mathcal{A}_2$. Therefore, $\Omega \in \mathcal{A}_1 \cap \mathcal{A}_2$.
2. Let $A \in \mathcal{A_1} \cap \mathcal{A}_2$. By definition of intersection, $A \in \mathcal{A}_1$, so $A^c \in \mathcal{A}_1$. By an identical argument, $A \in \mathcal{A}_2$. Therefore, $A^c \in \mathcal{A}_1 \cap \mathcal{A}_2$.
3. Let $A,B \in \mathcal{A}_1 \cap \mathcal{A}_2$. By definition of intersection, $A,B \in \mathcal{A}_1$, so $A \cup B \in \mathcal{A}_1$. By an identical argument, $A \cup B \in \mathcal{A}_2$. Therefore, $A \cup B \in \mathcal{A}_1 \cap \mathcal{A}_2$.

Thus, $\mathcal{A}_1 \cap \mathcal{A}_2$ is an algebra on $\Omega$.
$\blacksquare$

Lemma 1.4 can be extended to arbitrary intersections of algebras. 
Using this fact, we can define the algebra generated by a set system.
Let $\mathcal{S}$ be a family of subsets of $\Omega$.
Define $A(\mathcal{S})$ to be the smallest algebra on the space $\Omega$.
More precisely,
$$A(\mathcal{S}) \coloneqq \bigcap \mathcal{A}_{\alpha}$$
where the intersection is taken over all possible algebras on $\Omega$ that contain $\mathcal{S}$.
This definition is more theoretical than practical.
The following lemma provides another characterization of $A(S)$.

## Proposition 1.5: Alternate Definition of $A(S)$
Let $S$ be a family of subsets of $\Omega$. Define
$$\mathcal{A} \coloneqq \left\{\bigcup_{i=1}^n \left(\bigcap_{j=1}^m E_{ij}\right): E_{ij} \in \mathcal{S} \text{ or } E_{ij}^c \in \mathcal{S}\right\}$$
Then, $\mathcal{A} = A(\mathcal{S})$. 
In other words, every element of $A(\mathcal{S})$ can be written in disjunctive normal form (DNF).

### Proof.
Observe that every element of $\mathcal{A}$ must be contained in any algebra containing $\mathcal{S}$ since algebras containing $\mathcal{S}$ are closed under finite unions, finite intersections, and complements.
Hence, $\mathcal{A} \subset A(\mathcal{S})$.
To show the other inclusion, we will prove $\mathcal{A}$ is an algebra containing $\mathcal{S}$.
- By definition, $\mathcal{S} \subset \mathcal{A}$.
- Let $S \in \mathcal{S}$. Then, $\Omega = S \cup S^c \in \mathcal{A}$.
- Let $A \in \mathcal{A}$. Using induction and DeMorgan's laws, it can be shown that $A^c \in \mathcal{A}$.
- Let $A,B \in \mathcal{A}$. $A \cup B$ is already in DNF so $A \cup B \in \mathcal{A}$.

Thus, $\mathcal{A}$ is an algebra containing $\mathcal{S}$, hence $A(\mathcal{S}) \subset \mathcal{A}$. Therefore, $\mathcal{A} = A(\mathcal{S})$. 
$\blacksquare$

## Ring $\neq$ Algebra 
Consider the space $\Omega = \N$. The set $\mathcal{R}$ of finite subsets of $\N$ is a ring of sets since the union and difference of two finite sets is finite. However, the complement of a finite set is infinite, so $\mathcal{R}$ is not an algebra of sets.

For another example, consider the space $\Omega = \{1,2\}$ and the family $\mathcal{R} = \big\{\varnothing,\{1\}\big\}$. 
This is a ring of sets, but it is not closed with respect to complements with respect to the universe $\Omega = \{1,2\}$. 
If we had instead specified the universe to be $\{1\}$, then this would be a ring and an algebra. 
It is important to take into account what the universe is when considering an algebra of sets, since the definition of complements relies on the universe.

To talk about limits, infinite sums, probability and integration we will need set families that are closed under countable combinations of boolean set operations.

## $\sigma$-Algebras
A **$\sigma$-algebra**, also known as a $\sigma$-field, is a family of sets $\mathcal{F}$ such that
- $\Omega \in \mathcal{F}$
- $\mathcal{F}$ is closed under complements
- $\mathcal{F}$ is closed under countable unions

Using DeMorgan's laws, it can be shown that $\sigma$-algebras are closed under countable
- unions
- intersections
- symmetric differences
- relative complements

The $\sigma$ means countable. A $\sigma$-ring would be the same definition of a ring of sets except the closure would be under countable unions and relative complements. 
Moreover, a $\sigma$-ring that contains the space $\Omega$ automatically becomes a $\sigma$-algebra.

The passage from finite to countable operations is not cosmetic.
It is precisely what allows us to define infinite sums of sizes, take limits of increasing or decreasing sequences of sets, and eventually exchange limits with integrals.
$\sigma$-algebras are therefore the minimal environment in which a theory of integration and convergence can live.

## Lemma 1.6: Intersection of $\sigma$-algebras
Let $\mathcal{F}_1$ and $\mathcal{F}_2$ be $\sigma$-algebras. Then, the intersection $\mathcal{F}_1 \cap \mathcal{F}_2$ is a $\sigma$-algebra.

### Proof.
- By definition, $\Omega \in \mathcal{F}_1$ and $\Omega \in \mathcal{F}_1$. Hence, $\Omega \in \mathcal{F}_1 \cap \mathcal{F}_2$.
- Let $A \in \mathcal{F}_1 \cap \mathcal{F}_2$. 
Then, $A \in \mathcal{F}_1$ and therefore $A^c \in \mathcal{F}_1$. 
An identical argument shows that $A^c \in \mathcal{F}_2$. 
Thus, $A^c \in \mathcal{F}_1 \cap \mathcal{F}_2$.
- Let $A_n \in \mathcal{F}_1 \cap \mathcal{F}_2$ for $n \in \N$.
Then, $A_n \in \mathcal{F}_1$ for $n \in \N$. Hence, $\bigcup_{n\in \N} A_n \in \mathcal{F}_1$. An identical argument shows that $\bigcup_{n \in \N} A_n \in \mathcal{F}_2$. Thus, $\bigcup_{n \in \N} A_n \in \mathcal{F}_1 \cap \mathcal{F}_2$. 

$\blacksquare$

Given a family $\mathcal{A}$ of subset of $\Omega$, the $\sigma$-algebra generated by $\mathcal{A}$ is denoted $\sigma(\mathcal{A})$. More formally, this $\sigma$-algebra is the intersection of all $\sigma$-algebras on $\Omega$ that contain $\mathcal{A}$. Informally, this $\sigma$-algebra is the smallest $\sigma$-algebra containing $\mathcal{A}$. The previous lemma guarantees that this contruction produces a $\sigma$-algebra.

## Example: The Borel $\sigma$-algebra
On $\R$, consider the set of open intervals $\mathcal{I}$. 
The Borel $\sigma$-algebra, denoted $\mathcal{B}$ is the $\sigma$-algebra generated by open intervals, i.e. $\sigma(\mathcal{I})$. 
Every set in $\mathcal{B}$ can be constructed using countably many unions or intersections of open intervals and closed intervals (any $\sigma$-algebra containing open sets must contain closed sets as well due to closure under complements.)
This observation leads to a hierarchy among sets in $\mathcal{B}$ depending upon how complex it is to construct the set.

The bottom of the hierarchy is given by open sets and closed sets. Arbitrary unions of open sets produce open sets and arbitrary intersections of closed sets produce closed sets we need to switch the operations to create something new. Let $G$ denote the open sets (in German open is gebiet) and let $F$ denote the closed sets (in French closed is fermee). We then use subscripts of $\sigma$ and $\delta$ to indicate countable unions and countable intersections. The second level of the Borel Hierarchy is given by
- $F_{\sigma}$: family of sets where each set is a countable union of closed sets.
- $G_{\delta}$: family of sets where each set is a countable intersection of open sets.

We then define the levels recursively by alternating operations. For example the third level of the Borel Hierarchy is given by
- $F_{\sigma \delta}$: family of sets where each set is a countable intersection of $F_{\sigma}$ sets.
- $G_{\delta \sigma}$: family of sets where each set is a countable union of $G_{\delta}$ sets.

This recursive structure allows for each level to be assigned some countable ordinal. This structure allows for proofs based on transfinite induction. The Borel Hierarchy gives a structured way to approximate complex sets by simpler sets.

The Borel hierarchy illustrates a recurring theme: complicated sets are built from simpler ones by iterating limits.
Much of modern analysis can be viewed as understanding which constructions preserve measurability and how convergence interacts with this hierarchy.

{% include series-nav.html series="measure-theory" label="Measure Theory" %}
