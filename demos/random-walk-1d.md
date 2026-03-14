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
            <div class="panelTitle">Random Walk Paths</div>
            <canvas id="walkCanvas" width="900" height="420"></canvas>
        </div>

        <div class="panel">
            <div class="panelTitle" id="histTitle">Distribution of Positions</div>
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

<script defer src="/assets/demos/random-walk-1d.js"></script>

## The Simple Random Walk

In the simulation above, each path begins at the origin and then repeatedly moves one unit to the left or one unit to the right at random.
This process is called a **one-dimensional random walk**.
We begin at position

$$
X_0 = 0.
$$

At each step, we move either one unit to the right or one unit to the left, each with probability $1/2$.  
If we let $S_k$ denote the $k$-th step, then

$$
S_k =
\begin{cases}
+1 & \text{with probability } \frac12,\\
-1 & \text{with probability } \frac12.
\end{cases}
$$

We assume these steps are independent. After $n$ steps, the position is

$$
X_n = S_1 + S_2 + \cdots + S_n.
$$

So the random walk is built by adding together many small random increments.

## Mean and Variance

Because each step is equally likely to be $+1$ or $-1$,

$$
\mathbb{E}[S_k] = 0.
$$

Therefore,

$$
\mathbb{E}[X_n]
= \mathbb{E}[S_1 + \cdots + S_n]
= \mathbb{E}[S_1] + \cdots + \mathbb{E}[S_n]
= 0.
$$

On average, the walk stays centered at the origin.

To understand how far it typically spreads, we compute the variance. Since $S_k^2 = 1$,

$$
\mathrm{Var}(S_k) = \mathbb{E}[S_k^2] - (\mathbb{E}[S_k])^2 = 1 - 0 = 1.
$$

Because the steps are independent,

$$
\mathrm{Var}(X_n)
= \mathrm{Var}(S_1 + \cdots + S_n)
= \mathrm{Var}(S_1) + \cdots + \mathrm{Var}(S_n)
= n.
$$

So the standard deviation is

$$
\sqrt{\mathrm{Var}(X_n)} = \sqrt{n}.
$$

This is the key scaling law: although the walk takes $n$ steps, its typical distance from the origin grows like
$\sqrt{n}$ instead of $n$.

## Exact Distribution

After $n$ steps, the position $X_n$ depends on how many right steps and left steps occurred.
Let $R_n$ be the number of right steps taken in the first $n$ moves. Each step is a Bernoulli trial with probability $1/2$ of moving right, so

$$
R_n \sim \mathrm{Bin}(n, 1/2).
$$

Since every step is either $+1$ or $-1$, the position of the walk after $n$ steps is

$$
X_n = (\text{right steps}) - (\text{left steps}).
$$

Because the total number of steps is $n$,

$$
X_n = R_n - (n - R_n) = 2R_n - n.
$$

So the position $X_n$ is determined entirely by the binomial random variable $R_n$.
Suppose the walker ends at position $j$. Then we must have

$$
2R_n - n = j.
$$

Solving for $R_n$ gives

$$
R_n = \frac{n + j}{2}.
$$

Therefore,

$$
\mathbb{P}(X_n = j)
=
\mathbb{P}\!\left(R_n = \frac{n+j}{2}\right)
=
\binom{n}{(n+j)/2}\left(\frac12\right)^n,
$$

whenever $n+j$ is even. If $n+j$ is odd, then this probability is $0$.
This binomial formula explains the discrete distribution seen in the histogram.

## Why the Histogram Looks Gaussian

For small $n$, the distribution is clearly discrete and jagged. But as $n$ grows, the shape becomes smoother and begins to resemble a bell curve.
This is a consequence of the **Central Limit Theorem**. Since $X_n$ is the sum of many independent random steps,

$$
\frac{X_n}{\sqrt{n}}
\approx N(0,1)
$$

for large $n$. Equivalently, $X_n$ is approximately normal with mean $0$ and variance $n$:

$$
X_n \approx N(0,n).
$$

So even though each individual walk is random and erratic, the distribution of many walks develops a predictable gaussian shape.

## What the Simulation Shows

The top panel shows individual random walk paths. 
The bottom panel shows the distribution of walker positions at the selected step.
As the step number increases:

- the paths wander farther from the origin,
- the distribution spreads out,
- and the width of that spread grows on the order of $\sqrt{n}$.

This is one of the simplest examples of how randomness at a small scale produces a very structured pattern at a larger scale.