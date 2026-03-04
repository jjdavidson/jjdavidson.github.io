(() => {

    const canvas = document.getElementById("canvas");
    const stepsInput = document.getElementById("stepsInput");
    const walkCount = document.getElementById("walkCount");
    const drawButton = document.getElementById("drawButton");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

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

        positions.push(x);

        for (let k = 1; k <= N; k++) {
            x = x + randomStep();
            positions.push(x);
        }

        return positions;
    }

    // Draw axes where yMid is the pixel y-coordinate for position 0
    function drawAxes(yMid, padL, padR, padT, padB) {

        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        const xLeft = padL;
        const xRight = w - padR;
        const yTop = padT;
        const yBottom = h - padB;

        // y-axis (left)
        ctx.strokeStyle = "rgba(0,0,0,0.5)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(xLeft, yTop);
        ctx.lineTo(xLeft, yBottom);
        ctx.stroke();

        // x-axis (position = 0) in the middle
        // (Red so you can clearly see it while debugging.)
        ctx.strokeStyle = "rgba(200,0,0,0.6)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xLeft, yMid);
        ctx.lineTo(xRight, yMid);
        ctx.stroke();

        // labels
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.font = "14px system-ui";
        ctx.fillText("position", 10, 18);
        ctx.fillText("step #", xRight - 50, h - 15);
        ctx.fillText("0", xLeft - 18, yMid + 5);
    }

    function drawOneWalk() {

        const N = Number(stepsInput.value);
        const positions = generateWalk(N);

        const w = canvas.width;
        const h = canvas.height;

        const padL = 60;
        const padR = 20;
        const padT = 20;
        const padB = 50;

        const graphWidth = w - padL - padR;
        const graphHeight = h - padT - padB;

        const yMid = padT + graphHeight / 2;

        drawAxes(yMid, padL, padR, padT, padB);

        // Find maximum absolute position for scaling
        let maxAbs = 1;

        for (let i = 0; i < positions.length; i++) {
            const absVal = Math.abs(positions[i]);
            if (absVal > maxAbs) {
                maxAbs = absVal;
            }
        }

        const verticalScale = graphHeight / (2 * maxAbs);

        // Draw random walk polyline
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

    drawOneWalk();

})();