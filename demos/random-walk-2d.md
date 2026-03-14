---
title: Random Walk 2D
parent: Demos
nav_order: 2
---

# Random Walk (2D)

<div id="randomWalk2D">
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
                <span>View</span>
            </div>
            <select id="viewSelect">
                <option value="paths" selected>Paths</option>
                <option value="heat">Heat Map</option>
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
            <div class="panelTitle" id="canvasTitle">Random Walk Paths</div>
            <canvas id="walkCanvas" width="900" height="500"></canvas>
        </div>
    </div>
</div>

<style>
#randomWalk2D {
    margin-top: 1rem;
}

#randomWalk2D .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: flex-end;
    margin-bottom: 12px;
}

#randomWalk2D label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 14px;
    flex: 1 1 100px;
}

#randomWalk2D label.wide {
    min-width: 320px;
    flex: 1 1 320px;
}

#randomWalk2D .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#randomWalk2D button {
    padding: 10px 14px;
    font-weight: 700;
    cursor: pointer;
}

#randomWalk2D .panels {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

#randomWalk2D .panel {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 10px;
    padding: 10px;
}

#randomWalk2D .panelTitle {
    font-weight: 700;
    margin-bottom: 8px;
}

#randomWalk2D canvas {
    width: 100%;
    height: auto;
    display: block;
}
</style>

<script defer src="/assets/demos/random-walk-2d.js"></script>

## The 2D Random Walk

In this simulation, each walker starts at the origin and takes steps of length $1$ in random directions. If $\theta_1,\theta_2,\dots,\theta_n$ are independent angles chosen uniformly from $[0,2\pi)$, then after $n$ steps the position is

$$
S_n=(X_n,Y_n)=\sum_{k=1}^n (\cos\theta_k,\sin\theta_k).
$$

So each step has the same length, but its direction is completely random.
This is the natural 2D analogue of the 1D random walk. In one dimension, each step is either $+1$ or $-1$. In two dimensions, each step is a unit vector pointing in a random direction.
Because the angles are uniformly distributed, the walk has no preferred direction. On average, the cloud of walkers remains centered at the origin.

## Mean and Variance

Let one step be

$$
\xi=(\cos\theta,\sin\theta),
$$

where $\theta$ is uniformly distributed on $[0,2\pi)$. Since the density of $\theta$ is $\frac{1}{2\pi}$, we compute expectations by integration.
For the $x$-coordinate of one step,

$$
E[\cos\theta]
=
\frac{1}{2\pi}\int_0^{2\pi}\cos\theta\,d\theta
=
0.
$$

Similarly, for the $y$-coordinate,

$$
E[\sin\theta]
=
\frac{1}{2\pi}\int_0^{2\pi}\sin\theta\,d\theta
=
0.
$$

Therefore

$$
E[X_n]=0,
\qquad
E[Y_n]=0.
$$

So the expected position after $n$ steps is still the origin.
Next we compute the variances. Since the mean is $0$, the variance equals the second moment.
For the $x$-coordinate of one step,

$$
\operatorname{Var}(\cos\theta)
=
E[\cos^2\theta]
=
\frac{1}{2\pi}\int_0^{2\pi}\cos^2\theta\,d\theta
=
\frac{1}{2}.
$$

Likewise,

$$
\operatorname{Var}(\sin\theta)
=
E[\sin^2\theta]
=
\frac{1}{2\pi}\int_0^{2\pi}\sin^2\theta\,d\theta
=
\frac{1}{2}.
$$

Because the steps are independent, variances add from step to step. It follows that

$$
\operatorname{Var}(X_n)=\frac{n}{2},
\qquad
\operatorname{Var}(Y_n)=\frac{n}{2}.
$$

By linearity of expectaion and the expectation formula for variance, adding the two coordinates gives

$$
E[X_n^2+Y_n^2]
=
E[X_n^2]+E[Y_n^2]
=
\operatorname{Var}(X_n) + \operatorname{Var}(Y_n),
=
n.
$$

Since $X_n^2+Y_n^2=\lvert S_n \rvert^2$, this becomes

$$
E[|S_n|^2]=n.
$$

This shows that the **mean squared distance from the origin grows linearly with the number of steps**. As a result, the typical distance from the origin grows on the order of $\sqrt{n}$.

## Rescaling the Random Walk and Brownian Motion

The 2D random walk in this simulation takes steps of length $1$ in random directions. After $n$ steps, the position is

$$
S_n=\sum_{k=1}^n (\cos\theta_k,\sin\theta_k),
$$

where the angles $\theta_1,\theta_2,\dots$ are independent and uniformly distributed on $[0,2\pi)$.
We have already seen that

$$
E[|S_n|^2]=n.
$$

So after $n$ steps, the typical distance from the origin is on the order of $\sqrt{n}$.
This $\sqrt{n}$ scaling tells us how to zoom out. If we want to observe the walk on larger and larger time scales while keeping its size comparable, we should divide space by $\sqrt{n}$.
That motivates the rescaled process

$$
W_n(t)=\frac{1}{\sqrt{n}}\,S_{\lfloor nt\rfloor}.
$$

Here $\lfloor nt\rfloor$ means the greatest integer less than or equal to $nt$, so by time $t$ we have taken about $nt$ steps.
This rescaling does two things at once:

- time is sped up by a factor of $n$,
- space is shrunk by a factor of $\sqrt{n}$.

For each fixed time $t$, the random vector $S_{\lfloor nt\rfloor}$ has mean $0$, and its typical size is about $\sqrt{nt}$. After dividing by $\sqrt{n}$, the typical size of $W_n(t)$ is about $\sqrt{t}$, which remains finite as $n\to\infty$.
As we let $n$ grow, the process $W_n(t)$ converges to a continuous random motion called **Brownian motion**.
In two dimensions, Brownian motion is a random process

$$
B(t)=(B_1(t),B_2(t))
$$

with the following properties:

1. $B(0)=(0,0)$,
2. it has independent increments,
3. its increments are Gaussian,
4. and its mean squared displacement grows linearly in time.

For this random walk, each step contributes variance $\frac12$ in the $x$-coordinate and $\frac12$ in the $y$-coordinate. After about $nt$ steps,

$$
\operatorname{Var}(X_{\lfloor nt\rfloor})\approx \frac{nt}{2},
\qquad
\operatorname{Var}(Y_{\lfloor nt\rfloor})\approx \frac{nt}{2}.
$$

After dividing by $n$, this becomes

$$
\operatorname{Var}(W_n^{(x)}(t))\approx \frac{t}{2},
\qquad
\operatorname{Var}(W_n^{(y)}(t))\approx \frac{t}{2}.
$$

So in the limit, each coordinate of Brownian motion has variance proportional to $t$.
Equivalently,

$$
E[|B(t)|^2]=2Dt \cdot 2 = 4Dt,
$$

and for this model the diffusion constant is

$$
D=\frac14.
$$

So the rescaled random walk converges to planar Brownian motion with diffusion constant $D=\frac14$.
This is the continuum version of the random walk: instead of making discrete jumps at integer times, the particle now moves continuously, but it keeps the same large-scale statistical behavior.
The key point is that Brownian motion is not a different phenomenon from the random walk. It is what the random walk becomes when we zoom out to large time and space scales.

### Advanced Note: The Invariance Principle

The convergence of the rescaled random walk

$$
W_n(t)=\frac{1}{\sqrt{n}}S_{\lfloor nt\rfloor}
$$

to Brownian motion is not just a heuristic argument. It is a precise mathematical theorem known as the **invariance principle** (or **Donsker's theorem**). Roughly speaking, the theorem says that if we take any random walk with independent steps that have mean zero and finite variance, then after the diffusive rescaling

$$
W_n(t)=\frac{1}{\sqrt{n}}S_{\lfloor nt\rfloor},
$$

the resulting processes converge to Brownian motion as $n\to\infty$.

Remarkably, the limiting process does **not** depend on the detailed distribution of the steps. Whether the walk moves left and right on a lattice, takes steps in random directions in the plane, or uses some other symmetric distribution, the large-scale limit is always Brownian motion.
This universality is closely related to the **Central Limit Theorem**. Just as sums of independent random variables tend toward a Gaussian distribution, random walks tend toward Brownian motion when viewed on large spatial and temporal scales.

## The Probability Density of Brownian Motion

Brownian motion is the continuum limit of the rescaled random walk. To understand how its probability distribution evolves, we now derive the partial differential equation satisfied by its probability density.

Let $p(x,y,t)$ denote the probability density for the position of the particle at time $t$.
Because Brownian motion has independent, isotropic increments, over a short time interval $\Delta t$ the particle makes a very small random displacement with mean zero. The variance of each coordinate over time $\Delta t$ is proportional to $\Delta t$, and for diffusion constant $D$ we have

$$
E[(\Delta X)^2]=2D\,\Delta t,
\qquad
E[(\Delta Y)^2]=2D\,\Delta t.
$$

So over a short time interval, the new position is

$$
(x+\Delta X,\;y+\Delta Y),
$$

where $\Delta X$ and $\Delta Y$ are small random increments with mean $0$.
To find the evolution of the density, we examine the expected value of a smooth test function $f(x,y)$. Using a second-order Taylor expansion,

$$
\begin{aligned}
f(x+\Delta X,y+\Delta Y)
&=f(x,y)
+f_x\,\Delta X
+f_y\,\Delta Y \\
&\quad
+\frac{1}{2}f_{xx}(\Delta X)^2
+f_{xy}\Delta X\Delta Y
+\frac{1}{2}f_{yy}(\Delta Y)^2
+\cdots
\end{aligned}
$$

Taking expectations, and using

$$
E[\Delta X]=E[\Delta Y]=0,
$$

$$
E[\Delta X\Delta Y]=0,
$$

$$
E[(\Delta X)^2]=E[(\Delta Y)^2]=2D\,\Delta t,
$$

we obtain

$$
E[f(x+\Delta X,y+\Delta Y)]
=
f(x,y)
+D\,\Delta t\,(f_{xx}+f_{yy})
+\cdots
$$

Subtracting $f(x,y)$ from both sides, dividing by $\Delta t$, and taking the limit as $\Delta t\to 0$ gives

$$
\frac{d}{dt}E[f(B_t)]
=
D\,E[\Delta f(B_t)],
$$

where

$$
\Delta f=f_{xx}+f_{yy}
$$

is the Laplacian.
Now write this in terms of the density $p(x,y,t)$. Since

$$
E[f(B_t)]
=
\int_{\mathbb{R}^2} f(x,y)\,p(x,y,t)\,dx\,dy,
$$

we differentiate with respect to $t$:

$$
\frac{d}{dt}E[f(B_t)]
=
\int_{\mathbb{R}^2} f(x,y)\,\frac{\partial p}{\partial t}(x,y,t)\,dx\,dy.
$$

On the other hand,

$$
E[\Delta f(B_t)]
=
\int_{\mathbb{R}^2} \Delta f(x,y)\,p(x,y,t)\,dx\,dy.
$$

Using integration by parts, we move the Laplacian from $f$ onto $p$:

$$
\int_{\mathbb{R}^2} \Delta f(x,y)\,p(x,y,t)\,dx\,dy
=
\int_{\mathbb{R}^2} f(x,y)\,\Delta p(x,y,t)\,dx\,dy.
$$

Therefore,

$$
\int_{\mathbb{R}^2} f(x,y)\,\frac{\partial p}{\partial t}(x,y,t)\,dx\,dy
=
D\int_{\mathbb{R}^2} f(x,y)\,\Delta p(x,y,t)\,dx\,dy.
$$

Since this holds for every smooth test function $f$, the density must satisfy the diffusion equation

$$
\frac{\partial p}{\partial t}
=
D\left(
\frac{\partial^2 p}{\partial x^2}
+
\frac{\partial^2 p}{\partial y^2}
\right).
$$

This is the PDE governing the probability density of planar Brownian motion.

## Solving the Diffusion Equation

We now look for the solution that starts from a point mass at the origin. In other words, all of the probability is concentrated at $(0,0)$ at time $t=0$.
The fundamental solution of the 2D diffusion equation is

$$
p(x,y,t)
=
\frac{1}{4\pi Dt}
\exp\left(-\frac{x^2+y^2}{4Dt}\right).
$$

This is a 2D Gaussian density. It is rotationally symmetric, centered at the origin, and spreads outward as time increases.
We can check that its width grows like $\sqrt{t}$, which matches the behavior of the random walk.
Also,

$$
E[x^2+y^2]=4Dt,
$$

so the mean squared distance again grows linearly in time.
For the random walk in this simulation, each step contributes variance $\frac12$ in each coordinate, so one unit of time corresponds to diffusion constant

$$
D=\frac14.
$$

Substituting this into the Gaussian gives

$$
p(x,y,t)
=
\frac{1}{\pi t}
\exp\left(-\frac{x^2+y^2}{t}\right).
$$

This is the smooth bell-shaped density that the heat map approaches as the number of walks becomes large.
The big picture is now complete:

- the discrete random walk spreads on the scale $\sqrt{n}$,
- its rescaled limit is Brownian motion,
- and the probability density of Brownian motion satisfies the diffusion equation.

So diffusion is the continuum description of the same random motion seen in the simulation.

## Expected Distance from the Origin

So far we have shown that

$$
E[|S_n|^2]=n,
$$

which means the **mean squared distance** from the origin grows linearly with $n$.
But what about the ordinary expected distance

$$
E[|S_n|]?
$$

For large $n$, the position of the random walk is approximately Gaussian. More precisely, each coordinate is approximately normal with mean zero and variance $\frac{n}{2}$, so the joint density is approximately

$$
p_n(x,y)
=
\frac{1}{\pi n}\exp\left(-\frac{x^2+y^2}{n}\right).
$$

To compute the expected distance from the origin, it is natural to switch to polar coordinates. Let

$$
r=\sqrt{x^2+y^2}.
$$

Since area element transforms as

$$
dx\,dy = r\,dr\,d\theta,
$$

the radial density is

$$
f_R(r)
=
\int_0^{2\pi} p_n(r\cos\theta,r\sin\theta)\,r\,d\theta.
$$

Substituting the Gaussian density gives

$$
f_R(r)
=
\int_0^{2\pi}
\frac{1}{\pi n}\exp\left(-\frac{r^2}{n}\right)r\,d\theta
=
\frac{2r}{n}\exp\left(-\frac{r^2}{n}\right)
$$

for $r \ge 0$. This is a **Rayleigh distribution**.
Now we compute its mean:

$$
E[R]
=
\int_0^\infty r\,f_R(r)\,dr
=
\int_0^\infty r\cdot \frac{2r}{n}\exp\left(-\frac{r^2}{n}\right)\,dr.
$$

So

$$
E[R]
=
\frac{2}{n}\int_0^\infty r^2 e^{-r^2/n}\,dr.
$$

To evaluate this integral, let

$$
u=\frac{r}{\sqrt{n}},
\qquad
r=\sqrt{n}\,u,
\qquad
dr=\sqrt{n}\,du.
$$

Then

$$
\begin{aligned}
E[R]
&=
\frac{2}{n}\int_0^\infty (\sqrt{n}\,u)^2 e^{-u^2}\sqrt{n}\,du \\
&=
2\sqrt{n}\int_0^\infty u^2 e^{-u^2}\,du.
\end{aligned}
$$

Using the standard Gaussian integral

$$
\int_0^\infty u^2 e^{-u^2}\,du
=
\frac{\sqrt{\pi}}{4},
$$

we obtain

$$
E[R]
=
2\sqrt{n}\cdot \frac{\sqrt{\pi}}{4}
=
\frac{\sqrt{\pi n}}{2}.
$$

Therefore, for large $n$,

$$
E[|S_n|]\approx \frac{\sqrt{\pi n}}{2}.
$$

So the expected distance from the origin also grows like $\sqrt{n}$.
This is consistent with the mean squared distance formula

$$
E[|S_n|^2]=n,
$$

but it gives a more refined description of the typical radius of the cloud of walkers.