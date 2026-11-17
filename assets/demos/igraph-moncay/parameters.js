// Minimal polynomials in the frame where u0 → uj has direction 1. For Nauru,
// these are the products over distinct conjugates in Q(i, √3, √5), scaled to
// primitive integer coefficients.
const nauruBeta = ["16", "-28", "33", "-28", "16"];
const nauruOddInner = ["9", "0", "-2", "0", "9"];
const swappedNauruOddInner = ["81", "0", "18", "0", "-77", "0", "18", "0", "81"];
const nauruGamma = ["144", "432", "468", "168", "-23", "168", "468", "432", "144"];
const unitPolynomial = ["1", "-1"];

function edgeAngle(vertices, u, v) {
  return Math.atan2(vertices[v].y - vertices[u].y, vertices[v].x - vertices[u].x);
}

export function moncayParameters(graph) {
  const { n, j, k, vertices, embedding, componentCount } = graph;
  const referenceAngle = edgeAngle(vertices, 0, j);

  function direction(name, u, v, description) {
    const angle = edgeAngle(vertices, u, v) - referenceAngle;
    return {
      name, angle: Math.atan2(Math.sin(angle), Math.cos(angle)),
      edges: [{ u, v }], generator: true, description,
    };
  }

  const beta = direction("β", n, n + k, "First inner rim edge");
  const gamma = direction("γ", 0, n, "First spoke");
  const fourCircle = embedding.construction === "four-circle";
  const order = embedding.rotationOrder ?? n;
  const winding = fourCircle && vertices[componentCount].y < 0 ? -1 : embedding.multiplier;
  const alpha = {
    name: "α", angle: 2 * Math.PI * winding / order,
    edges: fourCircle ? [{ u: 0, v: n }, { u: componentCount, v: n + componentCount }]
      : [{ u: 1, v: (1 + j) % n }],
    generator: true,
    description: fourCircle ? "Rotation from the first spoke to the next spoke in the component"
      : "Outer rim edge after one index advance",
    formula: `e<sup>2πi·${winding}/${order}</sup>`,
    catalog: { kind: "root", order },
  };

  if (fourCircle) {
    // Each rim has two chord types according to the starting index parity.
    // The reference covers the even outer chords. If A is the reference
    // chord before rotation, the odd outer chords are signed rotations of
    // its conjugate, so their normalized directions are powers of α times
    // ±A⁻² = ±γ². The inner rim uses both β and δ.
    const odd = n + componentCount;
    const delta = direction("δ", odd, odd + k, "Inner rim edge from the next index in the component");
    beta.coefficients = nauruBeta;
    delta.coefficients = embedding.swappedLayers ? swappedNauruOddInner : nauruOddInner;
    gamma.coefficients = nauruGamma;
    return { referenceAngle, parameters: [alpha, beta, gamma, delta] };
  }

  if (embedding.construction === "translated-prism") {
    beta.angle = 0;
    beta.generator = false;
    beta.formula = "1";
    beta.coefficients = unitPolynomial;
    const defaultAngle = Math.atan2(4, 3);
    if (Math.abs(Math.abs(gamma.angle) - defaultAngle) < 1e-12) {
      gamma.coefficients = ["5", "-6", "5"];
      gamma.formula = `(3 ${gamma.angle < 0 ? "−" : "+"} 4i)/5`;
    }
  } else if (j === 1) {
    const pairKey = `${n},${k}`;
    const branch = embedding.angleRadians < 0 ? -1 : 1;
    const key = `${pairKey},${embedding.multiplier},${branch}`;
    beta.catalog = { kind: "branch", key, pairKey, index: 0 };
    gamma.catalog = { kind: "branch", key, pairKey, index: 1 };
  }

  return { referenceAngle, parameters: [alpha, beta, gamma] };
}
