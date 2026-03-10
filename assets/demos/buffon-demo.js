(() => {

    const throwsInput = document.getElementById("throwsInput");
    const gridType = document.getElementById("gridType");
    const shapeType = document.getElementById("shapeType");
    const spacingInput = document.getElementById("spacingInput");
    const sizeInput = document.getElementById("sizeInput");
    const speedSelect = document.getElementById("speedSelect");

    const currentThrow = document.getElementById("currentThrow");
    const currentThrowLabel = document.getElementById("currentThrowLabel");

    const restartButton = document.getElementById("restartButton");
    const playPauseButton = document.getElementById("playPauseButton");

    const tossCanvas = document.getElementById("tossCanvas");
    const statsCanvas = document.getElementById("statsCanvas");

    if (!tossCanvas || !statsCanvas) return;

    const tossCtx = tossCanvas.getContext("2d");
    const statsCtx = statsCanvas.getContext("2d"); 

    // Data: an array of throw objects
    let throws = [];
    let totalThrows = 100;

    // Animation state
    let isPlaying = false;
    let lastTimeMs = null;
    let throwAccumulator = 0;

    function regenerateAllThrows() {

        totalThrows = Number(throwsInput.value);

        throws = [];

        currentThrow.max = String(totalThrows);
        currentThrow.value = "0";
        currentThrowLabel.textContent = "0";

        renderAll();
    }

    function drawHorizontalLines(spacing) {

        const w = tossCanvas.width;
        const h = tossCanvas.height;

        tossCtx.strokeStyle = "rgba(0,0,0,0.3)";
        tossCtx.lineWidth = 1;

        for (let y = spacing; y < h; y += spacing) {
            tossCtx.beginPath();
            tossCtx.moveTo(0, y);
            tossCtx.lineTo(w, y);
            tossCtx.stroke();
        }
    }

    function drawVerticalLines(spacing) {

        const w = tossCanvas.width;
        const h = tossCanvas.height;

        tossCtx.strokeStyle = "rgba(0,0,0,0.3)";
        tossCtx.lineWidth = 1;

        for (let x = spacing; x < w; x += spacing) {
            tossCtx.beginPath();
            tossCtx.moveTo(x, 0);
            tossCtx.lineTo(x, h);
            tossCtx.stroke();
        }
    }

    function drawRectangularGrid(spacing) {

        drawHorizontalLines(spacing);
        drawVerticalLines(spacing);
    }

    function drawConcentricCircles(spacing) {

        const w = tossCanvas.width;
        const h = tossCanvas.height;

        const cx = w / 2;
        const cy = h / 2;
        const maxRadius = Math.hypot(cx, cy);

        tossCtx.strokeStyle = "rgba(0,0,0,0.3)";
        tossCtx.lineWidth = 1;

        for (let r = spacing; r < maxRadius; r += spacing) {
            tossCtx.beginPath();
            tossCtx.arc(cx, cy, r, 0, 2 * Math.PI);
            tossCtx.stroke();
        }
    }

    function drawGridPattern() {

        const w = tossCanvas.width;
        const h = tossCanvas.height;

        tossCtx.clearRect(0, 0, w, h);

        const spacing = Number(spacingInput.value);
        const grid = gridType.value;

        if (grid === "horizontal") {
            drawHorizontalLines(spacing);
        } else if (grid === "vertical") {
            drawVerticalLines(spacing);
        } else if (grid === "grid") {
            drawRectangularGrid(spacing);
        } else if (grid === "circles") {
            drawConcentricCircles(spacing);
        }
    }

    function renderThrowsUpTo(index) {

        drawGridPattern();

        // Throws will be drawn here in the next step.
        // For now, this just redraws the selected barrier pattern.
    }

    function renderStatsPanel() {

        const w = statsCanvas.width;
        const h = statsCanvas.height;

        statsCtx.clearRect(0, 0, w, h);

        statsCtx.fillStyle = "rgba(0,0,0,0.75)";
        statsCtx.font = "16px system-ui";
        statsCtx.textAlign = "center";
        statsCtx.textBaseline = "middle";

        statsCtx.fillText("Crossing statistics will appear here.", w / 2, h / 2);

        statsCtx.textAlign = "left";
        statsCtx.textBaseline = "alphabetic";
    }

    function renderAll() {

        const k = Number(currentThrow.value);
        currentThrowLabel.textContent = String(k);

        renderThrowsUpTo(k);
        renderStatsPanel();
    }

    function tick(timestampMs) {

        if (!isPlaying) {
            lastTimeMs = null;
            throwAccumulator = 0;
            return;
        }

        if (lastTimeMs === null) {
            lastTimeMs = timestampMs;
        }

        const dt = (timestampMs - lastTimeMs) / 1000;
        lastTimeMs = timestampMs;

        const speed = Number(speedSelect.value);
        throwAccumulator += speed * dt;

        const advance = Math.floor(throwAccumulator);
        if (advance > 0) {

            throwAccumulator -= advance;

            const k0 = Number(currentThrow.value);
            const k1 = Math.min(totalThrows, k0 + advance);

            currentThrow.value = String(k1);
            renderAll();

            if (k1 >= totalThrows) {
                isPlaying = false;
                playPauseButton.textContent = "Play";
                lastTimeMs = null;
                throwAccumulator = 0;
                return;
            }
        }

        requestAnimationFrame(tick);
    }

    function startPlaying() {

        if (isPlaying) return;

        if (Number(currentThrow.value) >= totalThrows) {
            currentThrow.value = "0";
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
        throwAccumulator = 0;
    }

    restartButton.addEventListener("click", () => {
        stopPlaying();
        regenerateAllThrows();
    });

    throwsInput.addEventListener("change", () => {
        stopPlaying();
        regenerateAllThrows();
    });

    gridType.addEventListener("change", () => {
        stopPlaying();
        renderAll();
    });

    shapeType.addEventListener("change", () => {
        stopPlaying();
        renderAll();
    });

    spacingInput.addEventListener("change", () => {
        stopPlaying();
        renderAll();
    });

    sizeInput.addEventListener("change", () => {
        stopPlaying();
        renderAll();
    });

    speedSelect.addEventListener("change", () => {
        // Speed changes live during play.
    });

    currentThrow.addEventListener("input", () => {
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

    regenerateAllThrows();
    renderAll();

})();