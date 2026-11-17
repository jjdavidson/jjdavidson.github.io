const cyclotomicCache = new Map();
const svgNamespace = "http://www.w3.org/2000/svg";
const center = 110;
const circleRadius = 82;
const vertexColors = ["#34A853", "#4285F4", "#EA4335"];

function gcd(a, b) {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

function divideMonic(polynomial, divisor) {
  const remainder = polynomial.slice();
  const degree = divisor.length - 1;
  const quotient = Array(polynomial.length - degree).fill(0);
  for (let i = quotient.length - 1; i >= 0; i--) {
    const coefficient = remainder[i + degree];
    quotient[i] = coefficient;
    for (let j = 0; j <= degree; j++) remainder[i + j] -= coefficient * divisor[j];
  }
  return quotient;
}

function cyclotomicPolynomial(order) {
  if (!cyclotomicCache.has(order)) {
    let polynomial = Array(order + 1).fill(0);
    polynomial[0] = -1;
    polynomial[order] = 1;
    // x^n − 1 is the product of Φ_d over the divisors d of n.
    for (let divisor = 1; divisor < order; divisor++) {
      if (order % divisor === 0) {
        polynomial = divideMonic(polynomial, cyclotomicPolynomial(divisor));
      }
    }
    cyclotomicCache.set(order, polynomial);
  }
  return cyclotomicCache.get(order);
}

function eisensteinColoring(order, width) {
  const labels = Array(width).fill(1);
  // For orders that are powers of two, all steps reduce to 1 in E₂.
  if ((order & (order - 1)) === 0) return { labels, modulus: 2 };

  // Integer-degree angles give orders dividing 360. These block labels are the
  // prime-power Eisenstein unit labels projected to a + b mod 3 in E₃.
  const blocksByPrime = [[2, [1, -1]], [3, [1, 1, 1]], [5, [1, 1, 1, 1, -1]]];
  for (const [prime, blocks] of blocksByPrime) {
    let primePower = 1;
    while (order % (primePower * prime) === 0) primePower *= prime;
    if (primePower === 1) continue;
    const blockSize = primePower / prime;
    // The primary components of α multiply to α, so each uses the same exponent.
    for (let exponent = 0; exponent < width; exponent++) {
      const block = Math.floor((exponent % primePower) / blockSize);
      labels[exponent] *= blocks[block];
    }
  }
  return { labels, modulus: 3 };
}

function add(left, right) {
  return left.map((coefficient, i) => coefficient + right[i]);
}

function coordinates(coefficients, basis) {
  let x = 0;
  let y = 0;
  coefficients.forEach((coefficient, i) => {
    x += coefficient * basis[i][0];
    y += coefficient * basis[i][1];
  });
  return [x, y];
}

function directionsFor(angle, highestDegree) {
  // Integer degrees specify roots of unity. Use exact coefficient vectors
  // modulo the minimal polynomial for equality, and floats only for drawing.
  const order = 360 / gcd(360, angle);
  const polynomial = cyclotomicPolynomial(order);
  const degree = polynomial.length - 1;
  const width = Math.min(highestDegree + 1, degree);
  const radians = angle * Math.PI / 180;
  const basis = Array.from({ length: width }, (_, i) => [
    Math.cos(i * radians), Math.sin(i * radians)
  ]);
  const zero = Array(width).fill(0);
  let power = zero.slice();
  power[0] = 1;
  const powers = [];
  const distinctVectors = new Map();

  function recordVector(coefficients, exponent, negative) {
    const key = coefficients.join(",");
    if (!distinctVectors.has(key)) {
      distinctVectors.set(key, { coefficients, labels: [] });
    }
    distinctVectors.get(key).labels.push({ exponent, negative });
  }

  for (let exponent = 0; exponent <= highestDegree; exponent++) {
    powers.push(power);
    recordVector(power, exponent, false);
    recordVector(power.map(coefficient => -coefficient), exponent, true);
    if (exponent < highestDegree) {
      const leading = width === degree ? power[degree - 1] : 0;
      power = power.map((_, j) => (j === 0 ? 0 : power[j - 1]) - leading * polynomial[j]);
    }
  }
  return { zero, powers, vectors: [...distinctVectors.values()], basis, polynomial, order };
}

function buildGraph({ zero, powers, vectors, basis, order }, construction, radius) {
  const steps = vectors.map(({ coefficients }) => coefficients);
  const vertices = [zero];
  const vertexIndex = new Map([[zero.join(","), 0]]);

  function extend(start, end, step) {
    for (let i = start; i < end; i++) {
      const vertex = add(vertices[i], step);
      const key = vertex.join(",");
      if (!vertexIndex.has(key)) {
        vertexIndex.set(key, vertices.length);
        vertices.push(vertex);
      }
    }
  }

  if (construction === "sumset") {
    for (const power of powers) extend(0, vertices.length, power);
  } else {
    let start = 0;
    for (let distance = 0; distance < radius; distance++) {
      const end = vertices.length;
      for (const step of steps) extend(start, end, step);
      start = end;
    }
  }

  const edges = [];
  vertices.forEach((vertex, i) => {
    for (const step of steps) {
      const neighbor = vertexIndex.get(add(vertex, step).join(","));
      if (neighbor > i) edges.push([i, neighbor]);
    }
  });
  const { labels, modulus } = eisensteinColoring(order, zero.length);
  const colors = vertices.map(vertex => {
    const value = vertex.reduce((sum, coefficient, i) => sum + coefficient * labels[i], 0);
    return (value % modulus + modulus) % modulus;
  });
  return { points: vertices.map(vertex => coordinates(vertex, basis)), edges, colors, modulus };
}

function element(parent, tag, attributes, content) {
  const node = document.createElementNS(svgNamespace, tag);
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
  if (content) node.textContent = content;
  parent.appendChild(node);
  return node;
}

function drawCircle(svg, radius = circleRadius, labelAxes = true) {
  svg.replaceChildren();
  element(svg, "circle", { cx: center, cy: center, r: radius, class: "cayley-axis" });
  element(svg, "path", { d: "M20 110H200 M110 20V200", class: "cayley-axis" });
  if (labelAxes) {
    element(svg, "text", { x: 204, y: 114, class: "cayley-svg-label" }, "1");
    element(svg, "text", { x: 108, y: 16, class: "cayley-svg-label" }, "i");
  }
}

function drawParameter(svg, angle) {
  drawCircle(svg);
  const radians = angle * Math.PI / 180;
  const x = center + circleRadius * Math.cos(radians);
  const y = center - circleRadius * Math.sin(radians);
  element(svg, "line", { x1: center, y1: center, x2: x, y2: y, stroke: "#7253ed", "stroke-width": 2 });
  element(svg, "circle", { cx: x, cy: y, r: 6, fill: "#593bb0", stroke: "#fff", "stroke-width": 1.5 });
  svg.setAttribute("aria-label", `Unit circle with alpha at ${angle} degrees. Use the angle input to change it with the keyboard.`);
}

function drawDirections(svg, { vectors, basis }) {
  const radius = 66;
  const lineHeight = 15;
  drawCircle(svg, radius, false);
  const sides = [[], []];
  for (const { coefficients, labels } of vectors) {
    const [dx, imaginary] = coordinates(coefficients, basis);
    const dy = -imaginary;
    const x = center + radius * dx;
    const y = center + radius * dy;
    const wing = side => `${x - 8 * dx - side * 3 * dy} ${y - 8 * dy + side * 3 * dx}`;
    const path = `M${center} ${center} L${x} ${y} M${wing(-1)} L${x} ${y} L${wing(1)}`;
    const hasPositive = labels.some(label => !label.negative);
    const hasNegative = labels.some(label => label.negative);
    if (hasNegative) {
      element(svg, "path", {
        d: path, class: "cayley-arrow cayley-arrow-negative",
        "stroke-width": hasPositive ? 4 : 1.8
      });
    }
    if (hasPositive) {
      element(svg, "path", {
        d: path, class: "cayley-arrow cayley-arrow-positive", "stroke-width": 1.8
      });
    }

    // Give opposite vertical vectors different sides too.
    const left = Math.abs(dx) < 1e-8 ? dy > 0 : dx < 0;
    const side = left ? -1 : 1;
    const height = labels.length * lineHeight;
    const labelX = center + (radius + 8) * dx + side * 4;
    const labelY = center + (radius + 8) * dy;
    sides[Number(!left)].push({ x, y, labelX, labelY, height, labels, side });
  }

  for (const labels of sides) {
    labels.sort((a, b) => a.labelY - b.labelY);
    let nextTop = 8;
    for (const label of labels) {
      label.top = Math.max(nextTop, label.labelY - label.height / 2);
      nextTop = label.top + label.height;
    }
    // Fit crowded tips by packing each side while keeping labels in tip order.
    let nextBottom = 212;
    for (let i = labels.length - 1; i >= 0; i--) {
      const label = labels[i];
      label.top = Math.min(label.top, nextBottom - label.height);
      nextBottom = label.top;
    }
    for (const { x, y, labelX, labelY, top, height, labels: tipPowers, side } of labels) {
      const middle = top + height / 2;
      if (Math.abs(middle - labelY) > 3) {
        element(svg, "line", {
          x1: x, y1: y, x2: labelX - side * 3, y2: middle,
          class: "cayley-label-leader"
        });
      }
      const text = element(svg, "text", {
        class: "cayley-tip-label", "text-anchor": side === 1 ? "start" : "end",
        "dominant-baseline": "central"
      });
      tipPowers.forEach((label, index) => {
        element(text, "tspan", {
          x: labelX, y: top + lineHeight * (index + 0.5),
          class: label.negative ? "cayley-tip-negative" : "cayley-tip-positive"
        }, vectorLabel(label));
      });
    }
  }
  const tipLabels = vectors.map(({ labels }) => labels.map(vectorLabel).join(" = "));
  svg.setAttribute("aria-label", `Connection vectors: ${tipLabels.join("; ")}.`);
}

function drawGraph(svg, { points, edges, colors }) {
  const bounds = svg.getBoundingClientRect();
  if (bounds.width === 0 || bounds.height === 0) return;
  const { width, height } = bounds;
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const left = Math.min(...xs), right = Math.max(...xs);
  const bottom = Math.min(...ys), top = Math.max(...ys);
  const scale = Math.min((width - 36) / Math.max(1, right - left), (height - 36) / Math.max(1, top - bottom));
  const positions = points.map(([x, y]) => [
    (width / 2 + (x - (left + right) / 2) * scale).toFixed(2),
    (height / 2 - (y - (bottom + top) / 2) * scale).toFixed(2)
  ]);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.replaceChildren();
  const edgePath = edges.map(([a, b]) => `M${positions[a].join(" ")}L${positions[b].join(" ")}`).join("");
  element(svg, "path", {
    d: edgePath, fill: "none", stroke: "#8795aa",
    "stroke-width": points.length > 200 ? 0.7 : 1.25,
    "stroke-opacity": points.length > 200 ? 0.5 : 0.85
  });
  const radius = points.length > 200 ? 1.6 : points.length > 50 ? 2.5 : 4;
  positions.forEach(([cx, cy], i) => {
    element(svg, "circle", { cx, cy, r: radius, fill: vertexColors[colors[i]] });
  });
  svg.setAttribute("aria-label", `Finite graph with ${points.length} vertices and ${edges.length} edges, drawn in the complex plane.`);
}

function powerLabel(degree, variable = "α") {
  if (degree === 0) return "1";
  if (degree === 1) return variable;
  const exponent = [...String(degree)].map(digit => "⁰¹²³⁴⁵⁶⁷⁸⁹"[Number(digit)]).join("");
  return `${variable}${exponent}`;
}

function polynomialLabel(polynomial) {
  const terms = [];
  for (let degree = polynomial.length - 1; degree >= 0; degree--) {
    const coefficient = polynomial[degree];
    if (coefficient === 0) continue;
    const magnitude = Math.abs(coefficient);
    const variable = degree === 0 ? "" : powerLabel(degree, "x");
    const factor = degree > 0 && magnitude === 1 ? "" : String(magnitude);
    const sign = coefficient < 0 ? "−" : "+";
    const prefix = terms.length === 0 ? (coefficient < 0 ? "−" : "") : ` ${sign} `;
    terms.push(prefix + factor + variable);
  }
  return terms.join("");
}

function vectorLabel({ exponent, negative }) {
  return (negative ? "−" : "") + powerLabel(exponent);
}

export function mount(root) {
  const get = role => root.querySelector(`[data-role="${role}"]`);
  const angleInput = get("angle");
  const degreeInput = get("degree");
  const constructionInput = get("construction");
  const radiusInput = get("radius");
  const radiusControl = get("radius-control");
  const picker = get("picker");
  const graphSvg = get("graph");
  const summary = get("summary");
  const minimalPolynomial = get("minimal-polynomial");
  const coloring = get("coloring");
  const vectorsSvg = get("vectors");
  let angle = angleInput.valueAsNumber;
  let graph;
  let scheduled = false;

  function render() {
    scheduled = false;
    const highestDegree = Number(degreeInput.value);
    const construction = constructionInput.value;
    const radius = Number(radiusInput.value);
    const directions = directionsFor(angle, highestDegree);
    radiusControl.hidden = construction === "sumset";
    drawParameter(picker, angle);
    drawDirections(vectorsSvg, directions);
    graph = buildGraph(directions, construction, radius);
    const vertices = graph.points.length;
    const edges = graph.edges.length;
    summary.textContent = `${vertices} ${vertices === 1 ? "vertex" : "vertices"} · ${edges} ${edges === 1 ? "edge" : "edges"}`;
    minimalPolynomial.textContent = polynomialLabel(directions.polynomial);
    const colorCount = new Set(graph.colors).size;
    const quotient = graph.modulus === 2 ? "E₂" : "E₃";
    coloring.textContent = `${quotient} · ${colorCount} ${colorCount === 1 ? "color" : "colors"} used`;
    drawGraph(graphSvg, graph);
  }

  function queueRender() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(render);
    }
  }

  function pickAngle(event) {
    const bounds = picker.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = bounds.top + bounds.height / 2 - event.clientY;
    if (Math.hypot(x, y) < 5) return;
    const next = (Math.round(Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
    if (next !== angle) {
      angle = next;
      angleInput.value = angle;
      queueRender();
    }
  }

  picker.addEventListener("pointerdown", event => {
    if (event.button !== 0) return;
    picker.setPointerCapture(event.pointerId);
    pickAngle(event);
  });
  picker.addEventListener("pointermove", event => {
    if (picker.hasPointerCapture(event.pointerId)) pickAngle(event);
  });
  angleInput.addEventListener("input", () => {
    if (angleInput.validity.valid && Number.isInteger(angleInput.valueAsNumber)) {
      angle = angleInput.valueAsNumber;
      queueRender();
    }
  });
  angleInput.addEventListener("change", () => { angleInput.value = angle; });
  for (const input of [degreeInput, constructionInput, radiusInput]) {
    input.addEventListener("change", queueRender);
  }
  render();
  new ResizeObserver(() => drawGraph(graphSvg, graph)).observe(graphSvg);
}
