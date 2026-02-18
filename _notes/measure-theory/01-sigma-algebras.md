---
title: Sigma Algebras
parent: Measure Theory
nav_order: 1
---

# Section 1: $\sigma$-Algebras

---

## Set Notation Conventions
In measure theory and probability, the **sample space**, or simply space will be denoted by $\Omega$.
The **empty set** will be denoted by $\varnothing$.
Throughout, $A \subset B$ denotes $A$ is a (possibly equal) subset of $B$, and $A \subsetneq B$ denotes a proper subset of $B$.
For a subset $A \subset \Omega$, the **complement** will be denoted by $A^c$. 
Furthermore, $A \cup B$, $A \cap B$, and $A \setminus B$ will denote **union**, **intersection** and **difference** set operations, respectively. 

The set of all subsets of $\Omega$ is called the **power set**, denoted $2^{\Omega}$. 
A **set family** is any subset of $2^{\Omega}$.
Throughout, we will use lowercase to denote elements of sets, uppercase to denote sets, and math script to denote set families.

A **sequence** (of points, sets, etc.) is a function whose domain is $\N$. 
A sequence will be denoted by encasing the variable with subscripts in parentheses, e.g. $(x_n)$ is a sequence of points.
If $A \cap B = \varnothing$, we say that $A$ and $B$ are disjoint. 
Moreover, we will write $A \sqcup B$ instead of $A \cup B$ whenever $A$ and $B$ are disjoint. 
We say that a family of sets $\mathcal{S}$ is **pairwise disjoint** if $S$ and $T$ are disjoint for all pairs $S,T \in \mathcal{S}$ with $S \neq T$.

Given sets $A$ and $B$, their **Cartesian product** is
$$
A \times B = \{(a,b) : a\in A,\ b\in B\}.
$$
More generally, for a multiset of sets $\mathcal{S}$ indexed by a set $I$, we write $\prod_{i\in I} S_i$ for the set of all infinite cartesian products whose elements are of the form $(x_i)_{i \in I}$ where $x_i \in S_i$ for all $i \in I$. 
If $S_i = S_J = S$ for all $i,j \in I$, we simplify the notation to $S^{I}$.

## Set Identities
We will assume that the reader is familiar with the usual properties of set operations. We will list useful set identities used throughout the notes without proof.

### DeMorgan's Laws
- $(A \cup B)^c = A^c \cap B^c$
- $(A \cap B)^c = A^c \cup B^c$

### Distributive Property
- $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$
- $A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$

### Difference Identities
- $A \setminus B = A \cap B^c$
- $A \setminus B = A \setminus (A \cap B)$
- $A \setminus (B \cup C) = (A \setminus B) \cap (A \setminus C)$

### Decomposition
- $A = (A \setminus B) \sqcup (A \cap B)$
- For any sequence of sets $(A_n)$, 
$$
A_n = A_1 \cup \bigcup_{k=2}^n\left(A_k \setminus A_{k-1}\right)
$$ 
- For any sequence of sets $(A_n)$,  
$$\bigcup_{n=1}^{\infty} A_n = \bigsqcup_{n=1}^{\infty} \left(A_n \setminus \bigcup_{k<n} A_k\right)
$$ 

### Product Set Identities
- $(A \times B) \cap (C \times D) = (A \cap C) \times (B \cap D)$
- $(A \times B) \setminus (C \times D) = ((A \setminus C) \times B)\sqcup ((A \cap C) \times (B \setminus D))$

Many of these identities also hold for arbitrary unions and arbitrary intersections.  
For proofs of these results, see Halmos, *Naive Set Theory*, Chapters I–II.

---

## Semi-rings of Sets
Historically, measure theory did not begin with abstract collections of sets.
It began with concrete geometric problems: measuring lengths of intervals,
areas of planar regions, and volumes of solids.
In each case, one first understands how to assign size to very simple sets,
and only later extends this assignment to more complicated ones.

This philosophy persists in modern measure theory.
Rather than attempting to define a measure on all subsets of a space at once,
we begin with a small family of elementary sets on which the notion of size is
geometrically or probabilistically clear.
The purpose of a semi-ring is to axiomatize the minimal structure needed for
such elementary families.

## Definition: Semi-ring of sets 
A family of sets $\mathcal{S}\subset 2^\Omega$ is called a **semi-ring** if

1. $\varnothing\in\mathcal{S}$,
2. $A,B\in\mathcal{S}$ implies $A\cap B\in\mathcal{S}$,
3. $A,B\in\mathcal{S}$ implies  
   $$A\setminus B = \bigsqcup_{k=1}^n C_k$$
   for some $C_1,\dots,C_n\in\mathcal{S}$.

Informally, semi-rings are closed under intersection, and differences can be
broken into finitely many simple pieces.

### Example: Half-open intervals
Consider the set family of half-open intervals on $\R$.
$$
\mathcal{S}=\{(a,b]:a<b,\ a,b\in\R\}\cup\{\varnothing\}
$$
This family forms a semi-ring.
Half-open intervals serve as the quintessential example of an elementary family of sets that can be assigned a measure. 
Higher-dimensional analogues are obtained by taking Cartesian products,
yielding half-open rectangles in $\R^d$.

### Example: Finite products
If $\mathcal{S}_1,\dots,\mathcal{S}_d$ are semi-rings, then the family
$$
\mathcal{S}_1\times\cdots\times\mathcal{S}_d
=
\{A_1\times\cdots\times A_d : A_i\in\mathcal{S}_i\}
$$
is again a semi-ring.

This explains why rectangles built from half-open intervals serve as the
elementary sets for Euclidean space.

### Why infinite products require new ideas
In probability theory and statistical physics, one frequently studies systems
with infinitely many degrees of freedom: infinite sequences of coin flips,
time-indexed stochastic processes, or random fields.

These situations naturally lead to product spaces of the form
$$
\Omega=\prod_{i\in\Gamma}\Omega_i,
$$
where $\Gamma$ may be countable or uncountable.

A crucial observation is that most events of practical interest do not depend
on all coordinates at once.
Instead, they constrain only finitely many coordinates.
For example, in a sequence of coin flips, one can ask for the first ten flips
to follow a specified pattern, but not realistically prescribe the entire
infinite sequence.

This observation motivates the following class of sets.

### Example: Cylinder sets
Let $F\subset\Gamma$ be finite, and let $S_i\subset\Omega_i$ for $i\in F$.
Define

$$
C(F,(S_i)_{i\in F}) = \{x\in\Omega : x_i\in A_i \text{ for all } i\in F\}.
$$

Such a set is called a **cylinder set**.
Cylinder sets describe events that depend only on finitely many coordinates.
They form the natural starting point for constructing measures on infinite product spaces. 
The **family of all cylinder sets** where $S_i \in \mathcal{S}_i$ and $\mathcal{S}_i$ is a semi-ring is also a semi-ring. The proof of this fact is relegated to the exercises.

Cylinder sets will later play a central role in the study of product measures, stochastic processes, and modern limit theories for large combinatorial and geometric objects.

---
