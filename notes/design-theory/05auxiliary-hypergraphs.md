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
    src="{{ '/assets/images/design-theory/mols33-auxiliary.svg' | relative_url }}"
    alt="The perfect matching on the auxiliary hypergraph representing two orthogonal 3x3 Latin squares."
    style="width: min(100%, 700px); height: auto;"
  >
</figure>