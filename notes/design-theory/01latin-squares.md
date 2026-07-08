---
title: Latin Squares
parent: Design Theory
nav_order: 1
layout: default
has_toc: true
---

# Latin Square Designs

These notes begin with Latin squares and their higher-dimensional analogues.
The main goal is to view Latin squares not only as arrays, but equivalently as colorings and decompositions of other combinatorial objects.

## Latin Squares

A **Latin square of order** $n$ is an $n \times n$ array filled with $n$ symbols such that each symbol appears exactly once in every row and exactly once in every column.
For example, the addition table of $\mathbb{Z}_3$ is a Latin square.

$$
\begin{array}{c|ccc}
    + & 0 & 1 & 2 \\ \hline
    0 & 0 & 1 & 2 \\
    1 & 1 & 2 & 0 \\
    2 & 2 & 0 & 1
\end{array}
$$

The Latin square condition says that every row is a permutation of the symbols and every column is a permutation of the symbols.
Equivalently, a Latin square can be described by a function $L : X \times Y \to Z$ where $|X|=|Y|=|Z|=n$, and where the following two conditions hold.

1. For every fixed $x \in X$, the map $y \mapsto L(x,y)$ is a bijection from $Y$ to $Z$.
2. For every fixed $y \in Y$, the map $x \mapsto L(x,y)$ is a bijection from $X$ to $Z$.

In the example above, we have

$$L(x,y)=x+y$$

where addition is taken modulo $3$.

## Latin Squares and Quasigroups

Latin squares can also be viewed as multiplication tables of more general algebraic objects.
A **quasigroup** is a tuple $(Q,\star)$ where $Q$ is a set and $\star : Q \times Q \to Q$ such that for every $a,b \in Q$, both equations

$$
a \star x = b
$$

and

$$
y \star a = b
$$

have unique solutions $x,y \in Q$.
This condition is exactly the Latin square condition where we require the maps $x \mapsto a \star x$ and $y \mapsto y \star a$ to be bijections.

Groups are special examples of quasigroups.
If $G$ is a group and we define

$$
L(x,y)=xy,
$$

then every row and every column of the Cayley table is a permutation of $G$.
Therefore the Cayley table of every finite group is a Latin square.

The group axioms give more structure than the Latin square condition requires.
A quasigroup does not need to have an identity element, and it does not need to be associative.
For example, define an operation on $\mathbb{Z}_3$ by

$$
x \star y = x-y.
$$

The corresponding Latin square is

$$
\begin{array}{c|ccc}
    \star & 0 & 1 & 2 \\ \hline
    0 & 0 & 2 & 1 \\
    1 & 1 & 0 & 2 \\
    2 & 2 & 1 & 0
\end{array}
$$

Each row and each column contains $0,1,2$ exactly once, so this is a Latin square.
However, this operation is not a group operation.
For instance, there is no two-sided identity element, so Latin squares are more general than group tables.
A group table is a highly structured Latin square, while an arbitrary Latin square only needs the row and column permutation property.

## Latin Squares as Bipartite Edge-Colorings

Latin squares can be viewed as edge-colorings of complete bipartite graphs.
Let $R$, $C$, and $S$ be sets of size $n$.
We think of $R$ as the set of rows, $C$ as the set of columns, and $S$ as the set of symbols.
Consider the complete bipartite graph $K_{R,C}$.
The vertices are the elements of $R \cup C$, and every row vertex $r \in R$ is connected to every column vertex $c \in C$.

A Latin square $L : R \times C \to S$ gives an edge-coloring of $K_{R,C}$ by coloring the edge $rc$ with the symbol $L(r,c)$.
The Latin square condition says exactly that this edge-coloring is proper.
Indeed, fixing a row $r \in R$, the edges incident to $r$ are

$$
\{\{r,c\} : c \in C\}.
$$

The colors on these edges are precisely the symbols appearing in row $r$.
Since every symbol appears exactly once in row $r$, these $n$ incident edges receive all $n$ colors exactly once.
Similarly, fixing a column $c \in C$, the edges incident to $c$ are

$$
\{\{r,c\} : r \in R\}.
$$

The colors on these edges are precisely the symbols appearing in column $c$.
Since every symbol appears exactly once in column $c$, these $n$ incident edges receive all $n$ colors exactly once.
Therefore no two adjacent edges receive the same color.

Conversely, suppose we have a proper edge-coloring of $K_{R,C}$ using the colors in $S$.
For each row $r \in R$ and column $c \in C$, define

$$
L(r,c)=\operatorname{color}(\{r,c\}).
$$

Because the coloring is proper and each vertex has degree $n$, the $n$ edges incident to each vertex receive all $n$ colors exactly once.
Thus every symbol appears exactly once in each row and exactly once in each column.
Therefore $L$ is a Latin square.
So a Latin square with symbol set $S$ is equivalent to a proper edge-coloring of $K_{R,C}$ using the colors in $S$.

<figure style="text-align: center;">
  <img
    src="{{ '/assets/images/design-theory/ls-bipartite-edge-coloring.svg' | relative_url }}"
    alt="A Latin square and the corresponding proper edge-coloring of a complete bipartite graph"
    style="max-width: 100%; height: auto;"
  >
</figure>

## Latin Squares as Triangle Decompositions

A Latin square can also be viewed as a triangle decomposition of a complete tripartite graph.
Similar to above, let $R$, $C$, and $S$ be sets of size $n$, representing rows, columns, and symbols.
Let $K_{R,C,S}$ be the complete tripartite graph with parts $R$, $C$, and $S$.

Every triangle in $K_{R,C,S}$ has the form $\{r,c,s\}$ where $r \in R$, $c \in C$, and $s \in S$.
Given a Latin square $L : R \times C \to S$, we create one triangle for each cell:

$$
\left\{\{r,c\},\{c,s\},\{r,s\}\right\}.
$$

where $s = L(r,c)$.

> **Claim:** These triangles decompose the edges of $K_{R,C,S}$.

- The edge $rc$ is covered by the triangle corresponding to the cell $(r,c)$.

- The edge $rs$ is covered exactly once because symbol $s$ appears exactly once in row $r$.

- The edge $cs$ is covered exactly once because symbol $s$ appears exactly once in column $c$.

Therefore every edge of $K_{R,C,S}$ appears in exactly one triangle. $\blacksquare$

Now suppose we have a triangle decomposition of $K_{n,n,n}$.
Label the parts to represent the rows $R$, the columns $C$ and the symbols $S$.
Since this is a triangle decomposition, there exists a unique vertex $s \in S$ for each possible $(r,c) \in R \times C$ that is contained in the triangle

$$
\{\{rc\},\{rs\},\{cs\}\}
$$

We then define $L(r,c) = s$.
Since every edge $\{r,s\}$ is covered exactly once, symbol $s$ appears exactly once in row $r$.
Since every edge $\{c,s\}$ is covered exactly once, symbol $s$ appears exactly once in column $c$.
Thus $L$ is a Latin square.

So Latin squares of order $n$ are equivalent to triangle decompositions of $K_{n,n,n}$.

<figure style="text-align: center;">
  <img
    src="{{ '/assets/images/design-theory/ls-triangle-decomposition.svg' | relative_url }}"
    alt="A Latin square and the corresponding triangle decomposition of a complete tripartite graph."
    style="max-width: 100%; height: auto;"
  >
</figure>

## Latin Squares as Permutation Tensors

A Latin square can also be encoded as a $3$-dimensional $0$-$1$ tensor.
Let $R$, $C$, and $S$ be sets of size $n$.
Given a Latin square $L : R \times C \to S$, define $T_L: R\times C \times S \to \{0,1\}$ by

$$
T_L(r,c,s) = 
\begin{cases}
    1 & \text{if } L(r,c)=s, \
    0 & \text{otherwise.}
\end{cases}
$$

The tensor $T_L$ records exactly the same information as the Latin square.
The Latin square conditions imply that $T_L$ has exactly one $1$ in every coordinate line.
This is the $3$-dimensional analogue of a permutation matrix, so we can think of $T_L$ as a **permutation tensor**.

Pictured below is the permutation tensor associated with a Latin square.From the diagram it is easy to see that each coordinate line only has a single $1$. The figure illustrates how the symbols in the latin square can also be thought of as a height map.

<figure style="text-align: center;">
  <img
    src="{{ '/assets/images/design-theory/ls-permutation-tensor.svg' | relative_url }}"
    alt="A Latin square and the corresponding permutation 3-tensor."
    style="max-width: 100%; height: auto;"
  >
</figure>

## Latin Hypercubes

Latin squares have higher-dimensional analogues called **Latin hypercubes**.
A $d$-dimensional Latin hypercube of order $n$ is a function

$$
L : X_1 \times X_2 \times \cdots \times X_d \to S
$$

where each set $X_i$ and the symbol set $S$ have size $n$, and where every axis-parallel line contains each symbol exactly once.
In other words, if all input coordinates except one are fixed, then the remaining map to $S$ is a bijection.
When $d=2$, this is exactly a Latin square.

Groups give a simple source of examples.
Let $G$ be a finite group of order $n$.
We can define

$$
L(x_1,\dots,x_d)=x_1x_2\cdots x_d.
$$

If all variables except $x_i$ are fixed, then the equation

$$
x_1x_2\cdots x_d=s
$$

has a unique solution for $x_i$ because we can multiply by inverses.
Thus this gives a Latin hypercube.

The equivalences for Latin squares generalize naturally.

First, a Latin hypercube can be viewed as an edge-coloring of the complete $d$-partite $d$-uniform hypergraph with parts $X_1,\dots,X_d$.
Each transversal edge $\\{x_1,\dots,x_d\\}$ receives the color

$$L(x_1,\dots,x_d).$$

The Latin hypercube condition says that whenever we fix $d-1$ vertices from different parts, the remaining edges through them receive all symbols exactly once. This means that the link hypergraph on a set of $d-2$ is a proper edge coloring of a complete bipartite graph. 

Second, a Latin hypercube can be viewed as a clique decomposition of a complete partite hypergraph.
Consider the complete $(d+1)$-partite $d$-uniform hypergraph with parts $X_1,\dots,X_d,S$.
Each entry

$$
L(x_1,\dots,x_d)=s
$$

gives a $(d+1)$-vertex set $\\{ x_1,\dots, x_d, s \\}$.
This set spans a copy of $K_{d+1}^{(d)}$, meaning it contains all of its $d$-element subsets.
The Latin hypercube condition says that these copies of $K_{d+1}^{(d)}$ decompose all transversal $d$-sets.

Finally, a Latin hypercube can be encoded as a higher-dimensional permutation tensor.
Define

$$
T_L: X_1 \times \cdots \times X_d \times S \to \{0,1\}
$$

by

$$
T_L(x_1,\dots,x_d,s) =
\begin{cases}
    1 & \text{if } L(x_1,\dots,x_d)=s, \\
    0 & \text{otherwise.}
\end{cases}
$$

The Latin hypercube condition says that $T_L$ has exactly one $1$ in every coordinate line.

Thus Latin hypercubes generalize Latin squares as arrays, edge-colorings, clique decompositions, and permutation tensors.

## Sources and Further Reading

The exposition above is based on standard references on Latin squares, quasigroups, and design theory.

- J. Dénes and A. D. Keedwell, *Latin Squares and Their Applications*, Academic Press, 1974.

- J. Dénes and A. D. Keedwell, *Latin Squares and Their Applications*, Second Edition, Elsevier, 2015.

- Charles J. Colbourn and Jeffrey H. Dinitz, editors, *Handbook of Combinatorial Designs*, Second Edition, Chapman and Hall/CRC, 2006.

- Douglas R. Stinson, *Combinatorial Designs: Constructions and Analysis*, Springer, 2004.

- Charles C. Lindner and Christopher A. Rodger, *Design Theory*, Second Edition, Chapman and Hall/CRC, 2008.