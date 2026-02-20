---
title: Sigma Algebras
parent: Measure Theory
nav_order: 1
---

# Section 1: $\sigma$-Algebras

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

Given a function $f:X\to Y$ and a set $A\subset Y$, the **pre-image** of $A$ under $f$ is

$$
f^{-1}(A) = \{x\in X : f(x)\in A\}.
$$

If $\mathcal{S}$ is a family of subsets of $Y$, we write

$$
f^{-1}(\mathcal{S}) = \{f^{-1}(A):A\in\mathcal{S}\}.
$$


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

$$
\bigcup_{n=1}^{\infty} A_n = \bigsqcup_{n=1}^{\infty} \left(A_n \setminus \bigcup_{k<n} A_k\right)
$$ 

### Product Set Identities
- $(A \times B) \cap (C \times D) = (A \cap C) \times (B \cap D)$
- $(A \times B) \setminus (C \times D) = ((A \setminus C) \times B)\sqcup ((A \cap C) \times (B \setminus D))$

### Pre-image Identities
Let $f:X\to Y$ be a function. Then

- $f^{-1}(A^c) = (f^{-1}(A))^c$
- $f^{-1}(A \cup B) = f^{-1}(A) \cup f^{-1}(B)$
- $f^{-1}(A \cap B) = f^{-1}(A) \cap f^{-1}(B)$
- $f^{-1}(A \setminus B) = f^{-1}(A) \setminus f^{-1}(B)$

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

A family of sets $\mathcal{S}\subset 2^\Omega$ is called a **semi-ring** if

- $\varnothing\in\mathcal{S}$,
- $A,B\in\mathcal{S}$ implies $A\cap B\in\mathcal{S}$,
- $A,B\in\mathcal{S}$ implies $A\setminus B = \bigsqcup_{k=1}^n C_k$ for some $C_1,\dots,C_n\in\mathcal{S}$.

Informally, semi-rings are closed under intersection, and differences can be
broken into finitely many simple pieces.

## Example: Half-open intervals
Consider the set family of half-open intervals on $\R$.

$$
\mathcal{S}=\{(a,b]:a<b,\ a,b\in\R\}\cup\{\varnothing\}
$$

This family forms a semi-ring.
Half-open intervals serve as the quintessential example of an elementary family of sets that can be assigned a measure. 
Higher-dimensional analogues are obtained by taking Cartesian products,
yielding half-open rectangles in $\R^d$.

## Example: Finite products
If $\mathcal{S}_1,\dots,\mathcal{S}_d$ are semi-rings, then the family

$$
\mathcal{S}_1\times\cdots\times\mathcal{S}_d
=
\{A_1\times\cdots\times A_d : A_i\in\mathcal{S}_i\}
$$

is again a semi-ring.

This explains why rectangles built from half-open intervals serve as the
elementary sets for Euclidean space.

## Why infinite products require new ideas
In probability theory and statistical physics, one frequently studies systems
with infinitely many degrees of freedom: infinite sequences of coin flips,
time-indexed stochastic processes, or random fields.
These situations naturally lead to product spaces of the form

$$
\Omega=\prod_{i\in\Gamma}\Omega_i
$$

where $\Gamma$ may be countable or uncountable.

A crucial observation is that most events of practical interest do not depend
on all coordinates at once.
Instead, they constrain only finitely many coordinates.
For example, in a sequence of coin flips, one can ask for the first ten flips
to follow a specified pattern, but not realistically prescribe the entire
infinite sequence.

This observation motivates the following class of sets.

## Example: Cylinder sets

Let $(\Omega_i)_{i \in I}$ be a (countable or uncountable) indexed collection of sets and consider the infinite product space

$$
\Omega = \prod_{i \in I} \Omega_i
$$

Let $F$ be a finite subset of $I$.
For each $i \in F$, choose a set $S_i \subset \Omega_i$.
The set

$$
\prod_{i \in F} S_i \times \prod_{i \in I \setminus F} \Omega_i
$$

is called a **cylinder set**.
Cylinder sets describe events that depend only on finitely many coordinates, and they form the natural starting point for constructing measures on infinite product spaces.

In addition, if each space $\Omega_i$ is equipped with a semi-ring $\mathcal{S}_i$, we restrict to cylinder sets for which $S_i \in \mathcal{S}_i$ for all $i \in F$.
The collection of all such cylinder sets will be denoted by $\mathrm{Cyl}$.

## Exercises

1. Show that the set of half-open intervals forms a semi-ring.

2. Show that the set of open intervals does not form a semi-ring.

3. Prove that the product of two semi-rings is a semi-ring. Conclude that half-open boxes in $\R^d$ form a semi-ring for any $d \geq 1$.

4. Let $\mathcal{S}$ be the semi-ring of half-open intervals. Show that the set $\mathcal{S}^{\N}$ is not a semi-ring.

5. Prove that any cylinder set can be written as the intersection of pre-images of sets.

6. Prove that the pre-image of a semi-ring is a semi-ring.
 
7. Use the facts above to show that $\mathrm{Cyl}$ is a semi-ring.

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
A\setminus B = A\cap B^c
$$

we see that algebras are closed under all finite set operations: unions, intersections, differences, and complements.

Every algebra is a semi-ring, but not every semi-ring is an algebra. For example, the family of half-open intervals is a semi-ring but not an algebra, since it is not closed under complements.

## Example: Finite–Cofinite Algebra

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

## Example: Trivial, Discrete, and Co-countable 
- The family $\{\varnothing,\Omega\}$ is called the **trivial** $\sigma$-algebra.

- The family $2^\Omega$ is called the **discrete** $\sigma$-algebra.

- Let $\Omega=\N$ and let $\mathcal{F}$ be the family of all **countable** and **co-countable** subsets of $\N$. 
Then $\mathcal{F}$ is a $\sigma$-algebra.
Indeed, complements of countable sets are co-countable and vice versa, and a countable union of countable sets is countable.

## Lemma: Pre-images of $\sigma$-algebras
Let $\mathcal{F}$ be a $\sigma$-algebra on $\Omega$. Suppose $f: X \to \Omega$ is any function. Then, $f^{-1}(\mathcal{F})$ is a $\sigma$-algebra on $X$.

### Proof.
See exercises.
$\blacksquare$

More sophisticated $\sigma$-algebras are typically constructed by specifying a generating family of sets and closing under countable operations.

---

## Generated Set Families
Many constructions in measure theory follow the same pattern: given a collection of sets, build the smallest structured family containing them. The key observation is that the classes of semi-rings, algebras, and $\sigma$-algebras are all stable under intersections. More precisely,

Let $I$ be an arbitrary indexing set.

- If each $\mathcal{S}_i$ is a semi-ring on $\Omega$, then $\bigcap_{i\in I}\mathcal{S}_i$ is a semi-ring on $\Omega$.
- If each $\mathcal{A}_i$ is an algebra on $\Omega$, then $\bigcap_{i\in I} \mathcal{A}_i$ is an algebra on $\Omega$.
- If each $\mathcal{F}_i$ is a $\sigma$-algebra on $\Omega$, then $\bigcap_{i\in I}\mathcal{F}_i$ is a $\sigma$-algebra on $\Omega$.

Proofs are routine and omitted. Stability under intersection guarantees that the following definitions of generated set families are well-founded.

Let $\mathcal{S}\subset 2^\Omega$.

- The **algebra generated by $\mathcal{S}$**, denoted $A(\mathcal{S})$, is

$$
A(\mathcal{S})=\bigcap\{\mathcal{A}:\mathcal{A}\text{ is an algebra on }\Omega\text{ containing }\mathcal{S}\}
$$

- The **$\sigma$-algebra generated by $\mathcal{S}$**, denoted $\sigma(\mathcal{S})$, is 

$$
\sigma(\mathcal{S})=\bigcap\{\mathcal{F}:\mathcal{F}\text{ is a }\sigma\text{-algebra on }\Omega\text{ containing }\mathcal{S}\}
$$

These definitions define generated set families using a "top-down" approach. There also exists an equivalent "bottom-up" approach to defining generated set families by recursively constructing a hierarchy of sets. A glimpse of this process will be presented by the most important $\sigma$-algebra, the Borel $\sigma$-algebra.

## Example: The Borel $\sigma$-algebra
On $\R$, consider the set of open intervals $\mathcal{I}$. 
The **Borel $\sigma$-algebra** (Borel sets), denoted $\mathcal{B}$ is the $\sigma$-algebra generated by open intervals.
Every set in $\mathcal{B}$ can be constructed using countably many unions or intersections of open intervals and closed intervals (any $\sigma$-algebra containing open sets must contain closed sets as well due to closure under complements.)
This observation leads to a hierarchy among sets in $\mathcal{B}$ depending upon how complex it is to construct the set.

The bottom of the hierarchy is given by open sets and closed sets. Countable unions of open sets produce open sets and countable intersections of closed sets produce closed sets, so we need to switch the operations to create something new. Let $G$ denote the open sets (in German open is gebiet) and let $F$ denote the closed sets (in French closed is fermee). We then use subscripts of $\sigma$ and $\delta$ to indicate countable unions and countable intersections. The second level of the Borel Hierarchy is given by

- $F_{\sigma}$: family of sets where each set is a countable union of closed sets.
- $G_{\delta}$: family of sets where each set is a countable intersection of open sets.

We then define the levels recursively by alternating operations. For example the third level of the Borel Hierarchy is given by

- $F_{\sigma \delta}$: family of sets where each set is a countable intersection of $F_{\sigma}$ sets.
- $G_{\delta \sigma}$: family of sets where each set is a countable union of $G_{\delta}$ sets.

This recursive structure allows for each level to be assigned some countable ordinal. This structure allows for proofs based on transfinite induction. The Borel Hierarchy gives a structured way to approximate complex sets by simpler sets.

The Borel hierarchy illustrates a recurring theme: complicated sets are built from simpler ones by iterating limits.
Much of modern analysis can be viewed as understanding which constructions preserve measurability and how convergence interacts with this hierarchy. We end this section by talking listing some important properties of generated $\sigma$-algebras.

## Lemma: Basic Properties of Generation
Let $\mathcal{S}, \mathcal{T} \subset 2^\Omega$.

- (Closure) $\mathcal{S} \subset A(\mathcal{S}) \subset \sigma(\mathcal{S})$

- (Monotonicity) If $\mathcal{S}\subset \mathcal{T}$, then $A(\mathcal{S})\subset A(\mathcal{T})$ and $\sigma(\mathcal{S})\subset \sigma(\mathcal{T})$.

- (Idempotence) $A(A(\mathcal{S}))=A(\mathcal{S})$ and $\sigma(\sigma(\mathcal{S}))=\sigma(\mathcal{S})$.

### Proof.
The proof is routine and will be omitted.

## Proposition: Pre-images Commute with $\sigma$-generation
Let $f: \Omega_1 \to \Omega_2$ be a function and suppose $\mathcal{S}$ is a family of sets on $\Omega_2$. Then,

$$
f^{-1}(\sigma(\mathcal{S}))=\sigma(f^{-1}(\mathcal{S}))
$$

### Proof.
By definition of a generated $\sigma$-algebra, $\mathcal{S} \subset \sigma(\mathcal{S})$. Since pre-images preserve inclusions

$$
f^{-1}(\mathcal{S}) \subset f^{-1}(\sigma(\mathcal{S}))
$$

Moreover, pre-images preserve the $\sigma$-algebra structure. 
Hence, $f^{-1}(\sigma(\mathcal{S}))$ is a $\sigma$-algebra containing $f^{-1}(\mathcal{S})$. 
By minimality of $\sigma(f^{-1}(\mathcal{S}))$, we can conclude

$$
\sigma(f^{-1}(\mathcal{S})) \subset f^{-1}(\sigma(\mathcal{S}))
$$

To prove the reverse inclusion, consider the set family

$$
\mathcal{A} \coloneqq \left\{B \subset \Omega_2: f^{-1}(B) \in \sigma(f^{-1}(\mathcal{S}))\right\}
$$

### Claim: $\mathcal{A}$ is a $\sigma$-algebra.
- Since $f^{-1}(\Omega_2) = \Omega_1 \in \sigma(f^{-1}(\mathcal{S}))$, we have $\Omega_2 \in \mathcal{A}$.

- Let $B \in \mathcal{A}$, so $f^{-1}(B) \in \sigma(f^{-1}(\mathcal{S}))$.
By closure under complements, 
$f^{-1}(B^c) = f^{-1}(B)^c \in \sigma(f^{-1}(\mathcal{S}))$.
Hence, $B^c \in \mathcal{A}$. 

- Let $(B_n)$ be a sequence in $\mathcal{A}$. Then, $\left(f^{-1}(B_n)\right)$ is a sequence in $\sigma(f^{-1}(\mathcal{S}))$. By closure under countable unions, $f^{-1}\left(\bigcup_{n=1}^{\infty} B_n\right) = \bigcup_{n=1}^{\infty} f^{-1}(B_n) \in \sigma(f^{-1}(\mathcal{S}))$. Hence, $\bigcup_{n=1}^{\infty} (B_n) \in \mathcal{A}$.

Thus, $\mathcal{A}$ is a $\sigma$-algebra on $\Omega_2$.
$\square$

By definition of $\sigma(\mathcal{S})$, $\sigma(\mathcal{S}) \subset \mathcal{A}$. 
Since pre-images preserve inclusions,

$$
f^{-1}(\sigma(\mathcal{S})) \subset f^{-1}(\mathcal{A}) \subset \sigma(f^{-1}(\mathcal{S}))
$$

where the last inclusion follows from the definition of $\mathcal{A}$. Since we have shown both inclusions, we conclude that $f^{-1}(\sigma(\mathcal{S})) = \sigma(f^{-1}(\mathcal{S}))$.
$\blacksquare$

## Exercises
8. Let $f:X\to\Omega$ be a function and let $\mathcal{F}$ be a $\sigma$-algebra on $\Omega$. Prove that $f^{-1}(\mathcal{F})$ is a $\sigma$-algebra on $X$.

9. Show that the intersection of an arbitrary family of $\sigma$-algebras on $\Omega$ is again a $\sigma$-algebra.

10. Give an example of a countable family of sets $\mathcal{S}$ such that $\sigma(\mathcal{S})$ is uncountable.

11. A **partition** of $\Omega$ is a family of pairwise disjoint sets $(A_i)_{i\in I}$ such that

$$
\bigsqcup_{i\in I}A_i=\Omega$
$$

Show that the following family is a $\sigma$-algebra:

$$
\mathcal{F}=\left\{\bigcup_{i\in J}A_i: J \subset I\right\}
$$
