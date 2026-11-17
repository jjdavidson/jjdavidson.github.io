const moduleVersion = new URL(import.meta.url).search;

function loadModule(path) {
  const url = new URL(path, import.meta.url);
  url.search = moduleVersion;
  return import(url.href);
}

const presets = {
  petersen: [5, 1, 2], cube: [4, 1, 1], dodecahedron: [10, 1, 2],
  mobius: [8, 1, 3], desargues: [10, 1, 3], nauru: [12, 1, 5],
  "two-rim-steps": [12, 2, 3],
};

function polynomialMarkup(coefficients) {
  const terms = [];
  coefficients.forEach((value, index) => {
    const coefficient = BigInt(value);
    if (!coefficient) return;
    const power = coefficients.length - index - 1;
    const magnitude = coefficient < 0n ? -coefficient : coefficient;
    const sign = coefficient < 0n ? "−" : terms.length ? "+" : "";
    const factor = magnitude === 1n && power ? "" : magnitude.toString();
    const variable = power ? `<var>x</var>${power > 1 ? `<sup>${power}</sup>` : ""}` : "";
    terms.push(`${sign}${sign && terms.length ? " " : ""}${factor}${variable}`);
  });
  const expression = terms.join(" ");
  if (terms.length <= 14) return expression;
  return `<details><summary>Degree ${coefficients.length - 1}</summary><div>${expression}</div></details>`;
}

function degrees(angle) {
  const phase = Math.atan2(Math.sin(angle), Math.cos(angle));
  return Math.round(phase * 18000 / Math.PI) / 100;
}

function polynomialFor(parameter, catalog) {
  if (parameter.coefficients) return parameter.coefficients;
  if (!catalog || !parameter.catalog) return undefined;
  const lookup = parameter.catalog;
  if (lookup.kind === "root") return catalog.polynomials[catalog.eta[lookup.order]];
  const pair = catalog.branches[lookup.key] ?? catalog.pairs[lookup.pairKey];
  return catalog.polynomials[pair?.[lookup.index]];
}

function moncayMarkup({ parameters }, catalog) {
  const names = parameters.filter(parameter => parameter.generator).map(parameter => parameter.name);
  let missingPolynomial = false;
  const body = parameters.map(parameter => {
    const { name, formula, angle } = parameter;
    const value = formula ? `${name} = ${formula}` : `${name} ≈ e<sup>i·${degrees(angle).toFixed(2)}°</sup>`;
    const coefficients = polynomialFor(parameter, catalog);
    if (!coefficients) missingPolynomial = true;
    return `<tr><th scope="row">${value}</th><td aria-label="Minimal polynomial of ${name}">${coefficients ? polynomialMarkup(coefficients) : "—"}</td></tr>`;
  }).join("");
  const note = missingPolynomial ? "<small>Exact minimal polynomials are shown where available.</small>" : "";
  return `<p>MonCay(${names.join(", ")})</p><table><thead><tr><th scope="col">Parameter</th><th scope="col">Minimal polynomial</th></tr></thead><tbody>${body}</tbody></table>${note}`;
}

export async function mount(root) {
  const [{ buildIGraph }, { moncayParameters }, {
    createGraphDrawing, createDirectionDrawing,
  }] = await Promise.all([
    loadModule("./geometry.js"), loadModule("./parameters.js"), loadModule("./drawing.js"),
  ]);
  const field = name => root.querySelector(`[data-role="${name}"]`);
  const ui = Object.fromEntries([
    "form", "preset", "n", "j", "k", "apply", "multiplier",
    "canvas", "error", "vertices", "edges", "angle", "three-colorable", "result", "moncay-result",
    "directions", "direction-controls", "direction-detail",
  ].map(name => [name, field(name)]));
  const graphDrawing = createGraphDrawing(ui.canvas);
  const directionDrawing = createDirectionDrawing(ui.directions);
  const buttons = new Map();
  let graph, directions, selected, catalog;

  function draw() {
    if (!graph) return;
    graphDrawing.draw(graph, directions.referenceAngle, selected);
    directionDrawing.draw(directions.parameters, selected);
  }

  function selectDirection(parameter) {
    selected = parameter;
    for (const [name, button] of buttons) {
      button.setAttribute("aria-pressed", String(name === selected?.name));
    }
    ui["direction-detail"].textContent = selected
      ? `${selected.name} · ${degrees(selected.angle)}° · ${selected.description}`
      : "";
    draw();
  }

  function toggleDirection(parameter) {
    selectDirection(parameter === selected ? undefined : parameter);
  }

  function setDirectionControls() {
    const controls = ui["direction-controls"];
    controls.replaceChildren();
    buttons.clear();
    for (const parameter of directions.parameters) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = parameter.name;
      button.setAttribute("aria-label", `${parameter.name}, ${parameter.description}`);
      button.addEventListener("click", () => toggleDirection(parameter));
      buttons.set(parameter.name, button);
      controls.append(button);
    }
    selectDirection(directions.parameters.find(parameter => parameter.name === selected?.name));
  }

  function renderStats() {
    if (!graph) return;
    const { n, j, k, vertices, edges, embedding, chromaticNumber, componentCount } = graph;
    ui.vertices.textContent = String(vertices.length);
    ui.edges.textContent = String(edges.length);
    ui.angle.textContent = embedding.angleDegrees === null ? "—" : `${embedding.angleDegrees.toFixed(2)}°`;
    ui["three-colorable"].textContent = "Yes";
    const scope = `I(${n}, ${j}, ${k})`;
    const layout = embedding.construction === "translated-prism" ? "Two congruent rims joined by a unit translation."
      : embedding.construction === "four-circle" ? "The four-circle Nauru construction."
        : `Concentric construction with step a = ${embedding.multiplier}.`;
    const components = componentCount > 1 ? ` and ${componentCount} components` : "";
    ui.result.textContent = `${layout} ${scope} has chromatic number ${chromaticNumber}${components}.`;
    ui.canvas.setAttribute("aria-label", `${scope}, ${vertices.length} vertices, ${edges.length} unit edges, chromatic number ${chromaticNumber}.`);
  }

  function setStepLimits(n) {
    const max = String(Math.floor((n - 1) / 2));
    ui.j.max = max;
    ui.k.max = max;
  }

  function setGraph(resetMultiplier = false) {
    try {
      const n = Number(ui.n.value), j = Number(ui.j.value), k = Number(ui.k.value);
      if (!Number.isInteger(n) || n < 3 || n > 60) throw new RangeError("n must be an integer from 3 to 60.");
      const multiplier = resetMultiplier ? "auto" : (ui.multiplier.value === "auto" ? "auto" : Number(ui.multiplier.value));
      const next = buildIGraph(n, j, k, { multiplier });
      directions = moncayParameters(next);
      graph = next;
      ui.error.hidden = true;
      ui.error.textContent = "";
      setStepLimits(n);
      const choices = graph.embedding.availableMultipliers || [];
      ui.multiplier.replaceChildren();
      for (const [value, label] of [["auto", "Auto"], ...choices.map(a => [String(a), String(a)])]) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        ui.multiplier.append(option);
      }
      ui.multiplier.value = String(multiplier);
      const concentric = graph.embedding.construction === "concentric";
      ui.multiplier.disabled = !concentric;
      const preset = Object.entries(presets).find(([, [size, outer, inner]]) =>
        size === n && outer === j && inner === k);
      ui.preset.value = preset ? preset[0] : "custom";
      setDirectionControls();
      renderStats();
      ui["moncay-result"].innerHTML = moncayMarkup(directions, catalog);
    } catch (error) {
      ui.error.textContent = error.message;
      ui.error.hidden = false;
    }
  }

  ui.form.addEventListener("submit", event => { event.preventDefault(); setGraph(true); });
  ui.preset.addEventListener("change", () => {
    const parameters = presets[ui.preset.value];
    if (!parameters) return;
    [ui.n.value, ui.j.value, ui.k.value] = parameters.map(String);
    setGraph(true);
  });
  ui.n.addEventListener("input", () => {
    const n = Number(ui.n.value);
    if (Number.isInteger(n) && n >= 3 && n <= 60) setStepLimits(n);
  });
  ui.multiplier.addEventListener("change", () => setGraph());
  for (const name of ["preset", "n", "j", "k", "apply", "multiplier"]) ui[name].disabled = false;
  ui.directions.addEventListener("click", event => {
    const parameter = directionDrawing.hitTest(event);
    if (parameter) toggleDirection(parameter);
  });
  ui.directions.addEventListener("pointermove", event => {
    ui.directions.style.cursor = directionDrawing.hitTest(event) ? "pointer" : "";
  });
  function resize() {
    graphDrawing.resize();
    directionDrawing.resize();
    draw();
  }
  resize();
  setGraph(true);
  const observer = new ResizeObserver(resize);
  observer.observe(ui.canvas);
  observer.observe(ui.directions);
  fetch(root.dataset.dataSrc)
    .then(response => {
      if (!response.ok) throw new Error(`Catalog request returned ${response.status}.`);
      return response.json();
    })
    .then(data => {
      if (graph) ui["moncay-result"].innerHTML = moncayMarkup(directions, data);
      catalog = data;
    })
    .catch(error => console.warn("Could not load the minimal polynomial catalog.", error));
  return () => observer.disconnect();
}
