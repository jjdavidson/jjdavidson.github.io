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

## From Random Walks to Diffusion

The Central Limit Theorem explains why the histogram in the simulation begins to resemble a Gaussian distribution. It tells us that the sum of many independent random steps approaches a normal distribution.
However, there is another perspective that leads to the same Gaussian shape.

Instead of studying a single walker, we can study how the **entire probability distribution evolves over time**. This viewpoint leads naturally to the **diffusion equation**, a partial differential equation that describes how probability spreads in space.

Let $P(n,j)$ denote the probability that the walker is at position $j$ after $n$ steps. Because each step moves the walker one unit left or right, the walker can only arrive at position $j$ from the neighboring positions $j-1$ or $j+1$. Therefore

$$
P(n+1,j)
=
\frac12 P(n,j-1) + \frac12 P(n,j+1).
$$

This equation describes how the probability distribution evolves from one step to the next.

## Rewriting the Difference Equation

We now subtract $P(n,j)$ from both sides:

$$
P(n+1,j) - P(n,j)
=
\frac12\bigl(P(n,j-1) - 2P(n,j) + P(n,j+1)\bigr).
$$

The left-hand side represents a **first difference in time**, while the right-hand side is a **second difference in space**.
To make this structure clearer, suppose each spatial step has length $\Delta x$ and each time step has length $\Delta t$. 
We write the probability as $P(x,t)$, where

$$
x = j\,\Delta x,
\qquad
t = n\,\Delta t.
$$

The recursion becomes

$$
P(x,t+\Delta t) - P(x,t)
=
\frac12\bigl(P(x-\Delta x,t) - 2P(x,t) + P(x+\Delta x,t)\bigr).
$$

Dividing by $\Delta t$ gives

$$
\frac{P(x,t+\Delta t)-P(x,t)}{\Delta t}
=
\frac{(\Delta x)^2}{2\Delta t}
\cdot
\frac{P(x-\Delta x,t)-2P(x,t)+P(x+\Delta x,t)}{(\Delta x)^2}.
$$

The left-hand side is the discrete version of a **time derivative**, and the expression on the right is the discrete version of a **second spatial derivative**.

## The Diffusion Equation

Now imagine zooming out so that $\Delta x \to 0$ and $\Delta t \to 0$, while keeping the ratio

$$
\frac{(\Delta x)^2}{2\Delta t}
\to D
$$

fixed. In this limit, the difference equation becomes

$$
\frac{\partial p}{\partial t}
=
D \frac{\partial^2 p}{\partial x^2}.
$$

This is the **diffusion equation**.
It describes how probability spreads over time in the large-scale limit of the random walk.
If the walk begins at the origin, the diffusion equation has solution

$$
p(x,t)
=
\frac{1}{\sqrt{4\pi Dt}}
\exp\!\left(-\frac{x^2}{4Dt}\right).
$$

This is a Gaussian distribution whose width grows like $\sqrt{t}$.
This matches exactly what we observed in the simulation: the distribution spreads out, and its typical width grows like the square root of time. So both approaches lead to the same conclusion:

- the **discrete random walk** produces a binomial distribution that approaches a Gaussian,
- the **continuous diffusion equation** has a Gaussian solution.

In this sense,

> **Diffusion is the continuum limit of the random walk.**