const ns = "http://www.w3.org/2000/svg";

export function createGraph(svg, { equalityBadges = false } = {}) {
  let data;
  let positions = [];
  let edges = [];
  let vertices = [];
  let graphLayer;
  let diagonal;
  let diagonalEdge;

  function element(tag, attributes, parent) {
    const node = document.createElementNS(ns, tag);
    for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, String(value));
    parent.appendChild(node);
    return node;
  }

  function sameEdge(a, b, u, v) {
    return (a === u && b === v) || (a === v && b === u);
  }

  function setData(nextData) {
    graphLayer?.remove();
    data = nextData;
    diagonalEdge = null;
    if (!data) return;
    graphLayer = element("g", { "aria-hidden": "true" }, svg);
    const edgeGroup = element("g", {}, graphLayer);
    diagonal = element("line", { "class": "witness-diagonal", "visibility": "hidden" }, graphLayer);
    const vertexGroup = element("g", {}, graphLayer);
    edges = [];
    vertices = [];
    for (const [a, b] of data.edges) {
      const line = element("line", { "stroke-linecap": "round" }, edgeGroup);
      edges.push({ a, b, line });
    }
    data.positions.forEach((_, index) => {
      const group = element("g", { "data-vertex": index }, vertexGroup);
      const circle = element("circle", { r: 18, class: "witness-node" }, group);
      const label = element("text", { y: 4, class: "witness-vertex-label" }, group);
      label.textContent = index;
      let badge;
      let tag;
      if (equalityBadges) {
        badge = element("g", { class: "witness-equality-badge", visibility: "hidden" }, group);
        element("circle", { r: 5 }, badge);
        tag = element("text", { y: 2.8, class: "witness-equality-tag" }, badge);
      }
      vertices.push({ group, circle, label, badge, tag });
    });
    layout();
  }

  function placeLine(line, a, b) {
    line.setAttribute("x1", positions[a][0]);
    line.setAttribute("y1", positions[a][1]);
    line.setAttribute("x2", positions[b][0]);
    line.setAttribute("y2", positions[b][1]);
  }

  function layout() {
    if (!data) return;
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
    for (const { a, b, line } of edges) placeLine(line, a, b);
    vertices.forEach((vertex, index) => {
      vertex.group.setAttribute("transform", `translate(${positions[index][0]} ${positions[index][1]})`);
      vertex.circle.setAttribute("r", radius);
      vertex.label.setAttribute("style", `font-size: ${fontSize}px`);
      vertex.label.setAttribute("y", fontSize * 0.35);
      const badgeOffset = radius * 0.7;
      vertex.badge?.setAttribute("transform", `translate(${badgeOffset} ${-badgeOffset})`);
    });
    renderDiagonal();
  }

  function renderDiagonal() {
    diagonal.setAttribute("visibility", diagonalEdge ? "visible" : "hidden");
    if (diagonalEdge) placeLine(diagonal, ...diagonalEdge);
  }

  function drawFrame({ colors, equalities, focus = [], support = [], evidence = [], baseEdges = [], pentagonEdges = [], conflict = [], assumption = null }) {
    diagonalEdge = assumption;
    renderDiagonal();
    for (const { a, b, line } of edges) {
      const collision = sameEdge(a, b, ...conflict);
      const active = evidence.some(edge => sameEdge(a, b, ...edge));
      const base = baseEdges.some(edge => sameEdge(a, b, ...edge));
      const pentagon = pentagonEdges.some(edge => sameEdge(a, b, ...edge));
      line.setAttribute("stroke", collision ? "#ea4335" : pentagon ? "#7c3aed" : active ? "#343434" : base ? "#9ca3af" : "#cbd0d7");
      line.setAttribute("stroke-width", collision ? 4 : active ? 2.8 : pentagon ? 2.4 : base ? 1.8 : 1.2);
      line.setAttribute("opacity", collision || pentagon || active || base ? 1 : 0.7);
      line.dataset.collision = String(collision);
    }

    vertices.forEach((vertex, index) => {
      const color = colors?.get(index);
      const equality = equalities?.get(index);
      const collision = conflict.includes(index);
      const focused = focus.includes(index);
      const supporting = support.includes(index);
      vertex.circle.setAttribute("fill", color?.fill ?? (equality ? "#d1d5db" : "#f3f4f6"));
      const outline = equality ? "#6b7280" : "#b5bbc4";
      vertex.circle.setAttribute("stroke", collision ? "#ea4335" : focused || supporting ? "#343434" : outline);
      vertex.circle.setAttribute("stroke-width", collision || focused ? 3 : supporting ? 2 : 1);
      vertex.group.dataset.color = color?.name ?? "unassigned";
      vertex.group.dataset.collision = String(collision);
      if (vertex.badge) {
        vertex.group.dataset.group = equality ?? "";
        const visibleTag = color ? "" : equality ?? "";
        vertex.badge.setAttribute("visibility", visibleTag ? "visible" : "hidden");
        vertex.tag.textContent = visibleTag;
      }
    });
  }

  new ResizeObserver(layout).observe(svg);
  return { setData, drawFrame };
}
