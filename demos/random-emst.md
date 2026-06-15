---
title: Random EMST
parent: Demos
nav_order: 5
---

# Random Euclidean Minimum Spanning Tree Statistics

<div id="randomEMSTDemo">
    <div class="controls">
        <label>
            <div class="row">
                <span>Number of Points</span>
            </div>
            <input id="pointCountInput" type="number" min="5" max="500" step="5" value="50">
        </label>
        <label>
            <div class="row">
                <span>Number of Trials</span>
            </div>
            <select id="trialCountInput">
                <option value="10">10</option>
                <option value="100" selected>100</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
                <option value="10000">10000</option>
            </select>
        </label>
        <label>
            <div class="row">
                <span>Simulation Speed</span>
            </div>
            <select id="speedSelect">
                <option value="2">Slow</option>
                <option value="10" selected>Medium</option>
                <option value="30">Fast</option>
                <option value="100">Very Fast</option>
            </select>
        </label>
        <label>
            <div class="row">
                <span>Sampling Region</span>
            </div>
            <select id="regionSelect">
                <option value="square" selected>Unit Square</option>
                <option value="circle">Unit Circle</option>
                <option value="rectangle">2 × 1 Rectangle</option>
                <option value="hshape">H-Shape</option>
                <option value="eshape">E-Shape</option>
                <option value="xshape">X-Shape</option>
                <option value="cshape">C-Shape</option>
                <option value="ishape">I-Shape</option>
                <option value="lshape">L-Shape</option>
            </select>
        </label>
        <button id="resetButton" type="button">Reset</button>
        <button id="startPauseButton" type="button">Start</button>
    </div>
    <div class="panels">
        <div class="panel">
            <div class="panelTitle">Euclidean Minimum Spanning Tree</div>
            <canvas id="emstCanvas" width="900" height="520"></canvas>
        </div>
        <div class="panel">
            <div class="panelTitle">Distribution of Total Tree Lengths</div>
            <canvas id="totalLengthCanvas" width="900" height="300"></canvas>
        </div>
        <div class="panel">
            <div class="panelTitle">Distribution of Tree Diameters</div>
            <canvas id="weightedDiameterCanvas" width="900" height="300"></canvas>
        </div>
        <div class="panel">
            <div class="panelTitle">Empirical Degree Distribution</div>
            <canvas id="degreeDistributionCanvas" width="900" height="300"></canvas>
        </div>
    </div>
</div>

<style>
#randomEMSTDemo {
    margin-top: 1rem;
}

#randomEMSTDemo .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: flex-end;
    margin-bottom: 12px;
}

#randomEMSTDemo label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 14px;
    min-width: 220px;
}

#randomEMSTDemo .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#randomEMSTDemo input {
    padding: 9px 10px;
    font: inherit;
}

#randomEMSTDemo button {
    padding: 10px 14px;
    font-weight: 700;
    cursor: pointer;
}

#randomEMSTDemo select {
    padding: 9px 10px;
}

#randomEMSTDemo .panels {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

#randomEMSTDemo .panel {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 10px;
    padding: 10px;
}

#randomEMSTDemo .panelTitle {
    font-weight: 700;
    margin-bottom: 8px;
}

#randomEMSTDemo canvas {
    width: 100%;
    height: auto;
    display: block;
}
</style>

<script defer src="/assets/demos/random-emst.js?v=11"></script>

## What the Simulation Shows

This simulation samples $n$ random points uniformly from a planar region of area $1$ and builds a **Euclidean minimum spanning tree** on those points.
A spanning tree is a connected graph that uses all of the sampled points as vertices and contains no cycles.
Among all possible spanning trees, the Euclidean minimum spanning tree, or **EMST**, is the one whose total Euclidean edge length is as small as possible.
The simulation uses an implicit form of Prim's algorithm to construct the EMST.
The main statistics considered are related to the following quantities:

- The **total length** of the EMST is the sum of all the edge weights.
- The **diameter** of the EMST is the length of the longest path with respect to the edge weights.
- The **leaf frequency** of the EMST is the proportion of vertices of degree 1.
- The **degree distribution** of the EMST is the proportion of vertices of each degree plotted on a histogram.

The simulation repeats this experiment many times.
Each trial produces a new random point set, a new tree, and new values for the tree statistics.
For convex regions, every straight-line edge between two sampled points lies inside the region, so all Euclidean edges are allowed.
For nonconvex regions, an edge is allowed only when the straight segment connecting its two endpoints stays inside the sampling region.
This lets the tree respect the geometry of regions with holes, corners, or narrow corridors.