(() => {

    const root = document.getElementById("randomWalk2D");
    if (!root) return;

    const stepsInput = root.querySelector("#stepsInput");
    const walkCount = root.querySelector("#walkCount");
    const speedSelect = root.querySelector("#speedSelect");
    const viewSelect = root.querySelector("#viewSelect");

    const currentStep = root.querySelector("#currentStep");
    const currentStepLabel = root.querySelector("#currentStepLabel");

    const restartButton = root.querySelector("#restartButton");
    const playPauseButton = root.querySelector("#playPauseButton");

    const canvasTitle = root.querySelector("#canvasTitle");
    const walkCanvas = root.querySelector("#walkCanvas");

    if (
        !stepsInput || !walkCount || !speedSelect || !viewSelect ||
        !currentStep || !currentStepLabel ||
        !restartButton || !playPauseButton ||
        !canvasTitle || !walkCanvas
    ) {
        return;
    }

    const walkCtx = walkCanvas.getContext("2d");

    let walks = [];
    let N = 200;

    let isPlaying = false;
    let lastTimeMs = null;
    let stepAccumulator = 0;

    function randomStep2D() {
        const theta = 2 * Math.PI * Math.random();
        return [Math.cos(theta), Math.sin(theta)];
    }

    function generateWalk(N) {
        const xs = new Float32Array(N + 1);
        const ys = new Float32Array(N + 1);

        let x = 0;
        let y = 0;

        xs[0] = 0;
        ys[0] = 0;

        for (let k = 1; k <= N; k++) {
            const [dx, dy] = randomStep2D();
            x += dx;
            y += dy;
            xs[k] = x;
            ys[k] = y;
        }

        return { x: xs, y: ys };
    }

    function regenerateAllWalks() {
        N = Number(stepsInput.value);
        const count = Number(walkCount.value);

        walks = new Array(count);

        for (let i = 0; i < count; i++) {
            walks[i] = generateWalk(N);
        }

        currentStep.max = String(N);
        currentStep.value = "0";
        currentStepLabel.textContent = "0";

        renderAll();
    }

    function getStepBasedExtent() {
        return Math.max(2, Math.ceil(2 * Math.sqrt(N)));
    }

    function drawPlaneAxes(ctx, canvas, padL, padR, padT, padB, extent, xLabel, yLabel) {
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        const xLeft = padL;
        const xRight = w - padR;
        const yTop = padT;
        const yBottom = h - padB;

        const graphWidth = xRight - xLeft;
        const graphHeight = yBottom - yTop;

        const xMid = xLeft + graphWidth / 2;
        const yMid = yTop + graphHeight / 2;

        ctx.strokeStyle = "rgba(0,0,0,0.4)";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(xMid, yTop);
        ctx.lineTo(xMid, yBottom);
        ctx.moveTo(xLeft, yMid);
        ctx.lineTo(xRight, yMid);
        ctx.stroke();

        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.font = "14px system-ui";

        ctx.textAlign = "center";
        ctx.fillText(xLabel, (xLeft + xRight) / 2, h - 12);

        ctx.save();
        ctx.translate(xLeft - 40, (yTop + yBottom) / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = "center";
        ctx.fillText(yLabel, 0, 0);
        ctx.restore();

        ctx.textAlign = "left";
        ctx.fillText("0", xMid + 6, yMid - 6);

        const scale = Math.min(graphWidth, graphHeight) / (2 * extent);

        return { xMid, yMid, scale };
    }

    function renderWalksUpToStep(s) {
        const padL = 60;
        const padR = 20;
        const padT = 20;
        const padB = 50;

        const extent = getStepBasedExtent();

        walkCtx.clearRect(0, 0, walkCanvas.width, walkCanvas.height);

        const graphWidth = walkCanvas.width - padL - padR;
        const graphHeight = walkCanvas.height - padT - padB;

        const xMid = padL + graphWidth / 2;
        const yMid = padT + graphHeight / 2;

        const scale = Math.min(graphWidth, graphHeight) / (2 * extent);

        const count = walks.length;
        const last = Math.min(s, N);
        const tailLength = 20;

        walkCtx.strokeStyle = "rgba(0,0,0,0.75)";
        walkCtx.lineWidth = (count === 1) ? 2.5 : 1.2;
        walkCtx.lineJoin = "round";
        walkCtx.lineCap = "round";

        for (let i = 0; i < count; i++) {
            const xs = walks[i].x;
            const ys = walks[i].y;

            let start = 0;
            const useTailOnly = (count >= 100);

            if (useTailOnly) {
                start = Math.max(0, last - tailLength);
            }

            if (!useTailOnly) {
                walkCtx.globalAlpha = (count === 1) ? 1 : 0.35;

                walkCtx.beginPath();

                for (let k = start; k <= last; k++) {
                    const px = xMid + xs[k] * scale;
                    const py = yMid - ys[k] * scale;

                    if (k === start) {
                        walkCtx.moveTo(px, py);
                    } else {
                        walkCtx.lineTo(px, py);
                    }
                }

                walkCtx.stroke();
            } else {
                for (let k = start + 1; k <= last; k++) {
                    const x0 = xMid + xs[k - 1] * scale;
                    const y0 = yMid - ys[k - 1] * scale;
                    const x1 = xMid + xs[k] * scale;
                    const y1 = yMid - ys[k] * scale;

                    const alpha = 0.15 + 0.6 * ((k - start) / Math.max(1, last - start));

                    walkCtx.globalAlpha = alpha;
                    walkCtx.beginPath();
                    walkCtx.moveTo(x0, y0);
                    walkCtx.lineTo(x1, y1);
                    walkCtx.stroke();
                }
            }
        }

        walkCtx.globalAlpha = 1;

        walkCtx.fillStyle = "rgba(0,0,0,0.9)";
        const r = (count === 1) ? 4 : 2;

        for (let i = 0; i < count; i++) {
            const xs = walks[i].x;
            const ys = walks[i].y;

            const px = xMid + xs[last] * scale;
            const py = yMid - ys[last] * scale;

            walkCtx.beginPath();
            walkCtx.arc(px, py, r, 0, 2 * Math.PI);
            walkCtx.fill();
        }
    }

    function renderHeatMapAtStep(s) {
        const padL = 60;
        const padR = 20;
        const padT = 20;
        const padB = 50;

        const extent = getStepBasedExtent();

        walkCtx.clearRect(0, 0, walkCanvas.width, walkCanvas.height);

        const graphWidth = walkCanvas.width - padL - padR;
        const graphHeight = walkCanvas.height - padT - padB;

        const xMid = padL + graphWidth / 2;
        const yMid = padT + graphHeight / 2;

        const scale = Math.min(graphWidth, graphHeight) / (2 * extent);

        const count = walks.length;
        if (count === 0) return;

        const stepIndex = Math.min(s, N);

        const cellSize = 10;
        const cols = Math.ceil(walkCanvas.width / cellSize);
        const rows = Math.ceil(walkCanvas.height / cellSize);

        const bins = new Uint32Array(cols * rows);

        for (let i = 0; i < count; i++) {
            const x = walks[i].x[stepIndex];
            const y = walks[i].y[stepIndex];

            const px = xMid + x * scale;
            const py = yMid - y * scale;

            const col = Math.floor(px / cellSize);
            const row = Math.floor(py / cellSize);

            if (col >= 0 && col < cols && row >= 0 && row < rows) {
                bins[row * cols + col]++;
            }
        }

        let maxBin = 0;
        for (let i = 0; i < bins.length; i++) {
            if (bins[i] > maxBin) maxBin = bins[i];
        }

        if (maxBin === 0) return;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const value = bins[row * cols + col];
                if (value === 0) continue;

                const alpha = value / maxBin;

                walkCtx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
                walkCtx.fillRect(
                    col * cellSize,
                    row * cellSize,
                    cellSize + 1,
                    cellSize + 1
                );
            }
        }
    }

    function renderAll() {
        const s = Number(currentStep.value);
        currentStepLabel.textContent = String(s);

        if (viewSelect.value === "paths") {
            canvasTitle.textContent = "Random Walk Paths";
            renderWalksUpToStep(s);
        } else {
            canvasTitle.textContent = `Heat Map (Step = ${s})`;
            renderHeatMapAtStep(s);
        }
    }

    function tick(timestampMs) {
        if (!isPlaying) {
            lastTimeMs = null;
            stepAccumulator = 0;
            return;
        }

        if (lastTimeMs === null) {
            lastTimeMs = timestampMs;
        }

        const dt = (timestampMs - lastTimeMs) / 1000;
        lastTimeMs = timestampMs;

        const speed = Number(speedSelect.value);
        stepAccumulator += speed * dt;

        const advance = Math.floor(stepAccumulator);

        if (advance > 0) {
            stepAccumulator -= advance;

            const s0 = Number(currentStep.value);
            const s1 = Math.min(N, s0 + advance);

            currentStep.value = String(s1);
            renderAll();

            if (s1 >= N) {
                isPlaying = false;
                playPauseButton.textContent = "Play";
                lastTimeMs = null;
                stepAccumulator = 0;
                return;
            }
        }

        requestAnimationFrame(tick);
    }

    function startPlaying() {
        if (isPlaying) return;

        if (Number(currentStep.value) >= N) {
            currentStep.value = "0";
            renderAll();
        }

        isPlaying = true;
        playPauseButton.textContent = "Pause";
        requestAnimationFrame(tick);
    }

    function stopPlaying() {
        isPlaying = false;
        playPauseButton.textContent = "Play";
        lastTimeMs = null;
        stepAccumulator = 0;
    }

    restartButton.addEventListener("click", () => {
        stopPlaying();
        regenerateAllWalks();
    });

    stepsInput.addEventListener("change", () => {
        stopPlaying();
        regenerateAllWalks();
    });

    walkCount.addEventListener("change", () => {
        stopPlaying();
        regenerateAllWalks();
    });

    speedSelect.addEventListener("change", () => {
        renderAll();
    });

    viewSelect.addEventListener("change", () => {
        stopPlaying();
        renderAll();
    });

    currentStep.addEventListener("input", () => {
        stopPlaying();
        renderAll();
    });

    playPauseButton.addEventListener("click", () => {
        if (isPlaying) {
            stopPlaying();
        } else {
            startPlaying();
        }
    });

    regenerateAllWalks();

})();