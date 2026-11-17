import { createGraph } from "./graph.js";
import { createPlayback, loadProof, palette, pentagonFrame } from "./proof.js";

export async function mount(root, { autoplay = true } = {}) {
  const find = role => root.querySelector(`[data-role="${role}"]`);
  const caseLabel = find("case");
  const patternLabel = find("pattern");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  try {
    const data = await loadProof(root.dataset.proofSrc);
    const { proof } = data;
    const { cases } = proof;
    if (data.positions.length !== 24 || !cases.length) throw new Error("Unexpected opener proof data");

    const graph = createGraph(find("graph"));
    graph.setData(data);
    root.dataset.preset = "24";
    const shouldPlay = autoplay && !reducedMotion.matches;
    let caseIndex = 0;
    let step = shouldPlay ? 0 : lastStep();

    function lastStep() {
      return cases[caseIndex].forces.length + 1;
    }

    function render() {
      const proofCase = cases[caseIndex];
      const frame = pentagonFrame(proof, proofCase, step);
      graph.drawFrame(frame);
      root.dataset.caseIndex = caseIndex;
      root.dataset.step = step;
      root.dataset.phase = frame.phase;
      caseLabel.textContent = proofCase.label;

      const extra = proofCase.extra_assumption;
      const swatches = extra ? [...proofCase.pattern, extra[1]] : proofCase.pattern;
      patternLabel.replaceChildren(...swatches.map(color => {
        const swatch = document.createElement("span");
        swatch.className = `witness-swatch color-${["a", "b", "c"][color]}`;
        swatch.setAttribute("aria-hidden", "true");
        return swatch;
      }));
      const names = proofCase.pattern.map(color => palette[color].name);
      patternLabel.setAttribute("aria-label", `Pentagon colors: ${names.join(", ")}` +
        (extra ? `; vertex ${extra[0]}: ${palette[extra[1]].name}` : ""));
    }

    function advance() {
      if (step === lastStep()) {
        caseIndex = (caseIndex + 1) % cases.length;
        step = 0;
      } else {
        step++;
      }
      render();
    }

    const playback = createPlayback(root, advance, () => step === lastStep() ? 1700 : step === 0 ? 900 : 350);
    reducedMotion.addEventListener("change", event => {
      if (event.matches) {
        playback.setPlaying(false);
        step = lastStep();
        render();
      } else if (autoplay) {
        playback.setPlaying(true);
      }
    });

    render();
    playback.setPlaying(shouldPlay);
  } catch (error) {
    root.dataset.phase = "error";
    find("detail").textContent = "This coloring proof could not load. Refresh to try again.";
    console.error(error);
  }
}
