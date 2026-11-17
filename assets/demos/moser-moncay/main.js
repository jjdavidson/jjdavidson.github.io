const minimumGridRadius = 8;
const rootThree = Math.sqrt(3);
const palette = ["#FBBC05", "#34A853", "#4285F4"];
const clashColor = "#b4232f";
const trussStyle = { color: "#414e61", width: 1.8 };
const gridStyle = { color: "#e1e5ec", width: 0.8 };
const norm = (m, n) => m * m + m * n + n * n;
const colorOf = (m, n) => ((m - n) % 3 + 3) % 3;

function buildGrid(radius) {
  const points = [];
  const rows = [];
  const index = new Map();
  const bound = Math.ceil(2 * radius / rootThree);
  for (let m = -bound; m <= bound; m++) {
    const first = points.length;
    for (let n = -bound; n <= bound; n++) {
      const squaredRadius = norm(m, n);
      if (squaredRadius > radius * radius) continue;
      index.set(`${m},${n}`, points.length);
      points.push({ m, n, squaredRadius, x: m + n / 2, y: n * rootThree / 2, color: colorOf(m, n) });
    }
    if (points.length > first) rows.push([first, points.length]);
  }
  return { points, rows, index, edges: unitEdges(points, index), origin: index.get("0,0") };
}

function unitEdges(points, index, vertices) {
  const edges = [];
  const directions = [[1, 0], [0, 1], [1, -1]];
  for (const i of vertices ?? index.values()) {
    const { m, n } = points[i];
    for (const [a, b] of directions) {
      const j = index.get(`${m + a},${n + b}`);
      if (j !== undefined && (!vertices || vertices.has(j))) edges.push([i, j]);
    }
  }
  return edges;
}

function findTip(squaredRadius) {
  // Every lattice shell has a point with m >= n >= 0 by rotation and reflection.
  for (let n = Math.floor(Math.sqrt(squaredRadius / 3)); n >= 0; n--) {
    const m = (Math.sqrt(4 * squaredRadius - 3 * n * n) - n) / 2;
    if (Number.isInteger(m) && m >= n && norm(m, n) === squaredRadius) return [m, n];
  }
  return null;
}

function trussToTip({ points, index }, m, n) {
  const tip = index.get(`${m},${n}`);
  const vertices = new Set();
  const addUpTriangle = (i, j) => {
    vertices.add(index.get(`${i},${j}`));
    vertices.add(index.get(`${i + 1},${j}`));
    vertices.add(index.get(`${i},${j + 1}`));
  };
  // Successive upward triangles include the vertices of the triangle between them.
  for (let i = 0; i < m; i++) addUpTriangle(i, 0);
  for (let j = 1; j < n; j++) addUpTriangle(m - 1, j);
  // Off the horizontal axis, the tip completes the final downward triangle.
  vertices.add(tip);
  return { tip, vertices, edges: unitEdges(points, index, vertices) };
}

function classifyRotation({ points, origin }, { vertices }, squaredRadius) {
  const denominator = 2 * squaredRadius;
  const cosineNumerator = denominator - 1;
  const sineTerm = Math.sqrt(3 * (4 * squaredRadius - 1));
  const rationalSine = Number.isInteger(sineTerm);
  const overlaps = [[origin, origin]];
  const distances = [];

  // With cos(theta) = (2N - 1)/(2N), only the determinant term can be
  // irrational. A unit distance or coincidence then requires it to vanish.
  for (const i of vertices) {
    if (i === origin) continue;
    const p = points[i];
    for (const j of vertices) {
      if (j === origin) continue;
      const q = points[j];
      const twiceDot = 2 * (p.m * q.m + p.n * q.n) + p.m * q.n + p.n * q.m;
      const determinant = p.m * q.n - p.n * q.m;
      if (!rationalSine && determinant !== 0) continue;
      const twiceProjection = twiceDot * cosineNumerator - determinant * sineTerm;
      const sum = p.squaredRadius + q.squaredRadius;
      if (twiceProjection === denominator * sum) {
        overlaps.push([i, j]);
      } else if (twiceProjection === denominator * (sum - 1)) {
        distances.push([i, j]);
      }
    }
  }

  const fixedShared = new Set(overlaps.map(([i]) => i));
  const turnedShared = new Set(overlaps.map(([, j]) => j));
  const crossEdges = distances.filter(([i, j]) => !fixedShared.has(i) && !turnedShared.has(j));
  return { overlaps, turnedShared, crossEdges };
}

function matchColor(color, swapped) {
  return swapped ? (3 - color) % 3 : color;
}

function compareColors(points, { crossEdges, overlaps }, swapped) {
  const edgeClashes = new Set();
  crossEdges.forEach(([i, j], index) => {
    if (points[i].color === matchColor(points[j].color, swapped)) edgeClashes.add(index);
  });
  const pointClashes = overlaps
    .filter(([i, j]) => points[i].color !== matchColor(points[j].color, swapped))
    .map(([i]) => i);
  return { edgeClashes, pointClashes, total: edgeClashes.size + pointClashes.length };
}

function graphSize(truss, geometry = null) {
  if (!geometry) return { vertices: truss.vertices.size, edges: truss.edges.length };
  const labels = new Map([...truss.vertices].map((vertex, i) => [vertex, i]));
  const size = labels.size;
  const parent = Array.from({ length: 2 * size }, (_, i) => i);
  function find(i) {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]];
      i = parent[i];
    }
    return i;
  }
  for (const [fixed, turned] of geometry.overlaps) {
    parent[find(labels.get(fixed))] = find(size + labels.get(turned));
  }
  const edges = new Set();
  function addEdge(a, b) {
    const i = find(a), j = find(b);
    if (i !== j) edges.add(i < j ? `${i},${j}` : `${j},${i}`);
  }
  for (const [i, j] of truss.edges) {
    addEdge(labels.get(i), labels.get(j));
    addEdge(size + labels.get(i), size + labels.get(j));
  }
  for (const [i, j] of geometry.crossEdges) addEdge(labels.get(i), size + labels.get(j));
  return { vertices: new Set(parent.map((_, i) => find(i))).size, edges: edges.size };
}

function betaPolynomial(squaredRadius) {
  const leading = squaredRadius === 1 ? "" : String(squaredRadius);
  const middle = 2 * squaredRadius - 1 === 1 ? "" : String(2 * squaredRadius - 1);
  return {
    html: `${leading}<var>x</var><sup>4</sup> − ${middle}<var>x</var><sup>2</sup> + ${squaredRadius}`,
    text: `${leading}x⁴ − ${middle}x² + ${squaredRadius}`
  };
}

function createDrawing(canvas, { points, rows, edges, origin, index }) {
  const ctx = canvas.getContext("2d");
  const one = index.get("1,0");
  const alpha = index.get("0,1");
  let width = 0;
  let height = 0;

  function strokeEdges(pairs, start, end, { color, width: lineWidth }) {
    ctx.beginPath();
    for (const [i, j] of pairs) {
      if (!start[i] || !end[j]) continue;
      const [x1, y1] = start[i];
      const [x2, y2] = end[j];
      if ((x1 < -2 && x2 < -2) || (x1 > width + 2 && x2 > width + 2) ||
          (y1 < -2 && y2 < -2) || (y1 > height + 2 && y2 > height + 2)) continue;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  function rowOffsets(position, step, limit, margin) {
    if (step === 0) {
      return position < -margin || position > limit + margin ? [Infinity, -Infinity] : [-Infinity, Infinity];
    }
    const a = (-margin - position) / step;
    const b = (limit + margin - position) / step;
    return [Math.min(a, b), Math.max(a, b)];
  }

  function visiblePositions(project, margin) {
    const positions = new Array(points.length);
    const [originX, originY] = project(points[origin]);
    const [alphaX, alphaY] = project(points[alpha]);
    const dx = alphaX - originX;
    const dy = alphaY - originY;
    // Along each row, m is fixed and each successive point moves by alpha.
    for (const [first, end] of rows) {
      const [x, y] = project(points[first]);
      const [left, right] = rowOffsets(x, dx, width, margin);
      const [top, bottom] = rowOffsets(y, dy, height, margin);
      const from = Math.max(0, Math.ceil(Math.max(left, top)));
      const through = Math.min(end - first - 1, Math.floor(Math.min(right, bottom)));
      for (let offset = from; offset <= through; offset++) {
        const i = first + offset;
        positions[i] = project(points[i]);
      }
    }
    return positions;
  }

  function vertex([x, y], size, color) {
    ctx.beginPath();
    ctx.fillStyle = palette[color];
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
  }

  function backgroundPoints(positions, radius, dense) {
    ctx.fillStyle = "#bcc5d3";
    ctx.beginPath();
    positions.forEach(([x, y]) => {
      if (x < -2 || x > width + 2 || y < -2 || y > height + 2) return;
      if (dense) {
        ctx.fillRect(x - radius, y - radius, 2 * radius, 2 * radius);
      } else {
        ctx.moveTo(x + radius, y);
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
      }
    });
    if (!dense) ctx.fill();
  }

  function markRotation([x, y], [oneX], angle) {
    const radius = Math.min(64, (oneX - x) * 0.65);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, -angle, true);
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 1.25;
    ctx.stroke();

    // Leave room for the label beside the arc when the two rays are close.
    const labelPosition = angle * radius < 24
      ? [x + radius + 9, y - radius * Math.sin(angle) - 12]
      : [x + (radius + 12) * Math.cos(angle / 2), y - (radius + 12) * Math.sin(angle / 2)];
    ctx.font = "600 15px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.strokeText("θ", ...labelPosition);
    ctx.fillStyle = "#334155";
    ctx.fillText("θ", ...labelPosition);
  }

  function draw(angle, truss, geometry, colors, swapped) {
    if (!width || !height) return;
    ctx.clearRect(0, 0, width, height);
    const c = Math.cos(angle ?? 0);
    const s = Math.sin(angle ?? 0);
    const rotate = ({ x, y }) => ({ x: c * x - s * y, y: s * x + c * y });
    const focus = [...truss.vertices].flatMap(i => angle === null ? [points[i]] : [points[i], rotate(points[i])]);
    const xs = focus.map(({ x }) => x);
    const ys = focus.map(({ y }) => y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const padding = Math.min(54, Math.min(width, height) * 0.14);
    const scale = Math.min((width - 2 * padding) / (maxX - minX), (height - 2 * padding) / (maxY - minY));
    const midX = (minX + maxX) / 2, midY = (minY + maxY) / 2;
    const project = ({ x, y }) => [width / 2 + scale * (x - midX), height / 2 - scale * (y - midY)];
    const size = Math.min(5, scale * 0.18);
    const tipSize = Math.min(8, scale * 0.24);
    const backgroundSize = Math.min(1.35, scale * 0.12);
    // At small scales the backdrop reads as a lattice of points, while the
    // highlighted trusses retain all of their edges.
    const dense = scale < 14;
    // Keep one extra unit for lattice edges with an endpoint off screen.
    const margin = dense ? 2 : scale + 2;
    const fixed = visiblePositions(project, margin);
    const turned = angle === null ? null : visiblePositions(point => project(rotate(point)), margin);
    if (!dense) strokeEdges(edges, fixed, fixed, gridStyle);
    backgroundPoints(fixed, backgroundSize, dense);

    if (turned) {
      if (!dense) strokeEdges(edges, turned, turned, gridStyle);
      backgroundPoints(turned, backgroundSize, dense);
    }

    strokeEdges(truss.edges, fixed, fixed, trussStyle);
    if (turned) strokeEdges(truss.edges, turned, turned, trussStyle);

    if (geometry) {
      strokeEdges(geometry.crossEdges, fixed, turned, trussStyle);
      const closingClash = geometry.crossEdges.some(([i, j], edgeIndex) =>
        i === truss.tip && j === truss.tip && colors.edgeClashes.has(edgeIndex)
      );
      if (closingClash) {
        strokeEdges([[truss.tip, truss.tip]], fixed, turned, {
          color: clashColor,
          width: Math.min(3.4, scale * 0.55)
        });
      }
    }

    if (angle > 0) markRotation(fixed[origin], project(points[one]), angle);
    for (const index of truss.vertices) {
      if (index === origin || index === truss.tip) continue;
      const { color } = points[index];
      vertex(fixed[index], size, color);
      if (turned && !geometry?.turnedShared.has(index)) {
        vertex(turned[index], size, matchColor(color, swapped));
      }
    }
    vertex(fixed[origin], tipSize, 0);
    const tipColor = points[truss.tip].color;
    vertex(fixed[truss.tip], tipSize, tipColor);
    if (turned) vertex(turned[truss.tip], tipSize, matchColor(tipColor, swapped));
    if (colors) {
      ctx.strokeStyle = clashColor;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (const index of colors.pointClashes) {
        const [x, y] = fixed[index];
        ctx.moveTo(x + size + 3, y);
        ctx.arc(x, y, size + 3, 0, 2 * Math.PI);
      }
      ctx.stroke();
    }
  }

  function resize() {
    ({ width, height } = canvas.getBoundingClientRect());
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  return { draw, resize };
}

export function mount(root) {
  const get = role => root.querySelector(`[data-role="${role}"]`);
  const canvas = get("canvas");
  const radiusInput = get("squared-radius");
  const rotation = get("rotation");
  const error = get("radius-error");
  const result = get("result");
  const phase = get("phase");
  const vertexLabel = get("vertices");
  const edgeLabel = get("edges");
  const colorableLabel = get("three-colorable");
  const angleLabel = get("angle");
  const polynomialLabel = get("polynomial");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const maximum = Number(radiusInput.max);
  let grid;
  let drawing;
  let gridRadius = 0;
  let selectedRadius;
  let truss;
  let rotationOn = false;
  let angle = 0;
  let targetAngle = 0;
  let geometry;
  let coloring;
  let swapped = false;
  let frame = null;
  let turning = false;

  function draw() {
    const settled = rotationOn && !turning;
    const visibleAngle = rotationOn || turning ? angle : null;
    drawing.draw(visibleAngle, truss, settled ? geometry : null, settled ? coloring : null, swapped);
  }

  function report() {
    const counts = graphSize(truss, rotationOn ? geometry : null);
    const threeColorable = !rotationOn || coloring.total === 0;
    const degrees = targetAngle * 180 / Math.PI;
    const polynomial = betaPolynomial(selectedRadius);
    vertexLabel.textContent = String(counts.vertices);
    edgeLabel.textContent = String(counts.edges);
    colorableLabel.textContent = threeColorable ? "Yes" : "No";
    angleLabel.textContent = `${(rotationOn ? degrees : 0).toFixed(2)}°`;
    polynomialLabel.innerHTML = polynomial.html;
    result.setAttribute("aria-busy", "false");
    phase.hidden = true;
    canvas.setAttribute("aria-label", `Highlighted graph: ${counts.vertices} vertices, ${counts.edges} edges. ${threeColorable ? "3-colorable" : "Not 3-colorable"}. Rotation angle ${(rotationOn ? degrees : 0).toFixed(2)} degrees. Minimal polynomial of beta: ${polynomial.text}.`);
  }

  function finish(target) {
    angle = target;
    turning = false;
    frame = null;
    report();
    draw();
  }

  function animateRotation() {
    if (frame !== null) cancelAnimationFrame(frame);
    const target = rotationOn ? targetAngle : 0;
    const start = angle;
    if (reduced.matches || target === start) {
      finish(target);
      return;
    }
    turning = true;
    result.setAttribute("aria-busy", "true");
    phase.hidden = false;
    phase.textContent = rotationOn ? "Rotating the second grid…" : "Undoing the rotation…";
    let startTime;
    function tick(time) {
      startTime ??= time;
      const progress = Math.min(1, (time - startTime) / 500);
      if (progress === 1) {
        finish(target);
        return;
      }
      angle = start + (target - start) * progress * progress * (3 - 2 * progress);
      draw();
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
  }

  function applyRadius() {
    const squaredRadius = radiusInput.valueAsNumber;
    const inRange = Number.isInteger(squaredRadius) && squaredRadius >= 1 && squaredRadius <= maximum;
    const tip = inRange ? findTip(squaredRadius) : null;
    error.hidden = tip !== null;
    radiusInput.setAttribute("aria-invalid", String(tip === null));
    if (!tip) {
      error.textContent = inRange
        ? `No triangular lattice point has squared radius ${squaredRadius}. Showing r² = ${selectedRadius}.`
        : `Enter an integer from 1 to ${maximum.toLocaleString()}. Showing r² = ${selectedRadius}.`;
      return;
    }
    selectedRadius = squaredRadius;
    const radius = Math.max(minimumGridRadius, Math.ceil(Math.sqrt(squaredRadius)));
    if (radius !== gridRadius) {
      gridRadius = radius;
      grid = buildGrid(radius);
      drawing = createDrawing(canvas, grid);
      drawing.resize();
    }
    truss = trussToTip(grid, ...tip);
    geometry = classifyRotation(grid, truss, squaredRadius);
    const direct = compareColors(grid.points, geometry, false);
    const reversed = compareColors(grid.points, geometry, true);
    swapped = reversed.total < direct.total;
    coloring = swapped ? reversed : direct;
    targetAngle = Math.acos(1 - 1 / (2 * squaredRadius));
    animateRotation();
  }

  get("form").addEventListener("submit", event => {
    event.preventDefault();
    applyRadius();
  });
  rotation.addEventListener("click", () => {
    rotationOn = !rotationOn;
    rotation.setAttribute("aria-pressed", String(rotationOn));
    rotation.classList.toggle("btn-primary", rotationOn);
    animateRotation();
  });
  radiusInput.addEventListener("input", () => {
    error.hidden = true;
    radiusInput.setAttribute("aria-invalid", "false");
  });
  radiusInput.value = "3";
  applyRadius();
  new ResizeObserver(() => {
    drawing.resize();
    draw();
  }).observe(canvas);
  radiusInput.disabled = false;
  rotation.disabled = false;
  get("apply").disabled = false;
}
