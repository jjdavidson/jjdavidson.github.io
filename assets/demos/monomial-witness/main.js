const proofRequests = new Map();

function loadProof(url) {
  if (!proofRequests.has(url)) {
    proofRequests.set(url, fetch(url).then(response => {
      if (!response.ok) throw new Error("Proof data did not load");
      return response.json();
    }));
  }
  return proofRequests.get(url);
}

export async function mount(root, { autoplay = true } = {}) {

  const svg = root.querySelector('[data-role="graph"]');
  const caseLabel = root.querySelector('[data-role="case"]');
  const patternLabel = root.querySelector('[data-role="pattern"]');
  const detail = root.querySelector('[data-role="detail"]');
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const names = ["green", "blue", "yellow"];
  const fills = ["#34a853", "#4285f4", "#fbbc05"];
  const ns = "http://www.w3.org/2000/svg";
  const edges = [];
  const vertices = [];

  let data;
  let positions = [];
  let caseIndex = 0;
  let step = 0;
  let isPlaying = autoplay && !reducedMotion.matches;
  let isVisible = true;
  let animationFrame = null;
  let previousTime = null;
  let elapsed = 0;

  function element(tag, attributes, parent) {
    const node = document.createElementNS(ns, tag);
    for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, String(value));
    parent.appendChild(node);
    return node;
  }

  function sameEdge(a, b, u, v) {
    return (a === u && b === v) || (a === v && b === u);
  }

  function createGraph() {
    const edgeGroup = element("g", { "aria-hidden": "true" }, svg);
    const vertexGroup = element("g", { "aria-hidden": "true" }, svg);
    for (const [a, b] of data.edges) {
      const line = element("line", { "stroke-linecap": "round" }, edgeGroup);
      edges.push({ a, b, line });
    }
    data.positions.forEach((_, index) => {
      const group = element("g", { "data-vertex": index }, vertexGroup);
      const circle = element("circle", { r: 18, class: "witness-node" }, group);
      const label = element("text", { y: 4, class: "witness-vertex-label" }, group);
      label.textContent = index;
      vertices.push({ group, circle, label });
    });
  }

  function layout() {
    const width = Math.max(240, Math.round(svg.getBoundingClientRect().width));
    const height = width < 460 ? 480 : 420;
    // Rotate wide layouts, then use one scale for both axes to preserve unit lengths.
    const points = data.positions.map(([x, y]) => width >= 460 ? [-y, x] : [x, y]);
    const xs = points.map(p => p[0]);
    const ys = points.map(p => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const scale = Math.min((width - 56) / (maxX - minX), (height - 56) / (maxY - minY));
    positions = points.map(([x, y]) => [
      width / 2 + (x - (minX + maxX) / 2) * scale,
      height / 2 - (y - (minY + maxY) / 2) * scale
    ]);

    let minimumSeparation = Infinity;
    for (let a = 0; a < positions.length; a++) {
      for (let b = a + 1; b < positions.length; b++) {
        minimumSeparation = Math.min(minimumSeparation, Math.hypot(positions[a][0] - positions[b][0], positions[a][1] - positions[b][1]));
      }
    }
    const radius = Math.min(16, minimumSeparation * 0.4);
    const fontSize = Math.max(8, Math.min(12, radius));

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("height", height);
    for (const { a, b, line } of edges) {
      line.setAttribute("x1", positions[a][0]);
      line.setAttribute("y1", positions[a][1]);
      line.setAttribute("x2", positions[b][0]);
      line.setAttribute("y2", positions[b][1]);
    }
    vertices.forEach((vertex, index) => {
      vertex.group.setAttribute("transform", `translate(${positions[index][0]} ${positions[index][1]})`);
      vertex.circle.setAttribute("r", radius);
      vertex.label.setAttribute("style", `font-size: ${fontSize}px`);
      vertex.label.setAttribute("y", fontSize * 0.35);
    });
  }

  function render() {
    const currentCase = data.proof.cases[caseIndex];
    const colors = new Map(data.proof.base_cycle.map((vertex, i) => [vertex, currentCase.pattern[i]]));
    if (currentCase.extra_assumption) colors.set(...currentCase.extra_assumption);
    currentCase.forces.slice(0, step).forEach(force => colors.set(force.vertex, force.color));

    const collision = step === currentCase.forces.length + 1;
    const deduction = step > 0 && !collision ? currentCase.forces[step - 1] : null;
    const extra = currentCase.extra_assumption;
    root.dataset.caseIndex = caseIndex;
    root.dataset.step = step;
    root.dataset.phase = collision ? "collision" : step === 0 ? "initial" : "deduction";
    caseLabel.textContent = `Case ${caseIndex + 1} of ${data.proof.cases.length}`;
    patternLabel.textContent = "";
    const swatch = color => {
      const span = document.createElement("span");
      span.className = `witness-swatch color-${["a", "b", "c"][color]}`;
      span.setAttribute("aria-hidden", "true");
      patternLabel.appendChild(span);
    };
    currentCase.pattern.forEach(swatch);
    if (extra) {
      swatch(extra[1]);
    }
    patternLabel.setAttribute("aria-label", `Pentagon colors: ${currentCase.pattern.map(color => names[color]).join(", ")}` + (extra ? `; vertex ${extra[0]}: ${names[extra[1]]}` : ""));

    for (const { a, b, line } of edges) {
      const conflict = collision && sameEdge(a, b, ...currentCase.conflict_edge);
      const parent = deduction && deduction.neighbors.some(v => sameEdge(a, b, deduction.vertex, v));
      const base = data.proof.base_cycle.some((v, i, cycle) => sameEdge(a, b, v, cycle[(i + 1) % cycle.length]));
      line.setAttribute("stroke", conflict ? "#ea4335" : parent ? "#343434" : base ? "#9ca3af" : "#cbd0d7");
      line.setAttribute("stroke-width", conflict ? 4 : parent ? 2.8 : base ? 1.8 : 1.2);
      line.setAttribute("opacity", conflict || parent || base ? 1 : 0.7);
      line.dataset.collision = conflict ? "true" : "false";
    }

    vertices.forEach((vertex, index) => {
      const assigned = colors.has(index);
      const conflict = collision && currentCase.conflict_edge.includes(index);
      const focus = deduction && deduction.vertex === index;
      const parent = deduction && deduction.neighbors.includes(index);
      vertex.circle.setAttribute("fill", assigned ? fills[colors.get(index)] : "#f3f4f6");
      vertex.circle.setAttribute("stroke", conflict ? "#ea4335" : focus || parent ? "#343434" : "#b5bbc4");
      vertex.circle.setAttribute("stroke-width", conflict || focus ? 3 : parent ? 2 : 1);
      vertex.group.dataset.color = assigned ? names[colors.get(index)] : "unassigned";
      vertex.group.dataset.collision = conflict ? "true" : "false";
    });
  }

  function advance() {
    const currentCase = data.proof.cases[caseIndex];
    if (step === currentCase.forces.length + 1) {
      caseIndex = (caseIndex + 1) % data.proof.cases.length;
      step = 0;
    } else {
      step++;
    }
    render();
  }

  function duration() {
    const count = data.proof.cases[caseIndex].forces.length;
    return step === count + 1 ? 1700 : step === 0 ? 900 : 350;
  }

  function tick(time) {
    animationFrame = null;
    if (!isPlaying || !isVisible || document.hidden) { previousTime = null; return; }
    if (previousTime !== null) elapsed += Math.min(time - previousTime, 200);
    previousTime = time;
    if (elapsed >= duration()) { elapsed = 0; advance(); }
    animationFrame = window.requestAnimationFrame(tick);
  }

  function syncPlayback() {
    root.dataset.playing = String(isPlaying);
    previousTime = null;
    if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    animationFrame = null;
    if (isPlaying && isVisible && !document.hidden) animationFrame = window.requestAnimationFrame(tick);
  }

  async function initialize() {
    try {
      data = await loadProof(root.dataset.proofSrc);
      if (data.positions.length !== 24 || data.proof.cases.length !== 6) throw new Error("Unexpected proof data");
      createGraph();
      layout();
      if (!isPlaying) step = data.proof.cases[caseIndex].forces.length + 1;
      render();

      document.addEventListener("visibilitychange", syncPlayback);
      reducedMotion.addEventListener("change", event => {
        isPlaying = autoplay && !event.matches;
        step = isPlaying ? 0 : data.proof.cases[caseIndex].forces.length + 1;
        elapsed = 0;
        render();
        syncPlayback();
      });
      new ResizeObserver(layout).observe(svg);
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(entries => {
          isVisible = entries[0].isIntersecting;
          syncPlayback();
        }).observe(root);
      }
      syncPlayback();
    } catch (error) {
      root.dataset.phase = "error";
      detail.textContent = "The coloring animation could not load. Please refresh to try again.";
    }
  }

  return initialize();
}
