---
title: The Oddtown Problem
parent: Research
nav_order: 1
layout: default
has_toc: true
---

# The Oddtown Problem

Many extremal problems in combinatorics become surprisingly tractable when translated into algebra. One of the simplest and most famous examples of this phenomenon is the **Oddtown problem**, which is often the first illustration of the **linear algebra method** in combinatorics.

My current research explores variants of this problem using Fourier analysis on finite abelian groups, particularly when the combinatorial conditions are imposed modulo composite numbers. These variants exhibit behavior that cannot be captured by the classical linear algebra argument alone.

This page outlines the classical problem, the algebraic method used to solve it, and the Fourier-analytic ideas that arise in modular generalizations.

## The Classical Oddtown Problem

Let $[n] = \lbrace 1,2,\dots,n \rbrace$. A family of sets $\mathcal{F} \subseteq 2^{[n]}$ is called an **Oddtown family** if

1. Every set has **odd size**
2. The intersection of any two distinct sets has **even size**

Our goal is to determine the largest possible size of an Oddtown family. Observe that the collection 

$$\left\{ \{1\}, \{2\}, \dots, \{n\} \right\}$$

is an Oddtown family of size $n$. 
Therefore, the maximum possible size of an Oddtown family is at least $n$.

## The Linear Algebra Method

> **Theorem (Berlekamp, Graver).**  
> If $\mathcal{F}$ is an Oddtown family on $[n]$, then
>
> $$
> \lvert \mathcal{F}\rvert \leq n.
> $$

Along with the lower bound from the singleton set construction, the extremal size of an oddtown family is $n$. This result is striking because the constraints appear combinatorial, but the proof uses linear algebra over $\mathbb{F}_2$.

### Proof.

Each set $A \subseteq [n]$ can be represented by its **characteristic vector** $v_A \in \lbrace 0,1 \rbrace^n$ where

$$
(v_A)_i = \begin{cases}
    1 & i \in A \\
    0 & i \notin A
\end{cases}
$$

Working over the field $\mathbb{F}_2$, observe that

$$v_A \cdot v_B = \lvert A \cap B\rvert \pmod 2$$

Suppose that $\mathcal{F} = \lbrace F_1,\dots, F_m\rbrace$ is an Oddtown family where $v_i = v_{F_i}$. 
The Oddtown conditions become

1. $v_i \cdot v_i = 1$
2. $v_i \cdot v_j = 0$ for $i \neq j$

Thus, the vectors $v_1,\dots,v_m$ are **pairwise orthogonal with nonzero self-inner product** in $\mathbb{F}_2^n$. 
Consider the linear equation

$$c_1v_1 + c_2v_2 + \dots + c_mv_m = 0$$

Taking dot products with respect to $v_i$, the orthogonality conditions imply

$$c_i(v_i \cdot v_i) = 0$$

Therefore, $c_i = 0$ for each $i = 1,\dots,m$, so $\{v_1,\dots,v_m\}$ is a linearly independent system of vectors in an $n$-dimensional space. Thus,

$$\lvert \mathcal{F}\rvert = m \leq n$$

This is a canonical example of the linear algebra method in extremal combinatorics. 
$\blacksquare$

## Modular Variants of the Oddtown Problem

A natural generalization replaces parity conditions with congruence conditions modulo a natural number $q$.
A family $\mathcal{F}$ is called an **$q$-Oddtown** family if for all $A,B \in \mathcal{F}$

1. $\lvert A\rvert \not\equiv 0 \pmod{q}$

2. $\lvert A \cap B \rvert \equiv 0 \pmod{q}\quad (A \neq B)$

Let $f_q(n)$ denote the maximum size of such a family. The singleton construction works for any natural number $n$ and any modulus $q$. Therefore,

$$f_{q}(n) \geq n$$

Does the reverse inequality also hold?

### Prime Modulus

When $q = p$ where $p$ is prime, the same linear algebra argument carries over by working over the vector space $\mathbb{F}_{p}^n$.


### Prime Power Modulus
However, when $q = p^k$ is a prime power, the same argument cannot be carried out over $\mathbb F_p$. 
Working modulo $p$ would collapse the condition $|A\cap B|\equiv 0 \pmod{p^k}$ into the weaker condition $|A\cap B|\equiv 0 \pmod p$. 
To retain the full divisibility information, we instead view the characteristic vectors as elements of $\mathbb Q^n$.
Let $\mathcal{F} = \lbrace F_1,\dots, F_m \rbrace$ be a $q$-Oddtown family with corresponding characteristic vectors $v_1,\dots,v_m$. 
For the sake of contradiction, suppose there exists a nontrivial solution to the equation

$$c_1v_1 + c_2v_2 + \dots + c_mv_m = 0$$

Without loss of generality, we may multiply by the LCD, so that $c_1,\dots,c_m \in \Z$.
Furthermore, we may divide through by any common factors, so that we may assume $\gcd(c_1,\dots,c_m) = 1$.
After taking dot products on both sides of a linear equation, we obtain the condition

$$c_1 (v_1 \cdot v_i) + c_2(v_2 \cdot v_i) + \dots c_m(v_m \cdot v_i) = 0$$

For $j \neq i$, we have

$$v_j \cdot v_i \equiv 0 \pmod{p^k}$$

so $p^k$ divides each term $c_j (v_j \cdot v_i)$.
Since $0$ is also divisible by $p^k$ it must be the case that $p^k$ also divides $c_i(v_i \cdot v_i)$. 
By assumption $v_i \cdot v_i$ is not divisible by $p^k$, so it must be the case that $c_i$ is a multiple of $p$. Since $i$ was arbitrary, it follows that all $c_i$ are divisible by $p$, contradicting the assumption that $\gcd(c_1,\dots,c_m) = 1$. Thus, there is no nontrivial solution to 

$$c_1v_1 + c_2v_2 + \dots + c_mv_m = 0$$

and $v_1,\dots,v_m$ are linearly independent. The dimension bound yields the result that $f_q(n) = n$.


### Composite Modulus

The situation changes dramatically when $q$ is composite. Suppose $q = p_1^{k_1} \cdots p_\omega^{k_\omega}$ has $\omega$ distinct prime factors. Define the subsets $\mathcal{F}_i$ for $i = 1,\dots, \omega$ by

$$\mathcal{F}_i = \left\{A \in \mathcal{F}: \lvert A \rvert \not\equiv 0 \pmod{p_i^{k_i}} \right\} $$

If $A \in \mathcal{F}$, then $\lvert A \rvert$ is not divisible by $q$. 
By the Chinese remainder theorem, this means that $\lvert A\rvert$ fails to be divisible by at least one of the prime powers $p_i^{k_i}$.
Conversely, if $\lvert A \rvert$ is not divisible by $p_i^{k_i}$, then it is not divisible by $q$. 
Therfore,

$$\mathcal{F} = \mathcal{F}_1 \cup \cdots \cup \mathcal{F}_{\omega}$$

By the Oddtown theorem for prime powers, it follows that $\lvert \mathcal{F_i} \rvert \leq n$. The union bound yields

$$f_q(n) \le \omega n$$

This leaves a large gap between the conjectured $f_q(n) = n$. 
Stronger bounds require understanding how the families $\mathcal F_i$ interact.
This interaction is where additional algebraic and Fourier-analytic techniques begin to play a role.


## Exploiting Orthogonality

The first nontrivial composite modulus is $q = 6 = 2 \cdot 3$. The bound above gives

$$
f_6(n) \leq 2n.
$$

We now explain Szegedy's argument showing that this bound can be improved to

$$
f_6(n) \leq 2n - 2\log_2 n.
$$

The key idea is to study not only the families corresponding to the primes $2$ and $3$, but also their complements. 
Let $\mathcal{F}_2$ and $\mathcal{F_3}$ be as defined above.
Define the complementary families

$$
\mathcal{F}_2' = \mathcal{F} \setminus \mathcal{F}_2
= \{A \in \mathcal{F} : \lvert A \rvert \equiv 0 \pmod{2}\},
$$

$$
\mathcal{F}_3' = \mathcal{F} \setminus \mathcal{F}_3
= \{A \in \mathcal{F} : \lvert A \rvert \equiv 0 \pmod{3}\}.
$$

Thus $\mathcal{F}_2'$ consists of the sets whose sizes are divisible by $2$, while $\mathcal{F}_3'$ consists of those whose sizes are divisible by $3$. 

Working modulo $2$, the characteristic vectors corresponding to sets in $\mathcal{F}_2$ are linearly independent in $\mathbb{F}_2^n$, while the vectors corresponding to $\mathcal{F}_2'$ lie in their orthogonal complement.
Recall the following lemma from linear algebra over finite fields.

> **Lemma. (0-1 Bound)**
> Suppose that $V$ is a $d$-dimensional subspace of $\mathbb{F}_p^n$. Then,
>
> $$ 
> \lvert V \cap \lbrace 0,1 \rbrace^n \rvert \leq 2^d
> $$

Intuitively, this lemma says that a low-dimensional subspace of $\mathbb{F}_p^n$ cannot contain too many $0$–$1$ vectors.
Let $V$ be the span of the characteristic vectors corresponding to sets in $\mathcal{F}_2'$. 
Since these vectors lie in the orthogonal complement of the span of $\mathcal{F}_2$, we have

$$
\dim(V) \le n - \lvert \mathcal{F}_2 \rvert.
$$

Applying the lemma to $V$ gives

$$
\lvert \mathcal{F}_2' \rvert \le 2^{\,n-\lvert \mathcal{F}_2 \rvert},
$$

Hence, $\lvert \mathcal{F}_2 \rvert \le n - \log_2 \lvert \mathcal{F}_2' \rvert$.
Repeating the same argument modulo $3$ yields $\lvert \mathcal{F}_3 \rvert \le n - \log_2 \lvert \mathcal{F}_3' \rvert$. We now consider some cases:

**Case 1:** Suppose one complementary family is small, say $\lvert \mathcal{F}_2' \rvert \le \tfrac{n}{2}$. 
Then, $\mathcal{F} = \mathcal{F}_2 \sqcup \mathcal{F}_2'$. Hence,

$$
\lvert \mathcal{F} \rvert = \lvert \mathcal{F}_2 \rvert + \lvert \mathcal{F}_2' \rvert \leq n + \tfrac{n}{2} = \frac{3n}{2},
$$

which already improves the trivial bound for sufficiently large $n$.

**Case 2:** Suppose both complementary families are large. More specifically,

$$
\lvert \mathcal{F}_2' \rvert \geq n,\qquad \lvert \mathcal{F}_3' \rvert \ge n
$$

The inequalities above then imply

$$
\lvert \mathcal{F}_2 \rvert \le n - \log_2 n, \qquad \lvert \mathcal{F}_3 \rvert \le n - \log_2 n
$$

Since $\mathcal{F} = \mathcal{F}_2 \cup \mathcal{F}_3$, the union bound implies

$$
\lvert \mathcal{F} \rvert \leq \lvert \mathcal{F}_2 \rvert + \lvert \mathcal{F}_3 \rvert \leq 2n - 2\log_2 n.
$$

Szegedy's argument extends to square-free moduli $q = p_1\cdots p_{\omega}$.
In this case, the maximum $q$-Oddtown family satisfies the bounds

$$
n \leq f_q(n) \leq \omega n - \omega \log_2(n)
$$

## A Stronger Orthogonality Structure

In the previous argument we used the fact that the vectors corresponding to sets in $\mathcal{F}_i'$ lie in the orthogonal complement of the span of $\mathcal{F}_i$. This yielded the dimension bound

$$
\dim(V_i) \le n - \lvert \mathcal{F}_i \rvert,
$$

where $V_i = \mathrm{span}(\mathcal{F}_i')$.
However, the vectors in $\mathcal{F}_i'$ satisfy an even stronger property.
If $A,B \in \mathcal{F}_i'$, then by definition

$$
\lvert A \rvert \equiv 0 \pmod{p_i}, \qquad \lvert B \rvert \equiv 0 \pmod{p_i}.
$$

Since $\mathcal{F}$ is a $q$-Oddtown family, intersections satisfy

$$
\lvert A \cap B \rvert \equiv 0 \pmod{p_i}.
$$

Passing to characteristic vectors over $\mathbb{F}_{p_i}$ gives

$$
v_A \cdot v_B = 0.
$$

This includes the case $A = B$. Thus every pair of vectors in $\mathcal{F}_i'$ is orthogonal. 
A subspace with this property is called **totally isotropic**. 
In such spaces, we can construct a stronger dimension bound.

> **Lemma. (Isotropic Bound)**
>If $V \subseteq \mathbb{F}_p^n$ is totally isotropic, then
>
> $$
> \dim(V) \leq \frac{n}{2}
> $$

Applying this to $V_i = \mathrm{span}(\mathcal{F}_i')$ yields

$$
\dim(V_i) \le \frac{n - \lvert \mathcal{F}_i \rvert}{2}.
$$

Using the dimension bound along with the isotropic bound, we obtain

$$
\lvert \mathcal{F}_i \rvert \leq n - 2\log_2 \lvert \mathcal{F}_i' \rvert.
$$

Thus the logarithmic saving from Szegedy's argument doubles, leading to

$$
f_q(n) \le \omega n - 2\omega \log_2 n + O(1).
$$


## References

- E. Berlekamp. *On subsets with intersections of even cardinality.*
- J. Graver. *Boolean designs and self-dual matroids.*
- L. Babai and P. Frankl. *Linear Algebra Methods in Combinatorics.*
- B. Bukh, T.-W. Chao, Z. Zheng. *The Oddtown problem modulo a composite number.*