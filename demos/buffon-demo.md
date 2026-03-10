---
title: Buffon and Barbier
parent: Demos
nav_order: 3
---

# Buffon Geometric Probability Demo

<div id="buffonDemo">
    <div class="controls">

        <label>
            <div class="row">
                <span>Shape Type</span>
            </div>
            <select id="shapeType">
                <option value="segment" selected>Line Segment</option>
                <option value="square">Square</option>
                <option value="circle">Circle</option>
            </select>
        </label>

        <label>
            <div class="row">
                <span>Shape Size</span>
            </div>
            <select id="sizeInput">
                <option value="30">30</option>
                <option value="40" selected>40</option>
                <option value="50">50</option>
                <option value="60">60</option>
            </select>
        </label>

        <label>
            <div class="row">
                <span>Total Throws</span>
            </div>
            <select id="throwsInput">
                <option value="10">10</option>
                <option value="50">50</option>
                <option value="100" selected>100</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
                <option value="2000">2000</option>
            </select>
        </label>

        <label>
            <div class="row">
                <span>Grid Type</span>
            </div>
            <select id="gridType">
                <option value="horizontal" selected>Horizontal Lines</option>
                <option value="vertical">Vertical Lines</option>
                <option value="grid">Rectangular Grid</option>
                <option value="circles">Concentric Circles</option>
            </select>
        </label>

        <label>
            <div class="row">
                <span>Grid Spacing</span>
            </div>
            <select id="spacingInput">
                <option value="40" selected>40</option>
                <option value="60">60</option>
                <option value="80">80</option>
            </select>
        </label>


        <label>
            <div class="row">
                <span>Simulation Speed</span>
            </div>
            <select id="speedSelect">
                <option value="10">Slow</option>
                <option value="30" selected>Medium</option>
                <option value="80">Fast</option>
            </select>
        </label>

        <label class="wide">
            <div class="row">
                <span>Current Throw</span>
                <span id="currentThrowLabel">0</span>
            </div>
            <input id="currentThrow" type="range" min="0" max="100" step="1" value="0">
        </label>

        <button id="restartButton">Restart</button>
        <button id="playPauseButton">Play</button>

    </div>

    <div class="panels">

        <div class="panel">
            <div class="panelTitle">Random Tosses</div>
            <canvas id="tossCanvas" width="900" height="420"></canvas>
        </div>

        <div class="panel">
            <div class="panelTitle">Crossing Statistics</div>
            <canvas id="statsCanvas" width="900" height="300"></canvas>
        </div>

    </div>
</div>

<style>
#buffonDemo {
    margin-top: 1rem;
}

#buffonDemo .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: flex-end;
    margin-bottom: 12px;
}

#buffonDemo label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 14px;
    min-width: 220px;
}

#buffonDemo label.wide {
    min-width: 320px;
    flex: 1 1 320px;
}

#buffonDemo .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#buffonDemo button {
    padding: 10px 14px;
    font-weight: 700;
    cursor: pointer;
}

#buffonDemo .panels {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

#buffonDemo .panel {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 10px;
    padding: 10px;
}

#buffonDemo .panelTitle {
    font-weight: 700;
    margin-bottom: 8px;
}

#buffonDemo canvas {
    width: 100%;
    height: auto;
    display: block;
}
</style>

<script defer src="/assets/demos/buffon-demo.js"></script>