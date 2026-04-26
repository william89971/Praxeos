/**
 * Monetary Garden — deterministic positions.
 *
 * Tree, grass, node, dead-zone positions are seeded so the scene is
 * identical every load. All world-space; the renderer translates as
 * needed.
 */

import { mulberry32 } from "@/sketches/lib/rng";

export const PLOT_HALF = 11;
export const GROUND_Y = 0;

export interface TreePos {
  readonly x: number;
  readonly z: number;
  readonly variant: 0 | 1 | 2;
  /** [0, 1] — random factor used for seeded canopy color, height jitter, etc. */
  readonly seed: number;
  /** Whether this tree falls in the broken band. Pre-computed so collapse is stable per tree. */
  readonly collapseAt: number;
}

export interface NodePos {
  readonly x: number;
  readonly z: number;
  /** Phase offset for emissive pulse, 0..1. */
  readonly phase: number;
}

export interface DeadZonePos {
  readonly x: number;
  readonly z: number;
  readonly radius: number;
  /** 0..1 — distortion threshold at which this zone activates. */
  readonly activates: number;
}

export interface PathSegment {
  readonly from: number;
  readonly to: number;
}

const TREES_DESKTOP = 36;
const TREES_MOBILE = 18;
const NODES = 9;
const DEAD_ZONES = 6;

export function treePositions(deviceClass: "desktop" | "mobile"): readonly TreePos[] {
  const count = deviceClass === "mobile" ? TREES_MOBILE : TREES_DESKTOP;
  const rng = mulberry32(0x70_1f_3a_91);
  const out: TreePos[] = [];
  for (let i = 0; i < count; i++) {
    const angle = rng() * Math.PI * 2;
    const radius = 2.2 + rng() * (PLOT_HALF - 2.5);
    const jitter = (rng() - 0.5) * 0.9;
    const x = Math.cos(angle) * radius + jitter;
    const z = Math.sin(angle) * radius + jitter;
    const variant = Math.floor(rng() * 3) as 0 | 1 | 2;
    const seed = rng();
    const collapseAt = 0.65 + rng() * 0.3;
    out.push({ x, z, variant, seed, collapseAt });
  }
  return out;
}

export function nodePositions(): readonly NodePos[] {
  // Hexagonal-ish ring around the center, slight randomization for organic feel.
  const rng = mulberry32(0x4c_55_a9_07);
  const out: NodePos[] = [];
  // Inner ring (3) + outer ring (6).
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2 + 0.1;
    out.push({
      x: Math.cos(angle) * 3.1,
      z: Math.sin(angle) * 3.1,
      phase: rng(),
    });
  }
  for (let i = 0; i < NODES - 3; i++) {
    const angle = (i / (NODES - 3)) * Math.PI * 2 + 0.4;
    out.push({
      x: Math.cos(angle) * 6.6,
      z: Math.sin(angle) * 6.6,
      phase: rng(),
    });
  }
  return out;
}

export function pathSegments(): readonly PathSegment[] {
  // Connect each outer node to its two nearest inner nodes; ring inner nodes.
  const segments: PathSegment[] = [];
  // Inner ring.
  segments.push({ from: 0, to: 1 });
  segments.push({ from: 1, to: 2 });
  segments.push({ from: 2, to: 0 });
  // Outer to inner (each outer to nearest inner — pre-computed for stability).
  const outerToInner: ReadonlyArray<readonly [number, number]> = [
    [3, 0],
    [4, 1],
    [5, 1],
    [6, 2],
    [7, 2],
    [8, 0],
  ];
  for (const [from, to] of outerToInner) segments.push({ from, to });
  return segments;
}

export function deadZonePositions(): readonly DeadZonePos[] {
  const rng = mulberry32(0x9b_c2_e1_47);
  const out: DeadZonePos[] = [];
  for (let i = 0; i < DEAD_ZONES; i++) {
    const angle = rng() * Math.PI * 2;
    const radius = 3.5 + rng() * (PLOT_HALF - 4.5);
    out.push({
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
      radius: 1.3 + rng() * 1.1,
      activates: 0.4 + rng() * 0.45,
    });
  }
  return out;
}
