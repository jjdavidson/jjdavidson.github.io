(() => {

    const agentCountInput = document.getElementById("agentCountInput");
    const moveSpeedInput = document.getElementById("moveSpeedInput");
    const transmissionProbInput = document.getElementById("transmissionProbInput");
    const INFECTION_RADIUS = 8;
    const displayModeInput = document.getElementById("displayModeInput");

    const restartButton = document.getElementById("restartButton");
    const playPauseButton = document.getElementById("playPauseButton");

    const simCanvas = document.getElementById("simCanvas");
    if (!simCanvas) return;

    const simCtx = simCanvas.getContext("2d");

    let agents = [];

    let isPlaying = false;
    let lastTimeMs = null;

    function randomBetween(a, b) {
        return a + Math.random() * (b - a);
    }

    function makeAgent() {
        const radius = 4;

        return {
            x: randomBetween(radius, simCanvas.width - radius),
            y: randomBetween(radius, simCanvas.height - radius),
            vx: randomBetween(-1, 1),
            vy: randomBetween(-1, 1),
            radius,
            state: "S"
        };
    }

    function assignInitialInfected() {
        for (let i = 0; i < agents.length; i++) {
            agents[i].state = "S";
        }

        if (agents.length === 0) return;

        const centerX = simCanvas.width / 2;
        const centerY = simCanvas.height / 2;

        agents[0].x = centerX;
        agents[0].y = centerY;
        agents[0].state = "I";
    }

    function regenerateAgents() {
        const count = Number(agentCountInput.value);

        agents = new Array(count);

        for (let i = 0; i < count; i++) {
            agents[i] = makeAgent();
        }

        assignInitialInfected();
        renderAll();
    }

    function updateAgents(dt) {
        const speed = Number(moveSpeedInput.value);
        const jitter = 0.25;

        for (let i = 0; i < agents.length; i++) {
            const a = agents[i];

            a.vx += randomBetween(-jitter, jitter);
            a.vy += randomBetween(-jitter, jitter);

            const len = Math.hypot(a.vx, a.vy) || 1;
            a.vx /= len;
            a.vy /= len;

            a.x += a.vx * speed * 60 * dt;
            a.y += a.vy * speed * 60 * dt;

            if (a.x <= a.radius) {
                a.x = a.radius;
                a.vx *= -1;
            }
            if (a.x >= simCanvas.width - a.radius) {
                a.x = simCanvas.width - a.radius;
                a.vx *= -1;
            }
            if (a.y <= a.radius) {
                a.y = a.radius;
                a.vy *= -1;
            }
            if (a.y >= simCanvas.height - a.radius) {
                a.y = simCanvas.height - a.radius;
                a.vy *= -1;
            }
        }
    }

    function spreadInfection() {
        const transmissionProb = Number(transmissionProbInput.value);
        const infectionRadiusSq = INFECTION_RADIUS * INFECTION_RADIUS;

        const toInfect = [];

        for (let i = 0; i < agents.length; i++) {
            const a = agents[i];
            if (a.state !== "I") continue;

            for (let j = 0; j < agents.length; j++) {
                const b = agents[j];
                if (b.state !== "S") continue;

                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const distSq = dx * dx + dy * dy;

                if (distSq <= infectionRadiusSq) {
                    if (Math.random() < transmissionProb) {
                        toInfect.push(j);
                    }
                }
            }
        }

        for (let k = 0; k < toInfect.length; k++) {
            agents[toInfect[k]].state = "I";
        }
    }

    function drawBox() {
        simCtx.clearRect(0, 0, simCanvas.width, simCanvas.height);

        simCtx.strokeStyle = "rgba(0,0,0,0.35)";
        simCtx.lineWidth = 2;
        simCtx.strokeRect(1, 1, simCanvas.width - 2, simCanvas.height - 2);
    }

    function getAgentColor(state) {
        if (state === "I") return "#dc2626";
        if (state === "R") return "#bfdbfe";
        return "#2563eb";
    }

    function drawAgents() {
        for (let i = 0; i < agents.length; i++) {
            const a = agents[i];

            simCtx.fillStyle = getAgentColor(a.state);
            simCtx.beginPath();
            simCtx.arc(a.x, a.y, a.radius, 0, 2 * Math.PI);
            simCtx.fill();
        }
    }

    function addToHeatGrid(grid, rows, cols, r, c, weight) {
        if (r < 0 || r >= rows || c < 0 || c >= cols) return 0;

        const index = r * cols + c;
        grid[index] += weight;
        return grid[index];
    }

    function drawHeatmap() {
        const cols = 120;
        const rows = 70;

        const cellW = simCanvas.width / cols;
        const cellH = simCanvas.height / rows;

        const grid = new Float32Array(cols * rows);
        let maxCount = 0;

        for (let i = 0; i < agents.length; i++) {
            const a = agents[i];
            if (a.state !== "I") continue;

            const gx = a.x / cellW;
            const gy = a.y / cellH;

            const col = Math.floor(gx);
            const row = Math.floor(gy);

            const dx = gx - col;
            const dy = gy - row;

            let value;

            value = addToHeatGrid(grid, rows, cols, row, col, (1 - dx) * (1 - dy));
            if (value > maxCount) maxCount = value;

            value = addToHeatGrid(grid, rows, cols, row, col + 1, dx * (1 - dy));
            if (value > maxCount) maxCount = value;

            value = addToHeatGrid(grid, rows, cols, row + 1, col, (1 - dx) * dy);
            if (value > maxCount) maxCount = value;

            value = addToHeatGrid(grid, rows, cols, row + 1, col + 1, dx * dy);
            if (value > maxCount) maxCount = value;
        }

        if (maxCount <= 0) return;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const count = grid[row * cols + col];
                if (count <= 0) continue;

                const alpha = Math.sqrt(count / maxCount);

                simCtx.fillStyle = `rgba(220, 38, 38, ${0.08 + 0.82 * alpha})`;
                simCtx.fillRect(
                    col * cellW,
                    row * cellH,
                    Math.ceil(cellW),
                    Math.ceil(cellH)
                );
            }
        }
    }

    function renderAll() {
        drawBox();

        if (displayModeInput.value === "heatmap") {
            drawHeatmap();
        } else {
            drawAgents();
        }
    }

    function tick(timestampMs) {
        if (!isPlaying) {
            lastTimeMs = null;
            return;
        }

        if (lastTimeMs === null) {
            lastTimeMs = timestampMs;
        }

        const dt = (timestampMs - lastTimeMs) / 1000;
        lastTimeMs = timestampMs;

        updateAgents(dt);
        spreadInfection();
        renderAll();

        requestAnimationFrame(tick);
    }

    function startPlaying() {
        if (isPlaying) return;

        isPlaying = true;
        playPauseButton.textContent = "Pause";
        requestAnimationFrame(tick);
    }

    function stopPlaying() {
        isPlaying = false;
        playPauseButton.textContent = "Play";
        lastTimeMs = null;
    }

    restartButton.addEventListener("click", () => {
        stopPlaying();
        regenerateAgents();
    });

    agentCountInput.addEventListener("change", () => {
        stopPlaying();
        regenerateAgents();
    });

    moveSpeedInput.addEventListener("change", () => {
        // Speed changes live during play.
    });

    transmissionProbInput.addEventListener("change", () => {
        stopPlaying();
        regenerateAgents();
    });

    displayModeInput.addEventListener("change", () => {
        renderAll();
    });

    playPauseButton.addEventListener("click", () => {
        if (isPlaying) {
            stopPlaying();
        } else {
            startPlaying();
        }
    });

    regenerateAgents();
    renderAll();

})();