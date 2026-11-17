import { mountConstruction } from "../shared/construction-player.js";

const durations = [0, 3600, 5000, 3900, 2800, 0, 2600, 650, 0];
const slate = "#354459";
const blue = "#2556a3";
const orange = "#ae570d";
const red = "#b4232f";
const palette = ["#6739a6", "#aa5c07", "#297146", "#2161aa", "#ab3168"];
const ease = t => t * t * (3 - 2 * t);

function rotate([x, y], angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [c * x - s * y, s * x + c * y];
}

function createDrawing(canvas, geometry) {
  const ctx = canvas.getContext("2d");
  const { points, rings, v, vv, vCopies, vvCopies, edgeGroups, pair, betaAngle, closingAngle } = geometry;
  const all = points.map((_, i) => i);
  const { weights, terms, rotatedMultiplier } = geometry.coloring;
  const baseColors = terms.map(list => list.reduce((sum, term) => sum + weights[term], 0) % 5);
  const rotatedColors = baseColors.map(color => color * rotatedMultiplier % 5);
  const colorGroups = [baseColors, rotatedColors].map(colors => {
    const groups = palette.map(() => []);
    colors.forEach((color, index) => groups[color].push(index));
    return groups;
  });
  const origin = points[pair[0]];
  const tip = points[pair[1]];
  const graphRadius = Math.max(...points.map(point => Math.hypot(...point))) + 0.13;
  let width = 0;
  let height = 0;
  let scale = 1;

  function dots(indices, size, color, opacity) {
    const radius = size / scale;
    ctx.beginPath();
    for (const index of indices) {
      const [x, y] = points[index];
      ctx.moveTo(x + radius, y);
      ctx.arc(x, y, radius, 0, Math.PI * 2);
    }
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function hexagon(ring, color, opacity) {
    ctx.beginPath();
    ring.forEach((index, i) => {
      ctx.moveTo(0, 0);
      ctx.lineTo(...points[index]);
      ctx.lineTo(...points[ring[(i + 1) % ring.length]]);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 1 / scale;
    ctx.globalAlpha = opacity;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function edges(progress, color, opacity) {
    const groups = progress * edgeGroups.length;
    ctx.beginPath();
    edgeGroups.forEach((group, i) => {
      const count = Math.floor(group.length * Math.max(0, Math.min(1, groups - i)));
      for (let j = 0; j < count; j++) {
        const [a, b] = group[j];
        ctx.moveTo(...points[a]);
        ctx.lineTo(...points[b]);
      }
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.75 / scale;
    ctx.globalAlpha = opacity;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function addCopies(base, copies, shifts, progress, size) {
    const position = progress * copies.length;
    const finished = Math.floor(position);
    const visible = new Set(base);
    for (let i = 0; i < finished; i++) {
      for (const index of copies[i]) visible.add(index);
    }
    dots(visible, size, slate, 0.73);
    if (finished < copies.length) {
      const fraction = ease(position - finished);
      const [x, y] = points[shifts[finished]];
      ctx.save();
      ctx.translate(x * fraction, y * fraction);
      dots(base, size + 0.3, blue, 0.8);
      ctx.restore();
    }
  }

  function marker([x, y], color = orange) {
    ctx.beginPath();
    ctx.arc(x, y, 5 / scale, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5 / scale;
    ctx.stroke();
  }

  function label(text, [x, y], dx, dy, align = "left") {
    const labelX = width / 2 + x * scale + dx;
    const labelY = height / 2 - y * scale + dy;
    ctx.font = "600 14px system-ui, sans-serif";
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = "#fff";
    ctx.fillStyle = slate;
    ctx.strokeText(text, labelX, labelY);
    ctx.fillText(text, labelX, labelY);
  }

  function draw(step, progress) {
    if (!width || !height) return;
    let radius = 1.18;
    if (step === 2) radius = 1.18 + (2.15 - 1.18) * ease(Math.min(1, progress * 4));
    if (step === 3) radius = 2.15 + (graphRadius - 2.15) * ease(Math.min(1, progress * 4));
    if (step > 3) radius = graphRadius;
    scale = (Math.min(width, height) - 44) / (2 * radius);
    const turn = step === 6 ? closingAngle * ease(progress) : closingAngle;
    const movingTip = rotate(tip, turn);
    const showColoring = step === 8;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(scale, -scale);

    if (step < 2) {
      const position = step === 0 ? 1 : 1 + progress * (rings.length - 1);
      const finished = Math.floor(position);
      for (let i = 0; i < finished; i++) {
        hexagon(rings[i], slate, 0.28);
        dots(rings[i], 3, slate, 0.85);
      }
      if (step === 1 && finished < rings.length) {
        const movingAngle = betaAngle * (finished - 1 + ease(position - finished));
        ctx.save();
        ctx.rotate(movingAngle);
        hexagon(rings[0], blue, 0.55);
        dots(rings[0], 3.3, blue, 1);
        ctx.restore();
      }
      dots([pair[0]], 3.5, slate, 1);
    } else if (step === 2) {
      addCopies(v, vCopies, v.slice(1), progress, 1.9);
    } else if (step === 3) {
      addCopies(vv, vvCopies, rings[2], progress, 1.15);
    } else {
      const edgeOpacity = showColoring ? 0.035 : step < 6 ? 0.2 : 0.13;
      edges(step === 4 ? progress : 1, slate, edgeOpacity);
      if (showColoring) {
        colorGroups[0].forEach((group, i) => dots(group, 1.35, palette[i], 0.9));
      } else {
        dots(all, 1.05, slate, step < 6 ? 0.52 : 0.38);
      }
      if (step >= 6) {
        ctx.save();
        ctx.rotate(turn);
        edges(1, showColoring ? slate : blue, showColoring ? edgeOpacity : 0.2);
        if (showColoring) {
          colorGroups[1].forEach((group, i) => dots(group, 1.35, palette[i], 0.9));
        } else {
          dots(all, 0.95, blue, 0.58);
        }
        ctx.restore();
      }
      if (step >= 7) {
        const end = tip.map((coordinate, i) => coordinate + (movingTip[i] - coordinate) * ease(progress));
        ctx.beginPath();
        ctx.moveTo(...tip);
        ctx.lineTo(...end);
        ctx.lineCap = "round";
        ctx.lineWidth = 6 / scale;
        ctx.strokeStyle = "#fff";
        ctx.stroke();
        ctx.lineWidth = 3 / scale;
        ctx.strokeStyle = red;
        ctx.stroke();
      }
      if (step >= 5) {
        marker(origin, showColoring ? palette[baseColors[pair[0]]] : orange);
        marker(tip, showColoring ? palette[baseColors[pair[1]]] : orange);
        if (step >= 6) marker(movingTip, showColoring ? palette[rotatedColors[pair[1]]] : orange);
      }
    }

    ctx.restore();
    if (step === 0) {
      label("0", origin, -8, 13, "right");
      label("1", points[rings[0][0]], 9, 0);
      label("α", points[rings[0][1]], 7, -10);
    }
    if (step >= 5) {
      label(showColoring ? `0 (${baseColors[pair[0]]})` : "0", origin, -10, 12, "right");
      label(showColoring ? `L (${baseColors[pair[1]]})` : "L", tip, 10, 4);
      if (step >= 6 && turn > closingAngle * 0.3) {
        label(showColoring ? `L′ (${rotatedColors[pair[1]]})` : "L′", movingTip, 6, -12);
      }
      if (step === 7 && progress === 1) {
        const midpoint = tip.map((coordinate, i) => (coordinate + movingTip[i]) / 2);
        label("1", midpoint, 11, -2);
      }
    }
  }

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  return { draw, resize };
}

export function mount(root, { autoplay = false } = {}) {
  return mountConstruction(root, { autoplay, durations, createDrawing });
}
