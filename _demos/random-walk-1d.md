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
            </div>
            <select id="stepsInput">
                <option value="25" selected>25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="400">400</option>
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
                <option value="500">500</option>
                <option value="1000">1000</option>
                <option value="2000">2000</option>
            </select>
        </label>

        <label>
            <div class="row">
                <span>Simulation Speed</span>
            </div>
            <select id="speedSelect">
                <option value="10">Slow</option>
                <option value="20" selected>Medium</option>
                <option value="40">Fast</option>
            </select>
        </label>

        <label>
            <div class="row">
                <span>Show Histogram</span>
            </div>
            <input id="showHistogram" type="checkbox" checked>
        </label>

        <label class="wide">
            <div class="row">
                <span>Current Step</span>
                <span id="currentStepLabel">0</span>
            </div>
            <input id="currentStep" type="range" min="0" max="200" step="1" value="0">
        </label>

        <button id="restartButton">Restart</button>
        <button id="playPauseButton">Play</button>
    </div>

    <div class="panels">
        <div class="panel">
            <div class="panelTitle">Walks (up to current step)</div>
            <canvas id="walkCanvas" width="900" height="420"></canvas>
        </div>

        <div class="panel">
            <div class="panelTitle">Histogram of positions at current step</div>
            <canvas id="histCanvas" width="900" height="300"></canvas>
        </div>
    </div>
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

#randomWalk1D label.wide {
    min-width: 320px;
    flex: 1 1 320px;
}

#randomWalk1D .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#randomWalk1D button {
    padding: 10px 14px;
    font-weight: 700;
    cursor: pointer;
}

#randomWalk1D .panels {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

#randomWalk1D .panel {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 10px;
    padding: 10px;
}

#randomWalk1D .panelTitle {
    font-weight: 700;
    margin-bottom: 8px;
}

#randomWalk1D canvas {
    width: 100%;
    height: auto;
    display: block;
}
</style>

<script defer src="/assets/demos/random-walk-1d.js?v=3"></script>