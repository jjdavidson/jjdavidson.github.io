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

        const positions = new Int16Array(N + 1);
        let x = 0;

        positions[0] = 0;

        for (let k = 1; k <= N; k++) {
            x = x + randomStep();
            positions[k] = x;
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
        ctx.strokeStyle = "rgba(0,0,0,0.45)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(xLeft, yTop);
        ctx.lineTo(xLeft, yBottom);
        ctx.stroke();

        // x-axis (position = 0) in the middle
        ctx.strokeStyle = "rgba(0,0,0,0.35)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(xLeft, yMid);
        ctx.lineTo(xRight, yMid);
        ctx.stroke();

        // labels
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.font = "14px system-ui";

        // x label
        ctx.fillText("step #", xRight - 50, h - 15);

        // rotated y label
        ctx.save();
        ctx.translate(18, (yTop + yBottom) / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText("position", 0, 0);
        ctx.restore();

        // mark the 0 line
        ctx.fillText("0", xLeft - 18, yMid + 5);
    }

    function drawManyWalks() {

        const N = Number(stepsInput.value);
        const count = Number(walkCount.value);

        const w = canvas.width;
        const h = canvas.height;

        const padL = 60;
        const padR = 20;
        const padT = 20;
        const padB = 50;

        const graphWidth = w - padL - padR;
        const graphHeight = h - padT - padB;

        const yMid = padT + graphHeight / 2;

        // Generate walks and find a common vertical scale (based on max abs across all walks)
        const walks = new Array(count);
        let maxAbs = 1;

        for (let i = 0; i < count; i++) {

            const positions = generateWalk(N);
            walks[i] = positions;

            for (let k = 0; k < positions.length; k++) {
                const absVal = Math.abs(positions[k]);
                if (absVal > maxAbs) {
                    maxAbs = absVal;
                }
            }
        }

        drawAxes(yMid, padL, padR, padT, padB);

        const verticalScale = graphHeight / (2 * maxAbs);

        // Choose styling based on count
        // (Global alpha keeps the picture readable when there are many walks.)
        let alpha = 0.85;
        let lineWidth = 2;

        if (count === 10) {
            alpha = 0.35;
            lineWidth = 1.5;
        } else if (count === 100) {
            alpha = 0.12;
            lineWidth = 1;
        } else if (count === 1000) {
            alpha = 0.035;
            lineWidth = 1;
        }

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineWidth = lineWidth;

        // Efficient: build ONE combined path for all walks, then stroke once
        ctx.beginPath();

        for (let i = 0; i < count; i++) {

            const positions = walks[i];

            for (let k = 0; k < positions.length; k++) {

                const xPixel = padL + (k / N) * graphWidth;
                const yPixel = yMid - positions[k] * verticalScale;

                if (k === 0) {
                    ctx.moveTo(xPixel, yPixel);
                } else {
                    ctx.lineTo(xPixel, yPixel);
                }
            }
        }

        ctx.stroke();
        ctx.restore();
    }

    drawButton.addEventListener("click", () => {
        drawManyWalks();
    });

    drawManyWalks();

})();