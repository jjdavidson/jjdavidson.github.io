const TAU = 2 * Math.PI;
const vertexColors = ["#FBBC05", "#34A853", "#4285F4"];
const highlight = "#c32635";

function canvasViewport(canvas) {
  const context = canvas.getContext("2d");
  let width = 0, height = 0;
  function resize() {
    ({ width, height } = canvas.getBoundingClientRect());
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  function clear() {
    if (!width || !height) return null;
    context.clearRect(0, 0, width, height);
    return { width, height };
  }
  return { context, resize, clear };
}

function label(context, text, x, y) {
  context.lineWidth = 4;
  context.strokeStyle = "#fff";
  context.strokeText(text, x, y);
  context.fillStyle = highlight;
  context.fillText(text, x, y);
}

function dot(context, x, y, radius, color) {
  context.beginPath();
  context.arc(x, y, radius, 0, TAU);
  context.fillStyle = color;
  context.fill();
}

function arrow(context, from, to, radius) {
  const dx = to.x - from.x, dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  const ux = dx / length, uy = dy / length;
  const short = length < 2 * radius + 13;
  const inset = short ? length * 0.14 : radius + 3;
  const offset = short ? radius + 5 : 0;
  const x = to.x - ux * inset + uy * offset;
  const y = to.y - uy * inset - ux * offset;
  const head = Math.min(9, (length - 2 * inset) * 0.65);
  context.beginPath();
  context.moveTo(from.x + ux * inset + uy * offset, from.y + uy * inset - ux * offset);
  context.lineTo(x, y);
  context.strokeStyle = highlight;
  context.lineWidth = 3;
  context.stroke();
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x - head * ux + 0.46 * head * uy, y - head * uy - 0.46 * head * ux);
  context.lineTo(x - head * ux - 0.46 * head * uy, y - head * uy + 0.46 * head * ux);
  context.closePath();
  context.fillStyle = highlight;
  context.fill();
}

function subscript(label) {
  return label.replace(/\d/g, digit => "₀₁₂₃₄₅₆₇₈₉"[Number(digit)]);
}

function clamp(value, lower, upper) {
  return Math.max(lower, Math.min(upper, value));
}

export function createGraphDrawing(canvas) {
  const { context, resize, clear } = canvasViewport(canvas);

  function draw(graph, referenceAngle, selected) {
    const viewport = clear();
    if (!viewport) return;
    const { width, height } = viewport;
    const { vertices, edges, colors } = graph;
    const cosine = Math.cos(referenceAngle), sine = Math.sin(referenceAngle);
    const rotated = vertices.map(({ x, y }) => ({
      x: x * cosine + y * sine,
      y: -x * sine + y * cosine,
    }));
    const xs = rotated.map(point => point.x), ys = rotated.map(point => point.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const centerX = (minX + maxX) / 2, centerY = (minY + maxY) / 2;
    const unit = Math.max(1, Math.min(
      (width - 68) / Math.max(1, maxX - minX),
      (height - 68) / Math.max(1, maxY - minY),
    ));
    const points = rotated.map(({ x, y }) => ({
      x: width / 2 + unit * (x - centerX),
      y: height / 2 - unit * (y - centerY),
    }));
    const radius = vertices.length > 70 ? 6 : 8;
    const selectedEdges = selected?.edges ?? [];
    context.lineCap = "round";
    context.lineJoin = "round";
    for (const type of ["outer", "inner", "spoke"]) {
      context.beginPath();
      for (const edge of edges) {
        if (edge.type !== type) continue;
        const start = points[edge.u], end = points[edge.v];
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
      }
      context.strokeStyle = type === "spoke" ? "#6b7d95" : "#8b99ab";
      context.lineWidth = type === "spoke" ? 1.6 : 1.3;
      context.stroke();
    }
    for (const { u, v } of selectedEdges) {
      arrow(context, points[u], points[v], radius);
    }

    points.forEach(({ x, y }, i) => {
      dot(context, x, y, radius, vertexColors[colors[i]]);
      context.strokeStyle = "#fff";
      context.lineWidth = 1;
      context.stroke();
    });
    context.font = "600 14px system-ui, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    const labeled = new Set();
    for (const { u, v } of selectedEdges) {
      const from = points[u], to = points[v];
      const length = Math.hypot(to.x - from.x, to.y - from.y);
      const dx = (to.x - from.x) * (radius + 12) / length;
      const dy = (to.y - from.y) * (radius + 12) / length;
      for (const [index, x, y] of [[u, from.x - dx, from.y - dy], [v, to.x + dx, to.y + dy]]) {
        if (labeled.has(index)) continue;
        labeled.add(index);
        label(context, subscript(vertices[index].label), clamp(x, 14, width - 14),
          clamp(y, 10, height - 10));
      }
    }
  }
  return { resize, draw };
}

export function createDirectionDrawing(canvas) {
  const { context, resize, clear } = canvasViewport(canvas);
  let targets = [];

  function draw(parameters, selected) {
    const viewport = clear();
    targets = [];
    if (!viewport) return;
    const { width, height } = viewport;
    const centerX = width / 2, centerY = height / 2;
    const radius = Math.max(12, Math.min(width, height) / 2 - 46);
    context.lineWidth = 1;
    context.strokeStyle = "#000";
    context.beginPath();
    context.moveTo(centerX - radius - 8, centerY);
    context.lineTo(centerX + radius + 8, centerY);
    context.moveTo(centerX, centerY - radius - 8);
    context.lineTo(centerX, centerY + radius + 8);
    context.stroke();
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, TAU);
    context.stroke();

    targets = parameters.map(parameter => ({
      parameter,
      x: centerX + radius * Math.cos(parameter.angle),
      y: centerY - radius * Math.sin(parameter.angle),
    }));
    for (const { x, y } of targets) dot(context, x, y, 4.5, "#000");

    const active = targets.find(target => target.parameter === selected);
    if (!active) return;
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.lineTo(active.x, active.y);
    context.strokeStyle = highlight;
    context.lineWidth = 1.5;
    context.stroke();
    dot(context, active.x, active.y, 6, highlight);
    context.font = "600 16px system-ui, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    label(context, selected.name, centerX + (radius + 17) * Math.cos(selected.angle),
      centerY - (radius + 17) * Math.sin(selected.angle));
  }

  function hitTest(event) {
    const bounds = canvas.getBoundingClientRect();
    const x = event.clientX - bounds.left, y = event.clientY - bounds.top;
    let nearest, distance = 14;
    for (const target of targets) {
      const next = Math.hypot(x - target.x, y - target.y);
      if (next >= distance) continue;
      distance = next;
      nearest = target.parameter;
    }
    return nearest;
  }
  return { resize, draw, hitTest };
}
