(() => {

    const stepsInput = document.getElementById("stepsInput");
    const walkCount = document.getElementById("walkCount");
    const speedSelect = document.getElementById("speedSelect");

    const currentStep = document.getElementById("currentStep");
    const currentStepLabel = document.getElementById("currentStepLabel");

    const restartButton = document.getElementById("restartButton");
    const playPauseButton = document.getElementById("playPauseButton");

    const walkCanvas = document.getElementById("walkCanvas");
    const histCanvas = document.getElementById("histCanvas");

    if (!walkCanvas || !histCanvas) return;

    const walkCtx = walkCanvas.getContext("2d");
    const histCtx = histCanvas.getContext("2d");

    // Data: an array of Int16Array walks, each of length N+1
    let walks = [];
    let N = 200;

    // Animation state
    let isPlaying = false;
    let lastTimeMs = null;
    let stepAccumulator = 0;

    function randomStep() {

        return (Math.random() < 0.5) ? -1 : 1;
    }

    function generateWalk(N) {

        const positions = new Int16Array(N + 1);
        let x = 0;

        positions[0] = 0;

        for (let k = 1; k <= N; k++) {
            x = x + randomStep();
            positions[k] = x;
        }

        return positions;
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

    function drawWalkAxes(yMid, padL, padR, padT, padB) {

        const w = walkCanvas.width;
        const h = walkCanvas.height;

        walkCtx.clearRect(0, 0, w, h);

        const xLeft = padL;
        const xRight = w - padR;
        const yTop = padT;
        const yBottom = h - padB;

        // y-axis
        walkCtx.strokeStyle = "rgba(0,0,0,0.45)";
        walkCtx.lineWidth = 1;
        walkCtx.beginPath();
        walkCtx.moveTo(xLeft, yTop);
        walkCtx.lineTo(xLeft, yBottom);
        walkCtx.stroke();

        // x-axis at position = 0
        walkCtx.strokeStyle = "rgba(0,0,0,0.35)";
        walkCtx.lineWidth = 1;
        walkCtx.beginPath();
        walkCtx.moveTo(xLeft, yMid);
        walkCtx.lineTo(xRight, yMid);
        walkCtx.stroke();

        walkCtx.fillStyle = "rgba(0,0,0,0.8)";
        walkCtx.font = "14px system-ui";

        // Centered x-axis label
        const xCenter = (xLeft + xRight) / 2;
        walkCtx.textAlign = "center";
        walkCtx.fillText("step #", xCenter, h - 15);

        // Rotated y-axis label centered at y = 0
        walkCtx.save();
        walkCtx.translate(xLeft - 40, yMid);
        walkCtx.rotate(-Math.PI / 2);
        walkCtx.textAlign = "center";
        walkCtx.fillText("position", 0, 0);
        walkCtx.restore();

        walkCtx.textAlign = "left";
        walkCtx.fillText("0", xLeft - 18, yMid + 5);
    }

    function drawHistogramAxes(padL, padR, padT, padB) {

        const w = histCanvas.width;
        const h = histCanvas.height;

        histCtx.clearRect(0, 0, w, h);

        const xLeft = padL;
        const xRight = w - padR;
        const yTop = padT;
        const yBottom = h - padB;

        histCtx.strokeStyle = "rgba(0,0,0,0.45)";
        histCtx.lineWidth = 1;

        histCtx.beginPath();
        histCtx.moveTo(xLeft, yTop);
        histCtx.lineTo(xLeft, yBottom);
        histCtx.lineTo(xRight, yBottom);
        histCtx.stroke();

        histCtx.fillStyle = "rgba(0,0,0,0.8)";
        histCtx.font = "14px system-ui";

        const xCenter = (xLeft + xRight) / 2;
        histCtx.textAlign = "center";
        histCtx.fillText("position", xCenter, h - 10);

        histCtx.save();
        histCtx.translate(xLeft - 40, (yTop + yBottom) / 2);
        histCtx.rotate(-Math.PI / 2);
        histCtx.textAlign = "center";
        histCtx.fillText("count", 0, 0);
        histCtx.restore();

        histCtx.textAlign = "left";

        return { xLeft, xRight, yTop, yBottom };
    }

    function renderWalksUpToStep(s) {

        const w = walkCanvas.width;
        const h = walkCanvas.height;

        const padL = 60;
        const padR = 20;
        const padT = 20;
        const padB = 50;

        const graphWidth = w - padL - padR;
        const graphHeight = h - padT - padB;
        const yMid = padT + graphHeight / 2;

        // Stable scale based on max abs across full walks
        let maxAbs = 1;

        for (let i = 0; i < walks.length; i++) {
            const positions = walks[i];
            for (let k = 0; k < positions.length; k++) {
                const a = Math.abs(positions[k]);
                if (a > maxAbs) maxAbs = a;
            }
        }

        const verticalScale = graphHeight / (2 * maxAbs);

        drawWalkAxes(yMid, padL, padR, padT, padB);

        const count = walks.length;
        const alpha = (count === 1) ? 0.9 : 0.35;
        const lineWidth = (count === 1) ? 2 : 1.25;

        walkCtx.save();
        walkCtx.globalAlpha = alpha;
        walkCtx.strokeStyle = "rgba(0,0,0,1)";
        walkCtx.lineWidth = lineWidth;

        walkCtx.beginPath();

        const last = Math.min(s, N);

        for (let i = 0; i < count; i++) {

            const positions = walks[i];

            for (let k = 0; k <= last; k++) {

                const xPixel = padL + (k / N) * graphWidth;
                const yPixel = yMid - positions[k] * verticalScale;

                if (k === 0) {
                    walkCtx.moveTo(xPixel, yPixel);
                } else {
                    walkCtx.lineTo(xPixel, yPixel);
                }
            }
        }

        walkCtx.stroke();
        walkCtx.restore();
    }

    function renderHistogramAtStep(s) {

        const padL = 60;
        const padR = 20;
        const padT = 24;
        const padB = 40;

        const { xLeft, xRight, yTop, yBottom } = drawHistogramAxes(padL, padR, padT, padB);

        const count = walks.length;
        if (count === 0) return;

        const stepIndex = Math.min(s, N);

        let minPos = Infinity;
        let maxPos = -Infinity;

        const values = new Int16Array(count);

        for (let i = 0; i < count; i++) {
            const v = walks[i][stepIndex];
            values[i] = v;
            if (v < minPos) minPos = v;
            if (v > maxPos) maxPos = v;
        }

        // Use bin width = 2 to fix the parity issue (even/odd support)
        const binWidth = 2;

        // Add some padding so bars aren't glued to the axes
        const pad = 4;
        minPos -= pad;
        maxPos += pad;

        // Snap min/max to bin boundaries
        const minEdge = Math.floor(minPos / binWidth) * binWidth;
        const maxEdge = Math.ceil(maxPos / binWidth) * binWidth;

        const binCount = Math.min(200, Math.max(5, Math.floor((maxEdge - minEdge) / binWidth) + 1));
        const bins = new Int32Array(binCount);

        // Fill bins
        for (let i = 0; i < count; i++) {
            const v = values[i];
            const b = Math.floor((v - minEdge) / binWidth);
            if (b >= 0 && b < binCount) {
                bins[b]++;
            }
        }

        let maxBin = 1;
        for (let b = 0; b < binCount; b++) {
            if (bins[b] > maxBin) maxBin = bins[b];
        }

        const W = (xRight - xLeft);
        const H = (yBottom - yTop);
        const barW = W / binCount;

        histCtx.fillStyle = "rgba(0,0,0,0.85)";

        for (let b = 0; b < binCount; b++) {
            const barH = (bins[b] / maxBin) * H;
            const x = xLeft + b * barW;
            const y = yBottom - barH;
            histCtx.fillRect(x, y, Math.max(1, barW - 1), barH);
        }

        const xCenter = (xLeft + xRight) / 2;
        histCtx.fillStyle = "rgba(0,0,0,0.75)";
        histCtx.font = "14px system-ui";
        histCtx.textAlign = "center";
        histCtx.fillText(`step = ${stepIndex}`, xCenter, yTop - 6);
        histCtx.textAlign = "left";
    }

    function renderAll() {

        const s = Number(currentStep.value);
        currentStepLabel.textContent = String(s);

        renderWalksUpToStep(s);

        // Throttle histogram updates for large simulations
        const count = walks.length;

        if (count <= 100 || s % 3 === 0) {
            renderHistogramAtStep(s);
        }
    }

    // Animation loop: advances currentStep based on speedSelect (steps/sec)
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

    // UI wiring
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
        // No need to stop; speed changes live during play.
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

    // Init
    regenerateAllWalks();
    renderAll();

})();