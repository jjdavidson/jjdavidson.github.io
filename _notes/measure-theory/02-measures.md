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
The limit of the increasing sequence, denoted $A_n \nearrow A$, is defined to be 

$$
A=\bigcup_{n=1}^\infty A_n
$$

- A sequence $(A_n)$ is **decreasing** if $A_n \supset A_{n+1}$ for all $n \in \N$.
The limit of the decreasing sequence, denoted $A_n \searrow A$, is defined to be 

$$
A=\bigcap_{n=1}^\infty A_n
$$

Increasing sequences represent approximation from below: each stage enlarges the set by adding finer detail. Decreasing sequences represent approximation from above: each stage removes excess portions and refines the set inward.

Suppose $(A_n)$ is increasing such that $A_n \nearrow A$.
Using set identities, we may write

$$
A=A_1 \sqcup (A_2\setminus A_1) \sqcup (A_3\setminus A_2)\sqcup \dots
$$

a countable disjoint union arising from successive refinements. Countable additivity then implies

$$
\mu(A)=\sum_{n=1}^\infty \mu(A_n\setminus A_{n-1})=\lim_{n\to\infty}\mu(A_n)
$$

Thus, countable additivity guarantees stability under increasing limits, a property known as continuity from below. Finite additivity alone does not ensure this limit identity.

Decreasing sequences require complements. If $(A_n)$ is decreasing and $A_n \searrow A$, then DeMorgan's law imply $A^c_n \nearrow A^c$
Thus stability under decreasing limits depends on closure under complements together with closure under countable unions. Under appropriate finiteness assumptions, this leads to continuity from above.

The analytic demand that measure behaves consistently under monotone limits leads to requring two structural properties:
- closure under countable unions,
- closure under complements.

Collections of sets satisfying these properties are precisely $\sigma$-algebras. Countable additivity governs infinite decomposition, and $\sigma$-algebras provide the structural environment in which such decompositions are well defined.

## Measurable Spaces and Measures

We now formalize the structures motivated in the previous section.

A **measurable space** is a pair $(\Omega,\mathcal{F})$ where $\Omega$ is a set and $\mathcal{F}$ is a $\sigma$-algebra of subsets of $\Omega$. 
The sets in $\mathcal{F}$ are called **measurable sets**.

The $\sigma$-algebra encodes the structural requirement that the collection of sets be stable under complements and countable unions, and hence under monotone limits.

Let $(\Omega,\mathcal{F})$ be a measurable space. A function $\mu:\mathcal{F}\to[0,\infty]$ is called a **measure** if:
- $\mu(\varnothing)=0$,
- For every sequence of pairwise disjoint sets $(A_n)_{n=1}^\infty$ in $\mathcal{F}$, we have 

$$
\mu\left(\bigcup_{n=1}^\infty A_n\right)=\sum_{n=1}^\infty \mu(A_n)
$$

The second condition is called **countable additivity** or **$\sigma$-additivity**.

A **measure space** is a triple $(\Omega,\mathcal{F},\mu)$ consisting of a measurable space $(\Omega,\mathcal{F})$ together with a measure $\mu$ on $\mathcal{F}$.
We now consider several fundamental examples.

## Example: The Dirac Measure

Let $\Omega$ be any set and fix a point $x_0\in\Omega$. The **Dirac measure at $x_0$**, denoted $\delta_{x_0}$, is defined by

$$
\delta_{x_0}(A)=\begin{cases}1 & \text{if } x_0\in A,\\ 0 & \text{if } x_0\notin A.\end{cases}
$$

It is straightforward to verify that $\delta_{x_0}$ is a measure on any measurable space $(\Omega,\mathcal{F})$.
The Dirac measure concentrates all mass at a single point. It plays a central role in probability theory and in the study of weak convergence of measures.

## Example: The Counting Measure

Let $\Omega$ be any set and let $\mathcal{F}=2^\Omega$. The **counting measure** $\mu$ is defined by

$$
\mu(A)=\begin{cases}|A| & \text{if } A \text{ is finite},\\ \infty & \text{if } A \text{ is infinite},\end{cases}
$$

where $|A|$ denotes the cardinality of $A$. 
If $\Omega$ is a finite set, we can renormalize the counting measure by defining

$$
p(A)=\frac{|A|}{|\Omega|}
$$

This measure coincides with a **uniform probability measure** on a finite discrete set. We will now record some important properties of measures.

## Proposition (Monotonicity)

Let $(\Omega,\mathcal{F},\mu)$ be a measure space. If $A,B\in\mathcal{F}$ and $A\subset B$, then $\mu(A)\le\mu(B)$.

### Proof

Since $A\subset B$, we may write $B=A\cup(B\setminus A)$ as a disjoint union. By countable additivity,

$$
\mu(B)=\mu(A)+\mu(B\setminus A)
$$

Since $\mu(B\setminus A)\ge0$, it follows that $\mu(A)\le\mu(B)$. $\blacksquare$

## Proposition (Countable Subadditivity)

Let $(\Omega,\mathcal{F},\mu)$ be a measure space. For any sequence $(A_n)_{n=1}^\infty$ in $\mathcal{F}$,

$$
\mu\left(\bigcup_{n=1}^\infty A_n\right)\le\sum_{n=1}^\infty \mu(A_n)
$$

### Proof

Define $B_1=A_1$ and for $n\ge2$ let $B_n=A_n\setminus\bigcup_{k=1}^{n-1}A_k$. Then the sets $B_n$ are pairwise disjoint and $\bigcup_{n=1}^\infty A_n=\bigcup_{n=1}^\infty B_n$. By countable additivity,

$$
\mu\left(\bigcup_{n=1}^\infty A_n\right)=\sum_{n=1}^\infty \mu(B_n)
$$

Since $B_n\subset A_n$, monotonicity implies $\mu(B_n)\le\mu(A_n)$ for each $n$, and the result follows. $\blacksquare$

## Proposition (Measure of Differences)

Let $(\Omega,\mathcal{F},\mu)$ be a measure space. If $A,B\in\mathcal{F}$ with $A\subset B$ and $\mu(A)<\infty$, then

$$
\mu(B\setminus A)=\mu(B)-\mu(A)
$$

### Proof

Since $B=A\cup(B\setminus A)$ is a disjoint union, countable additivity yields

$$
\mu(B)=\mu(A)+\mu(B\setminus A)
$$

Because $\mu(A)<\infty$, subtraction gives the desired identity.
$\blacksquare$

## Proposition (Null Sets Are Hereditary)

Let $(\Omega,\mathcal{F},\mu)$ be a measure space. If $N\in\mathcal{F}$ satisfies $\mu(N)=0$ and $A\subset N$ with $A\in\mathcal{F}$, then $\mu(A)=0$.

### Proof

By monotonicity, $\mu(A)\le\mu(N)=0$. Since measures are nonnegative, $\mu(A)=0$. $\blacksquare$

## Proposition (Continuity from Below)

Let $(\Omega,\mathcal{F},\mu)$ be a measure space. If $(A_n)$ is an increasing sequence in $\mathcal{F}$ and $A_n \nearrow A$, then
$$\mu(A)=\lim \mu(A_n).$$

### Proof

Define $B_1=A_1$ and for $n\ge2$ let $B_n=A_n\setminus A_{n-1}$. Then the sets $B_n$ are pairwise disjoint and $A=\bigcup_{n=1}^\infty B_n$. By countable additivity,

$$
\mu(A)=\sum_{n=1}^\infty \mu(B_n)
$$

For each $n$,

$$
\mu(A_n)=\sum_{k=1}^n \mu(B_k)
$$

Thus $\mu(A_n)$ is an increasing sequence whose limit equals $\sum_{n=1}^\infty \mu(B_n)=\mu(A)$.
$\blacksquare$

## Proposition (Continuity from Above)

Let $(\Omega,\mathcal{F},\mu)$ be a measure space. If $(A_n)$ is a decreasing sequence in $\mathcal{F}$ with $\mu(A_1)<\infty$ and $A_n \searrow A$, then

$$
\mu(A)=\lim_{n\to\infty}\mu(A_n)
$$

### Proof

Define $B_n=A_1\setminus A_n$. Then $(B_n)$ is increasing and

$$
\bigcup_{n=1}^\infty B_n=A_1\setminus A
$$

By continuity from below,

$$
\mu(A_1\setminus A)=\lim_{n\to\infty}\mu(A_1\setminus A_n)
$$

Since $\mu(A_1)<\infty$, we may use the difference formula to obtain

$$
\mu(A_1\setminus A_n)=\mu(A_1)-\mu(A_n)
$$

$$
\mu(A_1\setminus A)=\mu(A_1)-\mu(A)
$$

Taking limits yields $\mu(A)=\lim \mu(A_n)$.
$\blacksquare$