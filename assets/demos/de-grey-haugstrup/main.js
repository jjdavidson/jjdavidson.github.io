import { mountConstruction } from "../shared/construction-player.js";

const scaffoldStep = 3;
const tripleInterval = 1400;
const durations = [0, 500, 900, 4 * tripleInterval, 400, 400, 400, 400];
const palette = ["#45546a", "#2563a6", "#087967", "#7251a5", "#aa552a"];
const tripleColor = "#a14612";
const initialYaw = -0.62;
const initialPitch = 0.42;
const pitchLimit = Math.PI / 2 - 0.02;

function createDrawing(canvas, { positions, edges, labels, groups }, { counts, reset, play, tripleButtons }) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable");

  const center = positions.reduce((sum, point) => sum.map((value, axis) => value + point[axis]), [0, 0, 0])
    .map(value => value / positions.length);
  const points = positions.map(point => point.map((value, axis) => value - center[axis]));
  const sceneRadius = Math.max(...points.map(point => Math.hypot(...point)));
  const cameraDistance = 4 * sceneRadius;
  const vertexGroup = points.map((_, index) => groups.findIndex(group => index < group.end));
  const vertexIndices = end => Array.from({ length: end }, (_, index) => index);
  const indicesFor = names => names.map(name => labels.indexOf(name));
  const tetrahedron = indicesFor(["D", "E", "F", "K"]);
  const mirror = indicesFor(["A", "B", "C"]);
  const reflectionPairs = [["D", "G"], ["E", "H"], ["F", "I"], ["K", "J"]].map(indicesFor);
  const groupVertices = groups.map(({ end }) => vertexIndices(end));
  const stageVertices = [
    tetrahedron,
    [...tetrahedron, ...mirror],
    groupVertices[0],
    ...groupVertices,
  ];
  const stages = stageVertices.map((vertices, index) => {
    const visible = new Set(vertices);
    const previous = new Set(stageVertices[index - 1]);
    return {
      vertices,
      edges: edges.filter(([a, b]) => visible.has(a) && visible.has(b)),
      added: new Set(vertices.filter(vertex => !previous.has(vertex))),
    };
  });
  const triples = groups.slice(1).map(group => group.anchors);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let yaw = initialYaw;
  let pitch = initialPitch;
  let width = 0;
  let height = 0;
  let step = 0;
  let progress = 1;
  let drag = null;
  let tripleIndex = 0;
  let tripleTimer = null;

  function selectTriple(index) {
    tripleIndex = index;
    tripleButtons.forEach((button, i) => {
      button.setAttribute("aria-pressed", String(i === index));
    });
  }

  function startTripleCycle() {
    if (tripleTimer !== null) return;
    tripleTimer = window.setInterval(() => {
      if (document.hidden || reduced.matches) return;
      selectTriple((tripleIndex + 1) % triples.length);
      draw(step, progress);
    }, tripleInterval);
  }

  function stopTripleCycle() {
    window.clearInterval(tripleTimer);
    tripleTimer = null;
  }

  tripleButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      if (play.textContent === "Pause") play.click();
      stopTripleCycle();
      selectTriple(index);
      draw(step, progress);
    });
  });

  play.addEventListener("click", () => {
    if (step !== scaffoldStep) return;
    if (play.textContent === "Pause") stopTripleCycle();
    else startTripleCycle();
  });

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function draw(nextStep, nextProgress) {
    if (step !== nextStep) {
      if (step === scaffoldStep) stopTripleCycle();
      if (nextStep === scaffoldStep) {
        selectTriple(0);
        startTripleCycle();
      }
    }
    step = nextStep;
    progress = nextProgress;
    const stage = stages[step];
    const countText = `${stage.vertices.length} vertices · ${stage.edges.length} edges`;
    if (counts.textContent !== countText) counts.textContent = countText;
    if (width === 0 || height === 0) return;

    ctx.clearRect(0, 0, width, height);
    const cosYaw = Math.cos(yaw);
    const sinYaw = Math.sin(yaw);
    const cosPitch = Math.cos(pitch);
    const sinPitch = Math.sin(pitch);
    const scale = 0.38 * Math.min(width, height) / sceneRadius;
    const projected = points.map(([x, y, z], i) => {
      const turnX = cosYaw * x + sinYaw * z;
      const turnZ = cosYaw * z - sinYaw * x;
      const tiltY = cosPitch * y - sinPitch * turnZ;
      const depth = sinPitch * y + cosPitch * turnZ;
      const perspective = cameraDistance / (cameraDistance - depth);
      return {
        x: width / 2 + scale * perspective * turnX,
        y: height / 2 - scale * perspective * tiltY,
        depth,
        perspective,
        i,
      };
    });

    ctx.lineCap = "round";
    if (step === 2) drawReflection(projected);
    const color = palette[step < scaffoldStep ? step : step - scaffoldStep];
    for (const [a, b] of stage.edges) {
      const added = stage.added.has(a) || stage.added.has(b);
      ctx.beginPath();
      ctx.moveTo(projected[a].x, projected[a].y);
      ctx.lineTo(projected[b].x, projected[b].y);
      ctx.strokeStyle = added ? color : palette[Math.max(vertexGroup[a], vertexGroup[b])];
      ctx.lineWidth = added ? 1.7 : 1.15;
      ctx.globalAlpha = added ? 0.8 * progress : 0.36;
      ctx.stroke();
    }

    const highlighted = new Set(step === scaffoldStep ? triples[tripleIndex] : []);
    const anchors = new Set(groups[step - scaffoldStep]?.anchors);
    const visiblePoints = stage.vertices.map(index => projected[index]);
    const depthOrder = [...visiblePoints].sort((a, b) => a.depth - b.depth);
    for (const point of depthOrder) {
      const marked = highlighted.has(point.i);
      const added = stage.added.has(point.i);
      const anchor = anchors.has(point.i);
      const radius = (marked ? 6 : added || anchor ? 4.6 : 3.5) * point.perspective;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = marked ? tripleColor : added || anchor ? color : palette[vertexGroup[point.i]];
      ctx.globalAlpha = added ? progress : marked || anchor ? 1 : 0.72;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = marked || anchor ? 2 : 1;
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.font = "600 12px system-ui, sans-serif";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "#f4f7fb";
    ctx.lineWidth = 3;
    for (const point of visiblePoints) {
      if (step > scaffoldStep && !anchors.has(point.i)) continue;
      ctx.globalAlpha = stage.added.has(point.i) ? progress : 1;
      ctx.fillStyle = highlighted.has(point.i) ? tripleColor : "#24354a";
      const label = labels[point.i];
      ctx.strokeText(label, point.x + 8, point.y - 7);
      ctx.fillText(label, point.x + 8, point.y - 7);
    }
  }

  function drawReflection(projected) {
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(37, 99, 166, 0.18)";
    ctx.beginPath();
    ctx.moveTo(projected[mirror[0]].x, projected[mirror[0]].y);
    for (const index of mirror.slice(1)) ctx.lineTo(projected[index].x, projected[index].y);
    ctx.closePath();
    ctx.fill();

    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "#2563a6";
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.65 * progress;
    for (const [original, reflected] of reflectionPairs) {
      ctx.beginPath();
      ctx.moveTo(projected[original].x, projected[original].y);
      ctx.lineTo(projected[reflected].x, projected[reflected].y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function rotate(horizontal, vertical) {
    yaw += horizontal;
    pitch = Math.max(-pitchLimit, Math.min(pitchLimit, pitch + vertical));
    draw(step, progress);
  }

  canvas.addEventListener("pointerdown", event => {
    if (event.button !== 0 || drag) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", event => {
    if (event.pointerId !== drag?.id) return;
    rotate((event.clientX - drag.x) * 0.012, (event.clientY - drag.y) * 0.012);
    drag.x = event.clientX;
    drag.y = event.clientY;
  });
  canvas.addEventListener("lostpointercapture", event => {
    if (event.pointerId === drag?.id) drag = null;
  });

  const keyTurns = new Map([
    ["ArrowLeft", [-0.15, 0]], ["ArrowRight", [0.15, 0]],
    ["ArrowUp", [0, -0.15]], ["ArrowDown", [0, 0.15]],
  ]);
  canvas.addEventListener("keydown", event => {
    const turn = keyTurns.get(event.key);
    if (!turn) return;
    event.preventDefault();
    rotate(...turn);
  });
  reset.disabled = false;
  reset.addEventListener("click", () => {
    yaw = initialYaw;
    pitch = initialPitch;
    draw(step, progress);
  });

  return { resize, draw };
}

export function mount(root, { autoplay = false } = {}) {
  const counts = root.querySelector('[data-role="counts"]');
  const reset = root.querySelector('[data-role="reset-view"]');
  const play = root.querySelector('[data-role="play"]');
  const tripleButtons = [...root.querySelectorAll('[data-role="triple-option"]')];
  return mountConstruction(root, {
    autoplay,
    durations,
    createDrawing: (canvas, geometry) => createDrawing(canvas, geometry, { counts, reset, play, tripleButtons }),
  });
}
