(() => {

    const pointCountInput = document.getElementById("pointCountInput");

    const trialCountInput = document.getElementById("trialCountInput");
    const speedSelect = document.getElementById("speedSelect");
    const regionSelect = document.getElementById("regionSelect");

    const resetButton = document.getElementById("resetButton");
    const startPauseButton = document.getElementById("startPauseButton");

    const emstCanvas = document.getElementById("emstCanvas");
    const totalLengthCanvas = document.getElementById("totalLengthCanvas");
    const weightedDiameterCanvas = document.getElementById("weightedDiameterCanvas");
    const degreeDistributionCanvas = document.getElementById("degreeDistributionCanvas");

    if (!emstCanvas || !totalLengthCanvas || !weightedDiameterCanvas || !degreeDistributionCanvas || !regionSelect) return;

    const emstCtx = emstCanvas.getContext("2d");
    const totalLengthCtx = totalLengthCanvas.getContext("2d");
    const weightedDiameterCtx = weightedDiameterCanvas.getContext("2d");
    const degreeDistributionCtx = degreeDistributionCanvas.getContext("2d");

    const minPoints = 5;
    const maxPoints = 500;

    let pointCount = 50;
    let points = [];
    let mstEdges = [];

    let currentTotalLength = null;
    let totalLengthHistory = [];

    let currentDiameter = null;
    let diameterHistory = [];

    let currentMaxDegree = null;
    let maxDegreeHistory = [];

    let currentLeafFrequency = null;
    let leafFrequencyHistory = [];

    let currentDegreeCounts = [];
    let degreeCountsHistory = [];
    let degreeDistributionHistory = [];

    let isRunning = false;
    let lastTimeMs = null;
    let trialAccumulator = 0;

    function getTrialCount() {
        return Number(trialCountInput.value);
    }

    function getSimulationSpeed() {
        return Number(speedSelect.value);
    }

    function getRegionType() {
        return regionSelect.value;
    }

    function rectanglePiece(xMin, xMax, yMin, yMax) {
        return {
            kind: "rectangle",
            xMin: xMin,
            xMax: xMax,
            yMin: yMin,
            yMax: yMax,
            area: (xMax - xMin) * (yMax - yMin)
        };
    }

    function rotatedRectanglePiece(cx, cy, length, thickness, angle) {
        const ux = Math.cos(angle);
        const uy = Math.sin(angle);

        const vx = -Math.sin(angle);
        const vy = Math.cos(angle);

        const halfLength = length / 2;
        const halfThickness = thickness / 2;

        const corners = [
            {
                x: cx - halfLength * ux - halfThickness * vx,
                y: cy - halfLength * uy - halfThickness * vy
            },
            {
                x: cx + halfLength * ux - halfThickness * vx,
                y: cy + halfLength * uy - halfThickness * vy
            },
            {
                x: cx + halfLength * ux + halfThickness * vx,
                y: cy + halfLength * uy + halfThickness * vy
            },
            {
                x: cx - halfLength * ux + halfThickness * vx,
                y: cy - halfLength * uy + halfThickness * vy
            }
        ];

        return {
            kind: "rotatedRectangle",
            cx: cx,
            cy: cy,
            length: length,
            thickness: thickness,
            angle: angle,
            ux: ux,
            uy: uy,
            vx: vx,
            vy: vy,
            halfLength: halfLength,
            halfThickness: halfThickness,
            area: length * thickness,
            corners: corners
        };
    }

    function boundsFromPolygons(polygons) {
        let xMin = Infinity;
        let xMax = -Infinity;
        let yMin = Infinity;
        let yMax = -Infinity;

        for (let i = 0; i < polygons.length; i++) {
            for (let j = 0; j < polygons[i].length; j++) {
                const p = polygons[i][j];

                if (p.x < xMin) xMin = p.x;
                if (p.x > xMax) xMax = p.x;
                if (p.y < yMin) yMin = p.y;
                if (p.y > yMax) yMax = p.y;
            }
        }

        return {
            xMin: xMin,
            xMax: xMax,
            yMin: yMin,
            yMax: yMax,
            width: xMax - xMin,
            height: yMax - yMin
        };
    }

    function getRegionSpec() {
        const type = getRegionType();

        if (type === "circle") {
            const r = 1 / Math.sqrt(Math.PI);

            return {
                type: "circle",
                label: "area-one circle",
                displayLabel: "Area-One Circle",
                xMin: -r,
                xMax: r,
                yMin: -r,
                yMax: r,
                width: 2 * r,
                height: 2 * r,
                radius: r,
                isConvex: true,
                pieces: [],
                rotatedPieces: [],
                blockedRects: [],
                outline: []
            };
        }

        if (type === "rectangle") {
            const width = Math.sqrt(2);
            const height = 1 / Math.sqrt(2);

            return {
                type: "rectangle",
                label: "area-one 2 × 1 rectangle",
                displayLabel: "Area-One 2 × 1 Rectangle",
                xMin: 0,
                xMax: width,
                yMin: 0,
                yMax: height,
                width: width,
                height: height,
                isConvex: true,
                pieces: [
                    rectanglePiece(0, width, 0, height)
                ],
                rotatedPieces: [],
                blockedRects: [],
                outline: [
                    { x: 0, y: 0 },
                    { x: width, y: 0 },
                    { x: width, y: height },
                    { x: 0, y: height }
                ]
            };
        }

        if (type === "lshape") {
            const side = 3 / Math.sqrt(5);
            const thickness = side / 3;

            return {
                type: "lshape",
                label: "area-one skinny L-shape",
                displayLabel: "Area-One Skinny L-Shape",
                xMin: 0,
                xMax: side,
                yMin: 0,
                yMax: side,
                width: side,
                height: side,
                isConvex: false,
                pieces: [
                    rectanglePiece(0, side, 0, thickness),
                    rectanglePiece(0, thickness, thickness, side)
                ],
                rotatedPieces: [],
                blockedRects: [
                    {
                        xMin: thickness,
                        xMax: side,
                        yMin: thickness,
                        yMax: side
                    }
                ],
                outline: [
                    { x: 0, y: 0 },
                    { x: side, y: 0 },
                    { x: side, y: thickness },
                    { x: thickness, y: thickness },
                    { x: thickness, y: side },
                    { x: 0, y: side }
                ]
            };
        }

        if (type === "cshape") {
            const thickness = 0.25;
            const baseArea = 3 * thickness - 2 * thickness * thickness;
            const scale = 1 / Math.sqrt(baseArea);

            const t = thickness * scale;
            const side = scale;

            return {
                type: "cshape",
                label: "area-one C-shape",
                displayLabel: "Area-One C-Shape",
                xMin: 0,
                xMax: side,
                yMin: 0,
                yMax: side,
                width: side,
                height: side,
                isConvex: false,
                pieces: [
                    rectanglePiece(0, t, 0, side),
                    rectanglePiece(t, side, 0, t),
                    rectanglePiece(t, side, side - t, side)
                ],
                rotatedPieces: [],
                blockedRects: [
                    {
                        xMin: t,
                        xMax: side,
                        yMin: t,
                        yMax: side - t
                    }
                ],
                outline: [
                    { x: 0, y: 0 },
                    { x: side, y: 0 },
                    { x: side, y: t },
                    { x: t, y: t },
                    { x: t, y: side - t },
                    { x: side, y: side - t },
                    { x: side, y: side },
                    { x: 0, y: side }
                ]
            };
        }

        if (type === "eshape") {
            const thickness = 0.25;
            const middleArmLength = 0.85;

            const baseArea =
                thickness +
                (1 - thickness) * thickness +
                (middleArmLength - thickness) * thickness +
                (1 - thickness) * thickness;

            const scale = 1 / Math.sqrt(baseArea);

            const t = thickness * scale;
            const m = middleArmLength * scale;
            const side = scale;

            const y0 = 0;
            const y1 = t;
            const y2 = 0.375 * scale;
            const y3 = 0.625 * scale;
            const y4 = 0.75 * scale;
            const y5 = side;

            return {
                type: "eshape",
                label: "area-one E-shape",
                displayLabel: "Area-One E-Shape",
                xMin: 0,
                xMax: side,
                yMin: 0,
                yMax: side,
                width: side,
                height: side,
                isConvex: false,
                pieces: [
                    rectanglePiece(0, t, 0, side),
                    rectanglePiece(t, side, y4, y5),
                    rectanglePiece(t, m, y2, y3),
                    rectanglePiece(t, side, y0, y1)
                ],
                rotatedPieces: [],
                blockedRects: [
                    {
                        xMin: t,
                        xMax: side,
                        yMin: y1,
                        yMax: y2
                    },
                    {
                        xMin: m,
                        xMax: side,
                        yMin: y2,
                        yMax: y3
                    },
                    {
                        xMin: t,
                        xMax: side,
                        yMin: y3,
                        yMax: y4
                    }
                ],
                outline: [
                    { x: 0, y: 0 },
                    { x: side, y: 0 },
                    { x: side, y: y1 },
                    { x: t, y: y1 },
                    { x: t, y: y2 },
                    { x: m, y: y2 },
                    { x: m, y: y3 },
                    { x: t, y: y3 },
                    { x: t, y: y4 },
                    { x: side, y: y4 },
                    { x: side, y: y5 },
                    { x: 0, y: y5 }
                ]
            };
        }

        if (type === "hshape") {
            const leftWidth = 0.3;
            const rightStart = 0.7;
            const corridorYMin = 0.45;
            const corridorYMax = 0.55;
            const baseArea = leftWidth + (1 - rightStart) + (rightStart - leftWidth) * (corridorYMax - corridorYMin);
            const scale = 1 / Math.sqrt(baseArea);

            const x0 = 0;
            const x1 = leftWidth * scale;
            const x2 = rightStart * scale;
            const x3 = scale;

            const y0 = 0;
            const y1 = corridorYMin * scale;
            const y2 = corridorYMax * scale;
            const y3 = scale;

            return {
                type: "hshape",
                label: "area-one H-shape",
                displayLabel: "Area-One H-Shape",
                xMin: 0,
                xMax: scale,
                yMin: 0,
                yMax: scale,
                width: scale,
                height: scale,
                isConvex: false,
                pieces: [
                    rectanglePiece(x0, x1, y0, y3),
                    rectanglePiece(x1, x2, y1, y2),
                    rectanglePiece(x2, x3, y0, y3)
                ],
                rotatedPieces: [],
                blockedRects: [
                    {
                        xMin: x1,
                        xMax: x2,
                        yMin: y0,
                        yMax: y1
                    },
                    {
                        xMin: x1,
                        xMax: x2,
                        yMin: y2,
                        yMax: y3
                    }
                ],
                outline: [
                    { x: x0, y: y0 },
                    { x: x1, y: y0 },
                    { x: x1, y: y1 },
                    { x: x2, y: y1 },
                    { x: x2, y: y0 },
                    { x: x3, y: y0 },
                    { x: x3, y: y3 },
                    { x: x2, y: y3 },
                    { x: x2, y: y2 },
                    { x: x1, y: y2 },
                    { x: x1, y: y3 },
                    { x: x0, y: y3 }
                ]
            };
        }

        if (type === "ishape") {
            const thickness = 0.25;
            const baseArea = 3 * thickness - 2 * thickness * thickness;
            const scale = 1 / Math.sqrt(baseArea);

            const t = thickness * scale;
            const side = scale;

            const x1 = (side - t) / 2;
            const x2 = (side + t) / 2;

            return {
                type: "ishape",
                label: "area-one I-shape",
                displayLabel: "Area-One I-Shape",
                xMin: 0,
                xMax: side,
                yMin: 0,
                yMax: side,
                width: side,
                height: side,
                isConvex: false,
                pieces: [
                    rectanglePiece(0, side, 0, t),
                    rectanglePiece(x1, x2, t, side - t),
                    rectanglePiece(0, side, side - t, side)
                ],
                rotatedPieces: [],
                blockedRects: [
                    {
                        xMin: 0,
                        xMax: x1,
                        yMin: t,
                        yMax: side - t
                    },
                    {
                        xMin: x2,
                        xMax: side,
                        yMin: t,
                        yMax: side - t
                    }
                ],
                outline: [
                    { x: 0, y: 0 },
                    { x: side, y: 0 },
                    { x: side, y: t },
                    { x: x2, y: t },
                    { x: x2, y: side - t },
                    { x: side, y: side - t },
                    { x: side, y: side },
                    { x: 0, y: side },
                    { x: 0, y: side - t },
                    { x: x1, y: side - t },
                    { x: x1, y: t },
                    { x: 0, y: t }
                ]
            };
        }

        if (type === "xshape") {
            const baseLength = 1.35;
            const baseThickness = 0.22;

            const baseArea = 2 * baseLength * baseThickness - baseThickness * baseThickness;
            const scale = 1 / Math.sqrt(baseArea);

            const length = baseLength * scale;
            const thickness = baseThickness * scale;

            const bar1 = rotatedRectanglePiece(0, 0, length, thickness, Math.PI / 4);
            const bar2 = rotatedRectanglePiece(0, 0, length, thickness, -Math.PI / 4);

            const bounds = boundsFromPolygons([
                bar1.corners,
                bar2.corners
            ]);

            return {
                type: "xshape",
                label: "area-one X-shape",
                displayLabel: "Area-One X-Shape",
                xMin: bounds.xMin,
                xMax: bounds.xMax,
                yMin: bounds.yMin,
                yMax: bounds.yMax,
                width: bounds.width,
                height: bounds.height,
                isConvex: false,
                pieces: [],
                rotatedPieces: [
                    bar1,
                    bar2
                ],
                blockedRects: [],
                outline: []
            };
        }

        return {
            type: "square",
            label: "unit square",
            displayLabel: "Unit Square",
            xMin: 0,
            xMax: 1,
            yMin: 0,
            yMax: 1,
            width: 1,
            height: 1,
            isConvex: true,
            pieces: [
                rectanglePiece(0, 1, 0, 1)
            ],
            rotatedPieces: [],
            blockedRects: [],
            outline: [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 1, y: 1 },
                { x: 0, y: 1 }
            ]
        };
    }

    function clampPointCount(value) {
        let next = Math.round(Number(value));

        if (!Number.isFinite(next)) {
            next = pointCount;
        }

        if (next < minPoints) next = minPoints;
        if (next > maxPoints) next = maxPoints;

        return next;
    }

    function updatePointCountInput() {
        pointCountInput.value = String(pointCount);
    }

    function setPointCountFromInput() {
        const next = clampPointCount(pointCountInput.value);

        if (next === pointCount) {
            updatePointCountInput();
            return;
        }

        pointCount = next;
        resetSimulation();
    }

    function randomPointInRectanglePiece(piece) {
        return {
            x: piece.xMin + (piece.xMax - piece.xMin) * Math.random(),
            y: piece.yMin + (piece.yMax - piece.yMin) * Math.random()
        };
    }

    function randomPointFromPieces(pieces) {
        let totalArea = 0;

        for (let i = 0; i < pieces.length; i++) {
            totalArea += pieces[i].area;
        }

        let r = totalArea * Math.random();

        for (let i = 0; i < pieces.length; i++) {
            if (r <= pieces[i].area) {
                return randomPointInRectanglePiece(pieces[i]);
            }

            r -= pieces[i].area;
        }

        return randomPointInRectanglePiece(pieces[pieces.length - 1]);
    }

    function isPointInRotatedRectangle(p, rect) {
        const dx = p.x - rect.cx;
        const dy = p.y - rect.cy;

        const along = dx * rect.ux + dy * rect.uy;
        const across = dx * rect.vx + dy * rect.vy;

        return (
            Math.abs(along) <= rect.halfLength &&
            Math.abs(across) <= rect.halfThickness
        );
    }

    function isPointInAnyRotatedPiece(p, rotatedPieces) {
        for (let i = 0; i < rotatedPieces.length; i++) {
            if (isPointInRotatedRectangle(p, rotatedPieces[i])) {
                return true;
            }
        }

        return false;
    }

    function randomPointInRotatedUnion(region) {
        for (let attempt = 0; attempt < 10000; attempt++) {
            const p = {
                x: region.xMin + region.width * Math.random(),
                y: region.yMin + region.height * Math.random()
            };

            if (isPointInAnyRotatedPiece(p, region.rotatedPieces)) {
                return p;
            }
        }

        const rect = region.rotatedPieces[Math.floor(region.rotatedPieces.length * Math.random())];

        const a = (Math.random() - 0.5) * rect.length;
        const b = (Math.random() - 0.5) * rect.thickness;

        return {
            x: rect.cx + a * rect.ux + b * rect.vx,
            y: rect.cy + a * rect.uy + b * rect.vy
        };
    }

    function randomPointInRegion() {
        const region = getRegionSpec();

        if (region.type === "circle") {
            const r = region.radius * Math.sqrt(Math.random());
            const theta = 2 * Math.PI * Math.random();

            return {
                x: r * Math.cos(theta),
                y: r * Math.sin(theta)
            };
        }

        if (region.type === "xshape") {
            return randomPointInRotatedUnion(region);
        }

        return randomPointFromPieces(region.pieces);
    }

    function generatePoints(n) {
        const newPoints = new Array(n);

        for (let i = 0; i < n; i++) {
            newPoints[i] = randomPointInRegion();
        }

        return newPoints;
    }

    function squaredDistance(p, q) {
        const dx = p.x - q.x;
        const dy = p.y - q.y;

        return dx * dx + dy * dy;
    }

    function intervalWhereCoordinateIsBetween(a, b, low, high) {
        const eps = 1e-10;
        const d = b - a;

        if (Math.abs(d) < eps) {
            if (a > low + eps && a < high - eps) {
                return {
                    left: 0,
                    right: 1
                };
            }

            return null;
        }

        const t1 = (low - a) / d;
        const t2 = (high - a) / d;

        const left = Math.max(0, Math.min(t1, t2));
        const right = Math.min(1, Math.max(t1, t2));

        if (right - left > eps) {
            return {
                left: left,
                right: right
            };
        }

        return null;
    }

    function segmentEntersOpenRectangle(p, q, rect) {
        const eps = 1e-10;

        const xInterval = intervalWhereCoordinateIsBetween(p.x, q.x, rect.xMin, rect.xMax);
        const yInterval = intervalWhereCoordinateIsBetween(p.y, q.y, rect.yMin, rect.yMax);

        if (!xInterval || !yInterval) return false;

        const left = Math.max(xInterval.left, yInterval.left);
        const right = Math.min(xInterval.right, yInterval.right);

        return right - left > eps;
    }

    function clipIntervalForAbsLinear(left, right, valueAtZero, slope, bound) {
        const eps = 1e-10;

        if (Math.abs(slope) < eps) {
            if (Math.abs(valueAtZero) <= bound + eps) {
                return {
                    left: left,
                    right: right
                };
            }

            return null;
        }

        const t1 = (-bound - valueAtZero) / slope;
        const t2 = (bound - valueAtZero) / slope;

        const newLeft = Math.max(left, Math.min(t1, t2));
        const newRight = Math.min(right, Math.max(t1, t2));

        if (newRight + eps < newLeft) {
            return null;
        }

        return {
            left: newLeft,
            right: newRight
        };
    }

    function segmentIntervalInsideRotatedRectangle(p, q, rect) {
        const dx0 = p.x - rect.cx;
        const dy0 = p.y - rect.cy;

        const dqx = q.x - p.x;
        const dqy = q.y - p.y;

        const along0 = dx0 * rect.ux + dy0 * rect.uy;
        const across0 = dx0 * rect.vx + dy0 * rect.vy;

        const alongSlope = dqx * rect.ux + dqy * rect.uy;
        const acrossSlope = dqx * rect.vx + dqy * rect.vy;

        let interval = {
            left: 0,
            right: 1
        };

        interval = clipIntervalForAbsLinear(
            interval.left,
            interval.right,
            along0,
            alongSlope,
            rect.halfLength
        );

        if (!interval) return null;

        interval = clipIntervalForAbsLinear(
            interval.left,
            interval.right,
            across0,
            acrossSlope,
            rect.halfThickness
        );

        return interval;
    }

    function segmentCoveredByRotatedPieces(p, q, rotatedPieces) {
        const intervals = [];

        for (let i = 0; i < rotatedPieces.length; i++) {
            const interval = segmentIntervalInsideRotatedRectangle(p, q, rotatedPieces[i]);

            if (interval) {
                intervals.push(interval);
            }
        }

        if (intervals.length === 0) return false;

        intervals.sort((a, b) => a.left - b.left);

        const eps = 1e-8;
        let coveredRight = 0;

        if (intervals[0].left > eps) return false;

        for (let i = 0; i < intervals.length; i++) {
            if (intervals[i].left > coveredRight + eps) {
                return false;
            }

            if (intervals[i].right > coveredRight) {
                coveredRight = intervals[i].right;
            }

            if (coveredRight >= 1 - eps) {
                return true;
            }
        }

        return coveredRight >= 1 - eps;
    }

    function isAllowedEdge(p, q, region) {
        if (region.isConvex) return true;

        if (region.type === "xshape") {
            return segmentCoveredByRotatedPieces(p, q, region.rotatedPieces);
        }

        for (let i = 0; i < region.blockedRects.length; i++) {
            if (segmentEntersOpenRectangle(p, q, region.blockedRects[i])) {
                return false;
            }
        }

        return true;
    }

    function computeEMST(points, region) {
        const n = points.length;

        if (n <= 1) {
            return {
                edges: [],
                connected: true
            };
        }

        const inTree = new Array(n).fill(false);
        const bestDist = new Array(n).fill(Infinity);
        const bestParent = new Array(n).fill(-1);

        const edges = [];

        bestDist[0] = 0;

        for (let step = 0; step < n; step++) {
            let u = -1;
            let uBest = Infinity;

            for (let i = 0; i < n; i++) {
                if (!inTree[i] && bestDist[i] < uBest) {
                    u = i;
                    uBest = bestDist[i];
                }
            }

            if (u === -1) {
                return {
                    edges: edges,
                    connected: false
                };
            }

            inTree[u] = true;

            if (bestParent[u] !== -1) {
                edges.push({
                    u: bestParent[u],
                    v: u,
                    length: Math.sqrt(bestDist[u])
                });
            }

            for (let v = 0; v < n; v++) {
                if (inTree[v]) continue;
                if (!isAllowedEdge(points[u], points[v], region)) continue;

                const d = squaredDistance(points[u], points[v]);

                if (d < bestDist[v]) {
                    bestDist[v] = d;
                    bestParent[v] = u;
                }
            }
        }

        return {
            edges: edges,
            connected: edges.length === n - 1
        };
    }

    function computeTotalTreeLength(edges) {
        let total = 0;

        for (let i = 0; i < edges.length; i++) {
            total += edges[i].length;
        }

        return total;
    }

    function buildWeightedTreeAdjacency(n, edges) {
        const adj = new Array(n);

        for (let i = 0; i < n; i++) {
            adj[i] = [];
        }

        for (let i = 0; i < edges.length; i++) {
            const edge = edges[i];

            adj[edge.u].push({
                vertex: edge.v,
                length: edge.length
            });

            adj[edge.v].push({
                vertex: edge.u,
                length: edge.length
            });
        }

        return adj;
    }

    function farthestWeightedVertexFrom(start, adj) {
        const n = adj.length;

        const visited = new Array(n).fill(false);
        const distance = new Array(n).fill(0);

        const stack = [start];
        visited[start] = true;

        let farthest = start;
        let farthestDistance = 0;

        while (stack.length > 0) {
            const u = stack.pop();

            if (distance[u] > farthestDistance) {
                farthest = u;
                farthestDistance = distance[u];
            }

            for (let i = 0; i < adj[u].length; i++) {
                const neighbor = adj[u][i];
                const v = neighbor.vertex;

                if (!visited[v]) {
                    visited[v] = true;
                    distance[v] = distance[u] + neighbor.length;
                    stack.push(v);
                }
            }
        }

        return {
            vertex: farthest,
            distance: farthestDistance
        };
    }

    function computeTreeDiameter(n, edges) {
        if (n <= 1) return 0;

        const adj = buildWeightedTreeAdjacency(n, edges);

        const first = farthestWeightedVertexFrom(0, adj);
        const second = farthestWeightedVertexFrom(first.vertex, adj);

        return second.distance;
    }

    function computeDegreeCounts(n, edges) {
        const degrees = new Array(n).fill(0);

        for (let i = 0; i < edges.length; i++) {
            degrees[edges[i].u]++;
            degrees[edges[i].v]++;
        }

        let maxDegree = 0;

        for (let i = 0; i < degrees.length; i++) {
            if (degrees[i] > maxDegree) {
                maxDegree = degrees[i];
            }
        }

        const counts = new Array(maxDegree + 1).fill(0);

        for (let i = 0; i < degrees.length; i++) {
            counts[degrees[i]]++;
        }

        return {
            degrees: degrees,
            counts: counts,
            maxDegree: maxDegree
        };
    }

    function addDegreeCountsToHistory(counts) {
        if (degreeCountsHistory.length < counts.length) {
            for (let d = degreeCountsHistory.length; d < counts.length; d++) {
                degreeCountsHistory[d] = 0;
            }
        }

        for (let d = 0; d < counts.length; d++) {
            degreeCountsHistory[d] += counts[d];
        }
    }

    function computeStats(values) {
        const count = values.length;

        if (count === 0) {
            return {
                count: 0,
                mean: 0,
                variance: 0,
                standardDeviation: 0,
                standardError: 0
            };
        }

        let sum = 0;

        for (let i = 0; i < count; i++) {
            sum += values[i];
        }

        const mean = sum / count;

        if (count === 1) {
            return {
                count: count,
                mean: mean,
                variance: 0,
                standardDeviation: 0,
                standardError: 0
            };
        }

        let squaredErrorSum = 0;

        for (let i = 0; i < count; i++) {
            const error = values[i] - mean;
            squaredErrorSum += error * error;
        }

        const variance = squaredErrorSum / (count - 1);
        const standardDeviation = Math.sqrt(variance);
        const standardError = standardDeviation / Math.sqrt(count);

        return {
            count: count,
            mean: mean,
            variance: variance,
            standardDeviation: standardDeviation,
            standardError: standardError
        };
    }

    function computeDegreeDistributionRows() {
        const trialCount = degreeDistributionHistory.length;

        if (trialCount === 0) return [];

        let maxObservedDegree = 1;

        for (let i = 0; i < degreeDistributionHistory.length; i++) {
            maxObservedDegree = Math.max(maxObservedDegree, degreeDistributionHistory[i].length - 1);
        }

        while (maxObservedDegree > 1) {
            let totalAtDegree = 0;

            for (let i = 0; i < degreeDistributionHistory.length; i++) {
                totalAtDegree += degreeDistributionHistory[i][maxObservedDegree] || 0;
            }

            if (totalAtDegree > 0) break;

            maxObservedDegree--;
        }

        const rows = [];

        for (let degree = 1; degree <= maxObservedDegree; degree++) {
            let totalCount = 0;

            for (let i = 0; i < degreeDistributionHistory.length; i++) {
                totalCount += degreeDistributionHistory[i][degree] || 0;
            }

            const estimate = totalCount / (trialCount * pointCount);

            let standardError = 0;

            if (trialCount > 1) {
                let squaredErrorSum = 0;

                for (let i = 0; i < degreeDistributionHistory.length; i++) {
                    const trialProportion = (degreeDistributionHistory[i][degree] || 0) / pointCount;
                    const error = trialProportion - estimate;
                    squaredErrorSum += error * error;
                }

                const sampleVariance = squaredErrorSum / (trialCount - 1);
                standardError = Math.sqrt(sampleVariance / trialCount);
            }

            rows.push({
                degree: degree,
                count: totalCount,
                estimate: estimate,
                standardError: standardError
            });
        }

        return rows;
    }

    function generateOneTreeAndRecordStats() {
        const region = getRegionSpec();
        const maxAttempts = (!region.isConvex) ? 200 : 1;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const candidatePoints = generatePoints(pointCount);
            const result = computeEMST(candidatePoints, region);

            if (result.connected) {
                points = candidatePoints;
                mstEdges = result.edges;

                currentTotalLength = computeTotalTreeLength(mstEdges);
                totalLengthHistory.push(currentTotalLength);

                currentDiameter = computeTreeDiameter(pointCount, mstEdges);
                diameterHistory.push(currentDiameter);

                const degreeData = computeDegreeCounts(pointCount, mstEdges);

                currentMaxDegree = degreeData.maxDegree;
                currentDegreeCounts = degreeData.counts;

                const leafCount = currentDegreeCounts[1] || 0;
                currentLeafFrequency = leafCount / pointCount;

                maxDegreeHistory.push(currentMaxDegree);
                leafFrequencyHistory.push(currentLeafFrequency);

                addDegreeCountsToHistory(currentDegreeCounts);
                degreeDistributionHistory.push(currentDegreeCounts.slice());

                return true;
            }
        }

        points = generatePoints(pointCount);
        mstEdges = [];

        currentTotalLength = null;
        currentDiameter = null;
        currentMaxDegree = null;
        currentLeafFrequency = null;
        currentDegreeCounts = [];

        return false;
    }

    function stopSimulationWithButtonText(text) {
        isRunning = false;
        lastTimeMs = null;
        trialAccumulator = 0;
        startPauseButton.textContent = text;
    }

    function resetSimulation() {
        stopSimulationWithButtonText("Start");

        updatePointCountInput();

        totalLengthHistory = [];
        diameterHistory = [];
        maxDegreeHistory = [];
        leafFrequencyHistory = [];
        degreeCountsHistory = [];
        degreeDistributionHistory = [];

        currentTotalLength = null;
        currentDiameter = null;
        currentMaxDegree = null;
        currentLeafFrequency = null;
        currentDegreeCounts = [];

        mstEdges = [];

        generateOneTreeAndRecordStats();

        renderAll();
    }

    function startSimulation() {
        if (isRunning) return;

        if (diameterHistory.length >= getTrialCount()) {
            resetSimulation();
        }

        isRunning = true;
        startPauseButton.textContent = "Pause";
        requestAnimationFrame(tick);
    }

    function pauseSimulation() {
        stopSimulationWithButtonText("Resume");
    }

    function tick(timestampMs) {
        if (!isRunning) return;

        if (lastTimeMs === null) {
            lastTimeMs = timestampMs;
        }

        const dt = (timestampMs - lastTimeMs) / 1000;
        lastTimeMs = timestampMs;

        const speed = getSimulationSpeed();
        const selectedTrials = getTrialCount();

        trialAccumulator += speed * dt;

        let attemptedThisFrame = 0;
        let changedThisFrame = false;
        const maxAttemptsPerFrame = 25;

        while (
            trialAccumulator >= 1 &&
            diameterHistory.length < selectedTrials &&
            attemptedThisFrame < maxAttemptsPerFrame
        ) {
            trialAccumulator -= 1;

            const success = generateOneTreeAndRecordStats();

            attemptedThisFrame++;

            if (success) {
                changedThisFrame = true;
            }
        }

        if (changedThisFrame) {
            renderAll();
        }

        if (diameterHistory.length >= selectedTrials) {
            stopSimulationWithButtonText("Start");
            renderAll();
            return;
        }

        requestAnimationFrame(tick);
    }

    function getEMSTLayout() {
        const w = emstCanvas.width;
        const h = emstCanvas.height;

        const drawingAreaWidth = 600;
        const statsLeft = 630;
        const statsRight = w - 30;

        return {
            drawingArea: {
                left: 42,
                right: drawingAreaWidth - 42,
                top: 42,
                bottom: h - 42,
                width: drawingAreaWidth - 84,
                height: h - 84
            },
            stats: {
                left: statsLeft,
                right: statsRight,
                top: 44,
                bottom: h - 44
            }
        };
    }

    function getRegionDrawingBounds(drawingArea, region) {
        const scale = Math.min(
            drawingArea.width / region.width,
            drawingArea.height / region.height
        );

        const width = region.width * scale;
        const height = region.height * scale;

        const left = drawingArea.left + (drawingArea.width - width) / 2;
        const top = drawingArea.top + (drawingArea.height - height) / 2;

        return {
            left: left,
            right: left + width,
            top: top,
            bottom: top + height,
            width: width,
            height: height,
            scale: scale
        };
    }

    function pointToCanvas(p, bounds, region) {
        return {
            x: bounds.left + ((p.x - region.xMin) / region.width) * bounds.width,
            y: bounds.bottom - ((p.y - region.yMin) / region.height) * bounds.height
        };
    }

    function drawPolygon(ctx, points) {
        if (points.length === 0) return;

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }

        ctx.closePath();
    }

    function drawBlockedRectangle(bounds, region, rect) {
        const topLeft = pointToCanvas({
            x: rect.xMin,
            y: rect.yMax
        }, bounds, region);

        const bottomRight = pointToCanvas({
            x: rect.xMax,
            y: rect.yMin
        }, bounds, region);

        emstCtx.fillRect(
            topLeft.x,
            topLeft.y,
            bottomRight.x - topLeft.x,
            bottomRight.y - topLeft.y
        );
    }

    function drawSamplingRegion(bounds, region) {
        emstCtx.lineWidth = 1.5;

        if (region.type === "circle") {
            const center = pointToCanvas({ x: 0, y: 0 }, bounds, region);

            emstCtx.fillStyle = "rgba(0,0,0,0.025)";
            emstCtx.strokeStyle = "rgba(0,0,0,0.45)";

            emstCtx.beginPath();
            emstCtx.arc(center.x, center.y, region.radius * bounds.scale, 0, 2 * Math.PI);
            emstCtx.fill();
            emstCtx.stroke();

        } else if (region.type === "xshape") {
            emstCtx.fillStyle = "rgba(0,0,0,0.025)";
            emstCtx.strokeStyle = "rgba(0,0,0,0.55)";

            for (let i = 0; i < region.rotatedPieces.length; i++) {
                const canvasCorners = [];

                for (let j = 0; j < region.rotatedPieces[i].corners.length; j++) {
                    canvasCorners.push(pointToCanvas(region.rotatedPieces[i].corners[j], bounds, region));
                }

                drawPolygon(emstCtx, canvasCorners);
                emstCtx.fill();

                drawPolygon(emstCtx, canvasCorners);
                emstCtx.stroke();
            }

        } else {
            const canvasOutline = [];

            for (let i = 0; i < region.outline.length; i++) {
                canvasOutline.push(pointToCanvas(region.outline[i], bounds, region));
            }

            emstCtx.fillStyle = "rgba(0,0,0,0.025)";
            drawPolygon(emstCtx, canvasOutline);
            emstCtx.fill();

            emstCtx.fillStyle = "rgba(0,0,0,0.06)";

            for (let i = 0; i < region.blockedRects.length; i++) {
                drawBlockedRectangle(bounds, region, region.blockedRects[i]);
            }

            emstCtx.strokeStyle = "rgba(0,0,0,0.55)";
            drawPolygon(emstCtx, canvasOutline);
            emstCtx.stroke();
        }

        emstCtx.fillStyle = "rgba(0,0,0,0.8)";
        emstCtx.font = "14px system-ui";
        emstCtx.textAlign = "center";

        emstCtx.fillText(region.label, (bounds.left + bounds.right) / 2, bounds.top - 14);
    }

    function drawMSTEdges(bounds, region) {
        emstCtx.strokeStyle = "rgba(220, 38, 38, 0.9)";
        emstCtx.lineWidth = 2;

        emstCtx.beginPath();

        for (let i = 0; i < mstEdges.length; i++) {
            const edge = mstEdges[i];

            const p = pointToCanvas(points[edge.u], bounds, region);
            const q = pointToCanvas(points[edge.v], bounds, region);

            emstCtx.moveTo(p.x, p.y);
            emstCtx.lineTo(q.x, q.y);
        }

        emstCtx.stroke();
    }

    function drawPoints(bounds, region) {
        const radius = 4;

        emstCtx.fillStyle = "rgba(0,0,0,0.85)";
        emstCtx.strokeStyle = "white";
        emstCtx.lineWidth = 1.25;

        for (let i = 0; i < points.length; i++) {
            const q = pointToCanvas(points[i], bounds, region);

            emstCtx.beginPath();
            emstCtx.arc(q.x, q.y, radius, 0, 2 * Math.PI);
            emstCtx.fill();
            emstCtx.stroke();
        }
    }

    function percentText(value) {
        if (value === null) return "—";

        return (100 * value).toFixed(2) + "%";
    }

    function drawStatsPanel(bounds) {
        const totalLengthStats = computeStats(totalLengthHistory);
        const diameterStats = computeStats(diameterHistory);
        const maxDegreeStats = computeStats(maxDegreeHistory);
        const leafFrequencyStats = computeStats(leafFrequencyHistory);
        const region = getRegionSpec();

        const x = bounds.left;
        let y = bounds.top;

        emstCtx.fillStyle = "rgba(0,0,0,0.9)";
        emstCtx.font = "700 18px system-ui";
        emstCtx.textAlign = "left";

        emstCtx.fillText("Tree Statistics", x, y);

        y += 30;

        emstCtx.font = "14px system-ui";
        emstCtx.fillStyle = "rgba(0,0,0,0.78)";

        emstCtx.fillText("Region: " + region.displayLabel, x, y);
        y += 22;

        emstCtx.fillText("Points: " + pointCount, x, y);
        y += 22;

        emstCtx.fillText("Trial: " + diameterStats.count + " / " + getTrialCount(), x, y);
        y += 26;

        const totalLengthText = (currentTotalLength === null)
            ? "—"
            : currentTotalLength.toFixed(4);

        emstCtx.fillText("Current total len: " + totalLengthText, x, y);
        y += 22;

        emstCtx.fillText(
            "Avg total len: " + totalLengthStats.mean.toFixed(4) + " ± " + totalLengthStats.standardError.toFixed(4),
            x,
            y
        );
        y += 26;

        const diameterText = (currentDiameter === null)
            ? "—"
            : currentDiameter.toFixed(4);

        emstCtx.fillText("Current diameter: " + diameterText, x, y);
        y += 22;

        emstCtx.fillText(
            "Avg diameter: " + diameterStats.mean.toFixed(4) + " ± " + diameterStats.standardError.toFixed(4),
            x,
            y
        );
        y += 26;

        const maxDegreeText = (currentMaxDegree === null)
            ? "—"
            : String(currentMaxDegree);

        emstCtx.fillText("Current max deg: " + maxDegreeText, x, y);
        y += 22;

        emstCtx.fillText(
            "Avg max deg: " + maxDegreeStats.mean.toFixed(4) + " ± " + maxDegreeStats.standardError.toFixed(4),
            x,
            y
        );
        y += 26;

        emstCtx.fillText("Current leaf freq: " + percentText(currentLeafFrequency), x, y);
        y += 22;

        emstCtx.fillText(
            "Avg leaf freq: " + percentText(leafFrequencyStats.mean) + " ± " + (100 * leafFrequencyStats.standardError).toFixed(2) + "%",
            x,
            y
        );

        y += 30;

        emstCtx.strokeStyle = "rgba(0,0,0,0.18)";
        emstCtx.lineWidth = 1;

        emstCtx.beginPath();
        emstCtx.moveTo(x, y);
        emstCtx.lineTo(bounds.right, y);
        emstCtx.stroke();

        y += 24;

        emstCtx.fillStyle = "rgba(0,0,0,0.58)";
        emstCtx.font = "13px system-ui";

        if (!region.isConvex) {
            emstCtx.fillText("For nonconvex regions, tree edges", x, y);
            y += 18;

            emstCtx.fillText("must stay inside the region.", x, y);
            y += 18;

            emstCtx.fillText("All regions have area 1.", x, y);
        } else {
            emstCtx.fillText("All regions have area 1.", x, y);
            y += 18;

            emstCtx.fillText("Lengths use Euclidean", x, y);
            y += 18;

            emstCtx.fillText("edge lengths.", x, y);
        }
    }

    function renderEMSTPanel() {
        const w = emstCanvas.width;
        const h = emstCanvas.height;

        emstCtx.clearRect(0, 0, w, h);

        const layout = getEMSTLayout();
        const region = getRegionSpec();
        const drawingBounds = getRegionDrawingBounds(layout.drawingArea, region);

        drawSamplingRegion(drawingBounds, region);
        drawMSTEdges(drawingBounds, region);
        drawPoints(drawingBounds, region);
        drawStatsPanel(layout.stats);
    }

    function drawContinuousHistogramAxes(ctx, canvas, padL, padR, padT, padB, xLabel) {
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        const xLeft = padL;
        const xRight = w - padR;
        const yTop = padT;
        const yBottom = h - padB;

        ctx.strokeStyle = "rgba(0,0,0,0.45)";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(xLeft, yTop);
        ctx.lineTo(xLeft, yBottom);
        ctx.lineTo(xRight, yBottom);
        ctx.stroke();

        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.font = "14px system-ui";

        const xCenter = (xLeft + xRight) / 2;

        ctx.textAlign = "center";
        ctx.fillText(xLabel, xCenter, h - 10);

        ctx.save();
        ctx.translate(xLeft - 40, (yTop + yBottom) / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = "center";
        ctx.fillText("frequency", 0, 0);
        ctx.restore();

        return {
            xLeft: xLeft,
            xRight: xRight,
            yTop: yTop,
            yBottom: yBottom
        };
    }

    function drawContinuousHistogramBars(ctx, axes, values, binCount) {
        if (values.length === 0) return null;

        let minValue = values[0];
        let maxValue = values[0];

        for (let i = 1; i < values.length; i++) {
            const value = values[i];

            if (value < minValue) minValue = value;
            if (value > maxValue) maxValue = value;
        }

        if (minValue === maxValue) {
            minValue = Math.max(0, minValue - 0.5);
            maxValue = maxValue + 0.5;
        }

        const bins = new Array(binCount).fill(0);
        const range = maxValue - minValue;

        for (let i = 0; i < values.length; i++) {
            const value = values[i];

            let b = Math.floor(((value - minValue) / range) * binCount);

            if (b < 0) b = 0;
            if (b >= binCount) b = binCount - 1;

            bins[b]++;
        }

        let maxFrequency = 1;

        for (let i = 0; i < bins.length; i++) {
            if (bins[i] > maxFrequency) {
                maxFrequency = bins[i];
            }
        }

        const W = axes.xRight - axes.xLeft;
        const H = axes.yBottom - axes.yTop;

        ctx.fillStyle = "rgba(0,0,0,0.85)";

        for (let b = 0; b < binCount; b++) {
            const barHeight = (bins[b] / maxFrequency) * H;
            const x0 = axes.xLeft + (b / binCount) * W;
            const x1 = axes.xLeft + ((b + 1) / binCount) * W;
            const y = axes.yBottom - barHeight;

            ctx.fillRect(x0, y, Math.max(1, x1 - x0 - 1), barHeight);
        }

        return {
            minValue: minValue,
            maxValue: maxValue
        };
    }

    function drawContinuousHistogramTicks(ctx, axes, minValue, maxValue) {
        const tickCount = 5;
        const W = axes.xRight - axes.xLeft;

        ctx.strokeStyle = "rgba(0,0,0,0.25)";
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.lineWidth = 1;
        ctx.font = "12px system-ui";
        ctx.textAlign = "center";

        for (let i = 0; i <= tickCount; i++) {
            const t = i / tickCount;
            const value = minValue + t * (maxValue - minValue);
            const x = axes.xLeft + t * W;

            ctx.beginPath();
            ctx.moveTo(x, axes.yBottom);
            ctx.lineTo(x, axes.yBottom + 6);
            ctx.stroke();

            ctx.fillText(value.toFixed(2), x, axes.yBottom + 20);
        }
    }

    function renderContinuousHistogramPanel(canvas, ctx, values, xLabel) {
        const padL = 60;
        const padR = 20;
        const padT = 24;
        const padB = 44;

        const axes = drawContinuousHistogramAxes(ctx, canvas, padL, padR, padT, padB, xLabel);
        const range = drawContinuousHistogramBars(ctx, axes, values, 30);

        if (range) {
            drawContinuousHistogramTicks(ctx, axes, range.minValue, range.maxValue);
        }
    }

    function renderTotalLengthPanel() {
        renderContinuousHistogramPanel(
            totalLengthCanvas,
            totalLengthCtx,
            totalLengthHistory,
            "total length"
        );
    }

    function renderDiameterPanel() {
        renderContinuousHistogramPanel(
            weightedDiameterCanvas,
            weightedDiameterCtx,
            diameterHistory,
            "diameter"
        );
    }

    function drawDegreeDistributionAxes(axes) {
        degreeDistributionCtx.strokeStyle = "rgba(0,0,0,0.45)";
        degreeDistributionCtx.lineWidth = 1;

        degreeDistributionCtx.beginPath();
        degreeDistributionCtx.moveTo(axes.xLeft, axes.yTop);
        degreeDistributionCtx.lineTo(axes.xLeft, axes.yBottom);
        degreeDistributionCtx.lineTo(axes.xRight, axes.yBottom);
        degreeDistributionCtx.stroke();

        degreeDistributionCtx.fillStyle = "rgba(0,0,0,0.8)";
        degreeDistributionCtx.font = "14px system-ui";

        degreeDistributionCtx.textAlign = "center";
        degreeDistributionCtx.fillText(
            "degree",
            (axes.xLeft + axes.xRight) / 2,
            degreeDistributionCanvas.height - 10
        );

        degreeDistributionCtx.save();
        degreeDistributionCtx.translate(axes.xLeft - 42, (axes.yTop + axes.yBottom) / 2);
        degreeDistributionCtx.rotate(-Math.PI / 2);
        degreeDistributionCtx.textAlign = "center";
        degreeDistributionCtx.fillText("relative frequency", 0, 0);
        degreeDistributionCtx.restore();
    }

    function drawDegreeDistributionBars(axes, rows) {
        if (rows.length === 0) return;

        let maxEstimate = 0;
        let maxDegree = 1;

        for (let i = 0; i < rows.length; i++) {
            if (rows[i].estimate > maxEstimate) {
                maxEstimate = rows[i].estimate;
            }

            if (rows[i].degree > maxDegree) {
                maxDegree = rows[i].degree;
            }
        }

        if (maxEstimate <= 0) maxEstimate = 1;

        const W = axes.xRight - axes.xLeft;
        const H = axes.yBottom - axes.yTop;

        degreeDistributionCtx.fillStyle = "rgba(0,0,0,0.85)";

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

            const barHeight = (row.estimate / maxEstimate) * H;
            const x0 = axes.xLeft + ((row.degree - 1) / maxDegree) * W;
            const x1 = axes.xLeft + (row.degree / maxDegree) * W;
            const y = axes.yBottom - barHeight;

            degreeDistributionCtx.fillRect(x0, y, Math.max(1, x1 - x0 - 1), barHeight);
        }
    }

    function drawDegreeDistributionTicks(axes, rows) {
        if (rows.length === 0) return;

        let maxDegree = 1;

        for (let i = 0; i < rows.length; i++) {
            if (rows[i].degree > maxDegree) {
                maxDegree = rows[i].degree;
            }
        }

        const W = axes.xRight - axes.xLeft;

        degreeDistributionCtx.strokeStyle = "rgba(0,0,0,0.25)";
        degreeDistributionCtx.fillStyle = "rgba(0,0,0,0.7)";
        degreeDistributionCtx.lineWidth = 1;
        degreeDistributionCtx.font = "12px system-ui";
        degreeDistributionCtx.textAlign = "center";

        for (let d = 1; d <= maxDegree; d++) {
            const x = axes.xLeft + ((d - 0.5) / maxDegree) * W;

            degreeDistributionCtx.beginPath();
            degreeDistributionCtx.moveTo(x, axes.yBottom);
            degreeDistributionCtx.lineTo(x, axes.yBottom + 6);
            degreeDistributionCtx.stroke();

            degreeDistributionCtx.fillText(String(d), x, axes.yBottom + 20);
        }
    }

    function drawDegreeDistributionTable(tableBounds, rows) {
        const ctx = degreeDistributionCtx;

        const left = tableBounds.left;
        const right = tableBounds.right;
        const top = tableBounds.top;
        const width = right - left;

        ctx.fillStyle = "rgba(0,0,0,0.9)";
        ctx.font = "700 15px system-ui";
        ctx.textAlign = "left";

        ctx.fillText("Degree table", left, top);

        ctx.fillStyle = "rgba(0,0,0,0.58)";
        ctx.font = "12px system-ui";

        const trialCount = degreeDistributionHistory.length;
        const totalVertices = trialCount * pointCount;

        ctx.fillText("SE from trial-to-trial variation", left, top + 19);
        ctx.fillText("Trials: " + trialCount + ", vertices: " + totalVertices, left, top + 37);

        let y = top + 64;

        ctx.strokeStyle = "rgba(0,0,0,0.20)";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(left, y - 18);
        ctx.lineTo(right, y - 18);
        ctx.stroke();

        ctx.fillStyle = "rgba(0,0,0,0.78)";
        ctx.font = "700 12px system-ui";

        const degreeX = left;
        const estimateX = left + width * 0.28;
        const seX = left + width * 0.66;

        ctx.textAlign = "left";
        ctx.fillText("deg", degreeX, y);
        ctx.fillText("estimate", estimateX, y);
        ctx.fillText("SE", seX, y);

        y += 8;

        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(right, y);
        ctx.stroke();

        y += 18;

        ctx.font = "12px system-ui";
        ctx.fillStyle = "rgba(0,0,0,0.82)";

        const rowHeight = 21;
        const maxRows = Math.floor((tableBounds.bottom - y) / rowHeight);

        for (let i = 0; i < rows.length && i < maxRows; i++) {
            const row = rows[i];

            ctx.fillText(String(row.degree), degreeX, y);
            ctx.fillText(row.estimate.toFixed(4), estimateX, y);
            ctx.fillText(row.standardError.toFixed(4), seX, y);

            y += rowHeight;
        }

        if (rows.length > maxRows) {
            ctx.fillStyle = "rgba(0,0,0,0.55)";
            ctx.fillText("…", degreeX, y);
        }
    }

    function renderDegreeDistributionPanel() {
        const w = degreeDistributionCanvas.width;
        const h = degreeDistributionCanvas.height;

        degreeDistributionCtx.clearRect(0, 0, w, h);

        const rows = computeDegreeDistributionRows();

        const tableWidth = 300;
        const gap = 28;

        const axes = {
            xLeft: 60,
            xRight: w - 20 - tableWidth - gap,
            yTop: 24,
            yBottom: h - 44
        };

        const tableBounds = {
            left: axes.xRight + gap,
            right: w - 20,
            top: 30,
            bottom: h - 20
        };

        drawDegreeDistributionAxes(axes);
        drawDegreeDistributionBars(axes, rows);
        drawDegreeDistributionTicks(axes, rows);
        drawDegreeDistributionTable(tableBounds, rows);
    }

    function renderAll() {
        renderEMSTPanel();
        renderTotalLengthPanel();
        renderDiameterPanel();
        renderDegreeDistributionPanel();
    }

    pointCountInput.addEventListener("change", () => {
        setPointCountFromInput();
    });

    pointCountInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            pointCountInput.blur();
        }
    });

    trialCountInput.addEventListener("change", () => {
        resetSimulation();
    });

    speedSelect.addEventListener("change", () => {
        // Speed changes live while the simulation is running.
    });

    regionSelect.addEventListener("change", () => {
        resetSimulation();
    });

    resetButton.addEventListener("click", () => {
        resetSimulation();
    });

    startPauseButton.addEventListener("click", () => {
        if (isRunning) {
            pauseSimulation();
        } else {
            startSimulation();
        }
    });

    resetSimulation();

})();