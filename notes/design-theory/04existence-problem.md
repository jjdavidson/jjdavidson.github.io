---
title: The Existence Problem
parent: Design Theory
nav_order: 4
layout: default
has_toc: true
---

# History of the Existence Problem

As we saw before, $(n,q,r)$-Steiner systems correspond to $K_q^{(r)}$-decompositions of $K_n^{(r)}$. 
By exploring the $i$-degrees of Steiner system, we were able to come up with the following divisibility conditions:

$$
\binom{q-i}{r-i} \text{ divides } \binom{n-i}{r-i}
$$

for $0 \leq i \leq r$. We say that a tuple of integers $(n,q,r)$ is **admissible**, if they satisfy the divisibility conditions.
In the last section, we reproved the Kirkman's theorem
> **Theorem** (Kirkman 1847) If $(n,3,2)$ is admissible, then there exists an $(n,3,2)$-Steiner system.

We are immediately confronted with two questions:
1. How many Steiner triple systems exists for each admissible $(n,3,2)$?
2. Do $(n,q,r)$-Steiner systems exist for each admissible $(n,q,r)$?

For now, we will focus on the second question, and we will return to the first question later. 

Haim Hanani pioneered the first major generalizations of the existence problem in the 1950s and early 1960s.
His work pushed the explicit and recursive methods much further than the classical Steiner triple system constructions.

The next natural case after Steiner triple systems is the case of Steiner quadruple systems.
These are $(n,4,3)$-Steiner systems.
Equivalently, every triple of points is contained in exactly one block of size $4$.

> **Theorem** (Hanani 1960) If $(n,4,3)$ is admissible, then there exists an $(n,4,3)$-Steiner system.

In this case, the divisibility conditions reduce to

$$
n \equiv 2,4 \pmod{6}.
$$

Hanani's proof was a major achievement.
It showed that the success of Kirkman's theorem was not just a coincidence of triples and graphs.
The obvious divisibility conditions could also be sufficient for a genuinely higher-dimensional design problem.

Hanani also developed important recursive tools for pairwise balanced designs and group divisible designs.
These methods became part of the basic toolkit of design theory.
They allow one to build large designs from smaller designs by replacing points or groups with more complicated local structures.

However, this style of proof becomes harder and harder to manage.
As the parameters grow, the number of special cases and seed configurations grows quickly.
The constructions become less like a single clean formula and more like a large recursive machine.

This led to a shift in perspective.
Instead of trying to solve each admissible parameter set by hand, one can ask for an asymptotic theorem.

In 1975, Richard Wilson proved the decisive theorem for pair designs.

> **Theorem** (Wilson 1975) Fix $q$ and $\lambda$.
> There exists $n_0$ such that if $n > n_0$ and the divisibility conditions for an $(n,q,2,\lambda)$-design hold, then an $(n,q,2,\lambda)$-design exists.

For Steiner systems, this implies an asymptotic theorem for $(n,q,2)$-Steiner systems.

> **Corollary** For fixed $q$, there exists $n_0$ such that if $n > n_0$ and $(n,q,2)$ is admissible, then there exists an $(n,q,2)$-Steiner system.

In decomposition language, Wilson's theorem says that the complete graph $K_n$ can be decomposed into copies of $K_q$ whenever the obvious divisibility conditions hold and $n$ is sufficiently large.

This was a major conceptual breakthrough.
The theorem does not give a simple formula for every block.
Instead, it proves that for large enough $n$, the local divisibility conditions force the global design to exist.

This suggested a broad principle:

> For fixed local parameters, the obvious divisibility conditions should be sufficient for all sufficiently large admissible $n$.

For pair designs, Wilson proved this principle.
For higher-dimensional Steiner systems, the problem remained open.

The difficulty is that an $(n,q,r)$-Steiner system with $r \geq 3$ is a hypergraph decomposition problem.
It asks for a decomposition of the complete $r$-uniform hypergraph $K_n^{(r)}$ into copies of $K_q^{(r)}$.
Moreover, graphs have many useful tools that do not generalize cleanly to hypergraphs.
For example, in a graph decomposition, the objects being covered are edges.
In a hypergraph decomposition, the objects being covered are $r$-sets, and the blocks overlap in more complicated ways.

A natural intermediate goal is to build an approximate design.
That is, instead of covering every $r$-set exactly once, we try to cover almost every $r$-set exactly once.
This was the content of the **Erdős-Hanani conjecture**.

Rödl proved this conjecture in 1985 using what is now called the **Rödl nibble**.
The Rödl nibble is a randomized greedy method.
Instead of choosing blocks one at a time, it repeatedly chooses many blocks at random while carefully avoiding conflicts.
At each step, it only takes a small bite out of the remaining problem.
After many steps, almost all $r$-sets are covered.

This was another major shift in viewpoint.
It showed that approximate designs are much easier to obtain than exact designs.
Randomness can get very close to a full decomposition.
The problem is the leftover.
The Rödl nibble usually leaves behind a small set of uncovered $r$-sets.
This leftover is too sparse and irregular to handle by the same random greedy method.

Thus the modern existence problem separates into two parts.

1. Build an approximate decomposition.
2. Repair the leftover.

Keevash solved the full existence problem for designs in 2014.

> **Theorem** (Keevash 2014) Fix $q,r,\lambda$ with $q \geq r$.
> There exists $n_0$ such that if $n > n_0$ and the divisibility conditions for an $(n,q,r,\lambda)$-design hold, then an $(n,q,r,\lambda)$-design exists.

In particular, for fixed $q$ and $r$, every sufficiently large admissible $(n,q,r)$ has an $(n,q,r)$-Steiner system.
This completed the asymptotic existence problem for Steiner systems.
It showed that the divisibility conditions really are sufficient once $n$ is large enough.

Keevash's proof used modern probabilistic and algebraic ideas.
Very roughly, the proof first builds an approximate design and then uses carefully constructed algebraic gadgets to absorb or repair the leftover.

For these notes, the most important lesson is not only the theorem itself.
The important lesson is the strategy.
To prove a design exists, we do not try to write down the blocks directly.
Instead, 
1. Translate the design problem into a matching problem in an auxiliary hypergraph.
2. Use probabilistic methods to find an almost-perfect matching.
3. Use absorption to complete the matching.

After Keevash's proof, Glock, Kühn, Lo, and Osthus gave a new proof using **iterative absorption**.
This proof is more directly combinatorial.
It repeatedly reduces the leftover until it is small and structured enough to absorb.
More recently, **refined absorption** has given another framework for proving design existence theorems.
The common theme is that exact decomposition problems are handled by combining approximate decompositions with a carefully prepared absorbing structure.

This is the path we will follow next.
First, we will translate designs and decompositions into perfect matching problems in auxiliary hypergraphs.
Then we will study the Rödl nibble as a tool for approximate decompositions.
After that, we will study absorption, iterative absorption, and refined absorption as tools for finishing the leftover.

## Sources and Further Reading

The historical overview above is based on the following sources.

### Classical Design Theory

- Thomas P. Kirkman, "On a Problem in Combinations," *Cambridge and Dublin Mathematical Journal*, 2 (1847), 191--204.

- Haim Hanani, "On Quadruple Systems," *Canadian Journal of Mathematics*, 12 (1960), 145--157. [DOI](https://doi.org/10.4153/CJM-1960-013-3)

- Haim Hanani, "The Existence and Construction of Balanced Incomplete Block Designs," *Annals of Mathematical Statistics*, 32 (1961), 361--386.

- Haim Hanani, "On Some Tactical Configurations," *Canadian Journal of Mathematics*, 15 (1963), 702--722. [DOI](https://doi.org/10.4153/CJM-1963-069-5)

- Paul Erdős and Haim Hanani, "On a Limit Theorem in Combinatorial Analysis," *Publicationes Mathematicae Debrecen*, 10 (1963), 10--13.

- Richard M. Wilson, "An Existence Theory for Pairwise Balanced Designs, III: Proof of the Existence Conjectures," *Journal of Combinatorial Theory, Series A*, 18 (1975), 71--79. [DOI](https://doi.org/10.1016/0097-3165(75)90067-9)

### Approximate Designs and the Rödl Nibble

- Vojtěch Rödl, "On a Packing and Covering Problem," *European Journal of Combinatorics*, 6 (1985), 69--78. [DOI](https://doi.org/10.1016/S0195-6698(85)80023-8)

### Modern Existence Theorems

- Peter Keevash, "The Existence of Designs," arXiv:1401.3665. [arXiv](https://arxiv.org/abs/1401.3665)

- Stefan Glock, Daniela Kühn, Allan Lo, and Deryk Osthus, "The Existence of Designs via Iterative Absorption: Hypergraph $F$-Designs for Arbitrary $F$," *Memoirs of the American Mathematical Society*, 284 (2023). [arXiv](https://arxiv.org/abs/1611.06827)

- Michelle Delcourt and Luke Postle, "Refined Absorption: A New Proof of the Existence Conjecture," arXiv:2402.17855. [arXiv](https://arxiv.org/abs/2402.17855)

### General References

- Charles J. Colbourn and Jeffrey H. Dinitz, editors, *Handbook of Combinatorial Designs*, Second Edition, Chapman and Hall/CRC, 2006.

- Charles C. Lindner and Christopher A. Rodger, *Design Theory*, Second Edition, Chapman and Hall/CRC, 2008.