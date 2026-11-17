export const palette = [
  { name: "green", fill: "#34a853" },
  { name: "blue", fill: "#4285f4" },
  { name: "yellow", fill: "#fbbc05" }
];

const proofRequests = new Map();

export function loadProof(url) {
  if (!proofRequests.has(url)) {
    proofRequests.set(url, fetch(url).then(response => {
      if (!response.ok) throw new Error("Proof data did not load");
      return response.json();
    }).catch(error => {
      proofRequests.delete(url);
      throw error;
    }));
  }
  return proofRequests.get(url);
}

export function pentagonFrame(proof, proofCase, step) {
  const cycle = proof.base_cycle;
  const colors = new Map(cycle.map((vertex, index) => [vertex, palette[proofCase.pattern[index]]]));
  const extra = proofCase.extra_assumption;
  if (extra) colors.set(extra[0], palette[extra[1]]);
  for (const { vertex, color } of proofCase.forces.slice(0, step)) colors.set(vertex, palette[color]);

  const collision = step === proofCase.forces.length + 1;
  const deduction = step > 0 && !collision ? proofCase.forces[step - 1] : null;
  return {
    colors,
    pentagonEdges: step === 0 ? cycle.map((vertex, index) => [vertex, cycle[(index + 1) % cycle.length]]) : [],
    focus: deduction ? [deduction.vertex] : [],
    support: deduction?.neighbors,
    evidence: deduction?.neighbors.map(vertex => [deduction.vertex, vertex]),
    conflict: collision ? proofCase.conflict_edge : [],
    deduction,
    phase: collision ? "collision" : deduction ? "deduction" : "initial"
  };
}

export function attachmentFrames(edges, proof, { attachment }) {
  const { anchors, cycle, spokes } = attachment;
  const baseEdges = edges.filter(([a, b]) => a < proof.baseVertexCount && b < proof.baseVertexCount);
  const pentagonEdges = cycle.map((vertex, index) => [vertex, cycle[(index + 1) % cycle.length]]);
  const frames = [{
    equalities: new Map(anchors.map(vertex => [vertex, "A"])),
    focus: anchors,
    baseEdges,
    phase: "initial",
    explanation: `The base has ${proof.baseColoringCount} three-colorings up to renaming colors. In this case, vertices ${anchors.join(", ")} share a color.`
  }];
  const colors = new Map(anchors.map(vertex => [vertex, palette[0]]));
  frames.push({
    colors: new Map(colors),
    pentagonEdges,
    support: anchors,
    evidence: spokes,
    phase: "deduction",
    explanation: "Call the shared color green. Each vertex of the attached pentagon touches a green vertex."
  });

  for (const [index, vertex] of cycle.entries()) {
    const previous = cycle[index - 1];
    const [anchor] = spokes[index];
    const color = palette[1 + index % 2];
    colors.set(vertex, color);
    frames.push({
      colors: new Map(colors),
      focus: [vertex],
      support: index ? [anchor, previous] : [anchor],
      evidence: index ? [spokes[index], [previous, vertex]] : [spokes[index]],
      phase: "deduction",
      explanation: index
        ? `Vertex ${vertex} touches green ${anchor} and ${colors.get(previous).name} ${previous}, so it must be ${color.name}.`
        : `Vertex ${vertex} can be blue or yellow. Swap those names if needed so it is blue.`
    });
  }

  const first = cycle[0];
  const last = cycle.at(-1);
  frames.push({
    colors,
    conflict: [first, last],
    phase: "collision",
    explanation: `Vertices ${first} and ${last} are both blue. The red edge requires different colors.`
  });
  return frames;
}

function equalityTags(steps) {
  const groups = new Map();
  let nextTag = 0;
  for (const { equalGroups } of steps) {
    if (!equalGroups) continue;
    const vertices = equalGroups.flat();
    const previous = new Set(vertices.map(vertex => groups.get(vertex)).filter(tag => tag !== undefined));
    const tag = previous.size ? Math.min(...previous) : nextTag++;
    for (const [vertex, oldTag] of groups) {
      if (previous.has(oldTag)) groups.set(vertex, tag);
    }
    for (const vertex of vertices) groups.set(vertex, tag);
  }
  return new Map([...groups].map(([vertex, tag]) => [vertex, String.fromCharCode(65 + tag)]));
}

function propagateColors(equalities, evidence, knownColors) {
  const classOf = vertex => equalities.get(vertex) ?? vertex;
  const colors = new Map();
  for (const [vertex, color] of knownColors) {
    const group = classOf(vertex);
    if (colors.has(group) && colors.get(group) !== color) return null;
    colors.set(group, color);
  }

  const neighbors = new Map();
  for (const [u, v] of evidence) {
    const a = classOf(u);
    const b = classOf(v);
    if (a === b) return null;
    if (!neighbors.has(a)) neighbors.set(a, new Set());
    if (!neighbors.has(b)) neighbors.set(b, new Set());
    neighbors.get(a).add(b);
    neighbors.get(b).add(a);
  }

  let changed;
  do {
    changed = false;
    for (const [group, adjacent] of neighbors) {
      const occupied = new Set([...adjacent].map(neighbor => colors.get(neighbor)).filter(Boolean));
      if (occupied.has(colors.get(group)) || occupied.size === palette.length) return null;
      if (!colors.has(group) && occupied.size === palette.length - 1) {
        colors.set(group, palette.find(color => !occupied.has(color)));
        changed = true;
      }
    }
  } while (changed);

  const result = new Map(knownColors);
  for (const vertex of new Set([...equalities.keys(), ...evidence.flat()])) {
    const color = colors.get(classOf(vertex));
    if (color) result.set(vertex, color);
  }
  return result;
}

export function rhombusFrames(steps) {
  const frames = [];
  const evidence = [];
  let colors = new Map();
  let referenceChosen = false;
  for (const [index, proofStep] of steps.entries()) {
    if (proofStep.kind === "conflict") {
      frames.push(frames.at(-1));
      continue;
    }
    evidence.push(...proofStep.supportEdges);
    const equalities = equalityTags(steps.slice(0, index + 1));
    const knownColors = new Map(colors);
    const reference = proofStep.kind === "deduction" && !referenceChosen;
    if (reference) {
      const [[first], [second]] = proofStep.supportGroups;
      knownColors.set(first, palette[1]);
      knownColors.set(second, palette[2]);
      referenceChosen = true;
    }
    const nextColors = propagateColors(equalities, evidence, knownColors);
    if (nextColors) colors = nextColors;
    frames.push({ colors, equalities, reference, contradiction: nextColors === null });
  }
  return frames;
}

export function createPlayback(root, advance, duration, onPlayingChange) {
  let isPlaying = false;
  let isVisible = true;
  let animationFrame = null;
  let previousTime = null;
  let elapsed = 0;

  function canPlay() {
    return isPlaying && isVisible && !document.hidden;
  }

  function tick(time) {
    animationFrame = null;
    if (!canPlay()) {
      previousTime = null;
      return;
    }
    if (previousTime !== null) elapsed += Math.min(time - previousTime, 200);
    previousTime = time;
    if (elapsed >= duration()) {
      elapsed = 0;
      advance();
    }
    animationFrame = window.requestAnimationFrame(tick);
  }

  function syncPlayback() {
    previousTime = null;
    if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    animationFrame = canPlay() ? window.requestAnimationFrame(tick) : null;
  }

  function setPlaying(value) {
    isPlaying = value;
    elapsed = 0;
    root.dataset.playing = String(isPlaying);
    onPlayingChange?.(isPlaying);
    syncPlayback();
  }

  document.addEventListener("visibilitychange", syncPlayback);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(entries => {
      isVisible = entries[0].isIntersecting;
      syncPlayback();
    }).observe(root);
  }
  return { setPlaying, toggle: () => setPlaying(!isPlaying) };
}
