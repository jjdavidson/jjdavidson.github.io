import { buildFromSeed, minimalRotationPolynomial, norm } from "./geometry.js";
import { buildWitness } from "./witness.js";

const rootThree = Math.sqrt(3);
const palette = ["#FBBC05", "#34A853", "#4285F4", "#EA4335"];
const contactColor = "#334155";

function polynomialMarkup(coefficients) {
  return coefficients.flatMap((coefficient, i) => {
    if (!coefficient) return [];
    const power = coefficients.length - i - 1;
    const magnitude = Math.abs(coefficient);
    const sign = coefficient < 0 ? "−" : "+";
    const factor = magnitude === 1 && power ? "" : String(magnitude);
    const variable = power ? `<var>x</var>${power > 1 ? `<sup>${power}</sup>` : ""}` : "";
    return [`${i === 0 ? (coefficient < 0 ? "−" : "") : ` ${sign} `}${factor}${variable}`];
  }).join("");
}

function contactRadiusSquared3(contact) {
  return Math.max(3 * contact.fixedNorm, norm(contact.movingNumerator));
}

function createSurface(canvas) {
  const context = canvas.getContext("2d");
  let width = 0, height = 0;

  function resize() {
    ({ width, height } = canvas.getBoundingClientRect());
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function view(radius) {
    if (!width || !height) return null;
    context.clearRect(0, 0, width, height);
    const unit = Math.max(1, Math.min(width, height) - 54) / (2 * (radius + 0.25));
    const project = ({ x, y }) => [width / 2 + unit * x, height / 2 - unit * y];
    return { width, height, unit, project };
  }
  return { context, resize, view };
}

function drawContactCircles(context, { project, unit }, fixedNorms, movingNorms) {
  const [x, y] = project({ x: 0, y: 0 });
  context.lineWidth = 1;
  context.setLineDash([4, 4]);
  for (const [norms, color] of [[fixedNorms, "#9aa9be"], [movingNorms, "#8da9ae"]]) {
    context.strokeStyle = color;
    for (const squaredRadius of new Set(norms)) {
      context.beginPath();
      context.arc(x, y, unit * Math.sqrt(squaredRadius), 0, 2 * Math.PI);
      context.stroke();
    }
  }
  context.setLineDash([]);
}

function createLatticeDrawing(context) {
  let background = [], backgroundBound = 0;

  return function draw({ width, height, unit, project }, rotate) {
    const visible = ([x, y], margin = 2) => x >= -margin && y >= -margin && x <= width + margin && y <= height + margin;
    const visibleRadius = Math.hypot(width / 2, height / 2) / unit + 2;
    const bound = Math.ceil(2 * visibleRadius / rootThree) + 1;
    if (bound !== backgroundBound) {
      backgroundBound = bound;
      background = [];
      const stride = Math.max(1, Math.ceil((2 * bound + 1) / 180));
      for (let m = -bound; m <= bound; m += stride) for (let n = -bound; n <= bound; n += stride) {
        if (norm(m, n) <= (visibleRadius + 2) ** 2) background.push({ x: m + n / 2, y: n * rootThree / 2 });
      }
    }

    function line(a, b) {
      context.moveTo(...a);
      context.lineTo(...b);
    }

    function grid(turned) {
      const map = point => project(turned
        ? rotate({ x: point.x + 0.5, y: point.y + rootThree / 6 }) : point);
      if (unit >= 14) {
        context.beginPath();
        for (const point of background) {
          const a = map(point);
          if (!visible(a, unit + 1)) continue;
          for (const [dx, dy] of [[1, 0], [0.5, rootThree / 2], [0.5, -rootThree / 2]]) {
            line(a, map({ x: point.x + dx, y: point.y + dy }));
          }
        }
        context.strokeStyle = turned ? "#e2e9ed" : "#e6e8ed";
        context.lineWidth = 0.7;
        context.stroke();
      }
      context.beginPath();
      const dot = unit >= 14 ? 1 : 0.65;
      for (const point of background) {
        const [x, y] = map(point);
        if (!visible([x, y])) continue;
        context.moveTo(x + dot, y);
        context.arc(x, y, dot, 0, 2 * Math.PI);
      }
      context.fillStyle = turned ? "#bfc9cd" : "#c5c9d3";
      context.fill();
    }
    grid(false);
    grid(true);
  };
}

function drawContacts(context, frame, contacts, rotate, showCircles) {
  const { project, unit } = frame;
  if (showCircles) {
    drawContactCircles(context, frame, contacts.map(contact => contact.fixedNorm),
      contacts.map(contact => contact.movingNorm));
  }
  const points = new Map();
  for (const contact of contacts) {
    const fixed = project(contact.fixedPoint), offset = project(rotate(contact.movingPoint));
    context.beginPath();
    context.moveTo(...fixed);
    context.lineTo(...offset);
    context.strokeStyle = contactColor;
    context.lineWidth = Math.max(1, Math.min(2.6, unit * 0.16));
    context.stroke();
    points.set(`f:${contact.fixed}`, [fixed, 0]);
    points.set(`m:${contact.movingNumerator}`, [offset, contact.movingColor + 1]);
  }
  const dot = Math.min(5, unit * 0.2);
  for (const [point, color] of points.values()) {
    context.beginPath();
    context.arc(...point, dot, 0, 2 * Math.PI);
    context.fillStyle = palette[color];
    context.fill();
  }
}

function drawWitness(context, frame, { vertices, edges, fixedNorm, movingNorm }, showCircles) {
  const { project, unit } = frame;
  if (showCircles) drawContactCircles(context, frame, [fixedNorm], [movingNorm]);
  const points = vertices.map(project);
  for (const type of ["lattice", "contact"]) {
    context.beginPath();
    for (const edge of edges) {
      if (edge.type !== type) continue;
      context.moveTo(...points[edge.u]);
      context.lineTo(...points[edge.v]);
    }
    context.strokeStyle = type === "contact" ? contactColor : "#63748c";
    context.lineWidth = type === "contact"
      ? Math.max(1.6, Math.min(3, unit * 0.22))
      : Math.max(0.8, Math.min(1.6, unit * 0.14));
    context.stroke();
  }
  vertices.forEach(({ color, contact }, i) => {
    const dot = Math.min(contact ? 5.5 : 3.5, unit * (contact ? 0.24 : 0.16));
    context.beginPath();
    context.arc(...points[i], dot, 0, 2 * Math.PI);
    context.fillStyle = palette[color];
    context.fill();
  });
}

export async function mount(root) {
  const get = role => root.querySelector(`[data-role="${role}"]`);
  const canvas = get("canvas"), preset = get("preset"), error = get("error");
  const witnessToggle = get("witness-toggle"), circlesToggle = get("circles-toggle");
  const summary = get("summary"), witnessProof = get("witness-proof");
  const vertexLabel = get("vertices"), edgeLabel = get("edges"), angleLabel = get("angle");
  const colorableLabel = get("three-colorable"), polynomialLabel = get("polynomial");
  const surface = createSurface(canvas);
  const drawLattices = createLatticeDrawing(surface.context);
  const response = await fetch(root.dataset.dataSrc);
  if (!response.ok) throw new Error("The contact presets could not load.");
  const { presets } = await response.json();
  const entries = new Map(presets.map(entry => [entry.id, entry]));
  preset.replaceChildren(...presets.map(entry => {
    const option = document.createElement("option");
    option.value = entry.id;
    option.textContent = entry.label;
    return option;
  }));

  let construction, selected, witness, radius;
  let showWitness = false, showCircles = false;

  function draw() {
    const frame = surface.view(radius);
    if (!frame) return;
    const { context } = surface;
    const c = Math.cos(construction.angle), s = Math.sin(construction.angle);
    const rotate = ({ x, y }) => ({ x: c * x - s * y, y: s * x + c * y });
    drawLattices(frame, rotate);
    if (showWitness) drawWitness(context, frame, witness, showCircles);
    else drawContacts(context, frame, construction.contacts, rotate, showCircles);
  }

  function render() {
    const { contacts, angleDegrees } = construction;
    const fixedCount = new Set(contacts.map(contact => contact.fixed.join(","))).size;
    const offsetCount = new Set(contacts.map(contact => contact.movingNumerator.join(","))).size;
    vertexLabel.textContent = String(showWitness ? witness.vertices.length : fixedCount + offsetCount);
    edgeLabel.textContent = String(showWitness ? witness.edges.length : contacts.length);
    angleLabel.textContent = `${angleDegrees.toFixed(2)}°`;
    colorableLabel.textContent = "No";
    polynomialLabel.innerHTML = polynomialMarkup(minimalRotationPolynomial(construction));

    summary.setAttribute("aria-label", showWitness ? "Witness graph properties" : "Contact counts and two-lattice colorability");
    canvas.setAttribute("aria-label", showWitness
      ? `Four-chromatic unit-distance witness with ${witness.vertices.length} vertices and ${witness.edges.length} edges.`
      : `All ${contacts.length} unit contacts between the lattices at ${angleLabel.textContent}.`);
    witnessProof.hidden = !showWitness;
    witnessToggle.textContent = showWitness ? "Hide witness" : "Show witness";
    witnessToggle.setAttribute("aria-pressed", String(showWitness));
    circlesToggle.textContent = showCircles ? "Hide contact circles" : "Show contact circles";
    circlesToggle.setAttribute("aria-pressed", String(showCircles));
    draw();
  }

  function showPreset(entry) {
    const next = buildFromSeed(entry.w, entry.y, entry.branch, { maxCandidates: Infinity });
    if (!next.complete || next.contacts.length !== entry.expectedContacts) {
      throw new Error("The complete contact set could not be verified for this preset.");
    }
    const nextWitness = buildWitness(next);
    construction = next;
    witness = nextWitness;
    // Use one extent for both views so that switching preserves the embedding.
    radius = Math.max(
      Math.sqrt(Math.max(...next.contacts.map(contactRadiusSquared3)) / 3),
      ...nextWitness.vertices.map(({ x, y }) => Math.hypot(x, y)),
    );
    selected = entry;
    preset.value = entry.id;
    error.hidden = true;
    render();
  }

  const initial = entries.get("classical");
  if (!initial) throw new Error("The classical Golomb preset is missing.");
  surface.resize();
  showPreset(initial);
  preset.addEventListener("change", () => {
    try {
      const entry = entries.get(preset.value);
      if (entry) showPreset(entry);
    } catch (exception) {
      preset.value = selected.id;
      error.textContent = exception.message;
      error.hidden = false;
    }
  });
  witnessToggle.addEventListener("click", () => {
    showWitness = !showWitness;
    render();
  });
  circlesToggle.addEventListener("click", () => {
    showCircles = !showCircles;
    render();
  });
  const observer = new ResizeObserver(() => {
    surface.resize();
    draw();
  });
  observer.observe(canvas);
  for (const control of [preset, witnessToggle, circlesToggle]) control.disabled = false;
  return () => observer.disconnect();
}
