---
layout: default
title: Triangle-Free Unit-Distance Graphs
parent: Monomial Cayley Graphs
grand_parent: Simulations
nav_order: 2
permalink: /simulations/moncay/triangle-free-udg/
---

# {{ page.title }}

{% include demos/embed.html name="triangle-free-udg" id="triangle-free-udg-demo" autoplay=true show_caption=false %}

## The Davidson Constructions

I started with the monomial Cayley graph $\Gamma_\alpha$, where $\alpha$ is a root on the unit circle of the sextic

$$
f(x)=x^6-x^4-x^3-x^2+1.
$$

The drawings use the root with positive imaginary part and $-1<\alpha+\alpha^{-1}<0$. The vertices of $\Gamma_\alpha$ are the integer polynomials in $\alpha$, and its allowed steps are $\pm\alpha^k$ for $k\geq 0$. The sextic relation lets us reduce every vertex and step to a polynomial of degree at most five, so we can compare them using integer coefficients. [The sextic construction in my paper](https://arxiv.org/html/2610.09474v1#S4.SS3)

The sextic is the minimal polynomial of $\alpha$ and has a real root, so the field $\mathbb{Q}(\alpha)$ has an embedding into $\mathbb{R}$. If three points in $\mathbb{Q}(\alpha)$ formed a unit triangle, the ratio $z$ of the two sides leaving one vertex would satisfy $z^2-z+1=0$. That polynomial has no real root, so such a triangle cannot occur.

### From a finite search to a critical graph

**Sum Set.** For the 24- and 21-vertex constructions, I added subsets of the ten powers $1,\alpha,\ldots,\alpha^9$. Different subsets can give the same point, so the $2^{10}$ choices produced 830 distinct vertices. I joined vertices using signed powers through exponent 14, giving 4,848 edges. In the search reported in the paper, SAT isolated a 90-vertex graph with no proper three-coloring. Further extraction and vertex deletion left 24 vertices and 51 edges. A later search of the same Sum Set produced the 21-vertex graph with 44 edges.

**Cayley ball.** For the 20-vertex construction, I took the points reachable from the origin in at most two steps using $\pm1,\pm\alpha,\ldots,\pm\alpha^{12}$. The ball has 365 vertices and 1,036 edges with these steps. Removing vertices of degree at most two left 189 vertices. A three-coloring of the remaining graph could always be extended back over those removals. A SAT search and further vertex deletion left 20 vertices and 39 edges. [Explore the Sum Set and Cayley ball rules](../finite-graphs/)

The paper gives a four-coloring of $\Gamma_\alpha$, which restricts to all three witnesses. Each witness requires four colors, and deleting any one of its vertices makes it three-colorable. This is what it means for the graph to be **vertex-critical**.

### Exact vertex coordinates

Choose a graph to see its vertex coordinates as polynomials in $\alpha$. The vertex numbers match the labels in the visualization above.

<div id="davidson-coordinate-picker" role="group" aria-label="Choose a Davidson graph">
  <button class="btn btn-primary" type="button" data-graph="24" aria-pressed="true">Davidson 24</button>
  <button class="btn" type="button" data-graph="21" aria-pressed="false">Davidson 21</button>
  <button class="btn" type="button" data-graph="20" aria-pressed="false">Davidson 20</button>
</div>
<table id="davidson-coordinate-table" aria-label="Exact vertex coordinates">
  <thead>
    <tr><th scope="col">Vertex</th><th scope="col">Polynomial in α</th></tr>
  </thead>
  <tbody></tbody>
</table>

<script type="module">
  /* Coefficients of 1, α, …, α⁵, in the order of the visualization’s vertex labels. */
  const coordinates = {
    24: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1],
      [0, 0, 1, 0, 0, 0],
      [0, 0, 1, 1, 0, 0],
      [0, 1, 0, 0, 0, 0],
      [1, 0, 0, 0, -1, 0],
      [1, 0, 0, 0, 0, 0],
      [1, 1, 0, -1, -2, -2],
      [1, 1, 0, -1, -2, -1],
      [1, 1, 0, -1, -1, -1],
      [1, 1, 0, 0, -2, -2],
      [2, 1, -1, -2, -3, -2],
      [2, 1, -1, -2, -2, -1],
      [2, 1, -1, -1, -3, -2],
      [2, 1, 0, -2, -3, -2],
      [2, 2, -1, -3, -3, -2],
      [2, 2, -1, -2, -4, -3],
      [2, 2, -1, -2, -4, -2],
      [2, 2, -1, -2, -3, -3],
      [2, 2, -1, -2, -3, -2],
      [3, 1, -1, -3, -4, -2],
      [3, 2, -1, -4, -5, -3],
      [3, 2, -1, -3, -5, -4],
      [3, 2, -1, -3, -5, -3],
    ],
    21: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1],
      [0, 1, 0, -1, -1, -1],
      [0, 1, 0, 0, -1, -1],
      [1, 0, 0, -1, -2, -1],
      [1, 0, 0, -1, -2, 0],
      [1, 0, 0, -1, -1, -1],
      [1, 0, 0, -1, -1, 0],
      [1, 1, -1, -1, -2, -1],
      [1, 1, 0, -2, -3, -2],
      [1, 1, 0, -2, -2, -2],
      [1, 1, 0, -2, -2, -1],
      [1, 1, 0, -1, -3, -2],
      [1, 1, 0, -1, -2, -2],
      [1, 1, 0, -1, -2, -1],
      [1, 1, 0, -1, -1, -1],
      [2, 1, -1, -2, -4, -2],
      [2, 1, -1, -2, -3, -2],
      [2, 2, -1, -3, -5, -3],
      [2, 2, -1, -3, -4, -3],
      [3, 2, -1, -4, -6, -4],
    ],
    20: [
      [0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, -1, -1],
      [1, 0, 0, -1, -2, -1],
      [1, 1, -1, -2, -3, -2],
      [1, 1, -1, -1, -2, -2],
      [1, 1, -1, -1, -2, -1],
      [1, 1, 0, -2, -3, -2],
      [1, 1, 0, -1, -3, -2],
      [1, 1, 0, -1, -2, -2],
      [1, 1, 0, -1, -2, -1],
      [1, 2, -1, -2, -3, -2],
      [2, 1, -1, -2, -4, -3],
      [2, 1, -1, -2, -4, -2],
      [2, 1, -1, -2, -3, -3],
      [2, 1, -1, -2, -3, -2],
      [2, 2, -1, -3, -5, -4],
      [2, 2, -1, -3, -5, -3],
      [2, 2, -1, -3, -4, -3],
      [2, 2, -1, -2, -5, -4],
      [4, 3, -2, -5, -8, -6],
    ],
  };

  const powers = ["", "α", "α²", "α³", "α⁴", "α⁵"];
  const buttons = document.querySelectorAll("#davidson-coordinate-picker [data-graph]");
  const table = document.getElementById("davidson-coordinate-table");

  function formatPolynomial(coefficients) {
    const terms = [];
    coefficients.forEach((coefficient, degree) => {
      if (coefficient === 0) return;
      const magnitude = Math.abs(coefficient);
      const factor = degree > 0 && magnitude === 1 ? "" : String(magnitude);
      const sign = coefficient < 0 ? "−" : "+";
      const prefix = terms.length > 0 ? ` ${sign} ` : (coefficient < 0 ? "−" : "");
      terms.push(prefix + factor + powers[degree]);
    });
    return terms.join("") || "0";
  }

  function showCoordinates(graph) {
    table.tBodies[0].replaceChildren(...coordinates[graph].map((coefficients, vertex) => {
      const row = document.createElement("tr");
      const label = document.createElement("th");
      label.scope = "row";
      label.textContent = vertex;
      row.append(label);
      row.insertCell().textContent = formatPolynomial(coefficients);
      return row;
    }));
    buttons.forEach(button => {
      const selected = button.dataset.graph === graph;
      button.setAttribute("aria-pressed", String(selected));
      button.classList.toggle("btn-primary", selected);
    });
  }

  buttons.forEach(button => {
    button.addEventListener("click", () => showCoordinates(button.dataset.graph));
  });
  showCoordinates("24");
</script>

## The Exoo–Ismailescu constructions

**21 vertices.** Exoo and Ismailescu started with an 11-vertex graph containing two independent triples. In every proper three-coloring of the base graph, at least one of the triples is monochromatic. They attached a unit pentagon to each triple, with each vertex of the pentagon adjacent to a member of its triple. The pentagon attached to a monochromatic triple has only two colors available, which cannot color an odd cycle. [Soifer, §16.3](https://www.cs.rit.edu/~spr/COURSES/CCOMP/soifer.pdf#page=181)

**19 vertices.** They found a 14-vertex base graph in which the same independent triple is monochromatic in every proper three-coloring. A single attached unit pentagon then gives the two-color obstruction. [Soifer, §16.4](https://www.cs.rit.edu/~spr/COURSES/CCOMP/soifer.pdf#page=186)

**17 vertices.** They searched for abstract triangle-free, four-chromatic graphs that become three-colorable when any edge is removed. To find a unit-distance embedding of the 17-vertex candidate, they used its nine four-cycles. In a unit-distance drawing, each four-cycle forms a rhombus, so its diagonals have the same midpoint. These relations reduced the embedding problem to six equations in six parameters.

Their search also established that 17 is the minimum for a **faithful** triangle-free, four-chromatic unit-distance graph in the plane, where every pair of points at distance one counts as an edge. They ruled out all candidates on 15 or fewer vertices. The only 16-vertex candidate whose edges could all be drawn at unit length necessarily acquires two extra unit-distance edges, which create triangles. [Soifer, §16.5](https://www.cs.rit.edu/~spr/COURSES/CCOMP/soifer.pdf#page=189)

## References

- Jonathan Davidson. “Coloring Monomial Cayley Graphs: The One-Parameter Case” (2026), §4.3, for Davidson 24. [arXiv:2610.09474](https://arxiv.org/html/2610.09474v1#S4.SS3)
- Geoffrey Exoo and Dan Ismailescu. “Small Order Triangle-Free 4-Chromatic Unit Distance Graphs.” *Geombinatorics* 26(2) (2016), 49–64, for the 17-, 19-, and 21-vertex constructions. [Journal issue](https://geombina.uccs.edu/past-issues/volume-xxvi)
- Alexander Soifer. “Exoo–Ismailescu: The Final Word on Problem 15.4.” *The New Mathematical Coloring Book*, Springer (2024), 147–160, §§16.3–16.5. [Chapter 16](https://link.springer.com/chapter/10.1007/978-1-0716-3597-1_16)
- Haroldo Costa Silva Filho. Table 3 of arXiv:2607.19995v1 (2026), for the coordinates of the base of Exoo–Ismailescu 19. [Table 3](https://arxiv.org/html/2607.19995v1#S6.T3)
