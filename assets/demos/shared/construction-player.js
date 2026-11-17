const readingTime = 2800;

export async function mountConstruction(root, { autoplay, durations, createDrawing }) {
  const get = role => root.querySelector(`[data-role="${role}"]`);
  const canvas = get("canvas");
  const previous = get("previous");
  const play = get("play");
  const next = get("next");
  const status = get("step");
  const captions = [...root.querySelectorAll("[data-stage]")];
  if (captions.length !== durations.length) throw new Error("Unexpected construction stage count");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const response = await fetch(root.dataset.geometrySrc);
  if (!response.ok) throw new Error("Construction data did not load");
  const geometry = await response.json();
  const drawing = createDrawing(canvas, geometry);
  const lastStep = captions.length - 1;
  let step = 0;
  let elapsed = 0;
  let playing = autoplay;
  let paused = false;
  let frame = null;
  let lastTime = null;

  const duration = () => reduced.matches ? 0 : durations[step];
  const progress = () => duration() ? Math.min(1, elapsed / duration()) : 1;

  function updateControls() {
    previous.disabled = step === 0;
    next.disabled = step === lastStep;
    play.disabled = false;
    play.textContent = playing ? "Pause" : step === lastStep && progress() === 1 ? "Replay" : "Play";
  }

  function schedule() {
    if (frame === null && !paused && !document.hidden && (playing || progress() < 1)) {
      frame = requestAnimationFrame(tick);
    }
  }

  function selectStep(index, animate) {
    step = index;
    elapsed = animate ? 0 : duration();
    lastTime = null;
    captions.forEach((caption, i) => { caption.hidden = i !== step; });
    status.textContent = `Step ${step + 1} of ${captions.length}`;
    canvas.setAttribute("aria-label", captions[step].dataset.visual);
    updateControls();
    drawing.draw(step, progress());
    schedule();
  }

  function tick(time) {
    frame = null;
    if (paused || document.hidden) return;
    elapsed += lastTime === null ? 0 : Math.min(time - lastTime, 100);
    lastTime = time;
    if (playing && elapsed >= duration() + readingTime) {
      if (step < lastStep) {
        selectStep(step + 1, true);
        return;
      }
      playing = false;
    }
    drawing.draw(step, progress());
    if (progress() === 1) updateControls();
    schedule();
  }

  function manualStep(index, animate) {
    playing = false;
    paused = false;
    selectStep(index, animate);
  }

  previous.addEventListener("click", () => manualStep(step - 1, false));
  next.addEventListener("click", () => manualStep(step + 1, true));
  play.addEventListener("click", () => {
    if (playing) {
      playing = false;
      paused = true;
      updateControls();
      return;
    }
    playing = true;
    paused = false;
    lastTime = null;
    if (step === lastStep && progress() === 1) selectStep(0, false);
    updateControls();
    schedule();
  });

  document.addEventListener("visibilitychange", () => {
    lastTime = null;
    schedule();
  });
  reduced.addEventListener("change", () => {
    elapsed = duration();
    drawing.draw(step, 1);
    updateControls();
    schedule();
  });
  new ResizeObserver(() => {
    drawing.resize();
    drawing.draw(step, progress());
  }).observe(canvas);

  drawing.resize();
  selectStep(0, false);
}
