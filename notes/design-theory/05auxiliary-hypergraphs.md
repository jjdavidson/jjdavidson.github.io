---
title: Auxiliary Hypergraphs
parent: Design Theory
nav_order: 5
layout: default
has_toc: true
---

# Auxiliary Hypergraphs

Roughly speaking, an **auxiliary hypergraph** is a new hypergraph built from the original problem.
The vertices of the auxiliary hypergraph represent the small objects we want to cover, and the edges represent the larger structures we are allowed to choose.
Then a perfect matching in the auxiliary hypergraph corresponds to a solution of the original design problem.

## The General Idea

Suppose we want to decompose a large object into smaller pieces.
There are two ingredients.

1. A set of objects that must be covered.
2. A collection of allowable pieces, each of which covers several objects.

To build the auxiliary hypergraph, we use the objects to be covered as vertices.
Then each allowable piece becomes an edge containing the vertices that it covers.

A perfect matching in this auxiliary hypergraph is a collection of disjoint edges that covers every vertex exactly once.
Translated back into the original problem, this means that we have chosen allowable pieces so that every object is covered exactly once.

## Latin Squares

Let $R$, $C$, and $S$ be sets of size $n$.
We think of these as the rows, columns, and symbols of a Latin square.
Recall that a Latin square is an $n \times n$ grid where each of $n$ symbols appears exactly once in each row and exactly once in each column.

To build the auxiliary hypergraph, we first identify the constraints that a Latin square has to satisfy.
There are three kinds of constraints:

1. Every row-column pair $(r,c)$ must receive exactly one symbol.
2. Every row-symbol pair $(r,s)$ must appear exactly once.
3. Every column-symbol pair $(c,s)$ must appear exactly once.

Therefore, the vertex set of the auxiliary hypergraph is

$$V = (R \times C) \cup (R \times S) \cup (C \times S).$$

and the 3-edges of the auxiliary hypergraph are given by

$$E = \left\{\{(r,c),(r,s),(c,s)\}:r \in R,\ c \in C,\ s \in S\right\}.$$

The auxiliary hypergraph has $3n^2$ vertices and $n^3$ 3-edges. 

A perfect matching in the auxiliary hypergraph chooses disjoint edges that cover every vertex exactly once.
Translated back into Latin square language, this means:
- every cell $(r,c)$ receives exactly one symbol;
- every row-symbol pair $(r,s)$ appears exactly once;
- every column-symbol pair $(c,s)$ appears exactly once.

Therefore, a perfect matching in the auxiliary hypergrph is exactly a Latin square.
Since each 3-edge has size $3$, a perfect matching has $n^2$ edges which matches the number of entries on of a Latin square of order $n$.

### Example: The Auxiliary Hypergraph of a $2 \times 2$ Latin Square

Consider the $2 \times 2$ Latin square

$$
\begin{array}{c|cc}
      & 0 & 1 \\ \hline
    0 & 0 & 1 \\
    1 & 1 & 0
\end{array}
$$

Each part has four vertices with the labels $\\{00,01,10,11\\}$ where we use $ab$ in place of $(a,b)$ for brevity.
Thus the auxiliary hypergraph has $12$ vertices.
Each possible entry $(r,c,s)$ gives one edge for a total of $8$ hyperedges.
These hyperedges are:

$$
\begin{array}{cc}
    e_{(0,0,0)} = \{00,00,00\} & e_{(0,0,1)} = \{00,01,01\} \\
    e_{(0,1,0)} = \{01,00,10\} & e_{(0,1,1)} = \{01,01,11\} \\
    e_{(1,0,0)} = \{10,10,00\} & e_{(1,0,1)} = \{10,11,01\} \\
    e_{(1,1,0)} = \{11,10,10\} & e_{(1,1,1)} = \{11,11,11\} \\
\end{array}
$$

The Latin square corresponds to the matching

$$\{e_{(0,0,0)},e_{(0,1,1)},e_{(1,0,1)},e_{(1,1,0)}\}$$

Pictured below is the full auxilary hypergraph where the red edges correspond to the matching representing the Latin square.

<figure style="text-align: center;">
  <img
    src="{{ '/assets/images/design-theory/ls22-auxiliary.svg' | relative_url }}"
    alt="The perfect matchiing on the auxiliary hypergraph representing the 2x2 Latin square."
    style="width: min(100%, 500px); height: auto;"
  >
</figure>

### Example: The Auxiliary Hypergraph of a $3 \times 3$ Latin Square
Consider the $3 \times 3$ Latin square

$$
\begin{array}{c|ccc}
      & 0 & 1 & 2 \\ \hline
    0 & 0 & 1 & 2 \\
    1 & 1 & 2 & 0 \\
    2 & 2 & 0 & 1
\end{array}
$$

Each part has $9$ vertices, labeled $\{00,01,02,10,11,12,20,21,22\}$, where we write $ab$ in place of $(a,b)$ for brevity.
Thus the auxiliary hypergraph has 27 vertices and $3^3 = 27$ hyperedges.
Pictured below is the full auxilary hypergraph where the red edges correspond to the matching representing the Latin square.

<figure style="text-align: center;">
  <img
    src="{{ '/assets/images/design-theory/ls33-auxiliary.svg' | relative_url }}"
    alt="The perfect matchiing on the auxiliary hypergraph representing the 2x2 Latin square."
    style="width: min(100%, 600px); height: auto;"
  >
</figure>

## Mutually Orthogonal Latin Squares

A pair of $n \times n$ Latin squares $L_1$ and $L_2$ with symbol sets $S_1$ and $S_2$ are called **orthogonal** if every ordered pair of symbols appears exactly once.
In other words, the map

$$
(r,c) \mapsto (L_1(r,c),L_2(r,c))
$$

is a bijection from $R \times C$ to $S_1 \times S_2$ where each projection $R \times C \to S_1$ and $R \times C \to S_2$ is a Latin square.

### Example: Arranging Playing Cards

In a deck of playing cards, there are Aces, Kings, Queens, and Jacks which come in four suits of Spades, Diamonds, Clubs, and Hearts. Arranging the 16 cards into a $4 \times 4$ grid such that the ranks form a Latin square and the suits form a Latin square will create a pair of orthogonal Latin squares.

$$
\begin{array}{c|cccc}
      & 0 & 1 & 2 & 3 \\ \hline
    0 & A\spadesuit & K\heartsuit & Q\diamondsuit & J\clubsuit \\
    1 & J\heartsuit & Q\spadesuit & K\clubsuit & A\diamondsuit \\
    2 & K\diamondsuit & A\clubsuit & J\spadesuit & Q\heartsuit \\
    3 & Q\clubsuit & J\diamondsuit & A\heartsuit & K\spadesuit \\
\end{array}
$$

### Building the Auxiliary Hypergraph

To build the auxiliary hypergraph, we identify a set of constraints. For a pair of orthogonal Latin squares there are six kinds of constraints:

1. Every row-column pair $(r,c)$ must receive exactly one ordered pair of symbols.
2. Every row-symbol pair $(r,s_1)$ must appear exactly once in the first Latin square.
3. Every column-symbol pair $(c,s_1)$ must appear exactly once in the first Latin square.
4. Every row-symbol pair $(r,s_2)$ must appear exactly once in the second Latin square.
5. Every column-symbol pair $(c,s_2)$ must appear exactly once in the second Latin square.
6. Every symbol pair $(s_1,s_2)$ must appear exactly once.

Therefore, the vertex set of the auxiliary hypergraph is

$$
V =
(R \times C)
\cup
(R \times S_1)
\cup
(C \times S_1)
\cup
(R \times S_2)
\cup
(C \times S_2)
\cup
(S_1 \times S_2).
$$

Each possible choice for an entry has the form $(r,c,s_1,s_2)$ which corresponds to a 6-edge

$$
\{(r,c),(r,s_1),(c,s_1),(r,s_2),(c,s_2),(s_1,s_2)\}.
$$

Thus the auxiliary hypergraph has edge set

$$
E =
\left\{
\{(r,c),(r,s_1),(c,s_1),(r,s_2),(c,s_2),(s_1,s_2)\}
:
r \in R,\ c \in C,\ s_1 \in S_1,\ s_2 \in S_2
\right\}.
$$

If all four sets have size $n$, then the auxiliary hypergraph has $6n^2$
vertices and $n^4$ 6-edges.

A perfect matching in this auxiliary hypergraph chooses disjoint edges that cover every vertex exactly once.
Translated back into Latin square language, this means:

- every cell $(r,c)$ receives exactly one ordered pair of symbols $(s_1,s_2)$;
- every row-symbol pair $(r,s_1)$ appears exactly once in the first Latin square;
- every column-symbol pair $(c,s_1)$ appears exactly once in the first Latin square;
- every row-symbol pair $(r,s_2)$ appears exactly once in the second Latin square;
- every column-symbol pair $(c,s_2)$ appears exactly once in the second Latin square;
- every ordered pair of symbols $(s_1,s_2)$ appears exactly once.

Therefore, a perfect matching in this auxiliary hypergraph is exactly a pair of orthogonal Latin squares.
Since each edge has size $6$, a perfect matching has $n^2$ 6-edges
This matches the number of cells in an $n \times n$ Latin square.

### Example: The Auxiliary Hypergraph of Two Orthogonal $3 \times 3$ Latin Squares

Consider the two $3 \times 3$ Latin squares

$$
L_1: \quad
\begin{array}{c|ccc}
      & 0 & 1 & 2 \\ \hline
    0 & 0 & 1 & 2 \\
    1 & 1 & 2 & 0 \\
    2 & 2 & 0 & 1
\end{array}
\qquad
L_2: \quad
\begin{array}{c|ccc}
      & 0 & 1 & 2 \\ \hline
    0 & 0 & 2 & 1 \\
    1 & 1 & 0 & 2 \\
    2 & 2 & 1 & 0
\end{array}
$$

Placing the two Latin squares on top of each other gives the array of ordered pairs

$$
\begin{array}{c|ccc}
      & 0 & 1 & 2 \\ \hline
    0 & (0,0) & (1,2) & (2,1) \\
    1 & (1,1) & (2,0) & (0,2) \\
    2 & (2,2) & (0,1) & (1,0)
\end{array}
$$

Every ordered pair appears exactly once, so these two Latin squares are orthogonal.

The auxiliary hypergraph has six parts:

$$
R \times C,
\qquad
R \times S_1,
\qquad
C \times S_1,
\qquad
R \times S_2,
\qquad
C \times S_2,
\qquad
S_1 \times S_2.
$$

Each part has $9$ vertices, labeled

$$
\{00,01,02,10,11,12,20,21,22\},
$$

where we write $ab$ in place of $(a,b)$ for brevity.
Thus the auxiliary hypergraph has $54$ vertices.
Each possible entry $(r,c,s_1,s_2)$ gives one $6$-edge for a total of $3^4=81$ hyperedges.

The two orthogonal Latin squares correspond to the matching

$$
\begin{array}{ccc}
e_{(0,0,0,0)}, & e_{(0,1,1,2)}, & e_{(0,2,2,1)}, \\
e_{(1,0,1,1)}, & e_{(1,1,2,0)}, & e_{(1,2,0,2)}, \\
e_{(2,0,2,2)}, & e_{(2,1,0,1)}, & e_{(2,2,1,0)}
\end{array}
$$

Here each edge $e_{(r,c,s_1,s_2)}$ is the $6$-edge

$$
e_{(r,c,s_1,s_2)}
=
\{rc,rs_1,cs_1,rs_2,cs_2,s_1s_2\},
$$

where the entries are listed in the order of the six parts above.

Pictured below is the full auxiliary hypergraph where the red edges correspond to the matching representing the pair of orthogonal Latin squares.

<figure style="text-align: center;">
  <img
    src="{{ '/assets/images/design-theory/mols-auxiliary.svg' | relative_url }}"
    alt="The perfect matching on the auxiliary hypergraph representing two orthogonal 3x3 Latin squares."
    style="width: min(100%, 700px); height: auto;"
  >
</figure>

## Steiner Triple Systems as Auxiliary Hypergraphs

Recall that a **Steiner triple system** of order $n$ is a collection of triples on an $n$-element set such that every pair of points appears in exactly one triple.
Equivalently, an $\operatorname{STS}(n)$ is a triangle decomposition of the complete graph $K_n$.

To build the auxiliary hypergraph, we identify the constraints.
For a Steiner triple system, the constraints are the pairs of points.
Each pair must be covered exactly once.

Therefore, the vertex set of the auxiliary hypergraph is

$$
V = \binom{[n]}{2}.
$$

Each possible triple $\{x,y,z\}$ covers the three pairs $xy$, $xz$, and $yz$.
Thus each possible triple gives one $3$-edge

$$
\{xy,xz,yz\}.
$$

So the edge set of the auxiliary hypergraph is

$$
E = \left\{\{xy,xz,yz\} : \{x,y,z\} \in \binom{[n]}{3}\right\}.
$$

The auxiliary hypergraph has $\binom{n}{2}$ vertices and $\binom{n}{3}$ 3-edges.

A perfect matching in this auxiliary hypergraph chooses disjoint edges that cover every vertex exactly once.
Translated back into Steiner triple system language, this means that we choose triples so that every pair of points appears in exactly one triple.
Therefore, a perfect matching in this auxiliary hypergraph is exactly a Steiner triple system.
Since each 3-edge covers three pairs, a perfect matching has

$$
\frac{\binom{n}{2}}{3}=\frac{n(n-1)}{6}
$$

3-edges.
This matches the number of triples in an $\operatorname{STS}(n)$.

### Example: The Auxiliary Hypergraph of the Fano Plane

The smallest nontrivial Steiner triple system is the Fano plane, which is an $\operatorname{STS}(7)$.
Its triples are

$$
\{123,145,167,246,257,347,356\},
$$

where we write $123$ in place of $\{1,2,3\}$ for brevity.

The auxiliary hypergraph has vertex set $V=\binom{[7]}{2}$.
Each possible triple of points gives one $3$-edge for a total of $35$ 3-edges.
The Fano plane corresponds to the matching

$$
\begin{array}{lll}
e_{123}=\{12,13,23\},
&
e_{145}=\{14,15,45\},
&
e_{167}=\{16,17,67\},
\\[0.4em]
e_{246}=\{24,26,46\},
&
e_{257}=\{25,27,57\},
&
e_{347}=\{34,37,47\},
\\[0.4em]
e_{356}=\{35,36,56\}.
\end{array}
$$

Pictured below is the full auxiliary hypergraph where the red edges correspond to the matching representing the Fano plane.

<figure style="text-align: center;">
  <img
    src="{{ '/assets/images/design-theory/sts-auxiliary.svg' | relative_url }}"
    alt="The perfect matching on the auxiliary hypergraph representing the Fano plane as a Steiner triple system."
    style="width: min(100%, 650px); height: auto;"
  >
</figure>

## Why Matchings Are the Right Language

The examples above all follow the same pattern.

- First, we identify the local constraints of the design.
These constraints become the vertices of the auxiliary hypergraph.
- Second, we identify the local choices that are allowed.
These choices become the edges of the auxiliary hypergraph.
- Finally, a perfect matching chooses compatible local choices so that every constraint is satisfied exactly once.

This is useful because it turns many different design problems into the same kind of problem:

> Find a perfect matching in a structured hypergraph.

This rephrasing is powerful because matchings are one of the central objects in combinatorics.
There are many tools for proving that matchings exist.
In graph theory, classical results such as Hall's theorem and Tutte's theorem give exact conditions for perfect matchings in special settings.
For hypergraphs, perfect matchings are much harder, but there are still many useful methods.

For example, one modern strategy is to first find an almost-perfect matching.
This corresponds to building an approximate design.
Then one uses absorption to cover the small leftover and complete the perfect matching.
Translated back into design language, this means that we first satisfy almost all of the constraints, and then carefully repair the remaining constraints.

There is also another benefit.
The auxiliary hypergraph viewpoint can be used to count designs.
Since designs correspond to perfect matchings in the auxiliary hypergraph, counting designs becomes a problem about counting perfect matchings.

This gives access to another large collection of tools.
In graph settings, counting perfect matchings is closely related to permanents and inequalities such as Bregman's theorem.
In hypergraph settings, entropy methods and probabilistic counting methods play a similar role.
Thus the auxiliary hypergraph viewpoint is useful not only for proving that designs exist, but also for estimating how many designs there are.

## Practice Problems

1. **General Steiner Systems.**
Construct the auxiliary hypergraph for an $(n,q,r)$-Steiner system.
Show that its vertices are the $r$-subsets of $[n]$, and that each $q$-set gives one edge containing all of its $r$-subsets.
Conclude that perfect matchings in this auxiliary hypergraph are exactly $(n,q,r)$-Steiner systems.

2. **Pair Designs.**
Specialize the previous construction to $(n,q,2)$-Steiner systems.
Explain why this is the same as decomposing the edges of $K_n$ into copies of $K_q$.

3. **Designs with $\lambda > 1$.**
An $(n,q,2,\lambda)$-design requires every pair of points to appear in exactly $\lambda$ blocks.
Modify the auxiliary hypergraph construction by replacing each pair with $\lambda$ formal copies.
What should the edges be?

4. **General MOLS.**
Suppose we want to construct $m$ mutually orthogonal Latin squares of order $n$.
How many kinds of constraints are there?
Find the number of parts in the auxiliary hypergraph and find the size of each edge.

5. **Resolvable Designs.**
A resolvable design is a design whose blocks can be partitioned into parallel classes.
For a resolvable Steiner triple system, each parallel class partitions the vertex set into triples.
Try to build an auxiliary hypergraph whose edges represent entire parallel classes instead of individual triples.

## Sources and Further Reading

The exposition above is based on standard references on Latin squares, Steiner systems, and hypergraph matchings.

### Latin Squares and Designs

- J. Dénes and A. D. Keedwell, *Latin Squares and Their Applications*, Academic Press, 1974.

- Charles J. Colbourn and Jeffrey H. Dinitz, editors, *Handbook of Combinatorial Designs*, Second Edition, Chapman and Hall/CRC, 2006.

- Douglas R. Stinson, *Combinatorial Designs: Constructions and Analysis*, Springer, 2004.

- Charles C. Lindner and Christopher A. Rodger, *Design Theory*, Second Edition, Chapman and Hall/CRC, 2008.

- Charles J. Colbourn and Alexander Rosa, *Triple Systems*, Oxford University Press, 1999.

### Matching Theory

- Philip Hall, "On Representatives of Subsets," *Journal of the London Mathematical Society*, 10 (1935), 26--30.

- W. T. Tutte, "The Factorization of Linear Graphs," *Journal of the London Mathematical Society*, 22 (1947), 107--111.

- László Lovász and Michael D. Plummer, *Matching Theory*, North-Holland, 1986.

### Counting Designs and Matchings

- L. M. Brégman, "Some Properties of Nonnegative Matrices and Their Permanents," *Soviet Mathematics Doklady*, 14 (1973), 945--949.

- Jaikumar Radhakrishnan, "An Entropy Proof of Bregman's Theorem," *Journal of Combinatorial Theory, Series A*, 77 (1997), 161--164.

- Nathan Linial and Zur Luria, "An Upper Bound on the Number of Steiner Triple Systems," *Random Structures & Algorithms*, 43 (2013), 399--406. [DOI](https://doi.org/10.1002/rsa.20487)

- Peter Keevash, "Counting Designs," arXiv:1504.02909. [arXiv](https://arxiv.org/abs/1504.02909)