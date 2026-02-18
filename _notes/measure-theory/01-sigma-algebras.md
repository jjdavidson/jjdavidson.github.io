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

Many of these identities also hold for arbitrary unions and arbitrary intersections.  
For proofs of these results, see Halmos, *Naive Set Theory*, Chapters I–II.
