// Unit-distance representations of I(n,j,k), with distinct vertex positions.
// The concentric and four-circle constructions follow Žitnik, Horvat & Pisanski,
// J. Korean Math. Soc. 49 (2012), 475–491, doi:10.4134/JKMS.2012.49.3.475.
// Coordinates are numerical evaluations of the stated trigonometric formulas.

const TAU = 2 * Math.PI;
const CONTACT_TOLERANCE = 1e-8;
const mod = (a, n) => ((a % n) + n) % n;
const point = (radius, angle) => ({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) });

function gcd(a, b) {
  while (b) [a, b] = [b, a % b];
  return a;
}

export function validateParameters(n, k) {
  validateIGraphParameters(n, 1, k);
}

function validateIGraphParameters(n, j, k) {
  if (!Number.isSafeInteger(n) || n < 3) throw new RangeError("n must be an integer at least 3.");
  for (const [name, step] of [["j", j], ["k", k]]) {
    if (!Number.isSafeInteger(step) || step < 1 || 2 * step >= n) {
      throw new RangeError(`${name} must be an integer satisfying 1 ≤ ${name} < n/2.`);
    }
  }
}

function nauruComponentCount(n, j, k) {
  const m = n / 12;
  return Number.isInteger(m) && Math.min(j, k) === m && Math.max(j, k) === 5 * m ? m : 0;
}

export function availableEmbeddings(n, k) {
  validateParameters(n, k);
  if (k === 1 || nauruComponentCount(n, 1, k)) return [];
  return availableIGraphEmbeddings(n, 1, k);
}

// Multiplication by a unit modulo n relabels I(n,j,k) as I(n,aj,ak).
// a and n−a give reflected copies, so only one is listed.
function availableIGraphEmbeddings(n, j, k) {
  const candidates = [];
  for (let a = 1; 2 * a < n; a++) {
    if (gcd(a, n) !== 1) continue;
    const outerWinding = mod(a * j, n);
    const innerWinding = mod(a * k, n);
    const outerStep = Math.min(outerWinding, n - outerWinding);
    const innerStep = Math.min(innerWinding, n - innerWinding);
    const outerRadius = 1 / (2 * Math.sin(Math.PI * outerStep / n));
    const innerRadius = 1 / (2 * Math.sin(Math.PI * innerStep / n));
    const difference = Math.abs(outerRadius - innerRadius);
    // Equality is essential: GP(10,3) has a valid zero-angle drawing.
    if (difference < 1e-12 || difference > 1 + 1e-12) continue;
    let cosine = (outerRadius ** 2 + innerRadius ** 2 - 1) / (2 * outerRadius * innerRadius);
    cosine = Math.max(-1, Math.min(1, cosine));
    const angleRadians = Math.acos(cosine);
    candidates.push({
      multiplier: a, outerStep, innerStep, outerRadius, innerRadius,
      angleRadians, angleDegrees: angleRadians * 180 / Math.PI
    });
  }
  return candidates;
}

function makeEdges(n, j, k) {
  const edges = [];
  for (let i = 0; i < n; i++) {
    edges.push({ u: i, v: (i + j) % n, type: "outer" });
    edges.push({ u: n + i, v: n + (i + k) % n, type: "inner" });
    edges.push({ u: i, v: n + i, type: "spoke" });
  }
  return edges;
}

function vertex(n, ring, index, position) {
  return {
    id: ring === "outer" ? index : n + index,
    label: `${ring === "outer" ? "u" : "v"}${index}`,
    ring, index, ...position
  };
}

function concentricVertices(n, selected, branch) {
  const vertices = [];
  for (const ring of ["outer", "inner"]) {
    for (let i = 0; i < n; i++) {
      const angle = TAU * mod(selected.multiplier * i, n) / n
        + (ring === "inner" ? branch * selected.angleRadians : 0);
      vertices.push(vertex(n, ring, i, point(
        ring === "outer" ? selected.outerRadius : selected.innerRadius, angle
      )));
    }
  }
  return vertices;
}

function prismVertices(n, step, angle) {
  const radius = 1 / (2 * Math.sin(Math.PI * step / n));
  const translation = point(1, angle);
  const vertices = [];
  for (const ring of ["outer", "inner"]) {
    const sign = ring === "outer" ? -0.5 : 0.5;
    for (let i = 0; i < n; i++) {
      const p = point(radius, TAU * i / n);
      vertices.push(vertex(n, ring, i, {
        x: p.x + sign * translation.x, y: p.y + sign * translation.y
      }));
    }
  }
  return { vertices, radius, translation };
}

function fourCircleVertices(n, components, swappedLayers, branch) {
  // Proposition 13. Each component is a four-circle Nauru drawing, and each
  // spoke joins points on the same ray one unit apart relative to its center.
  const evenRadius = (6 + 7 * Math.sqrt(3) + Math.sqrt(15)) / 12;
  const oddRadius = (6 + 7 * Math.sqrt(3) - Math.sqrt(15)) / 12;
  const outerOffset = Number(swappedLayers);
  const innerOffset = 1 - outerOffset;
  const vertices = [];
  for (const ring of ["outer", "inner"]) {
    const offset = ring === "outer" ? outerOffset : innerOffset;
    for (let i = 0; i < n; i++) {
      const localIndex = Math.floor(i / components);
      const component = i % components;
      const radius = (localIndex % 2 ? oddRadius : evenRadius) - offset;
      const position = point(radius, branch * localIndex * Math.PI / 6);
      position.x += 5 * (component - (components - 1) / 2);
      vertices.push(vertex(n, ring, i, position));
    }
  }
  return { vertices, outerEvenRadius: evenRadius - outerOffset, outerOddRadius: oddRadius - outerOffset,
    innerEvenRadius: evenRadius - innerOffset, innerOddRadius: oddRadius - innerOffset };
}

function finiteColoring(n, j, componentCount, bipartite, edges) {
  const count = 2 * n;
  if (bipartite) {
    return Array.from({ length: count }, (_, i) =>
      (Math.floor((i % n) / componentCount) + Number(i >= n)) % 2
    );
  }
  const adjacency = Array.from({ length: count }, () => []);
  for (const { u, v } of edges) {
    adjacency[u].push(v);
    adjacency[v].push(u);
  }
  const colors = new Int8Array(count).fill(-1);
  const visited = new Uint8Array(count);
  for (let root = 0; root < componentCount; root++) {
    // In this component, u_(root+j) and v_root are nonadjacent neighbors
    // of u_root. Removing them leaves each rim cycle connected as a cycle
    // or path. Contracting the rims gives a complete bipartite multigraph
    // with equally many spokes per pair of rims and minimum edge cut at
    // least three, so losing the two incident spokes keeps it connected.
    const outerNeighbor = root + j;
    const spokeNeighbor = n + root;
    colors[outerNeighbor] = colors[spokeNeighbor] = 0;
    visited[outerNeighbor] = visited[spokeNeighbor] = visited[root] = 1;
    const order = [root];
    for (let index = 0; index < order.length; index++) {
      for (const neighbor of adjacency[order[index]]) {
        if (visited[neighbor]) continue;
        visited[neighbor] = 1;
        order.push(neighbor);
      }
    }
    // The reverse traversal gives each vertex an uncolored neighbor until
    // the root, whose two precolored neighbors share color zero.
    for (let index = order.length - 1; index >= 0; index--) {
      const vertex = order[index];
      const neighborColors = adjacency[vertex].map(neighbor => colors[neighbor]);
      colors[vertex] = [0, 1, 2].find(color => !neighborColors.includes(color));
    }
  }
  return Array.from(colors);
}

function inspectDrawing(vertices, edges) {
  const pairs = new Set(edges.map(({ u, v }) => `${Math.min(u, v)},${Math.max(u, v)}`));
  let maxEdgeError = 0, minimumSeparation = Infinity;
  const extraUnitEdges = [];
  for (let u = 0; u < vertices.length; u++) {
    for (let v = u + 1; v < vertices.length; v++) {
      const distance = Math.hypot(vertices[u].x - vertices[v].x, vertices[u].y - vertices[v].y);
      minimumSeparation = Math.min(minimumSeparation, distance);
      if (pairs.has(`${u},${v}`)) maxEdgeError = Math.max(maxEdgeError, Math.abs(distance - 1));
      else if (Math.abs(distance - 1) <= CONTACT_TOLERANCE) {
        extraUnitEdges.push({ u, v, type: "contact" });
      }
    }
  }
  if (minimumSeparation < 1e-8) throw new Error("This drawing has coincident vertices; choose another translation angle.");
  if (maxEdgeError > 1e-8) throw new Error("The drawing failed the unit-edge check.");
  return { extraUnitEdges, diagnostics: { maxEdgeError, minimumSeparation, contactTolerance: CONTACT_TOLERANCE } };
}

export function unitDirections(vertices, edges) {
  const directions = new Map();
  for (const { u, v, type } of edges) {
    let x = vertices[v].x - vertices[u].x;
    let y = vertices[v].y - vertices[u].y;
    const length = Math.hypot(x, y);
    x /= length;
    y /= length;
    if (y < -1e-10 || (Math.abs(y) <= 1e-10 && x < 0)) { x = -x; y = -y; }
    if (Math.abs(x) < 1e-12) x = 0;
    if (Math.abs(y) < 1e-12) y = 0;
    const key = `${x.toFixed(9)},${y.toFixed(9)}`;
    if (!directions.has(key)) directions.set(key, { x, y, angleDegrees: Math.atan2(y, x) * 180 / Math.PI, edgeCount: 0, types: [] });
    const direction = directions.get(key);
    direction.edgeCount++;
    if (!direction.types.includes(type)) direction.types.push(type);
  }
  return [...directions.values()].sort((a, b) => a.angleDegrees - b.angleDegrees);
}

export function buildPetersen(n, k, options = {}) {
  return buildIGraph(n, 1, k, options);
}

export function buildIGraph(n, j, k, options = {}) {
  validateIGraphParameters(n, j, k);
  const branch = Number(options.branch) === -1 ? -1 : 1;
  const componentCount = gcd(gcd(n, j), k);
  const nauruComponents = nauruComponentCount(n, j, k);
  let vertices, embedding;
  if (j === k) {
    // Relative to the first outer edge, use (3 ± 4i)/5. This non-root of
    // unity cannot coincide with a normalized unit chord of the polygon.
    const angle = options.translationAngle === undefined
      ? Math.PI / 2 + Math.PI * j / n + branch * Math.atan2(4, 3)
      : branch * options.translationAngle;
    if (!Number.isFinite(angle)) throw new RangeError("The translation angle must be finite.");
    const drawing = prismVertices(n, j, angle);
    vertices = drawing.vertices;
    embedding = { construction: "translated-prism", multiplier: 1,
      outerRadius: drawing.radius, innerRadius: drawing.radius,
      angleRadians: null, angleDegrees: null, translation: drawing.translation,
      translationAngleRadians: angle, availableMultipliers: [],
      rotationCenter: { x: drawing.translation.x / 2, y: drawing.translation.y / 2 },
      rotationEnabled: false };
  } else if (nauruComponents) {
    const swappedLayers = j > k;
    const drawing = fourCircleVertices(n, nauruComponents, swappedLayers, branch);
    vertices = drawing.vertices;
    const { vertices: ignored, ...radii } = drawing;
    embedding = { construction: "four-circle", multiplier: 1,
      angleRadians: 0, angleDegrees: 0, ...radii, swappedLayers, rotationOrder: 12,
      availableMultipliers: [],
      rotationCenter: { x: 0, y: 0 }, rotationEnabled: nauruComponents === 1 };
  } else {
    const candidates = availableIGraphEmbeddings(n, j, k);
    const requested = options.multiplier === undefined || options.multiplier === "auto"
      ? candidates[0]?.multiplier : Number(options.multiplier);
    const selected = candidates.find(candidate => candidate.multiplier === requested);
    if (!selected) throw new RangeError("No unit-distance concentric drawing exists for that multiplier.");
    vertices = concentricVertices(n, selected, branch);
    embedding = { construction: "concentric", ...selected,
      angleRadians: branch * selected.angleRadians,
      angleDegrees: branch * selected.angleDegrees,
      availableMultipliers: candidates.map(candidate => candidate.multiplier),
      rotationCenter: { x: 0, y: 0 }, rotationEnabled: true };
  }
  const edges = makeEdges(n, j, k);
  const { extraUnitEdges, diagnostics } = inspectDrawing(vertices, edges);
  const bipartite = (n / componentCount) % 2 === 0 &&
    (j / componentCount) % 2 === 1 && (k / componentCount) % 2 === 1;
  return { n, j, k, componentCount, vertices, edges, extraUnitEdges, embedding,
    directions: unitDirections(vertices, edges), bipartite,
    chromaticNumber: bipartite ? 2 : 3,
    colors: finiteColoring(n, j, componentCount, bipartite, edges), diagnostics };
}
