---
title: Disease Spread 
parent: Demos
nav_order: 3
---

# Disease Spread

<div id="diseaseSpreadDemo">
    <div class="controls">
        <label>
            <div class="row">
                <span>Number of Agents</span>
            </div>
            <select id="agentCountInput">
                <option value="500" selected>500</option>
                <option value="1000">1000</option>
                <option value="2000">2000</option>
            </select>
        </label>
        <label>
            <div class="row">
                <span>Movement Speed</span>
            </div>
            <select id="moveSpeedInput">
                <option value="0.6">Slow</option>
                <option value="1.2" selected>Medium</option>
                <option value="2.0">Fast</option>
            </select>
        </label>
        <label>
            <div class="row">
                <span>Transmission Probability</span>
            </div>
            <select id="transmissionProbInput">
                <option value="0.2">0.2</option>
                <option value="0.4" selected>0.4</option>
                <option value="0.6">0.6</option>
                <option value="0.8">0.8</option>
                <option value="1">1.0</option>
            </select>
        </label>
        <label>
            <div class="row">
                <span>Display Mode</span>
            </div>
            <select id="displayModeInput">
                <option value="agents" selected>Agents</option>
                <option value="heatmap">Heatmap</option>
            </select>
        </label>
        <button id="restartButton">Restart</button>
        <button id="playPauseButton">Play</button>
    </div>
    <div class="panels">
        <div class="panel">
            <div class="panelTitle">Agent Model for Disease Spread</div>
            <div class="legend">
                <div class="legendItem"><span class="dot susceptible"></span>Susceptible</div>
                <div class="legendItem"><span class="dot infected"></span>Infected</div>
            </div>
            <canvas id="simCanvas" width="900" height="520"></canvas>
        </div>
    </div>
</div>

<style>
#diseaseSpreadDemo {
    margin-top: 1rem;
}

#diseaseSpreadDemo .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: flex-end;
    margin-bottom: 12px;
}

#diseaseSpreadDemo label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 14px;
    min-width: 160px;
}

#diseaseSpreadDemo .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#diseaseSpreadDemo button {
    padding: 10px 14px;
    font-weight: 700;
    cursor: pointer;
}

#diseaseSpreadDemo .legend {
    display: flex;
    gap: 18px;
    align-items: center;
    font-size: 14px;
    margin-bottom: 8px;
}

#diseaseSpreadDemo .legendItem {
    display: flex;
    align-items: center;
    gap: 6px;
}

#diseaseSpreadDemo .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
}

#diseaseSpreadDemo .dot.susceptible {
    background: #2563eb;
}

#diseaseSpreadDemo .dot.infected {
    background: #dc2626;
}

#diseaseSpreadDemo .dot.recovered {
    background: #bfdbfe;
}

#diseaseSpreadDemo .panels {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

#diseaseSpreadDemo .panel {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 10px;
    padding: 10px;
}

#diseaseSpreadDemo .panelTitle {
    font-weight: 700;
    margin-bottom: 8px;
}

#diseaseSpreadDemo canvas {
    width: 100%;
    height: auto;
    display: block;
}
</style>

<script defer src="/assets/demos/disease-spread.js"></script>

## What the Simulation Shows

In this simulation, a population of agents moves randomly inside a two-dimensional box. Each agent is in one of two possible states:

- **Susceptible (S)** – healthy but able to become infected  
- **Infected (I)** – currently carrying the infection and able to transmit it

At the beginning of the simulation, most agents are susceptible and only a small number are infected. As the agents move around the plane, infected agents may transmit the disease to nearby susceptible agents.

Transmission occurs through **local interactions**. When a susceptible agent comes sufficiently close to an infected one, the infection spreads with some probability $p$.

Because agents are constantly moving, new encounters occur continuously, allowing the infection to propagate through the population.

This simulation is an example of an **agent-based model**. Instead of describing the population using equations directly, we simulate the behavior of many individual agents and observe the patterns that emerge.

Even though the rules are simple, large-scale structures often appear in the animation. Clusters of infection form, expand, and spread across space as agents interact.

The goal of this page is to understand how these microscopic rules lead to the mathematical models used in epidemiology.