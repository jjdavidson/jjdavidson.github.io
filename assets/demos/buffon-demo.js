(() => {

    const throwsInput = document.getElementById("throwsInput");
    const shapeType = document.getElementById("shapeType");
    const speedSelect = document.getElementById("speedSelect");

    const currentThrow = document.getElementById("currentThrow");
    const currentThrowLabel = document.getElementById("currentThrowLabel");

    const restartButton = document.getElementById("restartButton");
    const playPauseButton = document.getElementById("playPauseButton");

    const tossCanvas = document.getElementById("tossCanvas");

    if (!tossCanvas) return;

    const tossCtx = tossCanvas.getContext("2d");

    let throws = [];
    let crossingCounts = [];
    let totalThrows = 1000;

    let isPlaying = false;
    let lastTimeMs = null;
    let throwAccumulator = 0;

    function randomInRange(a, b) {
        return a + Math.random() * (b - a);
    }

    function getShapeParameters() {
        const shape = shapeType.value;

        if (shape === "segment") {
            return {
                shape: "segment",
                size: 40,
                spacing: 80
            };
        }

        if (shape === "square") {
            return {
                shape: "square",
                size: 20,
                spacing: 80
            };
        }

        if (shape === "triangle") {
            return {
                shape: "triangle",
                size: 80 / 3,
                spacing: 80
            };
        }

        return {
            shape: "piShape",
            spacing: 80
        };
    }

    function getVisibleWindowSize() {
        return Math.min(200, totalThrows);
    }

    function getStrokeWidth() {
        if (totalThrows >= 10000) return 2;
        return 3;
    }

    function getShapeLabel() {
        if (shapeType.value === "segment") return "Line Segment";
        if (shapeType.value === "square") return "Square";
        if (shapeType.value === "triangle") return "Equilateral Triangle";
        return "Pi Shape";
    }

    function getSegmentEndpoints(throwObj) {
        const half = throwObj.size / 2;
        const dx = half * Math.cos(throwObj.theta);
        const dy = half * Math.sin(throwObj.theta);

        return {
            x1: throwObj.cx - dx,
            y1: throwObj.cy - dy,
            x2: throwObj.cx + dx,
            y2: throwObj.cy + dy
        };
    }

    function getSquareVertices(throwObj) {
        const s = throwObj.size / 2;
        const c = Math.cos(throwObj.theta);
        const sn = Math.sin(throwObj.theta);

        const local = [
            { x: -s, y: -s },
            { x:  s, y: -s },
            { x:  s, y:  s },
            { x: -s, y:  s }
        ];

        return local.map(p => ({
            x: throwObj.cx + p.x * c - p.y * sn,
            y: throwObj.cy + p.x * sn + p.y * c
        }));
    }

    function getTriangleVertices(throwObj) {
        const a = throwObj.size;
        const h = Math.sqrt(3) * a / 2;

        const local = [
            { x: 0,    y: -2 * h / 3 },
            { x: -a/2, y:  h / 3 },
            { x:  a/2, y:  h / 3 }
        ];

        const c = Math.cos(throwObj.theta);
        const sn = Math.sin(throwObj.theta);

        return local.map(p => ({
            x: throwObj.cx + p.x * c - p.y * sn,
            y: throwObj.cy + p.x * sn + p.y * c
        }));
    }

    function getPiShapeSegments(throwObj) {
        // Lowercase pi shape
        // bounding trapezoid approximately:
        // top width = 30
        // bottom width = 14
        // height = 16
        // perimeter ≈ 79.78

        const localSegments = [
            { x1: -15, y1:  8, x2:  15, y2:  8 }, // top bar
            { x1:  -7, y1:  8, x2:  -7, y2: -8 }, // left leg
            { x1:   7, y1:  8, x2:   7, y2: -8 }  // right leg
        ];

        const c = Math.cos(throwObj.theta);
        const sn = Math.sin(throwObj.theta);

        return localSegments.map(seg => ({
            x1: throwObj.cx + seg.x1 * c - seg.y1 * sn,
            y1: throwObj.cy + seg.x1 * sn + seg.y1 * c,
            x2: throwObj.cx + seg.x2 * c - seg.y2 * sn,
            y2: throwObj.cy + seg.x2 * sn + seg.y2 * c
        }));
    }

    function segmentCrossesVerticalLinesFromEndpoints(x1, x2, spacing) {
        return Math.floor(x1 / spacing) !== Math.floor(x2 / spacing);
    }

    function getShapeXRange(throwObj) {

        if (throwObj.shape === "segment") {
            const { x1, x2 } = getSegmentEndpoints(throwObj);
            return {
                minX: Math.min(x1, x2),
                maxX: Math.max(x1, x2)
            };
        }

        if (throwObj.shape === "square") {
            const vertices = getSquareVertices(throwObj);
            let minX = Infinity;
            let maxX = -Infinity;

            for (const p of vertices) {
                if (p.x < minX) minX = p.x;
                if (p.x > maxX) maxX = p.x;
            }

            return { minX, maxX };
        }

        if (throwObj.shape === "triangle") {
            const vertices = getTriangleVertices(throwObj);
            let minX = Infinity;
            let maxX = -Infinity;

            for (const p of vertices) {
                if (p.x < minX) minX = p.x;
                if (p.x > maxX) maxX = p.x;
            }

            return { minX, maxX };
        }

        if (throwObj.shape === "piShape") {
            const segments = getPiShapeSegments(throwObj);
            let minX = Infinity;
            let maxX = -Infinity;

            for (const seg of segments) {
                minX = Math.min(minX, seg.x1, seg.x2);
                maxX = Math.max(maxX, seg.x1, seg.x2);
            }

            return { minX, maxX };
        }

        return { minX: throwObj.cx, maxX: throwObj.cx };
    }

    function throwCrossesVerticalLines(throwObj) {
        const spacing = throwObj.spacing;

        if (throwObj.shape === "piShape") {
            const segments = getPiShapeSegments(throwObj);

            for (const seg of segments) {
                if (segmentCrossesVerticalLinesFromEndpoints(seg.x1, seg.x2, spacing)) {
                    return true;
                }
            }

            return false;
        }

        const { minX, maxX } = getShapeXRange(throwObj);
        return Math.floor(minX / spacing) !== Math.floor(maxX / spacing);
    }

    function generateThrow() {
        const params = getShapeParameters();

        const throwObj = {
            cx: randomInRange(0, tossCanvas.width),
            cy: randomInRange(0, tossCanvas.height),
            theta: randomInRange(0, 2 * Math.PI),
            size: params.size,
            spacing: params.spacing,
            shape: params.shape,
            crosses: false
        };

        throwObj.crosses = throwCrossesVerticalLines(throwObj);
        return throwObj;
    }

    function regenerateAllThrows() {
        totalThrows = Number(throwsInput.value);

        throws = new Array(totalThrows);
        crossingCounts = new Array(totalThrows + 1);
        crossingCounts[0] = 0;

        for (let i = 0; i < totalThrows; i++) {
            throws[i] = generateThrow();
            crossingCounts[i + 1] = crossingCounts[i] + (throws[i].crosses ? 1 : 0);
        }

        currentThrow.max = String(totalThrows);
        currentThrow.value = "0";
        currentThrowLabel.textContent = "0";

        renderAll();
    }

    function drawVerticalLines(spacing) {
        const w = tossCanvas.width;
        const h = tossCanvas.height;

        tossCtx.strokeStyle = "rgba(0,0,0,0.28)";
        tossCtx.lineWidth = 1;

        for (let x = spacing; x < w; x += spacing) {
            tossCtx.beginPath();
            tossCtx.moveTo(x, 0);
            tossCtx.lineTo(x, h);
            tossCtx.stroke();
        }
    }

    function drawGridPattern() {
        tossCtx.clearRect(0, 0, tossCanvas.width, tossCanvas.height);

        const { spacing } = getShapeParameters();
        drawVerticalLines(spacing);
    }

    function getStrokeColor(throwObj, alpha) {
        if (throwObj.crosses) {
            return `rgba(200, 0, 0, ${alpha})`;
        }
        return `rgba(20, 20, 20, ${alpha})`;
    }

    function drawSegmentThrow(throwObj, alpha) {
        const { x1, y1, x2, y2 } = getSegmentEndpoints(throwObj);

        tossCtx.strokeStyle = getStrokeColor(throwObj, alpha);
        tossCtx.lineWidth = getStrokeWidth();

        tossCtx.beginPath();
        tossCtx.moveTo(x1, y1);
        tossCtx.lineTo(x2, y2);
        tossCtx.stroke();
    }

    function drawSquareThrow(throwObj, alpha) {
        const vertices = getSquareVertices(throwObj);

        tossCtx.strokeStyle = getStrokeColor(throwObj, alpha);
        tossCtx.lineWidth = getStrokeWidth();

        tossCtx.beginPath();
        tossCtx.moveTo(vertices[0].x, vertices[0].y);
        for (let i = 1; i < vertices.length; i++) {
            tossCtx.lineTo(vertices[i].x, vertices[i].y);
        }
        tossCtx.closePath();
        tossCtx.stroke();
    }

    function drawTriangleThrow(throwObj, alpha) {
        const vertices = getTriangleVertices(throwObj);

        tossCtx.strokeStyle = getStrokeColor(throwObj, alpha);
        tossCtx.lineWidth = getStrokeWidth();

        tossCtx.beginPath();
        tossCtx.moveTo(vertices[0].x, vertices[0].y);
        tossCtx.lineTo(vertices[1].x, vertices[1].y);
        tossCtx.lineTo(vertices[2].x, vertices[2].y);
        tossCtx.closePath();
        tossCtx.stroke();
    }

    function drawPiShapeThrow(throwObj, alpha) {
        const segments = getPiShapeSegments(throwObj);
        const color = getStrokeColor(throwObj, alpha);

        // top bar
        tossCtx.strokeStyle = color;
        tossCtx.lineWidth = getStrokeWidth();

        tossCtx.beginPath();
        tossCtx.moveTo(segments[0].x1, segments[0].y1);
        tossCtx.lineTo(segments[0].x2, segments[0].y2);
        tossCtx.stroke();

        // legs
        tossCtx.lineWidth = Math.max(1.5, getStrokeWidth() - 1);

        for (let i = 1; i < segments.length; i++) {
            tossCtx.beginPath();
            tossCtx.moveTo(segments[i].x1, segments[i].y1);
            tossCtx.lineTo(segments[i].x2, segments[i].y2);
            tossCtx.stroke();
        }
    }

    function drawThrow(throwObj, alpha) {
        if (throwObj.shape === "segment") {
            drawSegmentThrow(throwObj, alpha);
        } else if (throwObj.shape === "square") {
            drawSquareThrow(throwObj, alpha);
        } else if (throwObj.shape === "triangle") {
            drawTriangleThrow(throwObj, alpha);
        } else if (throwObj.shape === "piShape") {
            drawPiShapeThrow(throwObj, alpha);
        }
    }

    function getLegendStats(k) {
        const crossings = crossingCounts[k];
        const proportion = (k > 0) ? crossings / k : 0;

        let piText = "π ≈ —";

        if (k > 0 && crossings > 0 && crossings < k) {
            const piEstimate = 1 / proportion;

            const z = 1.96;
            const seP = Math.sqrt(proportion * (1 - proportion) / k);
            const marginP = z * seP;

            const pLower = Math.max(proportion - marginP, 1e-9);
            const pUpper = Math.min(proportion + marginP, 1 - 1e-9);

            const piLower = 1 / pUpper;
            const piUpper = 1 / pLower;
            const piMargin = (piUpper - piLower) / 2;

            piText = `π ≈ ${piEstimate.toFixed(3)} ± ${piMargin.toFixed(3)}`;
        }

        return {
            shape: getShapeLabel(),
            crossings,
            proportion,
            piText
        };
    }

    function drawLegend(k) {
        const stats = getLegendStats(k);

        const lines = [
            `Shape: ${stats.shape}`,
            `Crossings: ${stats.crossings}`,
            `p_est = ${stats.proportion.toFixed(3)}`,
            stats.piText
        ];

        tossCtx.save();

        tossCtx.font = "15px system-ui";
        tossCtx.textBaseline = "top";

        const pad = 10;
        const lineGap = 6;
        const lineHeight = 18;
        const boxX = 14;
        const boxY = 14;
        const boxW = 250;
        const boxH = pad * 2 + lines.length * lineHeight + (lines.length - 1) * lineGap;

        tossCtx.fillStyle = "rgba(255,255,255,0.88)";
        tossCtx.strokeStyle = "rgba(0,0,0,0.18)";
        tossCtx.lineWidth = 1;

        tossCtx.fillRect(boxX, boxY, boxW, boxH);
        tossCtx.strokeRect(boxX, boxY, boxW, boxH);

        tossCtx.fillStyle = "rgba(0,0,0,0.82)";

        for (let i = 0; i < lines.length; i++) {
            const y = boxY + pad + i * (lineHeight + lineGap);
            tossCtx.fillText(lines[i], boxX + pad, y);
        }

        tossCtx.restore();
    }

    function renderThrowsUpTo(k) {
        drawGridPattern();

        const last = Math.min(k, throws.length);
        const windowSize = getVisibleWindowSize();
        const start = Math.max(0, last - windowSize);
        const span = Math.max(1, last - start);

        for (let i = start; i < last; i++) {
            const age = i - start;
            const t = age / span;
            const alpha = 0.12 + 0.88 * t;

            drawThrow(throws[i], alpha);
        }

        drawLegend(last);
    }

    function renderAll() {
        const k = Number(currentThrow.value);
        currentThrowLabel.textContent = String(k);
        renderThrowsUpTo(k);
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

        throwAccumulator += Number(speedSelect.value) * dt;

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

    shapeType.addEventListener("change", () => {
        stopPlaying();
        regenerateAllThrows();
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

})();