// Coordinates use alpha=(1+i*sqrt(3))/2. Rendering is numerical; the contact
// enumeration below uses integer arithmetic and the proved global radius bound.
const rootThree = Math.sqrt(3);
const q = [2, -1];
const qbar = [1, 1];
const units = [[1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]];
const mod = (n, m) => ((n % m) + m) % m;
const pair = (a, b) => Array.isArray(a) ? a : [a, b];
const mul = ([a, b], [c, d]) => [a * c - b * d, a * d + b * c + b * d];
const conjugate = ([a, b]) => [a + b, -b];
const cmul = (a, b) => ({ x: a.x * b.x - a.y * b.y, y: a.x * b.y + a.y * b.x });
const cscale = (a, s) => ({ x: a.x * s, y: a.y * s });
export const MAX_FIXED_NORM = 4096;
export const MAX_MOVING_NORM = 3 * MAX_FIXED_NORM;

export function norm(a, b) {
  const [m, n] = pair(a, b);
  return m * m + m * n + n * n;
}

export function colorOf(a, b) {
  const [m, n] = pair(a, b);
  return mod(m - n, 3);
}

export function latticePoint(a, b) {
  const [m, n] = pair(a, b);
  return { x: m + n / 2, y: n * rootThree / 2 };
}

export function movingPoint(numerator) {
  return cscale(latticePoint(mul(numerator, qbar)), 1 / 3);
}

export function rotate(point, angle) {
  return cmul(point, { x: Math.cos(angle), y: Math.sin(angle) });
}

export function selectShell(squaredRadius, residue = null) {
  if (!Number.isSafeInteger(squaredRadius) || squaredRadius < 1) return null;
  for (let n = Math.floor(Math.sqrt(squaredRadius / 3)); n >= 0; n--) {
    const m = (Math.sqrt(4 * squaredRadius - 3 * n * n) - n) / 2;
    if (!Number.isInteger(m) || m < n || norm(m, n) !== squaredRadius) continue;
    if (residue === null || colorOf(m, n) === mod(residue, 3)) return [m, n];
    if (colorOf(-m, -n) === mod(residue, 3)) return [-m, -n];
  }
  return null;
}

function sigmaFromSeed(w, y, branch) {
  const N = norm(w), M = norm(y), A = 3 * N + M - 3;
  const D = 12 * N * M - A * A;
  const numerator = cmul(cmul(latticePoint(q), latticePoint(w)), { x: A, y: branch * Math.sqrt(D) });
  const z = latticePoint(y);
  return cscale(cmul(numerator, { x: z.x, y: -z.y }), 1 / (6 * N * M));
}

export function normalizeSeed(wInput, yInput, branchInput = -1) {
  let w = [...wInput], y = [...yInput], branch = Number(branchInput) === 1 ? 1 : -1;
  if (colorOf(y) === 2) y = mul(units[5], y);
  let sigma = sigmaFromSeed(w, y, branch);
  const degrees = mod(Math.atan2(sigma.y, sigma.x) * 180 / Math.PI, 360);
  w = mul(units[mod(-Math.floor((degrees + 1e-10) / 60), 6)], w);
  sigma = sigmaFromSeed(w, y, branch);
  let folded = mod(Math.atan2(sigma.y, sigma.x) * 180 / Math.PI, 360);
  if (folded > 30 + 1e-8) {
    // Reflection followed by a 60-degree global turn: sigma -> alpha*bar(sigma).
    w = mul(units[2], conjugate(w));
    y = conjugate(y);
    branch *= -1;
    sigma = sigmaFromSeed(w, y, branch);
    folded = mod(Math.atan2(sigma.y, sigma.x) * 180 / Math.PI, 360);
  }
  if (folded > 30 + 1e-7) throw new Error("Could not normalize the contact orientation.");
  return { w, y, branch, sigma, angleDegrees: folded };
}

function shellPoints(squaredRadius, residue = null) {
  const points = [];
  const bound = Math.floor(2 * Math.sqrt(squaredRadius / 3));
  for (let b = -bound; b <= bound; b++) {
    const root = Math.sqrt(4 * squaredRadius - 3 * b * b);
    if (!Number.isInteger(root)) continue;
    for (const a of new Set([(-b + root) / 2, (-b - root) / 2])) {
      if (!Number.isInteger(a) || (residue !== null && colorOf(a, b) !== residue)) continue;
      points.push([a, b]);
    }
  }
  return points;
}

export function contactDiscriminant(N, M) {
  return 12 * N * M - (3 * N + M - 3) ** 2;
}

export function contactAngleKey({ w, y, branch }) {
  // Within a shell pair the discriminant and denominator are fixed.
  const product = mul(q, mul(w, conjugate(y)));
  return `${product.join(",")},${branch}`;
}

export function contactRotations(N, M) {
  if (!Number.isSafeInteger(N) || N < 1 || N > MAX_FIXED_NORM ||
      !Number.isSafeInteger(M) || M < 1 || M > MAX_MOVING_NORM || M % 3 !== 1) return [];
  if (contactDiscriminant(N, M) <= 0) return [];
  const angles = new Map();
  for (const w of shellPoints(N)) for (const y of shellPoints(M, 1)) {
    for (const branch of [-1, 1]) {
      const seed = normalizeSeed(w, y, branch);
      const key = contactAngleKey(seed);
      if (!angles.has(key)) angles.set(key, { ...seed, key });
    }
  }
  return [...angles.values()].sort((a, b) => a.angleDegrees - b.angleDegrees);
}

// Unlike contactAngleKey, this identifies the same rotation across shells.
export function contactRotationKey({ w, y, branch }) {
  return `${quadraticKey(w, y)},${branch}`;
}

export function contactRotationsNear(angleDegrees, { toleranceDegrees = 0.005 } = {}) {
  if (!Number.isFinite(angleDegrees) || angleDegrees < 0 || angleDegrees > 30) {
    throw new RangeError("Enter an angle from 0° to 30°.");
  }
  if (!Number.isFinite(toleranceDegrees) || toleranceDegrees < 0 || toleranceDegrees > 1) {
    throw new RangeError("The angle tolerance must be from 0° to 1°.");
  }

  const radiansPerDegree = Math.PI / 180;
  const angle = angleDegrees * radiansPerDegree;
  const turn = { x: Math.cos(angle), y: Math.sin(angle) };
  // Pad the numerical search window for roundoff. Every returned seed
  // defines an exact contact through its integer discriminant.
  const window = toleranceDegrees + 1e-9;
  const chordScale = 2 * Math.sin(window * radiansPerDegree / 2);
  const offsetBound = Math.floor(2 * Math.sqrt(MAX_MOVING_NORM / 3));
  const matches = new Map();

  for (let a = -offsetBound; a <= offsetBound; a++) {
    for (let b = -offsetBound; b <= offsetBound; b++) {
      const M = norm(a, b);
      if (M > MAX_MOVING_NORM || colorOf(a, b) !== 1) continue;
      const y = [a, b];
      const center = cmul(movingPoint(y), turn);
      // Rotating this offset point within the window moves it by at most
      // this chord length. Any qualifying fixed point lies in the annulus.
      const displacement = chordScale * Math.sqrt(M / 3) + 1e-9;
      const outer = 1 + displacement;
      const innerSquared = Math.max(0, 1 - displacement) ** 2;
      const outerSquared = outer ** 2;
      const firstRow = Math.ceil((center.y - outer) * 2 / rootThree);
      const lastRow = Math.floor((center.y + outer) * 2 / rootThree);

      for (let n = firstRow; n <= lastRow; n++) {
        const dx = center.x - n / 2;
        const dy = center.y - n * rootThree / 2;
        for (let m = Math.ceil(dx - outer); m <= Math.floor(dx + outer); m++) {
          const N = norm(m, n);
          if (N === 0 || N > MAX_FIXED_NORM) continue;
          const distanceSquared = (m - dx) ** 2 + dy ** 2;
          if (distanceSquared < innerSquared || distanceSquared > outerSquared) continue;
          if (contactDiscriminant(N, M) <= 0) continue;

          const w = [m, n];
          for (const branch of [-1, 1]) {
            const sigma = sigmaFromSeed(w, y, branch);
            const degrees = Math.atan2(sigma.y, sigma.x) / radiansPerDegree;
            // Symmetry preserves both seed radii, so a rotation in the
            // canonical sector has a seed in this scan with no further fold.
            if (degrees < 0 || degrees > 30 || Math.abs(degrees - angleDegrees) > window) continue;
            const seed = { w, y, branch, sigma, angleDegrees: degrees, N, M };
            const key = contactRotationKey(seed);
            const previous = matches.get(key);
            if (!previous || Math.max(3 * N, M) < Math.max(3 * previous.N, previous.M)) {
              matches.set(key, { ...seed, key });
            }
          }
        }
      }
    }
  }

  return [...matches.values()].sort((a, b) =>
    Math.abs(a.angleDegrees - angleDegrees) - Math.abs(b.angleDegrees - angleDegrees) ||
    a.angleDegrees - b.angleDegrees
  );
}

function gcd(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) [a, b] = [b, a % b];
  return a;
}

function integerSqrt(n) {
  if (n < 0n) throw new Error("Negative integer square root.");
  if (n < 2n) return n;
  let x = 1n << BigInt(Math.ceil(n.toString(2).length / 2));
  for (;;) {
    const next = (x + n / x) / 2n;
    if (next >= x) return x;
    x = next;
  }
}

function bigMul([a, b], [c, d]) {
  return [a * c - b * d, a * d + b * c + b * d];
}

function bigNorm([a, b]) { return a * a + a * b + b * b; }

function contactRecord(fixed, movingNumerator) {
  const [a, b] = movingNumerator;
  const movingLattice = [(a - b - 1) / 3, (a + 2 * b - 1) / 3];
  return {
    id: `${fixed.join(",")}|${movingNumerator.join(",")}`,
    fixed, movingNumerator, movingLattice,
    fixedPoint: latticePoint(fixed), movingPoint: movingPoint(movingNumerator),
    fixedNorm: norm(fixed), movingNorm: norm(movingNumerator) / 3,
    color: colorOf(fixed), movingColor: colorOf(movingLattice)
  };
}

function selectedOrbit(w, y) {
  return [0, 2, 4].map(j => contactRecord(mul(units[j], w), mul(units[j], y)));
}

function enumerateContacts(construction, maxCandidates) {
  const { w, y, N, M, A, D } = construction;
  const bN = BigInt(N), bM = BigInt(M), bA = BigInt(A), bD = BigInt(D);
  const globalLimit = (36n * bN * bM) / bD;
  const coordinateBound = limit => Number(integerSqrt((4n * limit) / 3n)) + 2;
  const globalBound = coordinateBound(globalLimit);
  const candidateCount = (2 * globalBound + 1) ** 2;
  const complete = Number.isSafeInteger(candidateCount) && candidateCount <= maxCandidates;
  // The seed's disk already contains a contact, so searching it suffices
  // to find the first contact even when the global search is too large.
  const radialLimit = BigInt(Math.max(3 * N, M));
  const Kmax = complete || globalLimit < radialLimit ? globalLimit : radialLimit;
  const bound = coordinateBound(Kmax);
  if ((2 * bound + 1) ** 2 > maxCandidates) {
    return { contacts: selectedOrbit(w, y), complete: false, candidateCount, nearestComplete: false };
  }
  const W = mul(w, conjugate(y)).map(BigInt);
  const contacts = new Map();
  for (let a = -bound; a <= bound; a++) {
    for (let b = -bound; b <= bound; b++) {
      if (colorOf(a, b) !== 1) continue;
      const zp = [BigInt(a), BigInt(b)];
      const K = bigNorm(zp);
      if (!K || K > Kmax) continue;
      const [r, s] = bigMul(W, zp);
      const g = gcd(r, s);
      const primitive = [r / g, s / g];
      const n0 = bigNorm(primitive);
      const discriminant = K * (36n * bN * bM - bD * K);
      if (discriminant < 0n) continue;
      const h = integerSqrt(discriminant);
      if (h * h !== discriminant) continue;
      const numerators = new Set([bA * K + h, bA * K - h]);
      for (const numerator of numerators) {
        const denominator = 6n * g * n0;
        if (numerator % denominator) continue;
        const t = numerator / denominator;
        if (3n * g * t * t * n0 + g * K - bA * t * K !== 3n * g) {
          throw new Error("Exact contact equation failed.");
        }
        const fixed = primitive.map(x => Number(t * x));
        if (!complete && 3 * norm(fixed) > Number(radialLimit)) continue;
        const contact = contactRecord(fixed, [a, b]);
        contacts.set(contact.id, contact);
      }
    }
  }
  return {
    contacts: [...contacts.values()].sort((a, b) => a.fixedNorm - b.fixedNorm || a.fixed[0] - b.fixed[0] || a.fixed[1] - b.fixed[1]),
    complete, candidateCount, nearestComplete: true,
    searchedRadius: complete ? null : Math.sqrt(Number(radialLimit) / 3)
  };
}

export function squarefreePart(n) {
  let d = n;
  for (let p = 2; p * p <= d; p++) while (d % (p * p) === 0) d /= p * p;
  return d;
}

function primitiveContactPolynomial(construction) {
  const { w, y, N, M, A } = construction;
  const T = mul(mul(qbar, conjugate(w)), y);
  const P = BigInt(2 * T[0] + T[1]);
  const n = BigInt(N), m = BigInt(M), a = BigInt(A);
  const leading = 3n * n * m;
  const next = -a * P;
  const middle = a * a + P * P - 6n * n * m;
  const common = gcd(gcd(leading, next), middle);
  return [leading, next, middle, next, leading].map(x => Number(x / common));
}

export function minimalRotationPolynomial(construction) {
  const polynomial = construction.primitivePolynomial;
  const [a, b, c] = polynomial;
  const r = Math.sqrt(a);
  const s = b / (2 * r);
  // A quadratic rotation gives the square of its minimal polynomial in the
  // contact formula. Otherwise this primitive quartic is already irreducible.
  if (Number.isInteger(r) && r * r === a && Number.isInteger(s) && c === 2 * a + s * s) {
    return [r, s, r];
  }
  return [...polynomial];
}

function quadraticKey(w, y) {
  const A = 3 * norm(w) + norm(y) - 3;
  const [a, b] = mul(mul(qbar, conjugate(w)), y);
  const common = Number(gcd(gcd(BigInt(a), BigInt(b)), BigInt(A)));
  return `${a / common},${b / common},${A / common}`;
}

const quotientFourKeys = new Set();
for (const [w, y] of [
  [[6, 0], [-10, 4]],
  [[4, 0], [9, -4]],
  [[-7, 3], [-10, 0]],
  [[-8, 4], [-12, 5]], // The order-12 subgroup of the residue field at 23.
]) {
  for (const branch of [-1, 1]) {
    const normalized = normalizeSeed(w, y, branch);
    quotientFourKeys.add(quadraticKey(normalized.w, normalized.y));
  }
}

export function classifyConstruction(construction) {
  const { d, w, y, primitivePolynomial } = construction;
  let max = 7, proved = false, reason = "No global four-coloring is established here.";
  if (d % 8 !== 7) {
    max = 4; proved = true; reason = "A four-coloring of the whole coordinate field comes from reduction at 2.";
  } else if (d % 5 === 0 || [2, 3].includes(d % 5)) {
    max = 4; proved = true; reason = "A four-coloring of the whole coordinate field comes from reduction at 5.";
  } else if (primitivePolynomial[0] % 2 === 1) {
    max = 4; proved = true; reason = "These particular rotation parameters admit a four-color reduction at 2.";
  } else if (primitivePolynomial[0] % 7 !== 0 && [0, 1, 2, 4].includes(mod(-d, 7))) {
    max = 4; proved = true; reason = "Reduction at two conjugate primes above 7 gives a four-color Eisenstein quotient.";
  } else if (quotientFourKeys.has(quadraticKey(w, y))) {
    max = 4; proved = true; reason = "An explicit finite Eisenstein quotient gives a global four-coloring.";
  } else {
    const residue = mod(-d, 11);
    if (residue === 0 || [2, 6, 7, 8, 10].includes(residue)) {
      max = 5; reason = "Four colors are necessary; reduction at 11 supplies a global five-color upper bound.";
    }
  }
  return { twoLattices: 4, moncay: { min: 4, max, proved, reason } };
}

export function buildFromSeed(wInput, yInput, branchInput = -1, options = {}) {
  for (const value of [...wInput, ...yInput]) {
    if (!Number.isSafeInteger(value)) throw new Error("Lattice coordinates must be integers.");
  }
  const N = norm(wInput), M = norm(yInput);
  if (N < 1 || M < 1) throw new Error("Choose nonzero lattice vertices.");
  if (colorOf(yInput) === 0) throw new Error("The moving triangle must have squared side length congruent to 1 modulo 3.");
  const A = 3 * N + M - 3;
  const D = contactDiscriminant(N, M);
  if (!Number.isSafeInteger(D) || D <= 0) throw new Error("These radii cannot meet at distance one. Choose closer radii.");
  const normalized = options.normalize === false
    ? { w: [...wInput], y: [...yInput], branch: Number(branchInput) === 1 ? 1 : -1, sigma: sigmaFromSeed(wInput, yInput, Number(branchInput) === 1 ? 1 : -1) }
    : normalizeSeed(wInput, yInput, branchInput);
  if (colorOf(normalized.y) !== 1) throw new Error("The moving vertex must lie in the chosen triangle-center coset.");
  const angle = Math.atan2(normalized.sigma.y, normalized.sigma.x);
  const construction = {
    w: normalized.w, y: normalized.y, N, M, A, D, d: squarefreePart(D),
    sourceW: [...wInput], sourceY: [...yInput], branch: Number(branchInput) === 1 ? 1 : -1,
    seedBranch: normalized.branch, sigma: normalized.sigma,
    angle, angleDegrees: angle * 180 / Math.PI,
    normBound: 12 * N * M / D,
    selectedContacts: selectedOrbit(normalized.w, normalized.y)
  };
  construction.primitivePolynomial = primitiveContactPolynomial(construction);
  Object.assign(construction, enumerateContacts(construction, options.maxCandidates ?? 200000));
  construction.classification = classifyConstruction(construction);
  return construction;
}

export function buildConstruction(N, M, branch = -1, options = {}) {
  if (!Number.isSafeInteger(N) || N < 1 || N > MAX_FIXED_NORM) throw new Error("Enter a fixed squared radius from 1 to 4096.");
  if (!Number.isSafeInteger(M) || M < 1 || M > MAX_MOVING_NORM) throw new Error("Enter a squared triangle side from 1 to 12288.");
  const w = selectShell(N), y = selectShell(M, 1);
  if (!w) throw new Error("That fixed squared radius does not occur on the triangular lattice.");
  if (M % 3 !== 1) throw new Error("The squared triangle side must be congruent to 1 modulo 3.");
  if (!y) throw new Error("That squared triangle side does not occur on the triangular lattice.");
  return buildFromSeed(w, y, branch, options);
}

export function buildGrid(radius, { moving = false } = {}) {
  const points = [], index = new Map(), edges = [];
  const bound = Math.ceil(2 * (radius + (moving ? 1 / rootThree : 0)) / rootThree) + 1;
  for (let m = -bound; m <= bound; m++) for (let n = -bound; n <= bound; n++) {
    const numerator = moving ? [1 + 2 * m + n, -m + n] : null;
    const point = moving ? movingPoint(numerator) : latticePoint(m, n);
    if (point.x * point.x + point.y * point.y > radius * radius + 1e-9) continue;
    index.set(`${m},${n}`, points.length);
    points.push({ m, n, ...point, color: colorOf(m, n), squaredRadius: moving ? norm(numerator) / 3 : norm(m, n), movingNumerator: numerator });
  }
  for (let i = 0; i < points.length; i++) for (const [a, b] of [[1, 0], [0, 1], [1, -1]]) {
    const j = index.get(`${points[i].m + a},${points[i].n + b}`);
    if (j !== undefined) edges.push([i, j]);
  }
  return { points, edges, index, origin: moving ? undefined : index.get("0,0"), baseVertex: index.get("0,0") };
}
