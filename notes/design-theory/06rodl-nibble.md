---
title: The Rödl Nibble
parent: Design Theory
nav_order: 6
layout: default
has_toc: true
---

# The Rödl Nibble

## Motivation and the Nibble Algorithm

In the previous section, we translated design problems into matching problems in auxiliary hypergraphs.
The vertices of the auxiliary hypergraph represent constraints, and the edges represent allowable local choices.
A perfect matching chooses compatible local choices so that every constraint is satisfied exactly once.

For many design problems, finding a perfect matching directly is too difficult.
The Rödl nibble is a method for finding an **almost-perfect matching**.
In design language, this means that we build an **approximate design**: almost every constraint is satisfied exactly once.

The basic idea is a randomized greedy algorithm.
Instead of choosing one edge at a time, we choose many edges at once, but with very small probability.
Each round takes only a small bite out of the hypergraph, which is why the method is called the **nibble**.

A typical round looks like this.

1. Start with the current auxiliary hypergraph $H_i$.
2. Select each available edge independently with a small probability $p$.
3. Keep the selected edges that do not intersect any other selected edge.
4. Add these kept edges to the matching.
5. Delete all vertices covered by the kept edges.
6. Continue with the remaining hypergraph.

The probability $p$ must be small.
If $p$ is too large, too many selected edges will intersect, and most choices will be wasted.
If $p$ is small, then most selected edges are isolated among the selected edges, so many of them can safely be added to the matching.

The key point is that after one small bite, the remaining hypergraph should still look roughly regular.
Then the same argument can be repeated.
After many rounds, the matching covers almost all vertices.

The Rödl nibble works especially well in hypergraphs that are nearly regular and have small codegrees.
Nearly regular means that most vertices lie in roughly the same number of edges.
Small codegrees mean that two vertices rarely lie together in many edges.
These two properties imply that the random choices are spread out evenly and that local conflicts are limited.

For design theory, this is exactly the situation that appears in the auxiliary hypergraphs for Steiner systems.
Each constraint has many possible ways to be satisfied, and two different constraints usually do not share too many possible choices.

The Rödl nibble does not usually finish the problem.
It leaves behind a small set of uncovered vertices.
Translated back into design language, it leaves behind a small set of unsatisfied constraints.

This explains the role of absorption.
The nibble builds an approximate solution.
Absorption repairs the leftover.
Together, these two ideas form the basic modern strategy for proving design existence theorems.

## Probability Tools Used in the Nibble

The Rödl nibble is a probabilistic method, but the main goal is deterministic.
We want to prove that a large matching exists.
Randomness is used to show that a good sequence of choices is possible.

The following probability tools are the main ingredients.

### Linearity of Expectation

Linearity of expectation lets us compute the expected number of selected edges, conflicts, covered vertices, and surviving edges.

For example, if each edge is selected with probability $p$, then the expected number of selected edges is

$$
p|E(H)|.
$$

This does not require independence beyond knowing the individual probabilities.
Linearity of expectation gives the first approximation for what one round of the nibble should do.

### Concentration Inequalities

Expectation alone is not enough.
We need to know that random quantities are usually close to their expected values.

The most common concentration tools are Chernoff-type bounds.
These show that sums of many independent or nearly independent random variables are tightly concentrated around their mean.

In the nibble, concentration is used to show that after each round:

- the number of remaining vertices is close to its predicted value;
- most degrees are close to their predicted value;
- codegrees remain small;
- the remaining hypergraph is still pseudorandom.

Without concentration, the process might behave well on average but fail in a typical run.

### The Union Bound

The union bound is used to control many possible bad events at once.
For example, we may need to show that no vertex has degree much larger than expected, or that no pair of vertices has codegree much larger than expected.

If the probability of each bad event is very small, and the number of bad events is not too large, then the probability that any bad event occurs is still small.

This is one reason strong concentration inequalities are important.
They give error probabilities small enough to survive a union bound over all vertices, pairs, or small sets.

### Dependency Control

The random variables in the nibble are not completely independent.
Two edges interact if they share a vertex.
These dependencies are the main difficulty.

Small codegrees help control these dependencies.
If two vertices lie together in only a few edges compared to the typical degree, then local conflicts are rare.
This allows the random process to behave almost as if the relevant choices were independent.

This is why the degree and codegree hypotheses are central in nibble theorems.

### Martingales

In more advanced nibble arguments, martingales are used to prove concentration when the random variables are exposed step by step.

A martingale tracks a random process as information is gradually revealed.
Tools such as Azuma's inequality or Freedman's inequality show that if no single random choice can change the final outcome too much, then the outcome is concentrated.

Martingales are useful because the nibble has dependencies.
Even when ordinary Chernoff bounds are not directly applicable, martingale concentration can often replace them.

### Tracking the Random Process

The nibble evolves over many rounds.
Instead of analyzing each round separately from scratch, we track a few key quantities.

Typical quantities include:

- the number of uncovered vertices;
- the typical degree of a remaining vertex;
- the maximum codegree;
- the number of available edges.

The expected one-step changes often follow a simple pattern.
After rescaling, these changes can be approximated by differential equations.

The differential equation method says that the random process follows this deterministic trajectory with high probability.
This gives a clean way to understand the long-term behavior of the nibble.

For these notes, we will mostly use the differential equation method as intuition.
The important idea is that although the nibble is random, its large-scale behavior is predictable.

## Toy Example: Finding a Large Matching in a Regular Graph

Before studying matchings in hypergraphs, it is useful to look at the same idea for ordinary graphs.

Let $G$ be a $D$-regular graph on $n$ vertices.
We want to find a large matching in $G$.
A matching is a collection of edges no two of which share a vertex.

A greedy algorithm could choose one edge at a time.
The nibble idea is to choose many edges at once, but with small probability.

Fix a small constant $\varepsilon > 0$ and set

$$
p = \frac{\varepsilon}{D}.
$$

Now perform one random round.

1. Select each edge of $G$ independently with probability $p$.
2. Keep only the selected edges that do not share a vertex with any other selected edge.
3. Add the kept edges to the matching.
4. Delete the vertices covered by the kept edges.

The kept edges form a matching by construction.

Let us estimate how many edges survive.
A fixed edge $e=uv$ conflicts with every other edge incident to $u$ or $v$.
Since $G$ is $D$-regular, there are at most

$$
2D-2
$$

edges that conflict with $e$.

Thus the probability that $e$ is selected and no conflicting edge is selected is approximately

$$
p(1-p)^{2D-2}.
$$

Using $p=\varepsilon/D$, this is roughly

$$
\frac{\varepsilon}{D}e^{-2\varepsilon}.
$$

Since $G$ has

$$
\frac{Dn}{2}
$$

edges, the expected number of kept edges is roughly

$$
\frac{Dn}{2} \cdot \frac{\varepsilon}{D}e^{-2\varepsilon}
=
\frac{\varepsilon e^{-2\varepsilon}}{2}n.
$$

So one round covers a positive fraction of the vertices.

This is the basic nibble phenomenon.
A small random bite creates many compatible choices at once.

The parameter $p$ is important.
If $p$ is too large, too many selected edges collide.
If $p$ is too small, we do not make enough progress.
Choosing $p$ on the order of $1/D$ balances these two effects.

The real difficulty is not the first round.
The real difficulty is showing that after deleting the covered vertices, the remaining graph still has enough regularity to continue.

In very symmetric graphs, such as complete graphs, this is easy to believe.
After removing some vertices from $K_n$, the remaining graph is still complete.
But in a general graph or hypergraph, the leftover can become irregular.
The nibble method works by proving that, with high probability, the leftover remains sufficiently pseudorandom for many rounds.

## The Hypergraph Matching Theorem

The graph example captures the basic mechanism, but design theory naturally leads to hypergraphs.

The auxiliary hypergraph for a design is usually not a graph.
For example, the auxiliary hypergraph for a Steiner triple system has:

- vertices given by pairs of points;
- edges given by triples of points;
- each edge containing the three pairs inside a triple.

So it is a $3$-uniform hypergraph.

The relevant general theorem is a hypergraph matching theorem in the spirit of Pippenger and Spencer.

> **Informal Hypergraph Matching Theorem.**
> Fix $k$.
> Let $H$ be a large $k$-uniform hypergraph.
> Suppose:
>
> 1. $H$ is nearly regular;
> 2. every pair of vertices has codegree much smaller than the typical degree;
> 3. the typical degree is large.
>
> Then $H$ has a matching covering all but $o(|V(H)|)$ vertices.

Here **nearly regular** means that almost every vertex lies in approximately the same number of edges.

The **codegree** of two vertices $x,y \in V(H)$ is the number of edges containing both $x$ and $y$.
The small-codegree condition says that

$$
\Delta_2(H) = o(D),
$$

where $D$ is the typical vertex degree.

This condition is what prevents too many local conflicts.
If two vertices appear together in many edges, then random choices involving one vertex strongly affect choices involving the other.
Small codegrees keep these dependencies under control.

In design language, the theorem says:

> If every constraint has many possible local choices, and no two constraints are too strongly linked, then we can satisfy almost all constraints without conflict.

This is exactly what we need for approximate designs.