---
title: σ-Algebras
parent: Measure Theory
nav_order: 1
---

# Section 1: Semi-Rings, Algebras, and $\sigma$-Algebras

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
3. $A,B\in\mathcal{S}$ implies $A\setminus B = \bigsqcup_{k=1}^n C_k$ for some $C_1,\dots,C_n\in\mathcal{S}$.

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

### Exercises

1. Show that the set of half-open intervals forms a semi-ring.

2. Show that the set of open intervals does not form a semi-ring.

3. Prove that the product of two semi-rings is a semi-ring. 
Use this fact to show that half-open boxes in $\R^d$ form a semi-ring for any $d\ge1$.

4. Let $\mathcal{S}$ be the semi-ring of half-open intervals. 
Show that the set of pure infinite products $\prod_{i\in\N} A_i$ with $A_i\in\mathcal{S}$ need not form a semi-ring.

5. Let $\Omega=\prod_{i\in\Gamma}\Omega_i$. 
Show that any cylinder set can be written as a finite intersection of sets of the form $\pi_i^{-1}(A)$.

6. Show that if $\mathcal{S}$ is a semi-ring and $f:X\to Y$ is a function, then the family $\{f^{-1}(A):A\in\mathcal{S}\}$ is a semi-ring on $X$. 
Use this fact to conclude that cylinder sets built from semi-rings form a semi-ring in $\prod_{i\in\Gamma}\Omega_i$.

---

## From Semi-rings to Algebras

Semi-rings model elementary building blocks: simple sets whose geometry we understand and on which size can be assigned directly. However, most sets of interest are formed by combining such building blocks.

To support these constructions, we would like a family of sets that is stable under all usual finite set operations: unions, intersections, differences, and complements. This leads to the notion of an algebra of sets.

In the literature, families closed under unions and differences are often called rings of sets, and families additionally containing the whole space and closed under complements are called algebras or fields of sets. This terminology reflects the algebraic interpretation of set families as Boolean rings.

## Algebras of Sets

An **algebra (field) of sets** $\mathcal{A}$ is a collection of subsets of $\Omega$ such that

- $\Omega \in \mathcal{A}$,
- $\mathcal{A}$ is closed under complements,
- $A,B\in\mathcal{A}$ implies $A\cup B\in\mathcal{A}$.

Using the identities

$$
A\cap B = (A^c\cup B^c)^c,
\qquad
A\setminus B = A\cap B^c,
$$

we see that algebras are closed under all finite set operations: unions, intersections, differences, and complements.

Every algebra is a semi-ring, but not every semi-ring is an algebra. For example, the family of half-open intervals is a semi-ring but not an algebra, since it is not closed under complements.

### Example: Finite–Cofinite Algebra

Let $\Omega=\N$ and let $\mathcal{A}$ be the family of all **finite** and **cofinite** subsets of $\N$. That is,

$$
\mathcal{A} = \{A\subset\N : A \text{ is finite or } A^c \text{ is finite}\}.
$$

Then $\mathcal{A}$ is an algebra: it is closed under complements and finite unions.

## $\sigma$-Algebras
Algebras are sufficient for defining finitely additive set functions. However, to support limits, infinite sums, and convergence arguments, we must work with set families that are closed under **countable** operations. This leads to the central notion of a $\sigma$-algebra.

A **$\sigma$-algebra** (or $\sigma$-field) is a family of sets $\mathcal{F}$ such that

- $\Omega \in \mathcal{F}$,
- $\mathcal{F}$ is closed under complements,
- $\mathcal{F}$ is closed under countable unions.

Using De Morgan’s laws, it follows that $\sigma$-algebras are also closed under countable intersections and relative complements.

The defining feature of a $\sigma$-algebra is closure under **countable combinations of the usual set operations**. In other words, whenever a set can be constructed from elements of $\mathcal{F}$ using countably many unions, intersections, and complements, the resulting set still belongs to $\mathcal{F}$.

It is precisely this passage from finite to countable operations that allows us to define infinite sums of sizes, take limits of increasing or decreasing sequences of sets, and eventually exchange limits with integrals. $\sigma$-algebras are therefore the minimal environment in which a theory of integration, probability, and convergence can live.

Every $\sigma$-algebra is an algebra, and every algebra is a semi-ring. Thus, we have the inclusion chain

$$
\sigma\text{-algebras} \subset \text{algebras} \subset \text{semi-rings}.
$$

Moreover, each inclusion is strict. The finite–cofinite algebra is not a $\sigma$-algebra, since the set of even integers is a countable union of singleton sets and hence would have to belong to the algebra if it were a $\sigma$-algebra, but it is neither finite nor cofinite.

### Example: Trivial, Discrete, and Co-countable 
1. The families $\{\varnothing,\Omega\}$ and $2^\Omega$ are $\sigma$-algebras. 
The first is called the **trivial $\sigma$-algebra**, and the second is called the **discrete $\sigma$-algebra**.

2. Let $\Omega=\N$ and let $\mathcal{F}$ be the family of all **countable** and **co-countable** subsets of $\N$. 
Then $\mathcal{F}$ is a $\sigma$-algebra.
Indeed, complements of countable sets are co-countable and vice versa, and a countable union of countable sets is countable.

More sophisticated $\sigma$-algebras are typically constructed by specifying a generating family of sets and closing under countable operations.
