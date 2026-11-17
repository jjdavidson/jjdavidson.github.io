import { colorOf, latticePoint, movingPoint, norm, rotate } from "./geometry.js";

const directions = [[1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]];
const add = ([a, b], [c, d]) => [a + c, b + d];
const difference = ([a, b], [c, d]) => [a - c, b - d];
const midpoint = ([a, b], [c, d]) => [(a + c) / 2, (b + d) / 2];
const turn = ([a, b]) => [-a - b, a]; // Multiplication by α².
const turnOffset = ([a, b]) => [-a - b - 1, a]; // The offset adds (α² - 1)/q = -1.
const orbit = (point, turnPoint) => [point, turnPoint(point), turnPoint(turnPoint(point))];
const offset = movingPoint([1, 0]);

function latticeDistance(a, b) {
  const [m, n] = difference(a, b);
  return Math.max(Math.abs(m), Math.abs(n), Math.abs(m + n));
}

function nextAlongPath(center, tip) {
  const distance = latticeDistance(center, tip);
  let next, bestDeviation = Infinity;
  for (const direction of directions) {
    const candidate = add(center, direction);
    if (latticeDistance(candidate, tip) !== distance - 1) continue;
    // Among shortest paths, stay close to the straight line from the origin.
    const deviation = Math.abs(candidate[0] * tip[1] - candidate[1] * tip[0]);
    if (deviation < bestDeviation) {
      next = candidate;
      bestDeviation = deviation;
    }
  }
  return next;
}

function addLayer(tips, turnPoint, position, color, vertices, edges) {
  const tipKeys = new Set(tips.map(point => point.join(",")));
  const index = new Map();
  const edgeKeys = new Set();

  function vertex(point) {
    const key = point.join(",");
    if (!index.has(key)) {
      index.set(key, vertices.length);
      vertices.push({ ...position(point), color: color(point), contact: tipKeys.has(key) });
    }
    return index.get(key);
  }

  function triangle(a, b, c) {
    const ids = [vertex(a), vertex(b), vertex(c)];
    for (let i = 0; i < ids.length; i++) {
      const u = ids[i], v = ids[(i + 1) % ids.length];
      const key = [Math.min(u, v), Math.max(u, v)].join(",");
      if (edgeKeys.has(key)) continue;
      edgeKeys.add(key);
      edges.push({ u, v, type: "lattice" });
    }
  }

  const [a, b, c] = tips;
  const sideSquared = norm(difference(a, b));
  if (sideSquared === 1) {
    triangle(a, b, c);
  } else if (sideSquared === 4) {
    const ab = midpoint(a, b), bc = midpoint(b, c), ca = midpoint(c, a);
    triangle(a, ab, ca);
    triangle(b, bc, ab);
    triangle(c, ca, bc);
    triangle(ab, bc, ca);
  } else {
    const stars = new Set();
    function star(center) {
      const key = center.join(",");
      if (stars.has(key)) return;
      stars.add(key);
      const neighbors = directions.map(direction => add(center, direction));
      for (let i = 0; i < neighbors.length; i++) {
        triangle(center, neighbors[i], neighbors[(i + 1) % neighbors.length]);
      }
    }

    function addRotatedStars(center) {
      for (const point of orbit(center, turnPoint)) star(point);
    }

    // Grow one arm with its two rotated copies. Adjacent stars share
    // triangles, and the three starting centers coincide or are adjacent.
    let center = [0, 0];
    addRotatedStars(center);
    while (!index.has(a.join(","))) {
      center = nextAlongPath(center, a);
      addRotatedStars(center);
    }
  }

  return tips.map(point => index.get(point.join(",")));
}

export function buildWitness(construction) {
  const vertices = [], edges = [];
  if (!construction?.contacts?.length) return { vertices, edges };

  const radialNorm = ({ fixed, movingNumerator }) => Math.max(3 * norm(fixed), norm(movingNumerator));
  const seed = construction.contacts.reduce((first, contact) =>
    radialNorm(contact) < radialNorm(first) ? contact : first);
  const fixedTips = orbit(seed.fixed, turn);
  const movingTips = orbit(seed.movingLattice, turnOffset);
  const fixedContactColor = colorOf(seed.fixed);

  const fixedIds = addLayer(fixedTips, turn, latticePoint,
    point => (colorOf(point) - fixedContactColor + 3) % 3, vertices, edges);
  const movingIds = addLayer(movingTips, turnOffset, point => {
    const { x, y } = latticePoint(point);
    return rotate({ x: x + offset.x, y: y + offset.y }, construction.angle);
  }, point => colorOf(point) + 1, vertices, edges);

  for (let i = 0; i < fixedIds.length; i++) {
    edges.push({ u: fixedIds[i], v: movingIds[i], type: "contact" });
  }
  return {
    vertices,
    edges,
    fixedNorm: seed.fixedNorm,
    movingNorm: seed.movingNorm,
  };
}
