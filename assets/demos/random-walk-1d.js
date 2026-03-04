(() => {

    const stepsInput = document.getElementById("stepsInput");
    const walkCount = document.getElementById("walkCount");
    const currentStep = document.getElementById("currentStep");
    const currentStepLabel = document.getElementById("currentStepLabel");
    const drawButton = document.getElementById("drawButton");

    const walkCanvas = document.getElementById("walkCanvas");
    const histCanvas = document.getElementById("histCanvas");

    if (!walkCanvas || !histCanvas) return;

    const walkCtx = walkCanvas.getContext("2d");
    const histCtx = histCanvas.getContext("2d");

    // Data: an array of Int16Array walks, each of length N+1
    let walks = [];
    let N = 200;

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

        // Update current step slider bounds
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

        // labels
        walkCtx.fillStyle = "rgba(0,0,0,0.8)";
        walkCtx.font = "14px system-ui";

        walkCtx.fillText("step #", xRight - 50, h - 15);

        walkCtx.save();
        walkCtx.translate(18, (yTop + yBottom) / 2);
        walkCtx.rotate(-Math.PI / 2);
        walkCtx.fillText("position", 0, 0);
        walkCtx.restore();

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
        histCtx.fillText("count", 10, 18);
        histCtx.fillText("position", xRight - 60, h - 15);

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

        // Scale based on max abs across all walks (full length), so view is stable as s increases
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

        // Use a constant alpha for multi-walk readability
        const count = walks.length;
        const alpha = (count === 1) ? 0.9 : 0.35;
        const lineWidth = (count === 1) ? 2 : 1.25;

        walkCtx.save();
        walkCtx.globalAlpha = alpha;
        walkCtx.strokeStyle = "rgba(0,0,0,1)";
        walkCtx.lineWidth = lineWidth;

        walkCtx.beginPath();

        for (let i = 0; i < count; i++) {

            const positions = walks[i];
            const last = Math.min(s, N);

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
        const padT = 20;
        const padB = 40;

        const { xLeft, xRight, yTop, yBottom } = drawHistogramAxes(padL, padR, padT, padB);

        const count = walks.length;
        if (count === 0) return;

        const stepIndex = Math.min(s, N);

        // Collect positions at this step
        let minPos = Infinity;
        let maxPos = -Infinity;

        const values = new Int16Array(count);

        for (let i = 0; i < count; i++) {
            const v = walks[i][stepIndex];
            values[i] = v;
            if (v < minPos) minPos = v;
            if (v > maxPos) maxPos = v;
        }

        // Choose bin width 1 (integer lattice). Add padding so edge bars aren't glued to axes.
        const pad = 2;
        minPos -= pad;
        maxPos += pad;

        const binCount = Math.max(5, Math.min(121, (maxPos - minPos + 1)));
        const bins = new Int32Array(binCount);

        for (let i = 0; i < count; i++) {
            const v = values[i];
            const b = Math.floor((v - minPos) * (binCount - 1) / ((maxPos - minPos) || 1));
            bins[Math.max(0, Math.min(binCount - 1, b))]++;
        }

        // Draw bars
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

        // Add small text showing step
        histCtx.fillStyle = "rgba(0,0,0,0.75)";
        histCtx.font = "14px system-ui";
        histCtx.fillText(`step = ${stepIndex}`, xLeft, yTop - 6);
    }

    function renderAll() {

        const s = Number(currentStep.value);
        currentStepLabel.textContent = String(s);

        renderWalksUpToStep(s);
        renderHistogramAtStep(s);
    }

    // Events
    drawButton.addEventListener("click", () => {
        regenerateAllWalks();
    });

    stepsInput.addEventListener("change", () => {
        regenerateAllWalks();
    });

    walkCount.addEventListener("change", () => {
        regenerateAllWalks();
    });

    currentStep.addEventListener("input", () => {
        renderAll();
    });

    // Init
    regenerateAllWalks();

})();