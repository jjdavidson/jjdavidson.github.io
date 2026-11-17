import { createGraph } from "./graph.js";
import { attachmentFrames, createPlayback, loadProof, palette, pentagonFrame, rhombusFrames } from "./proof.js";

export async function mount(root, { autoplay = true } = {}) {
  const find = role => root.querySelector(`[data-role="${role}"]`);
  const graph = createGraph(find("graph"), { equalityBadges: true });
  const presetSelect = find("preset");
  const caseSelect = find("proof-case");
  const previousButton = find("previous-step");
  const nextButton = find("next-step");
  const playButton = find("play");
  const stepLabel = find("step-count");
  const graphTitle = find("graph-title");
  const equalityKey = find("equality-key");
  const caseGuide = find("case-guide");
  const guides = [...caseGuide.querySelectorAll("[data-preset-guide]")];
  const explanation = find("explanation");
  const detail = find("detail");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const playback = createPlayback(root, () => moveStep(1), duration, playing => {
    playButton.textContent = playing ? "Pause" : "Play";
    explanation.setAttribute("aria-live", playing ? "off" : "polite");
  });

  let data;
  let caseFrames = [];
  let caseIndex = 0;
  let step = 0;
  let pendingLoad = 0;

  function currentCase() {
    return data.proof.cases[caseIndex];
  }

  function lastStep() {
    return caseFrames[caseIndex]?.length
      ? caseFrames[caseIndex].length - 1
      : currentCase().forces.length + 1;
  }

  function renderPentagon(proofCase) {
    const frame = pentagonFrame(data.proof, proofCase, step);
    const [a, b] = proofCase.conflict_edge;
    const { deduction } = frame;
    if (frame.phase === "collision") {
      explanation.textContent = `Vertices ${a} and ${b} share a color and are adjacent. This case is impossible.`;
    } else if (deduction) {
      explanation.textContent = `Neighbors ${deduction.neighbors.join(" and ")} have different colors, so vertex ${deduction.vertex} must be ${palette[deduction.color].name}.`;
    } else {
      const cycle = data.proof.base_cycle;
      const extra = proofCase.extra_assumption;
      explanation.textContent = `Pentagon ${[...cycle, cycle[0]].join(" → ")}.`;
      if (extra) {
        const { adjacent_fixed_vertex: neighbor, available_colors: options } = data.proof.split_justification;
        const available = options.map(color => palette[color].name).join(" or ");
        explanation.textContent += ` Vertex ${extra[0]} touches ${frame.colors.get(neighbor).name} vertex ${neighbor}, so it can be ${available}. This subcase takes ${palette[extra[1]].name}.`;
      }
    }
    graph.drawFrame(frame);
    return frame.phase;
  }

  function renderRhombus(proofCase) {
    const { conflictEdge } = proofCase.steps[step];
    // The conflict frame keeps the last deduction's equality groups and adds the red edge.
    const { kind, equalGroups, supportGroups, supportEdges, quotient } = proofCase.steps[conflictEdge ? step - 1 : step];
    const focus = equalGroups.flat();
    const support = supportGroups.flat();
    const { colors, equalities, reference, contradiction } = caseFrames[caseIndex][step];
    const tag = equalities.get(focus[0]);
    const color = colors.get(focus[0]);

    const assumption = kind === "assumption" && !quotient ? equalGroups.map(group => group[0]) : null;
    graph.drawFrame({ colors, equalities, focus, support, evidence: supportEdges, conflict: conflictEdge, assumption });
    if (conflictEdge) {
      const [a, b] = conflictEdge;
      const known = colors.get(a);
      const collision = known && known === colors.get(b)
        ? `Vertices ${a} and ${b} are both ${known.name}.`
        : `The last deduction would give vertices ${a} and ${b} the same color.`;
      explanation.textContent = `${collision} The red edge requires different colors.`;
      return "collision";
    }

    const groupLabel = group => group.length === 1 ? group[0] : `{${group.join(", ")}}`;
    const groups = equalGroups.map(groupLabel).join(" and ");
    if (kind === "assumption") {
      const outcome = color ? `They must be ${color.name}.` : `Mark them ${tag}.`;
      explanation.textContent = quotient
        ? `In the four-cycle of color classes, assume ${groups} share a color. ${outcome}`
        : `Assume vertices ${focus.join(" and ")} share a color. ${outcome}`;
    } else if (contradiction) {
      explanation.textContent = `${groups} must share a color. That contradicts the colors already established.`;
    } else if (reference) {
      explanation.textContent = `Choose blue and yellow for the outlined adjacent classes. ${groups} must be green.`;
    } else {
      const outcome = color ? `They must be ${color.name}.` : `They must share a color. Mark them ${tag}.`;
      explanation.textContent = `${groups} each touch the two outlined, adjacent classes. ${outcome}`;
    }
    return kind === "assumption" && step === 0 ? "initial" : kind;
  }

  function renderProof(proofCase) {
    if (proofCase.steps) return renderRhombus(proofCase);
    if (!proofCase.attachment) return renderPentagon(proofCase);
    const frame = caseFrames[caseIndex][step];
    graph.drawFrame(frame);
    explanation.textContent = frame.explanation;
    return frame.phase;
  }

  function render() {
    const proofCase = currentCase();
    root.dataset.caseIndex = caseIndex;
    root.dataset.step = step;
    root.dataset.phase = renderProof(proofCase);
    explanation.scrollTop = 0;
    caseSelect.value = String(caseIndex);
    stepLabel.textContent = `Step ${step + 1} of ${lastStep() + 1}`;
    previousButton.disabled = caseIndex === 0 && step === 0;
    nextButton.disabled = caseIndex === data.proof.cases.length - 1 && step === lastStep();
  }

  function moveStep(direction) {
    if (direction > 0 && step === lastStep()) {
      caseIndex = (caseIndex + 1) % data.proof.cases.length;
      step = 0;
    } else if (direction < 0 && step === 0) {
      caseIndex--;
      step = lastStep();
    } else {
      step += direction;
    }
    render();
  }

  function duration() {
    return root.dataset.phase === "deduction" ? 700 : 1000;
  }

  async function selectPreset(play = false) {
    const option = presetSelect.options[presetSelect.selectedIndex];
    const preset = option.value;
    const request = ++pendingLoad;
    playback.setPlaying(false);
    data = null;
    root.dataset.phase = "loading";
    caseSelect.disabled = playButton.disabled = previousButton.disabled = nextButton.disabled = true;
    stepLabel.textContent = "";
    explanation.textContent = "";
    equalityKey.hidden = true;
    caseGuide.hidden = true;
    detail.textContent = "";
    graph.setData(null);

    try {
      const loaded = await loadProof(option.dataset.proofSrc);
      if (request !== pendingLoad) return;
      if (loaded.positions.length !== Number(option.dataset.vertexCount) || !loaded.proof.cases.length) {
        throw new Error("Unexpected proof data");
      }
      data = loaded;
      caseFrames = data.proof.cases.map(proofCase => {
        if (proofCase.steps) return rhombusFrames(proofCase.steps);
        if (proofCase.attachment) return attachmentFrames(data.edges, data.proof, proofCase);
        return [];
      });
      caseIndex = 0;
      step = 0;
      root.dataset.preset = preset;
      graphTitle.textContent = `${option.textContent.trim()}, ${data.positions.length} vertices and ${data.edges.length} unit edges`;
      for (const guide of guides) guide.hidden = guide.dataset.presetGuide !== preset;
      caseGuide.hidden = guides.every(guide => guide.hidden);
      equalityKey.hidden = !(currentCase().steps || currentCase().attachment);
      caseSelect.replaceChildren(...data.proof.cases.map((proofCase, index) => {
        const option = document.createElement("option");
        option.value = String(index);
        option.textContent = proofCase.label;
        return option;
      }));
      caseSelect.disabled = playButton.disabled = false;
      graph.setData(data);
      playback.setPlaying(play && !reducedMotion.matches);
      render();
      root.dataset.demoReady = "true";
    } catch (error) {
      if (request !== pendingLoad) return;
      root.dataset.phase = "error";
      root.dataset.demoReady = "false";
      detail.textContent = "This coloring proof could not load. Choose another witness or refresh to try again.";
      console.error(error);
    }
  }

  presetSelect.addEventListener("change", () => selectPreset());
  caseSelect.addEventListener("change", () => {
    playback.setPlaying(false);
    caseIndex = Number(caseSelect.value);
    step = 0;
    render();
  });
  previousButton.addEventListener("click", () => {
    playback.setPlaying(false);
    moveStep(-1);
  });
  nextButton.addEventListener("click", () => {
    playback.setPlaying(false);
    moveStep(1);
  });
  playButton.addEventListener("click", playback.toggle);
  reducedMotion.addEventListener("change", event => {
    if (event.matches) playback.setPlaying(false);
  });
  await selectPreset(autoplay);
}
