---
title: Uniform Acceleration
parent: AP Physics C - Mech
nav_order: 1
---

# Uniform Acceleration

<div id="kinematics1D">
    <div class="controls">
        <label>
            <div class="row">
                <span>$x_0 =$</span>
            </div>
            <input id="positionInput" type="number" step="0.1" value="0.0">
        </label>
        <label>
            <div class="row">
                <span>$v_0 =$</span>
            </div>
            <input id="velocityInput" type="number" step="0.1" value="2.0">
        </label>
        <label>
            <div class="row">
                <span>$a =$</span>
            </div>
            <input id="accelerationInput" type="number" step="0.1" value="1.0">
        </label>
        <label>
            <div class="row">
                <span>View</span>
            </div>
            <select id="viewSelect">
                <option value="normal" selected>Normal</option>
                <option value="tangent">Tangent Line</option>
                <option value="area">Signed Area</option>
            </select>
        </label>
        <label class="wide">
            <div class="row">
                <span>Time</span>
                <span id="kinematicsTimeLabel">0.0</span>
            </div>
            <input id="kinematicsTimeSlider" type="range" min="0" max="10" step="0.1" value="0">
        </label>
    </div>
    <div class="panels">
        <div class="panel">
            <div class="panelTitle">Position, Velocity, and Acceleration Graphs</div>
            <canvas id="kinematicsCanvas" width="900" height="720"></canvas>
        </div>
    </div>
</div>

<style>
#kinematics1D {
    margin-top: 1rem;
}

#kinematics1D .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: flex-end;
    margin-bottom: 12px;
}

#kinematics1D label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 14px;
    min-width: 220px;
}

#kinematics1D label.wide {
    min-width: 320px;
    flex: 1 1 320px;
}

#kinematics1D .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#kinematics1D .panels {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

#kinematics1D .panel {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 10px;
    padding: 10px;
}

#kinematics1D .panelTitle {
    font-weight: 700;
    margin-bottom: 8px;
}

#kinematics1D canvas {
    width: 100%;
    height: auto;
    display: block;
}
</style>

<script defer src="/assets/AP Physics/uniform-accel.js"></script>

As you read the graphs, keep these four ideas in mind:

- slope of position gives velocity
- slope of velocity gives acceleration
- area under velocity gives displacement
- area under acceleration gives change in velocity

## The Equations of Motion
The primary goal of physics is to predict the motion of objects. 
The **equations of motion** are a set of differential equations relating **position** $x(t)$, **velocity** $v(t)$, and **acceleration** $a(t)$:

$$a(t) = \frac{dv}{dt}, \quad v(t) = \frac{dx}{dt}$$

Graphically, this means:
- the slope of the position-time graph is velocity
- the slope of the velocity-time graph is acceleration

The integral form of the equations of motion over a time interval $[t_0,t_f]$ is given by

$$\Delta v = v(t_f)-v(t_0) = \int_{t_0}^{t_f} a(t)\,dt$$

$$\Delta x = x(t_f)-x(t_0) = \int_{t_0}^{t_f} v(t)\,dt$$

Graphically, this means:

- the signed area under the acceleration-time graph gives the **change** in velocity
- the signed area under the velocity-time graph gives the **change** in position, that is, the **displacement**

## Constant Acceleration
In the special case of constant acceleration, the equations of motion lead to linear and quadratic formulas for velocity and position. Some international physics courses call these the **SUVAT Equations**:

$$
\begin{aligned}
    v &= u + at \\
    v^2 &= u^2 + 2as \\
    s &= ut + \tfrac{1}{2}at^2 \\
    s &= vt - \tfrac{1}{2}at^2 \\
    s &= \tfrac{1}{2}(u+v)t
\end{aligned}
$$

where
- $s$ is the displacement
- $u$ is the initial velocity
- $v$ is the final velocity
- $a$ is the constant acceleration
- $t$ is the time between the initial state and the final state

In many physics courses in the United States, a different notation is used for the same equations. These are often called the Uniformly Accelerated Motion (UAM) equations:

$$
\begin{aligned}
    v_f &= v_0 + at \\
    v_f^2 &= v_0^2 + 2a \Delta x \\
    \Delta x &= v_0t + \tfrac{1}{2}at^2 \\
    \Delta x &= v_ft - \tfrac{1}{2}at^2 \\
    \Delta x &= \tfrac{1}{2}(v_0+v_f)t
\end{aligned}
$$

where
- $\Delta x$ is the displacement
- $v_0$ is the initial velocity
- $v_f$ is the final velocity
- $a$ is the constant acceleration
- $t$ is the time between the initial state and the final state

### Case 1: Positive Acceleration
Suppose $a>0$. Then,
- the acceleration-time graph is a **horizontal line** above the time axis
- the velocity-time graph is a **line with positive slope**
- the position-time graph is a **parabola that bends upward (concave up)**

A common mistake is to think that positive acceleration automatically means the object is speeding up. That is not true.

- If $v>0$ and $a>0$, the object speeds up.
- If $v<0$ and $a>0$, the object slows down.

So positive acceleration means that velocity is increasing, not necessarily that speed is increasing.

If the velocity graph crosses zero, the object changes direction. On the position graph, this corresponds to a turning point, usually a local minimum in the constant-acceleration case.

### Case 2: Negative Acceleration
Suppose $a<0$. Then,
- the acceleration-time graph is a **horizontal line** below the time axis
- the velocity-time graph is a **line with negative slope**
- the position-time graph is a **parabola that bends downward (concave down)**

A common mistake is to think that negative acceleration automatically means the object is slowing down. That is not true.

- If $v>0$ and $a<0$, the object slows down.
- If $v<0$ and $a<0$, the object speeds up.

So negative acceleration means that velocity is decreasing, not necessarily that speed is decreasing.

If the velocity graph crosses zero, the object changes direction. On the position graph, this corresponds to a turning point, usually a local maximum in the constant-acceleration case.

### Case 3: Zero Acceleration
Suppose $a=0$. Then,
- the acceleration-time graph is a **horizontal line** on the time axis
- the velocity-time graph is a **horizontal line**
- the position-time graph is a **straight line**

Zero acceleration means that velocity is constant, so the object moves with constant velocity.

- If $v>0$, the object moves in the positive direction at constant speed.
- If $v<0$, the object moves in the negative direction at constant speed.
- If $v=0$, the object remains at rest.

So zero acceleration means that velocity does not change.

If the velocity graph is zero for all time, the object stays at a fixed position. Otherwise, the object does not change direction, since the velocity does not cross zero.

## Speed and Distance

In one-dimensional motion, it is important to distinguish between **velocity** and **speed**, and between **displacement** and **distance**.

- **velocity** is the signed quantity $v(t)$
- **speed** is the magnitude of velocity, so $\text{speed} = \lvert v(t) \rvert$
- **displacement** is the signed change in position
- **distance** is the total length of the path traveled

Because of this distinction,

$$\text{displacement} = \int_{t_0}^{t_f} \text{(velocity)}\,dt$$ 

$$\quad \text{distance traveled} = \int_{t_0}^{t_f} \text{(speed)}\,dt$$

Graphically:

- the **signed area** under the velocity-time graph gives displacement
- the area under the **absolute value** graph $\lvert v(t) \rvert$ gives distance

This means that parts of the velocity graph below the axis count as negative contribution to displacement, but still count as positive contribution to distance. The object changes direction exactly when $v(t)$ changes sign, that is, when the velocity-time graph crosses the time axis.

### Uniform Acceleration Case

When acceleration is constant, velocity has the form

$$
v(t)=v_0+at
$$

so the speed is

$$
\text{speed} = \lvert v_0+at \rvert.
$$

The displacement from $t_0$ to $t_f$ is

$$
\Delta x = \int_{t_0}^{t_f} (v_0+at)\,dt.
$$

If the velocity does not change sign on the interval, then distance and displacement differ only by a sign:

- if $v(t)>0$ for the whole interval, then
  $$
  \text{distance}=\Delta x
  $$
- if $v(t)<0$ for the whole interval, then
  $$
  \text{distance}=-\Delta x
  $$

If the velocity **does** change sign, then the object turns around, and distance must be computed by splitting the motion at the turning point.

If $a\neq 0$, the turning time is found from

$$
v_0+at=0
$$

so

$$
t_{\text{turn}}=-\frac{v_0}{a}.
$$

Then distance is found by adding the magnitudes of the displacements on the two pieces of motion.

For example, if the object reverses direction during the interval $[t_0,t_f]$, then

$$
\text{distance}
=
\left| \int_{t_0}^{t_{\text{turn}}} v(t)\,dt \right|
+
\left| \int_{t_{\text{turn}}}^{t_f} v(t)\,dt \right|.
$$

### General Case
For any one-dimensional motion, even when acceleration is not constant,

$$
\text{speed}=\lvert v(t)\rvert
$$

and

$$
\text{distance}=\int_{t_0}^{t_f}\lvert v(t)\rvert\,dt.
$$

To compute distance in practice:

1. Find the times where $v(t)=0$.
2. Split the time interval at those points.
3. On each subinterval, velocity has a definite sign.
4. Add the magnitudes of the signed displacements.

Equivalently, you may write

$$
\text{distance}
=
\sum \left| \int v(t)\,dt \right|
$$

where the sum is taken over intervals on which $v(t)$ does not change sign. This is why displacement and distance are only the same when the object never reverses direction.

### Key Idea

- **Displacement** cares about initial and final position.
- **Distance** cares about the entire path.
- **Velocity** cares about how fast and which direction.
- **Speed** cares about how fast regardless of direction.

So if an object moves forward and then backward, its displacement can be small or even zero, while its distance is still positive.
