---
title: Random Walk 1D
parent: Demos
nav_order: 1
---

# Random Walk (1D)

<div id="randomWalk1D">
    <div class="controls">

        <label>
            <div class="row">
                <span>Total Steps</span>
                <span id="stepsLabel" class="pill">200</span>
            </div>
            <select id="stepsInput">
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200" selected>200</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
            </select>
        </label>

        <label>
            <div class="row">
                <span>Number of Walks</span>
            </div>
            <select id="walkCount">
                <option value="1" selected>1</option>
                <option value="10">10</option>
                <option value="100">100</option>
                <option value="1000">1000</option>
            </select>
        </label>

        <button id="drawButton">Draw</button>

    </div>

    <canvas id="canvas" width="900" height="420"></canvas>
</div>

<style>
#randomWalk1D {
    margin-top: 1rem;
}

#randomWalk1D .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: flex-end;
    margin-bottom: 12px;
}

#randomWalk1D label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 14px;
    min-width: 220px;
}

#randomWalk1D .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#randomWalk1D .pill {
    padding: 2px 10px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 999px;
    font-variant-numeric: tabular-nums;
}

#randomWalk1D button {
    padding: 10px 14px;
    font-weight: 700;
    cursor: pointer;
}

#randomWalk1D canvas {
    width: 100%;
    height: auto;
    display: block;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 10px;
}
</style>

<script defer src="/assets/demos/random-walk-1d.js"></script>