---
layout: home
title: Home
nav_order: 1
featured_simulation: monomial-witness
---

{% include demos/embed.html name=page.featured_simulation id="featuredSimulation" autoplay=true show_caption=true %}

# Welcome to my website

Hi, my name is Jonathan. I study **combinatorial optimization** problems, drawing on ideas from algebra, analysis, number theory, geometry, and topology. I am especially interested in problems that connect different areas of mathematics and in how these connections help us understand discrete structures.

My current research focuses on **monomial Cayley graphs** and **extremal theory on Hamming graphs**. Monomial Cayley graphs provide an algebraic approach to the Hadwiger–Nelson problem in geometric graph theory. Hamming graphs offer a setting for interpolating between classical extremal graph theory and extremal problems on the hypercube.

My approach is rooted in **experimental mathematics**. I use computational exploration to identify patterns and formulate conjectures, then seek theorems that explain what I observe. My methods include SAT-based searches for finite configurations and flag algebra techniques for establishing extremal bounds. I also develop visualizations and simulations to explore examples, build intuition, and communicate mathematical ideas in research, teaching, and outreach.

I completed my undergraduate studies at **Stanford University**, where I worked on minimal and capillary surfaces and studied how geometric boundary conditions can produce singular behavior in variational surfaces. I later earned my master's degree at **Cal State LA**, where I studied Cayley graphs, intersecting families, Ramsey theory on bipartite graphs, and odd cover problems. My master's thesis explored extremal graph results on product graphs.

I am currently applying for Mathematics PhD programs.

Feel free to explore my [math notes]({{ '/notes/' | relative_url }}) and experiment with my [interactive simulations]({{ '/simulations/' | relative_url }}). They offer background and examples connected to my research, teaching, and outreach.

---

## Contact

<div class="about-contact">
  <img src="{{ '/assets/images/headshot.jpg' | relative_url }}" width="140" height="140" alt="Jonathan Davidson" loading="lazy">
  <div>
    <p><strong>Email</strong>: <a href="mailto:jonathan.j.davidson@gmail.com">jonathan.j.davidson@gmail.com</a></p>
    <p><strong>GitHub</strong>: <a href="https://github.com/jjdavidson">jjdavidson</a></p>
    <p><strong>YouTube</strong>: <a href="https://www.youtube.com/@FiniteJest">@FiniteJest</a></p>
  </div>
</div>

<style>
.about-contact {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem 1.5rem;
}
.about-contact > div {
  min-width: 0;
  overflow-wrap: anywhere;
}
.about-contact p:first-child {
  margin-top: 0;
}
.about-contact img {
  width: 140px;
  max-width: 100%;
  height: auto;
}
</style>
