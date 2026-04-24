/**
 * Time Preference Forest — L-system tree generator.
 *
 * Emits flat segment arrays for efficient Canvas 2D drawing. Geometry is
 * deterministic given (seed, state). Rendering decisions (colour, width,
 * tilt, darkening) happen at draw-time, not here.
 */

import { type RNG, hashSeed, mulberry32 } from "@/sketches/lib/rng";
import { type ForestState, interventionBoost, naturalHeight, rootDepth } from "./abct";

export interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** 0..1 — where on the tree axis this segment lives. 0 = base, 1 = tip. */
  axisT: number;
  /** Whether the segment is below ground (a root). */
  underground: boolean;
  /** Whether the segment exists only because of intervention-driven growth. */
  artificial: boolean;
  /** Stroke width before any rendering adjustments. */
  weight: number;
}

export interface Tree {
  /** Trunk base X, in canvas coordinates. */
  rootX: number;
  /** Ground Y. */
  groundY: number;
  segments: Segment[];
  /** For mycorrhiza pass. */
  rootTips: Array<[number, number]>;
}

export interface Forest {
  trees: Tree[];
  mycorrhiza: Segment[];
  groundY: number;
  width: number;
  height: number;
}

interface GenParams {
  /** Deterministic seed. */
  seed: string;
  /** Canvas dimensions. */
  width: number;
  height: number;
  /** Current simulation state (drives morphology). */
  state: ForestState;
}

const GROUND_FRACTION = 0.58; // y-position of the ground line (from top)

export function generateForest(params: GenParams): Forest {
  const { seed, width, height, state } = params;
  const groundY = height * GROUND_FRACTION;

  const rng = mulberry32(
    hashSeed(
      `${seed}|${state.timePreference.toFixed(3)}|${state.savingsRate.toFixed(3)}`,
    ),
  );

  // Tree count: modestly more trees when time preference is LOW (a real forest).
  const patience = 1 - state.timePreference;
  const treeCount = Math.round(4 + patience * 5);

  const trees: Tree[] = [];
  const spacing = width / (treeCount + 1);
  for (let i = 0; i < treeCount; i++) {
    const baseX = spacing * (i + 1) + (rng() - 0.5) * spacing * 0.4;
    trees.push(generateTree(rng, baseX, groundY, height, state));
  }

  const mycorrhiza = generateMycorrhiza(rng, trees, state);
  return { trees, mycorrhiza, groundY, width, height };
}

/* ------------------------------------------------------------------------- */
/* A single tree                                                              */
/* ------------------------------------------------------------------------- */

function generateTree(
  rng: RNG,
  rootX: number,
  groundY: number,
  canvasHeight: number,
  state: ForestState,
): Tree {
  const segments: Segment[] = [];
  const rootTips: Array<[number, number]> = [];

  const natural = naturalHeight(state);
  const boost = interventionBoost(state);
  const rootH = rootDepth(state);

  // Canvas space available above/below ground.
  const heightAbove = groundY;
  const heightBelow = canvasHeight - groundY;

  // Trunk: vertical L-system branching above ground.
  const trunkHeight = heightAbove * natural * 0.85;
  const artificialTrunkExtra = heightAbove * boost * 0.45;
  const rootHeight = heightBelow * rootH * 0.92;

  // --- Trunk & canopy (real) -------------------------------------------
  drawBranching(
    rng,
    segments,
    rootX,
    groundY,
    -Math.PI / 2, // upward
    trunkHeight,
    2.4 + natural * 2.0, // trunk thickness
    0, // axisT start
    iterationsForNatural(natural),
    false, // above-ground
    false, // natural (not artificial)
    state,
  );

  // --- Artificial boost (intervention) ---------------------------------
  if (artificialTrunkExtra > 0) {
    const startY = groundY - trunkHeight;
    drawBranching(
      rng,
      segments,
      rootX,
      startY,
      -Math.PI / 2,
      artificialTrunkExtra,
      1.4 + natural * 1.6,
      0.6,
      2, // smaller recursion — fast weedy growth
      false,
      true, // artificial
      state,
    );
  }

  // --- Roots (below ground, mirror of trunk at lower iteration) --------
  drawBranching(
    rng,
    segments,
    rootX,
    groundY,
    Math.PI / 2, // downward
    rootHeight,
    1.6 + rootH * 1.4,
    0,
    Math.max(2, iterationsForNatural(natural) - 1),
    true,
    false,
    state,
    rootTips,
  );

  return { rootX, groundY, segments, rootTips };
}

function iterationsForNatural(natural: number): number {
  // natural 0.2 → 2 iterations; natural 1 → 5
  return Math.max(2, Math.round(1 + natural * 4));
}

/**
 * Recursive branch generator. Draws a segment, then with probability branches
 * into sub-branches.
 */
function drawBranching(
  rng: RNG,
  segs: Segment[],
  x: number,
  y: number,
  angle: number,
  length: number,
  width: number,
  axisT: number,
  iters: number,
  underground: boolean,
  artificial: boolean,
  state: ForestState,
  rootTipsOut?: Array<[number, number]>,
) {
  if (iters <= 0 || length < 2 || width < 0.2) {
    if (underground && rootTipsOut) rootTipsOut.push([x, y]);
    return;
  }

  const jitter = (rng() - 0.5) * 0.05;
  const x2 = x + Math.cos(angle + jitter) * length;
  const y2 = y + Math.sin(angle + jitter) * length;

  segs.push({
    x1: x,
    y1: y,
    x2,
    y2,
    axisT,
    underground,
    artificial,
    weight: width,
  });

  // Two children, possibly three for richer canopy at low time preference.
  const branches = 1 - state.timePreference > 0.6 && rng() < 0.3 ? 3 : 2;
  const spreadBase = underground ? 0.5 : 0.55;

  for (let i = 0; i < branches; i++) {
    const spread = spreadBase + (rng() - 0.5) * 0.2;
    const sign = i === 0 ? -1 : i === 1 ? 1 : (rng() - 0.5) * 2;
    const childAngle = angle + sign * spread;
    const childLength = length * (0.72 + rng() * 0.12);
    const childWidth = width * 0.72;
    drawBranching(
      rng,
      segs,
      x2,
      y2,
      childAngle,
      childLength,
      childWidth,
      Math.min(1, axisT + 1 / Math.max(1, iters)),
      iters - 1,
      underground,
      artificial,
      state,
      rootTipsOut,
    );
  }
}

/* ------------------------------------------------------------------------- */
/* Mycorrhizal network — faint curves connecting nearest root-tips.           */
/* Only appears at low time preference + non-zero savings.                    */
/* ------------------------------------------------------------------------- */

function generateMycorrhiza(rng: RNG, trees: Tree[], state: ForestState): Segment[] {
  const intensity = Math.max(0, (1 - state.timePreference) * state.savingsRate);
  if (intensity < 0.15) return [];

  const segs: Segment[] = [];
  const maxDistance = 180; // px — only near neighbours

  for (let i = 0; i < trees.length; i++) {
    const a = trees[i];
    if (!a || a.rootTips.length === 0) continue;

    for (let j = i + 1; j < trees.length; j++) {
      const b = trees[j];
      if (!b || b.rootTips.length === 0) continue;

      // Find nearest pair.
      let bestPair: [[number, number], [number, number]] | null = null;
      let bestDist = Number.POSITIVE_INFINITY;
      for (const ta of a.rootTips) {
        for (const tb of b.rootTips) {
          const d = Math.hypot(ta[0] - tb[0], ta[1] - tb[1]);
          if (d < bestDist) {
            bestDist = d;
            bestPair = [ta, tb];
          }
        }
      }
      if (!bestPair || bestDist > maxDistance) continue;
      if (rng() > intensity) continue;

      const [p1, p2] = bestPair;
      segs.push({
        x1: p1[0],
        y1: p1[1],
        x2: p2[0],
        y2: p2[1],
        axisT: 1,
        underground: true,
        artificial: false,
        weight: 0.5 + intensity * 0.6,
      });
    }
  }
  return segs;
}

/* ------------------------------------------------------------------------- */
/* Forest metrics — diagnostic / testable.                                    */
/* ------------------------------------------------------------------------- */

export function forestMetrics(forest: Forest): {
  totalSegments: number;
  undergroundFraction: number;
  artificialFraction: number;
  maxDepth: number;
  maxHeight: number;
} {
  let underground = 0;
  let artificial = 0;
  let maxDepth = 0;
  let maxHeight = 0;

  for (const tree of forest.trees) {
    for (const seg of tree.segments) {
      if (seg.underground) {
        underground++;
        maxDepth = Math.max(maxDepth, seg.y2 - tree.groundY);
      } else {
        maxHeight = Math.max(maxHeight, tree.groundY - seg.y2);
      }
      if (seg.artificial) artificial++;
    }
  }
  const totalSegments = forest.trees.reduce((a, t) => a + t.segments.length, 0);
  return {
    totalSegments,
    undergroundFraction: underground / Math.max(1, totalSegments),
    artificialFraction: artificial / Math.max(1, totalSegments),
    maxDepth,
    maxHeight,
  };
}
