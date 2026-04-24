# src/sketches — Generative Art Conventions

How to write a sketch that respects the Praxeos system. Read this before writing a single line of p5, regl, three.js, or WebGL shader.

## The four laws

### 1. SSR-safe

Any p5 / regl / three code runs in `useEffect` (never at module top-level). The component that imports canvas libs must be imported via `next/dynamic` with `ssr: false` so the server never tries to execute WebGL.

```tsx
"use client";
import dynamic from "next/dynamic";
const RealSketch = dynamic(() => import("./RealSketch"), { ssr: false });
```

### 2. Pause when off-screen

Every sketch uses `IntersectionObserver` to start/stop its render loop. A sketch that paints when the reader is 12,000 pixels below it is a bug and a drain on the battery.

```ts
const observer = new IntersectionObserver(entries => {
  for (const e of entries) e.isIntersecting ? start() : stop();
}, { threshold: 0.1 });
```

### 3. Respect `prefers-reduced-motion`

If the user opts out of motion, the sketch component never mounts. Swap for `<PosterFallback src={metadata.posterSrc} alt={metadata.sketchDescription} />`. Not a slower animation — no animation.

```ts
const rm = useSyncExternalStore(subscribe, () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches
);
return rm ? <PosterFallback ... /> : <RealSketch />;
```

### 4. Clean up on unmount

Return a teardown function from the effect. Remove listeners. Cancel animation frames. Destroy WebGL contexts. Revoke Object URLs. Terminate workers. If your sketch leaks on navigation, you will feel it on mobile immediately.

## Determinism

Never `Math.random`. Always seed:

```ts
import seedrandom from "seedrandom";
const rng = seedrandom(blockHash);
const x = rng(); // deterministic, reproducible, testable
```

This lets us unit-test the sketch's geometry, generate the same OG image twice, and give users shareable deep-links that reproduce the state.

## Picking the right tool

| Need | Tool | Notes |
|---|---|---|
| 2D line art, low-to-medium complexity | **p5 (WEBGL mode)** | Fast to prototype, good default styling. Default choice. |
| 2D high-throughput instanced geometry | **regl** | Halving Garden live layer. Bypasses the scene graph overhead. |
| Real 3D with camera / lights / meshes | **three + @react-three/fiber + drei** | Only if the effect genuinely requires 3D. Costs ~200KB gzip. |
| Pure fragment shader / visual effect | **raw WebGL2** or **glsl-canvas** | For paper-grain, ink diffusion, procedural texture. |
| Simple DOM animation | **Motion** | Not a sketch. Use Motion + CSS. |
| Audio | **Tone.js**, lazy-loaded on opt-in toggle | Off by default, persisted to localStorage. |

## Performance budgets

- 60fps on M1 MacBook Air. 30fps on iPhone 12.
- Per-frame main-thread budget ≤ 6ms. Move heavy computation (hash→geometry, physics steps) to a Web Worker.
- JS bundle for the sketch (including libraries) ≤ 200KB gzip. Code-split aggressively via `next/dynamic`.

## Testing

Unit-test the pure geometry functions: input hash → deterministic ArrayBuffer of vertex data. The rendering wrapper is not unit-tested (too environmental); the geometry is everything.

## Common anti-patterns

- Mutating a global singleton (a p5 instance, a three scene). Contain everything per-component.
- Swallowing errors in the render loop. Log them; they will eat sessions silently otherwise.
- Resizing on every frame. Use a ResizeObserver or throttle.
- Reading from WebGL (readPixels) during render. It kills the pipeline.
