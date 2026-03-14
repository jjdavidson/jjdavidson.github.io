---
title: Buffon's Needle 
parent: Demos
nav_order: 4
---

# Estimating $\pi$ by Tossing Polygons

<div id="buffonDemo">
    <div class="controls">
        <label>
            <div class="row">
                <span>Shape</span>
            </div>
            <select id="shapeType">
                <option value="segment" selected>Line Segment</option>
                <option value="triangle">Triangle</option>
                <option value="square">Square</option>
                <option value="piShape">$\pi$</option>
            </select>
        </label>
        <label>
            <div class="row">
                <span>Number of Trials</span>
            </div>
            <select id="throwsInput">
                <option value="10">10</option>
                <option value="100" selected>100</option>
                <option value="1000">1000</option>
                <option value="10000">10,000</option>
            </select>
        </label>
        <label>
            <div class="row">
                <span>Simulation Speed</span>
            </div>
            <select id="speedSelect">
                <option value="25">Slow</option>
                <option value="50" selected>Medium</option>
                <option value="100">Fast</option>
                <option value="400">Very Fast</option>
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
    <div class="panel">
        <div class="panelTitle">Random Tosses</div>
        <canvas id="tossCanvas" width="900" height="420"></canvas>
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

## Buffon’s Needle (1777)

This experiment is based on a famous probability problem studied by **Georges-Louis Leclerc, Comte de Buffon**, in 1777.

Buffon was interested in understanding how **random orientation and position affect the chance of hitting a target**. One way to think about the problem is through the spread of projectiles. When a musket is fired toward a wall marked with vertical stripes, the exact point where the bullet lands depends on many small sources of randomness: the angle of the shot, small movements of the shooter, wind, and imperfections in the weapon.

Even in a simplified setting, these random variations create a natural question:

> If objects fall with random positions and random orientations, how often will they intersect a set of regularly spaced lines?

To study this, Buffon introduced a **toy mathematical model**.

Imagine a floor marked with equally spaced parallel lines a distance $$D$$ apart. Now suppose we randomly toss a needle of length $$L$$ onto the floor.
Each toss produces a random position and a random orientation for the needle. The question becomes:

> What is the probability that the needle crosses one of the lines?

Remarkably, when the needle is no longer than the spacing between the lines $$(L \le D)$$, the answer is

$$
P(\text{cross}) = \frac{2L}{\pi D}.
$$

This formula is surprising because the constant $$\pi$$, normally associated with circles, appears in a problem about **random geometric placement**.
If we choose the spacing so that $D = 2L$, then the formula simplifies to

$$
P(\text{cross}) = \frac{1}{\pi}.
$$

This means that we can estimate $$\pi$$ experimentally. If we repeatedly toss the needle and record the fraction of throws that cross a line,

$$
\hat{p} = \frac{\text{number of crossings}}{\text{number of tosses}},
$$

then

$$
\pi \approx \frac{1}{\hat{p}}.
$$

To understand why this formula is true, we analyze the **geometry of a random toss**.

## Deriving Buffon’s Formula by Projection

Because the floor markings are **vertical lines**, the crossing event depends only on the needle’s **horizontal extent**. The vertical position of the needle does not matter.
So instead of tracking the full position of the needle in the plane, we can simplify the problem by projecting everything onto the $x$-axis.

### Step 1: Collapse the geometry to one dimension

Fix an angle $\theta \in [0,\pi/2]$ between the needle and the vertical lines.
When the needle has length $L$ and makes angle $\theta$ with the vertical, its projection onto the $x$-axis has length

$$
L\sin\theta.
$$

This projected length measures how far the needle stretches horizontally.
Since the floor lines are vertical, the needle crosses a line exactly when its horizontal projection crosses one of the projected line locations on the $x$-axis.
So for a fixed angle $\theta$, the two-dimensional crossing problem becomes a one-dimensional question:

> If an interval of length $L\sin\theta$ is placed randomly on a line with marks spaced distance $D$ apart, what is the probability that it crosses one of the marks?

### Step 2: Crossing probability for a fixed angle

For a fixed angle $\theta$, let $x$ be the distance from the center of the needle to the nearest vertical line.
Because the lines are spaced $D$ apart, the center is equally likely to fall anywhere between two neighboring lines. By symmetry, it is enough to take

$$
x \in [0, D/2].
$$

A crossing occurs exactly when half of the horizontal projection reaches far enough to touch the nearest line. Since the full horizontal projection has length $L\sin\theta$, half of it has length

$$
\frac{L}{2}\sin\theta.
$$

Therefore the crossing condition is

$$
x \le \frac{L}{2}\sin\theta.
$$

Since $x$ is uniformly distributed on $[0,D/2]$, the conditional probability of crossing for this fixed angle is

$$
P(\text{cross}\mid \theta)
=
\frac{(L/2)\sin\theta}{D/2}
=
\frac{L\sin\theta}{D}.
$$

So once the angle is fixed, the crossing probability is simply proportional to the horizontal projection length.

### Step 3: Average over all angles

Now we allow the needle to have a random orientation.
By symmetry, we only need to consider angles

$$
\theta \in [0,\pi/2].
$$

All such angles are equally likely, so $\theta$ is uniformly distributed on this interval.
That means the overall crossing probability is the average of the conditional probability $P(\text{cross}\mid\theta)$ over all angles:

$$
P(\text{cross})
=
\frac{2}{\pi}\int_0^{\pi/2} P(\text{cross}\mid\theta)\,d\theta.
$$

Substituting the formula above gives

$$
P(\text{cross})
=
\frac{2}{\pi}\int_0^{\pi/2}\frac{L\sin\theta}{D}\,d\theta.
$$

Pulling out the constants,

$$
P(\text{cross})
=
\frac{2L}{\pi D}\int_0^{\pi/2}\sin\theta\,d\theta.
$$

### Step 4: Evaluate the integral

We compute

$$
\int_0^{\pi/2}\sin\theta\,d\theta
=
[-\cos\theta]_0^{\pi/2}
=
0-(-1)
=
1.
$$

Therefore,

$$
P(\text{cross})
=
\frac{2L}{\pi D}.
$$

This is Buffon’s needle formula.

#### Final Interpretation

The key idea is that for each fixed angle, the needle behaves like a one-dimensional interval whose length is its **horizontal projection**

$$
L\sin\theta.
$$

The chance of crossing at that angle is determined by how large that projection is compared with the spacing $D$. The total probability is then found by averaging over all possible orientations.
This is exactly where the factor of $\pi$ enters: it comes from averaging over angles.

## Barbier’s Formula

Buffon’s original result applies to **line segments**. In the 1860s, the mathematician **Joseph-Émile Barbier** discovered a remarkable generalization.

>Suppose a **convex shape** with perimeter $P$ is tossed randomly onto a floor marked with parallel lines spaced distance $D$ apart. Then the probability that the shape crosses one of the lines is
>
>$$
>P(\text{cross}) = \frac{P}{\pi D}.
>$$

The surprising part is that **only the perimeter matters**, not the detailed shape.
A circle, square, triangle, or any other convex shape with the same perimeter will therefore have exactly the same crossing probability.

### Why the perimeter appears

The intuition behind Barbier’s theorem is closely related to the projection idea used in Buffon’s needle.
For any fixed orientation $\theta$, the crossing event depends only on the **width of the shape in the horizontal direction** — that is, the length of its projection onto the $x$-axis.
Different shapes have different projection lengths for a given angle. 

However, Barbier was able to use a remarkable geometric fact proven by Augustin-Louis Cauchy:

>**Theorem** (Cauchy, 1832) The average projection length of a convex shape over all directions is
>
>$$
>\frac{P}{\pi}
>$$
>
> where $P$ is the perimeter of the convex shape.

This means that, on average, the shape behaves like a needle whose effective horizontal length is $P/\pi$.
Substituting this average length into Buffon’s needle formula gives

$$
P(\text{cross}) = \frac{P}{\pi D}.
$$

### How the Simulation Uses Barbier's Formula
In this simulation, the spacing between the lines is chosen so that the perimeter of each convex hull satisfies

$$
P = D.
$$

Substituting this into Barbier’s formula gives

$$
P(\text{cross}) = \frac{1}{\pi}.
$$

So every shape in the demo — regardless of its exact geometry — has the same theoretical crossing probability. Repeated random tosses therefore produce an experimental estimate of $\pi$.

### Why the $\pi$-Shaped Object Works

The $\pi$-shape used in the simulation is **not convex**, so Barbier’s theorem does not apply to it directly.
However, something special happens when we consider crossings against **parallel vertical lines**.
A crossing occurs whenever the object spans two adjacent vertical strips of width $D$. 
In other words, the crossing event depends only on the object's **horizontal projection**.
But any shape and its **convex hull** have the same projection in every direction. 
Therefore the $\pi$-shape crosses exactly the same vertical lines as its convex hull.

In this demo, the convex hull is designed to be a trapezoid whose perimeter equals the line spacing:

$$
P = D.
$$

So Barbier’s theorem applies to the convex hull, giving

$$
P(\text{cross}) = \frac{1}{\pi}.
$$

Because the $\pi$-shape and its convex hull have identical crossing behavior for vertical lines, the $\pi$-shaped toss also estimates $\pi$.

## Statistics Behind the Simulation

Each toss of the object produces one of two outcomes:

- the object **crosses a line**, or  
- the object **does not cross a line**.

If the true crossing probability is

$$
p = \frac{1}{\pi},
$$

then after $n$ independent tosses the number of crossings $X$ follows a **binomial distribution**:

$$
X \sim \text{Bin}(n,p).
$$

A natural estimate of the crossing probability is the **sample proportion**

$$
\hat{p} = \frac{X}{n}.
$$

Since the true relationship between $p$ and $\pi$ is

$$
p = \frac{1}{\pi},
$$

we estimate $\pi$ using

$$
\hat{\pi} = \frac{1}{\hat{p}}.
$$

Two fundamental results from probability theory explain why this estimate improves as more tosses are performed:

- the **Law of Large Numbers**, which explains convergence of the estimate  
- the **Central Limit Theorem**, which describes the distribution of the error

### Law of Large Numbers

The estimate of $\pi$ improves as more tosses are performed. This phenomenon is explained by the Law of Large Numbers.

> **Law of Large Numbers**  
> Let $X \sim \text{Bin}(n,p)$ and define the sample proportion
> $$
> \hat{p} = \frac{X}{n}.
> $$
> Then as $n \to \infty$,
> $$
> \hat{p} \to p
> $$
> with probability $1$.

In this experiment,

$$
p = \frac{1}{\pi}.
$$

Therefore the observed proportion of crossings converges to the true probability:

$$
\hat{p} \to \frac{1}{\pi}.
$$

Because the function $f(x) = \frac{1}{x}$ is a *continuous function* on the postive real numbers, we also have 

$$
\hat{\pi} = \frac{1}{\hat{p}} \to \pi.
$$

This shows that the estimate of $\pi$ becomes increasingly accurate as the number of tosses grows.
However, this argument says nothing about *how quickly* this convergence occurs.
From the simulation above, even performing 10,000 tosses typically estimates $\pi$ to only one or two decimal places.
To understand the **size of the fluctuations** in the estimate, we turn to the Central Limit Theorem.

### Central Limit Theorem

While the law of large numbers guarantees convergence, it does not describe the **distribution of the error**. This description is provided by the Central Limit Theorem.

> **Central Limit Theorem**  
> Let $X \sim \text{Bin}(n,p)$ and define the sample proportion $\hat{p} = X/n$. Then as $n \to \infty$,
>
> $$
> \frac{\hat{p}-p}{\sqrt{p(1-p)/n}}
> \xrightarrow{d}
> \mathcal{N}(0,1).
> $$

This theorem says that for large $n$, the sample proportion is approximately normally distributed:

$$
\hat{p} \approx
\mathcal{N}\!\left(
p,
\frac{p(1-p)}{n}
\right).
$$

This approximation allows us to estimate the uncertainty of $\hat{p}$.
The **standard error** of the sample proportion is therefore

$$
\text{SE}(\hat{p}) =
\sqrt{\frac{\hat{p}(1-\hat{p})}{n}}.
$$

### Transferring Uncertainty

Using the normal approximation, a **95% confidence interval** for the probability is

$$
\hat{p}
\pm
1.96
\sqrt{\frac{\hat{p}(1-\hat{p})}{n}}.
$$

However, our goal is to estimate $\pi$, not $p$. Since

$$
\pi = \frac{1}{p},
$$

our estimate is

$$
\hat{\pi} = \frac{1}{\hat{p}}.
$$

To understand the uncertainty in this estimate, we use an often underrated idea from calculus: **linear approximation**.

If a function $g(x)$ is applied to an estimate $x$, then small errors transform approximately according to

$$
\Delta g(x) \approx |g'(x)| \, \Delta x.
$$

In our case,

$$
g(p) = \frac{1}{p}.
$$

Taking the derivative gives

$$
g'(p) = -\frac{1}{p^2}.
$$

Therefore a small error $\Delta p$ in the estimate $\hat{p}$ produces an approximate error in the estimate $\hat{\pi}$ of size

$$
\Delta \hat{\pi}
\approx
\frac{1}{\hat{p}^2} \, \Delta \hat{p}.
$$

Substituting the 95% margin of error for $\hat{p}$ gives the approximate uncertainty in the estimate of $\pi$:

$$
\Delta \hat{\pi} \approx
1.96\sqrt{\frac{1-\hat{p}}{n\hat{p}^3}}.
$$

This is the quantity displayed in the simulation when the estimate is reported as

$$
\pi \approx \hat{\pi} \pm \Delta \hat{\pi}.
$$

Although the law of large numbers guarantees that $\hat{\pi}$ converges to $\pi$, it does not say how quickly this convergence occurs. The Central Limit Theorem shows that the typical size of the statistical error decreases on the order of

$$
\frac{1}{\sqrt{n}}.
$$

This means that increasing the number of tosses by a factor of $100$ reduces the error by only a factor of $10$. For example, if we perform $n = 10{,}000$ tosses, then $\sqrt{10{,}000} = 100$, so the typical size of the error is roughly on the order of $1/100$. This explains why even after 10,000 tosses the simulation usually estimates $\pi$ correctly to only about **two digits**. Achieving one additional digit of accuracy typically requires about **100 times more tosses**, illustrating the inherently slow rate of convergence characteristic of Monte Carlo methods.