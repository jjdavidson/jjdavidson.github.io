(() => {

    const positionInput = document.getElementById("positionInput");
    const velocityInput = document.getElementById("velocityInput");
    const accelerationInput = document.getElementById("accelerationInput");
    const viewSelect = document.getElementById("viewSelect");

    const timeSlider = document.getElementById("kinematicsTimeSlider");
    const timeLabel = document.getElementById("kinematicsTimeLabel");

    const canvas = document.getElementById("kinematicsCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const T_MIN = 0;
    const T_MAX = 10;
    const SAMPLE_COUNT = 400;

    function numericValue(input, fallback) {
        if (!input) return fallback;
        const value = Number(input.value);
        return Number.isFinite(value) ? value : fallback;
    }

    function currentParams() {
        return {
            x0: numericValue(positionInput, 0),
            v0: numericValue(velocityInput, 0),
            a: numericValue(accelerationInput, 0)
        };
    }

    function currentView() {
        return viewSelect ? viewSelect.value : "normal";
    }

    function positionAt(t, params) {
        return params.x0 + params.v0 * t + 0.5 * params.a * t * t;
    }

    function velocityAt(t, params) {
        return params.v0 + params.a * t;
    }

    function accelerationAt(_t, params) {
        return params.a;
    }

    function positionSlopeAt(t, params) {
        return velocityAt(t, params);
    }

    function velocitySlopeAt(_t, params) {
        return params.a;
    }

    function accelerationSlopeAt() {
        return 0;
    }

    function displacementFromZero(t, params) {
        return params.v0 * t + 0.5 * params.a * t * t;
    }

    function deltaVFromZero(t, params) {
        return params.a * t;
    }

    function sampleGraph(fn, params) {
        const values = new Array(SAMPLE_COUNT + 1);

        for (let i = 0; i <= SAMPLE_COUNT; i++) {
            const t = T_MIN + (i / SAMPLE_COUNT) * (T_MAX - T_MIN);
            values[i] = fn(t, params);
        }

        return values;
    }

    function computeScale(values, fallbackHalfRange) {
        let min = Infinity;
        let max = -Infinity;

        for (let i = 0; i < values.length; i++) {
            const y = values[i];
            if (y < min) min = y;
            if (y > max) max = y;
        }

        min = Math.min(min, 0);
        max = Math.max(max, 0);

        if (Math.abs(max - min) < 1e-9) {
            min = -fallbackHalfRange;
            max = fallbackHalfRange;
        }

        const pad = 0.12 * (max - min || 1);
        return { min: min - pad, max: max + pad };
    }

    function mapTimeToX(t, left, width) {
        return left + ((t - T_MIN) / (T_MAX - T_MIN)) * width;
    }

    function mapValueToY(y, top, height, scale) {
        return top + ((scale.max - y) / (scale.max - scale.min)) * height;
    }

    function drawPanelFrame(left, top, width, height, label) {
        ctx.strokeStyle = "rgba(0,0,0,0.18)";
        ctx.lineWidth = 1;
        ctx.strokeRect(left, top, width, height);

        ctx.fillStyle = "rgba(0,0,0,0.85)";
        ctx.font = "14px system-ui";
        ctx.save();
        ctx.translate(left - 18, top + height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = "center";
        ctx.fillText(label, 0, 0);
        ctx.restore();
    }

    function drawAxes(left, top, width, height, scale) {
        const yZero = mapValueToY(0, top, height, scale);
        const xZero = mapTimeToX(0, left, width);

        ctx.strokeStyle = "rgba(0,0,0,0.22)";
        ctx.lineWidth = 1;

        if (yZero >= top && yZero <= top + height) {
            ctx.beginPath();
            ctx.moveTo(left, yZero);
            ctx.lineTo(left + width, yZero);
            ctx.stroke();
        }

        if (xZero >= left && xZero <= left + width) {
            ctx.beginPath();
            ctx.moveTo(xZero, top);
            ctx.lineTo(xZero, top + height);
            ctx.stroke();
        }

        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.font = "12px system-ui";
        ctx.textAlign = "right";

        if (yZero >= top && yZero <= top + height) {
            ctx.fillText("0", left - 6, yZero + 4);
        }
    }

    function drawTimeTicks(left, top, width, height) {
        ctx.strokeStyle = "rgba(0,0,0,0.18)";
        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.lineWidth = 1;
        ctx.font = "12px system-ui";
        ctx.textAlign = "center";

        for (let t = 0; t <= T_MAX; t += 2) {
            const x = mapTimeToX(t, left, width);
            const y = top + height;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + 6);
            ctx.stroke();
            ctx.fillText(String(t), x, y + 18);
        }

        ctx.fillText("time", left + width / 2, top + height + 36);
    }

    function drawCurve(left, top, width, height, values, scale) {
        ctx.strokeStyle = "rgba(0,0,0,0.9)";
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let i = 0; i < values.length; i++) {
            const t = T_MIN + (i / SAMPLE_COUNT) * (T_MAX - T_MIN);
            const x = mapTimeToX(t, left, width);
            const y = mapValueToY(values[i], top, height, scale);

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.stroke();
    }

    function drawCursor(left, top, width, height, tCursor) {
        const x = mapTimeToX(tCursor, left, width);

        ctx.strokeStyle = "rgba(0,0,0,0.28)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, top);
        ctx.lineTo(x, top + height);
        ctx.stroke();
    }

    function drawPoint(left, top, width, height, tCursor, yValue, scale) {
        const x = mapTimeToX(tCursor, left, width);
        const y = mapValueToY(yValue, top, height, scale);

        ctx.fillStyle = "rgba(0,0,0,0.95)";
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    }

    function drawReadout(left, top, width, text, lineIndex, color = "rgba(0,0,0,0.85)") {
        ctx.fillStyle = color;
        ctx.font = "13px system-ui";
        ctx.textAlign = "left";
        ctx.fillText(text, left + width + 14, top + 20 + 20 * lineIndex);
    }

    function formatSigned(value) {
        return value.toFixed(2);
    }

    function drawTangentLine(left, top, width, height, scale, fn, slopeFn, params, tCursor, slopeLabel) {
        const y0 = fn(tCursor, params);
        const m = slopeFn(tCursor, params);
        const tLeft = T_MIN;
        const tRight = T_MAX;
        const yLeft = y0 + m * (tLeft - tCursor);
        const yRight = y0 + m * (tRight - tCursor);

        ctx.strokeStyle = "rgba(220,0,0,0.9)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(mapTimeToX(tLeft, left, width), mapValueToY(yLeft, top, height, scale));
        ctx.lineTo(mapTimeToX(tRight, left, width), mapValueToY(yRight, top, height, scale));
        ctx.stroke();

        drawReadout(left, top, width, `${slopeLabel} = ${formatSigned(m)}`, 2, "rgba(180,0,0,0.95)");
    }

    function drawSignedArea(left, top, width, height, scale, fn, signedIntegralValue, params, tCursor, areaLabel, lineIndex) {
        const yZero = mapValueToY(0, top, height, scale);

        ctx.fillStyle = "rgba(220,0,0,0.18)";
        ctx.beginPath();
        ctx.moveTo(mapTimeToX(T_MIN, left, width), yZero);

        for (let i = 0; i <= SAMPLE_COUNT; i++) {
            const t = T_MIN + (i / SAMPLE_COUNT) * (tCursor - T_MIN);
            const x = mapTimeToX(t, left, width);
            const y = mapValueToY(fn(t, params), top, height, scale);
            ctx.lineTo(x, y);
        }

        ctx.lineTo(mapTimeToX(tCursor, left, width), yZero);
        ctx.closePath();
        ctx.fill();

        drawReadout(left, top, width, `${areaLabel} = ${formatSigned(signedIntegralValue(tCursor, params))}`, lineIndex, "rgba(180,0,0,0.95)");
    }

    function renderPanel(options) {
        const {
            left,
            top,
            width,
            height,
            label,
            values,
            scale,
            currentValue,
            tCursor,
            fn,
            slopeFn,
            params,
            readoutText,
            tangentLabel,
            showTangent,
            areaValueFn,
            areaLabel,
            areaLineIndex,
            deltaLabel,
            deltaValueFn,
            deltaLineIndex,
            showArea
        } = options;

        drawPanelFrame(left, top, width, height, label);
        drawAxes(left, top, width, height, scale);

        const view = currentView();
        if (view === "area" && showArea) {
            drawSignedArea(left, top, width, height, scale, fn, areaValueFn, params, tCursor, areaLabel, areaLineIndex);
        }

        drawCurve(left, top, width, height, values, scale);

        if (view === "tangent" && showTangent) {
            drawTangentLine(left, top, width, height, scale, fn, slopeFn, params, tCursor, tangentLabel);
        }

        drawCursor(left, top, width, height, tCursor);
        drawPoint(left, top, width, height, tCursor, currentValue, scale);
        drawReadout(left, top, width, readoutText, 0);

        if (deltaLabel && deltaValueFn) {
            drawReadout(left, top, width, `${deltaLabel} = ${formatSigned(deltaValueFn(tCursor, params))}`, deltaLineIndex);
        }
    }

    function renderAll() {
        const params = currentParams();
        const tCursor = timeSlider ? Number(timeSlider.value) : 0;

        if (timeLabel) {
            timeLabel.textContent = tCursor.toFixed(1);
        }

        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const padL = 110;
        const padR = 190;
        const padT = 20;
        const padB = 50;
        const gap = 24;

        const panelWidth = w - padL - padR;
        const panelHeight = (h - padT - padB - 2 * gap) / 3;

        const xValues = sampleGraph(positionAt, params);
        const vValues = sampleGraph(velocityAt, params);
        const aValues = sampleGraph(accelerationAt, params);

        const xScale = computeScale(xValues, 4);
        const vScale = computeScale(vValues, 3);
        const aScale = computeScale(aValues, 1);

        const xCurrent = positionAt(tCursor, params);
        const vCurrent = velocityAt(tCursor, params);
        const aCurrent = accelerationAt(tCursor, params);

        const xTop = padT;
        const vTop = xTop + panelHeight + gap;
        const aTop = vTop + panelHeight + gap;

        renderPanel({
            left: padL,
            top: xTop,
            width: panelWidth,
            height: panelHeight,
            label: "position",
            values: xValues,
            scale: xScale,
            currentValue: xCurrent,
            tCursor,
            fn: positionAt,
            slopeFn: positionSlopeAt,
            params,
            readoutText: `x(t) = ${xCurrent.toFixed(2)}`,
            tangentLabel: "slope",
            showTangent: true,
            areaValueFn: null,
            areaLabel: null,
            areaLineIndex: 1,
            deltaLabel: "Δx",
            deltaValueFn: displacementFromZero,
            deltaLineIndex: 1,
            showArea: false
        });

        renderPanel({
            left: padL,
            top: vTop,
            width: panelWidth,
            height: panelHeight,
            label: "velocity",
            values: vValues,
            scale: vScale,
            currentValue: vCurrent,
            tCursor,
            fn: velocityAt,
            slopeFn: velocitySlopeAt,
            params,
            readoutText: `v(t) = ${vCurrent.toFixed(2)}`,
            tangentLabel: "slope",
            showTangent: true,
            areaValueFn: displacementFromZero,
            areaLabel: "area under v(t)",
            areaLineIndex: 2,
            deltaLabel: "Δv",
            deltaValueFn: deltaVFromZero,
            deltaLineIndex: 1,
            showArea: true
        });

        renderPanel({
            left: padL,
            top: aTop,
            width: panelWidth,
            height: panelHeight,
            label: "acceleration",
            values: aValues,
            scale: aScale,
            currentValue: aCurrent,
            tCursor,
            fn: accelerationAt,
            slopeFn: accelerationSlopeAt,
            params,
            readoutText: `a(t) = ${aCurrent.toFixed(2)}`,
            tangentLabel: "slope",
            showTangent: false,
            areaValueFn: deltaVFromZero,
            areaLabel: "area under a(t)",
            areaLineIndex: 2,
            deltaLabel: null,
            deltaValueFn: null,
            deltaLineIndex: 1,
            showArea: true
        });

        drawTimeTicks(padL, aTop, panelWidth, panelHeight);
    }

    function bindIfPresent(element, eventName, handler) {
        if (!element) return;
        element.addEventListener(eventName, handler);
    }

    bindIfPresent(positionInput, "input", renderAll);
    bindIfPresent(velocityInput, "input", renderAll);
    bindIfPresent(accelerationInput, "input", renderAll);
    bindIfPresent(viewSelect, "change", renderAll);
    bindIfPresent(timeSlider, "input", renderAll);

    renderAll();

})();
