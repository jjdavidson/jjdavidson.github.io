---
title: Measures
parent: Measure Theory
nav_order: 2
---

# Basic Properties of Measures

## What is Measure?

Our notion of measure originates in geometry. We seek to assign length, area, or volume to complicated shapes in a way that is consistent with physical intuition. From geometric experience, several fundamental properties emerge:

- Nonnegativity  
- Monotonicity  
- Euclidean invariance  
- Decomposability  

These principles guide the abstract axioms of measure theory.

### Nonnegativity

A measure should never assign a negative value to a set. Geometrically, physical objects have either positive size or zero size. For example, the volume of the unit cube is 1, while the volume of one of its faces is 0.

Later in the theory we will consider signed measures, where negative values are permitted. For instance, in Riemann integration the “area under a curve” may be positive or negative depending on its position relative to the $x$-axis. However, the foundational theory begins with nonnegative measures.

### Monotonicity

If one set is contained in another, its measure should not exceed that of the larger set. That is, whenever $A \subset B$, we expect $\mu(A) \leq \mu(B)$.

Monotonicity formalizes the idea that enlarging a set cannot decrease its size. This property will play an important role later when we construct Lebesgue measure via outer approximations.

### Euclidean Invariance

In classical geometry, length, area, and volume are invariant under rigid motions such as translations and rotations. A translated or rotated object retains the same size.

While this symmetry is essential in the construction of Lebesgue measure, measure theory itself is far more general. Many measure spaces are not geometric and need not respect Euclidean invariance. Nevertheless, invariance principles often serve as guiding structural constraints.

### Decomposability

Perhaps the most fundamental property is decomposability: a complicated set can be partitioned into simpler pieces whose measures are easier to compute. The measure of the whole should equal the sum of the measures of its parts.

The Riemann integral, for example, is defined by decomposing an interval into finitely many subintervals and summing the contributions from each piece. To formalize this idea, we distinguish between finite and countable additivity.

A set function $\mu$ is **finitely additive** if $$\mu(A \sqcup B)=\mu(A)+\mu(B)$$
A set function $\mu$ is **countably additive** if for every sequence of pairwise disjoint sets $(A_n)_{n=1}^\infty$, we have $$\mu\left(\bigcup_{n=1}^\infty A_n\right)=\sum_{n=1}^\infty \mu(A_n)$$

Finite additivity guarantees additivity for a single fixed partition. However, many analytic constructions involve infinite refinement, a sequence of partitions.

## Monotone Limits of Sets

- A sequence $(A_n)$ is **increasing** if $A_n \subset A_{n+1}$ for all $n \in \N$. 
The limit of the increasing sequence, denoted $A_n \nearrow A$, is defined to be $$A=\bigcup_{n=1}^\infty A_n$$
- A sequence $(A_n)$ is **decreasing** if $A_n \supset A_{n+1}$ for all $n \in \N$.
The limit of the decreasing sequence, denoted $A_n \searrow A$, is defined to be $$A=\bigcap_{n=1}^\infty A_n$$

Increasing sequences represent approximation from below: each stage enlarges the set by adding finer detail. Decreasing sequences represent approximation from above: each stage removes excess portions and refines the set inward.

Suppose $(A_n)$ is increasing such that $A_n \nearrow A$.
Using set identities, we may write
$$A=A_1 \sqcup (A_2\setminus A_1) \sqcup (A_3\setminus A_2)\sqcup \dots$$
a countable disjoint union arising from successive refinements. Countable additivity then implies
$$\mu(A)=\sum_{n=1}^\infty \mu(A_n\setminus A_{n-1})=\lim_{n\to\infty}\mu(A_n).$$
Thus countable additivity guarantees stability under increasing limits, a property known as continuity from below. Finite additivity alone does not ensure this limit identity.

Decreasing sequences require complements. If $(A_n)$ is decreasing and $A_n \searrow A$, then DeMorgan's law imply $A^c_n \nearrow A^c$
Thus stability under decreasing limits depends on closure under complements together with closure under countable unions. Under appropriate finiteness assumptions, this leads to continuity from above.

The analytic demand that measure behaves consistently under monotone limits leads to requring two structural properties:
- closure under countable unions,
- closure under complements.

Collections of sets satisfying these properties are precisely $\sigma$-algebras. Countable additivity governs infinite decomposition, and $\sigma$-algebras provide the structural environment in which such decompositions are well defined.