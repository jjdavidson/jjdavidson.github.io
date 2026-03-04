---
title: Random Walk 1D
parent: Demos
nav_order: 1
---

# Random Walk (1D)

<p>
  Graph of a symmetric random walk over time.
  x-axis = step number, y-axis = position.
</p>

<div id="rw1d" class="rw1d">
  <div class="rw1d-controls">
    <label class="rw1d-label">
      Steps: <span id="rw1dStepsLabel">200</span>
      <input id="rw1dSteps" type="range" min="10" max="2000" step="10" value="200">
    </label>

    <label class="rw1d-label">
      Number of walks:
      <select id="rw1dCount">
        <option value="1">1</option>
        <option value="10">10</option>
        <option value="100">100</option>
        <option value="1000">1000</option>
      </select>
    </label>

    <button id="rw1dDraw" class="rw1d-btn">Draw (placeholder)</button>
  </div>

  <canvas id="rw1dCanvas" width="900" height="420"></canvas>
</div>

<style>
/* Scoped styling: only affects elements inside #rw1d */
#rw1d.rw1d { margin-top: 1rem; }
#rw1d .rw1d-controls { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-bottom: 10px; }
#rw1d .rw1d-label { display: flex; flex-direction: column; gap: 6px; font-size: 14px; }
#rw1d .rw1d-btn { padding: 10px 12px; font-weight: 700; cursor: pointer; }
#rw1d canvas { width: 100%; height: auto; display: block; border: 1px solid rgba(0,0,0,0.12); border-radius: 10px; }
</style>

<script>
(function () {
  const canvas = document.getElementById("rw1dCanvas");
  const stepsInput = document.getElementById("rw1dSteps");
  const stepsLabel = document.getElementById("rw1dStepsLabel");
  const drawBtn = document.getElementById("rw1dDraw");

  // If this script runs on a page without the demo, bail safely.
  if (!canvas || !stepsInput || !stepsLabel || !drawBtn) return;

  const ctx = canvas.getContext("2d");

  function drawAxes() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const padL = 60, padR = 20, padT = 20, padB = 50;
    const x0 = padL, x1 = w - padR;
    const y0 = h - padB, y1 = padT;

    // axes
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x0, y1);
    ctx.lineTo(x0, y0);
    ctx.lineTo(x1, y0);
    ctx.stroke();

    // labels
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.font = "14px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillText("position", 10, 18);
    ctx.fillText("step #", x1 - 50, h - 15);

    return { padL, padR, padT, padB, x0, x1, y0, y1 };
  }

  function drawPlaceholderLine() {
    const { x0, x1, y0, y1 } = drawAxes();

    // simple diagonal line as placeholder
    ctx.strokeStyle = "rgba(0,0,0,0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }

  stepsInput.addEventListener("input", () => {
    stepsLabel.textContent = stepsInput.value;
  });

  drawBtn.addEventListener("click", () => {
    drawPlaceholderLine();
  });

  // draw something on load so we know it works
  drawPlaceholderLine();
})();
</script>