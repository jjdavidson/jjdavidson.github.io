(() => {

    const canvas = document.getElementById("canvas");
    const stepsInput = document.getElementById("stepsInput");
    const walkCount = document.getElementById("walkCount");
    const drawButton = document.getElementById("drawButton");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    function drawAxes() {

        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        const padL = 60;
        const padR = 20;
        const padT = 20;
        const padB = 50;

        const x0 = padL;
        const x1 = w - padR;
        const y0 = h - padB;
        const y1 = padT;

        ctx.strokeStyle = "rgba(0,0,0,0.5)";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(x0, y1);
        ctx.lineTo(x0, y0);
        ctx.lineTo(x1, y0);
        ctx.stroke();

        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.font = "14px system-ui";

        ctx.fillText("position", 10, 18);
        ctx.fillText("step #", x1 - 50, h - 15);

        return { x0, x1, y0, y1, padL, padR, padT, padB };
    }

    // Returns +1 or -1 with 50/50 probability
    function randomStep() {

        if (Math.random() < 0.5) {
            return -1;
        }

        return 1;
    }

    // Generate an array of positions [x0, x1, ..., xN]
    function generateWalk(N) {

        const positions = [];
        let x = 0;

        positions.push(x);               // x0 = 0

        for (let k = 1; k <= N; k++) {   // compute x1..xN
            x = x + randomStep();
            positions.push(x);
        }

        return positions;
    }

    function drawOneWalk() {

        const N = Number(stepsInput.value);
        const positions = generateWalk(N);

        const { padL, padR, padT, padB } = drawAxes();

        const w = canvas.width;
        const h = canvas.height;

        const graphWidth = w - padL - padR;
        const graphHeight = h - padT - padB;

        const x0 = padL;
        const yMid = padT + graphHeight / 2;

        // Find vertical scaling
        let maxAbs = 1;

        for (let i = 0; i < positions.length; i++) {
            const absVal = Math.abs(positions[i]);
            if (absVal > maxAbs) {
                maxAbs = absVal;
            }
        }

        const verticalScale = graphHeight / (2 * maxAbs);

        // Draw horizontal axis (y = 0)
        ctx.strokeStyle = "rgba(0,0,0,0.4)";
        ctx.beginPath();
        ctx.moveTo(padL, yMid);
        ctx.lineTo(w - padR, yMid);
        ctx.stroke();

        // Draw the random walk polyline
        ctx.strokeStyle = "rgba(0,0,0,0.85)";
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let k = 0; k < positions.length; k++) {

            const xPixel = padL + (k / N) * graphWidth;
            const yPixel = yMid - positions[k] * verticalScale;

            if (k === 0) {
                ctx.moveTo(xPixel, yPixel);
            } else {
                ctx.lineTo(xPixel, yPixel);
            }
        }

        ctx.stroke();
    }

    drawButton.addEventListener("click", () => {
        drawOneWalk();
    });

    // Initial draw
    drawOneWalk();

})();