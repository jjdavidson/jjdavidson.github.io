import { mountConstruction } from "../shared/construction-player.js";

const durations = [0, 3000, 4200, 2100, 0, 2500, 0, 2700, 850, 0];
const slate = "#354459";
const blue = "#2556a3";
const violet = "#7545aa";
const orange = "#ae570d";
const red = "#b4232f";
const palette = ["#6739a6", "#aa5c07", "#297146", "#2161aa", "#ab3168"];
const turnAngle = Math.acos(7 / 8);
const ease = t => t * t * (3 - 2 * t);

function rotateAround([x, y], [a, b], angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [a + c * (x - a) - s * (y - b), b + s * (x - a) + c * (y - b)];
}

function bounds(points) {
  const x = points.map(point => point[0]);
  const y = points.map(point => point[1]);
  const left = Math.min(...x);
  const right = Math.max(...x);
  const bottom = Math.min(...y);
  const top = Math.max(...y);
  return { x: (left + right) / 2, y: (bottom + top) / 2, w: right - left, h: top - bottom };
}

function createDrawing(canvas, geometry) {
  const ctx = canvas.getContext("2d");
  const { seed, paths, g1, g2, g3 } = geometry;
  const [a, b] = g1.pair.map(index => g1.points[index]);
  const [left, center, right, upperLeft, upperRight] = g2.marks;
  const [pivotLeft, pivotRight] = [upperLeft, upperRight].map(index => g2.points[index]);
  const fixedTip = g2.points[right];
  const hinge = g2.points[left];
  const [closingStart, closingEnd] = g3.closingEdge.map(index => g3.points[index]);
  const closingHinge = g3.points[g3.copies[0][left]];
  const marked = new Set(g2.marks);
  const solid = g2.edges.filter(([u, v]) => marked.has(u) && marked.has(v));
  const virtual = g2.copies.map(copy => g1.pair.map(index => copy[index]));
  const seedView = bounds(seed.points);
  const g1View = bounds(g1.points);
  const g2View = bounds([...g1.points, ...g2.points]);
  const g3View = bounds(g3.points);
  const views = [
    seedView, seedView, g1View, g1View, g1View, g2View,
    g2View, g3View, g3View, g3View
  ];
  const colorGroups = palette.map(() => []);
  g3.colors.forEach((color, i) => colorGroups[color].push(g3.points[i]));
  const pathEdges = paths.map(path => path.slice(1).map((vertex, i) => [path[i], vertex]));
  const seedTriangles = seed.edges.filter(([u, v]) => Math.floor(u / 7) !== Math.floor(v / 7));
  const seedGroups = [
    { pairs: seedTriangles, color: slate, opacity: 0.64, size: 1.3 },
    ...palette.slice(0, 3).map((color, ring) => ({
      pairs: seed.edges.filter(([u, v]) => Math.floor(u / 7) === ring && Math.floor(v / 7) === ring),
      color, opacity: 0.82, size: 1.6,
    })),
  ].map(group => ({
    ...group,
    vectors: group.pairs.map(([u, v]) => {
      const [x, y] = seed.points[u];
      const [endX, endY] = seed.points[v];
      return { x, y, dx: endX - x, dy: endY - y };
    }),
  }));
  const negatives = seedGroups.flatMap(({ vectors }) =>
    vectors.map(({ dx, dy }) => ({ x: 0, y: 0, dx: -dx, dy: -dy })));
  const labels = [];
  let width = 0;
  let height = 0;
  let scale = 1;

  function edges(points, pairs, color, opacity, size, dashed = false) {
    ctx.save();
    ctx.beginPath();
    for (const [u, v] of pairs) {
      ctx.moveTo(...points[u]);
      ctx.lineTo(...points[v]);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = size / scale;
    ctx.lineCap = "round";
    ctx.globalAlpha = opacity;
    if (dashed) ctx.setLineDash([5 / scale, 4 / scale]);
    ctx.stroke();
    ctx.restore();
  }

  function dots(points, color, size, opacity = 1) {
    const radius = size / scale;
    ctx.save();
    ctx.beginPath();
    for (const [x, y] of points) {
      ctx.moveTo(x + radius, y);
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
    }
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.fill();
    ctx.restore();
  }

  function mark(point, name, color, dx = 9, dy = -11, align = "left") {
    dots([point], "#fff", 6.5);
    dots([point], color, 4.8);
    if (name) labels.push({ point, name, dx, dy, align });
  }

  function drawGraph(graph, color, edgeOpacity, dotOpacity) {
    edges(graph.points, graph.edges, color, edgeOpacity, 0.75);
    dots(graph.points, color, 1.1, dotOpacity);
  }

  function drawCopy(graph, pivot, angle, color, edgeOpacity, dotOpacity) {
    ctx.save();
    ctx.translate(...pivot);
    ctx.rotate(angle);
    ctx.translate(-pivot[0], -pivot[1]);
    drawGraph(graph, color, edgeOpacity, dotOpacity);
    ctx.restore();
  }

  function drawSeed() {
    for (const { pairs, color, opacity, size } of seedGroups) {
      edges(seed.points, pairs, color, opacity, size);
    }
    dots(seed.points, slate, 3.4);
  }

  function drawArrows(vectors, shift, reach, color, opacity, size) {
    const head = Math.min(4.5 / scale, reach / 3);
    ctx.save();
    ctx.beginPath();
    for (const { x, y, dx, dy } of vectors) {
      const startX = x * (1 - shift);
      const startY = y * (1 - shift);
      const tipX = startX + reach * dx;
      const tipY = startY + reach * dy;
      ctx.moveTo(startX, startY);
      ctx.lineTo(tipX, tipY);
      ctx.moveTo(tipX - head * (dx + dy / 2), tipY - head * (dy - dx / 2));
      ctx.lineTo(tipX, tipY);
      ctx.lineTo(tipX - head * (dx - dy / 2), tipY - head * (dy + dx / 2));
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = size / scale;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = opacity;
    ctx.stroke();
    ctx.restore();
  }

  function drawDirections(progress) {
    if (progress <= 0.1) {
      drawSeed();
      return;
    }

    const shift = ease(Math.min(1, (progress - 0.1) / 0.55));
    const reach = ease(Math.max(0, (progress - 0.75) / 0.25));
    if (reach > 0) drawArrows(negatives, 0, reach, blue, 0.76, 1.2);
    for (const { vectors, color, opacity, size } of seedGroups) {
      drawArrows(vectors, shift, 1, color, opacity, size);
    }
    if (shift < 1) dots(seed.points, slate, 3.4, 1 - shift);
    else mark([0, 0], "0", slate, 8, 11);
  }

  function drawPaths(progress) {
    const position = progress < 0.2 ? progress / 0.2 : 1 + (paths.length - 1) * (progress - 0.2) / 0.8;
    const complete = Math.min(paths.length, Math.floor(position));
    const visited = new Set(paths.slice(0, complete).flat());
    edges(g1.points, pathEdges.slice(0, complete).flat(), blue, 0.21, 0.9);
    dots([...visited].map(index => g1.points[index]), slate, 1.35, 0.65);
    if (complete < paths.length) {
      const path = paths[complete].map(index => g1.points[index]);
      const segments = (position - complete) * (path.length - 1);
      const whole = Math.floor(segments);
      const from = path[whole];
      const to = path[whole + 1];
      const end = from.map((coordinate, i) => coordinate + (to[i] - coordinate) * (segments - whole));
      const current = [...path.slice(0, whole + 1), end];
      edges(current, current.slice(1).map((_, i) => [i, i + 1]), blue, 0.92, 1.8);
      dots([end], blue, 2.9);
    }
    mark(a, "A", slate, -9, 12, "right");
    mark(b, "B", slate);
  }

  function drawPair() {
    drawGraph(g1, slate, 0.12, 0.4);
    edges(g1.points, [g1.pair], violet, 1, 2.2, true);
    mark(a, "A", orange, -9, 11, "right");
    mark(b, "B", blue);
  }

  function markPairs([leftTip, rightUpper], [rightTip, leftUpper]) {
    mark(leftTip, "L", orange, -11, 10, "right");
    mark(rightTip, "R", orange, 11, 10);
    mark(leftUpper, "U", palette[2], -9, -11, "right");
    mark(rightUpper, "V", palette[3]);
  }

  function drawJoining(progress) {
    if (progress === 0) {
      drawPair();
      return;
    }
    const angle = Math.PI / 3 * ease(progress);
    if (progress === 1) {
      drawGraph(g2, slate, 0.17, 0.68);
    } else {
      drawCopy(g1, pivotLeft, -angle, blue, 0.15, 0.69);
      drawCopy(g1, pivotRight, angle, violet, 0.15, 0.69);
    }
    const leftPair = [a, b].map(point => rotateAround(point, pivotLeft, -angle));
    const rightPair = [a, b].map(point => rotateAround(point, pivotRight, angle));
    edges([...leftPair, ...rightPair], [[0, 1], [2, 3]], violet, 1, 2.2, true);
    markPairs(leftPair, rightPair);
  }

  function drawEquality() {
    drawGraph(g2, slate, 0.11, 0.28);
    edges(g2.points, solid, slate, 0.9, 2.2);
    edges(g2.points, virtual, violet, 1, 2.2, true);
    markPairs([g2.points[left], pivotRight], [g2.points[right], pivotLeft]);
    mark(g2.points[center], "O", palette[0], 0, 14, "center");
  }

  function drawClosing(step, progress) {
    const angle = step === 7 ? turnAngle * ease(progress) : turnAngle;
    const colored = step === 9;
    if (colored) {
      edges(g3.points, g3.edges, slate, 0.08, 0.65);
      colorGroups.forEach((group, color) => dots(group, palette[color], 1.55, 0.93));
    } else {
      drawGraph(g2, slate, 0.14, 0.49);
      drawCopy(g2, hinge, angle, blue, 0.18, 0.65);
    }

    if (step === 8) {
      const end = closingStart.map((coordinate, i) => coordinate + (closingEnd[i] - coordinate) * ease(progress));
      edges([closingStart, end], [[0, 1]], red, 1, 3);
    }

    const movedTip = step === 7 ? rotateAround(fixedTip, hinge, angle) : closingEnd;
    const colorAt = index => colored ? palette[g3.colors[index]] : orange;
    mark(closingHinge, "L", colorAt(g3.copies[0][left]), -9, 11, "right");
    mark(closingStart, "R", colorAt(g3.closingEdge[0]), 10, 10);
    if (angle > turnAngle * 0.15) mark(movedTip, "R′", colorAt(g3.closingEdge[1]));
  }

  function draw(step, progress) {
    if (!width || !height) return;
    const view = views[step];
    const padding = Math.min(30, width * 0.18, height * 0.18);
    scale = Math.min((width - 2 * padding) / view.w, (height - 2 * padding) / view.h);
    labels.length = 0;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(scale, -scale);
    ctx.translate(-view.x, -view.y);

    switch (step) {
      case 0: drawSeed(); break;
      case 1: drawDirections(progress); break;
      case 2: drawPaths(progress); break;
      case 3:
        edges(g1.points, g1.edges.slice(0, Math.floor(g1.edges.length * progress)), slate, 0.22, 0.75);
        dots(g1.points, slate, 1.25, 0.65);
        break;
      case 4: drawPair(); break;
      case 5: drawJoining(progress); break;
      case 6: drawEquality(); break;
      default: drawClosing(step, progress);
    }
    ctx.restore();

    ctx.font = "600 14px system-ui, sans-serif";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#fff";
    ctx.fillStyle = slate;
    for (const { point, name, dx, dy, align } of labels) {
      const x = width / 2 + (point[0] - view.x) * scale + dx;
      const y = height / 2 - (point[1] - view.y) * scale + dy;
      ctx.textAlign = align;
      ctx.strokeText(name, x, y);
      ctx.fillText(name, x, y);
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  return { draw, resize };
}

export function mount(root, { autoplay = false } = {}) {
  return mountConstruction(root, { autoplay, durations, createDrawing });
}
