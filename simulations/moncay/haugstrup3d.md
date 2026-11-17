---
layout: default
title: De Grey-Haugstrup
parent: Monomial Cayley Graphs
grand_parent: Simulations
nav_order: 4.5
permalink: /simulations/moncay/haugstrup3d/
---

# The De Grey–Haugstrup Graph in 3D

Explore the 47-vertex, 146-edge unit-distance graph of Aubrey de Grey and Asger Haugstrup. The viewer uses Haugstrup’s published three-dimensional coordinates.

{% include demos/embed.html name="de-grey-haugstrup" id="haugstrup3d" %}

## The 11-vertex scaffold

Start with the regular unit tetrahedron $DEFK$. Glue another unit tetrahedron to each of the faces $DEK$, $DFK$, and $EFK$. Their new tips are $A$, $B$, and $C$, respectively. Equivalently, each new tip is the reflection of the original tetrahedron’s opposite vertex across the shared face.

Reflect this seven-vertex assembly across the plane through $A,B,C$. The reflection fixes those three vertices and sends $D,E,F,K$ to $G,H,I,J$, respectively. The two halves together give $7+7-3=11$ vertices and 30 unit edges. The four Nechushtan spindles attach to this scaffold in Steps 5–8. [Haugstrup’s construction discussion on Math Stack Exchange](https://math.stackexchange.com/questions/4509123/chromatic-6-spindle-in-3d-space)

## Why six colors are necessary

In a proper five-coloring of the 11-vertex scaffold, at least three vertices share a color. The scaffold has only four independent triples, and each is the attachment site of one piece. Each piece’s nine new vertices require at least five colors because no independent set among them has more than two vertices. Every new vertex touches one of the three scaffold vertices at its attachment site. If those three vertices all had the same color, the nine new vertices would have only four colors available. Adding all four pieces rules out every five-coloring. [Haugstrup’s construction and edge list](https://math.stackexchange.com/questions/4509123/chromatic-6-spindle-in-3d-space)

## Exact vertex coordinates

The first table lists the scaffold vertices from Steps 1–4. The remaining tables follow the order of the four attachments. The scaffold and the points $Q_1$ and $R_1$ use Haugstrup’s published formulas. The remaining coordinates are specified using local frames and cyclic permutations of the axes. [Haugstrup’s coordinates](https://math.stackexchange.com/questions/4509123/chromatic-6-spindle-in-3d-space)

### Steps 1–4 — Scaffold

Divide each triple in the table by $9\sqrt{2}$ to get the vertex in the original embedding.

| Vertex | $9\sqrt{2}\,(x,y,z)$ |
| --- | --- |
| $A$ | $(15,0,0)$ |
| $B$ | $(0,15,0)$ |
| $C$ | $(0,0,15)$ |
| $D$ | $(4,4,-5)$ |
| $E$ | $(4,-5,4)$ |
| $F$ | $(-5,4,4)$ |
| $G$ | $(12,12,3)$ |
| $H$ | $(12,3,12)$ |
| $I$ | $(3,12,12)$ |
| $J$ | $(3,3,3)$ |
| $K$ | $(7,7,7)$ |

### Step 5 — Piece 1 (Q)

With $t=\sqrt{2289118}$, Haugstrup’s first point is

$$
Q_1=\frac{(533-2t,\;5084-2t,\;908-2t)}{3915\sqrt{2}}.
$$

For a piece $P$, use the anchors $(X,Z)=(A,C)$ for $Q$ and $(X,Z)=(G,D)$ for $R$. The first axis points from $Z$ to $P_1$. The second points toward $X$ after projecting perpendicular to the first. In formulas,

$$
e_1=\frac{3}{5}(P_1-Z),\qquad
w=(X-Z)-\bigl((X-Z)\cdot e_1\bigr)e_1,
$$

$$
e_2=\frac{w}{\lVert w\rVert},\qquad e_3=e_1\times e_2.
$$

Each triple $(x,y,z)$ in the $Q$ and $R$ tables means the point $Z+xe_1+ye_2+ze_3$ in that piece’s frame. Set

$$
s=\frac{\sqrt{23}}{6},\qquad b=\frac{3\sqrt{2}}{16},\qquad d=\frac{\sqrt{46}}{16}.
$$

For example, $Q_2$ and $Q_3$ are the two intersections of the spheres centered at $Q_1$, $A$, and $C$ with squared radii $1$, $1$, and $8/3$. In the $Q$ frame the first two coordinates of both intersections are $4/3$ and $s$, and the last coordinates are $-1/2$ and $1/2$.

| Vertex | Exact coordinates in the $Q$ frame |
| --- | --- |
| $Q_1$ | $(5/3,0,0)$ |
| $Q_2$ | $(4/3,s,-1/2)$ |
| $Q_3$ | $(4/3,s,1/2)$ |
| $Q_4$ | $(1/3,s,-1/2)$ |
| $Q_5$ | $(1/3,s,1/2)$ |
| $Q_6$ | $(5/6,s/4-b,-1/8-d)$ |
| $Q_7$ | $(5/6,s/4-b,1/8+d)$ |
| $Q_8$ | $(5/6,s/4+b,-1/8+d)$ |
| $Q_9$ | $(5/6,s/4+b,1/8-d)$ |

### Step 6 — Piece 2 (R)

Put $t=\sqrt{55729}$ and $h=\sqrt{4037+256t}$. The first point is

$$
R_1=\frac{(10528-25t-45h,\;10528-25t+45h,\;20080-10t)}{12528\sqrt{2}}.
$$

Use $P_1=R_1$ and $(X,Z)=(G,D)$ in the frame formula above.

| Vertex | Exact coordinates in the $R$ frame |
| --- | --- |
| $R_1$ | $(5/3,0,0)$ |
| $R_2$ | $(4/3,s,1/2)$ |
| $R_3$ | $(4/3,s,-1/2)$ |
| $R_4$ | $(1/3,s,1/2)$ |
| $R_5$ | $(1/3,s,-1/2)$ |
| $R_6$ | $(5/6,s/4-b,1/8+d)$ |
| $R_7$ | $(5/6,s/4-b,-1/8-d)$ |
| $R_8$ | $(5/6,s/4+b,1/8-d)$ |
| $R_9$ | $(5/6,s/4+b,-1/8+d)$ |

### Step 7 — Piece 3 (U)

Let $(x_i,y_i,z_i)$ be the coordinates of $R_i$ after converting from the $R$ frame to the original axes. The rotation $(x,y,z)\mapsto(y,z,x)$ sends $R_i$ to $U_i$.

| Vertex | Exact coordinates |
| --- | --- |
| $U_1$ | $(y_1,z_1,x_1)$ |
| $U_2$ | $(y_2,z_2,x_2)$ |
| $U_3$ | $(y_3,z_3,x_3)$ |
| $U_4$ | $(y_4,z_4,x_4)$ |
| $U_5$ | $(y_5,z_5,x_5)$ |
| $U_6$ | $(y_6,z_6,x_6)$ |
| $U_7$ | $(y_7,z_7,x_7)$ |
| $U_8$ | $(y_8,z_8,x_8)$ |
| $U_9$ | $(y_9,z_9,x_9)$ |

### Step 8 — Piece 4 (T)

Applying the same rotation twice to $R_i$ gives $T_i$.

| Vertex | Exact coordinates |
| --- | --- |
| $T_1$ | $(z_1,x_1,y_1)$ |
| $T_2$ | $(z_2,x_2,y_2)$ |
| $T_3$ | $(z_3,x_3,y_3)$ |
| $T_4$ | $(z_4,x_4,y_4)$ |
| $T_5$ | $(z_5,x_5,y_5)$ |
| $T_6$ | $(z_6,x_6,y_6)$ |
| $T_7$ | $(z_7,x_7,y_7)$ |
| $T_8$ | $(z_8,x_8,y_8)$ |
| $T_9$ | $(z_9,x_9,y_9)$ |

## References

- Aubrey de Grey and Asger Haugstrup. “Two small 6-chromatic unit-distance graphs in $\mathbb{R}^3$.” *Geombinatorics* **31**(3), January 2022, 110–115. [Journal issue](https://geombina.uccs.edu/past-issues/volume-xxxi)
- Asger Haugstrup. Answer and construction comments on “Chromatic 6 spindle in 3D space.” *Math Stack Exchange*, November 2022. [Coordinates, edges, and discussion](https://math.stackexchange.com/questions/4509123/chromatic-6-spindle-in-3d-space)
