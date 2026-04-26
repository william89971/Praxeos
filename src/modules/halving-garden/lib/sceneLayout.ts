/**
 * Halving Garden — 3D scene layout.
 *
 * Maps the five Bitcoin halving epochs into a long manuscript hall along
 * the +Z axis. Each epoch is a tilted "page" of the manuscript with
 * deterministic block-marker positions seeded by epoch index. Live blocks
 * (from mempool.space) ride on top via `liveBlockToWorld()`.
 *
 * Pure: no DOM, no random, no globals. Safe to use server-side or in tests.
 */

import { mulberry32 } from "@/sketches/lib/rng";
import { BLOCKS_PER_EPOCH, EPOCHS, getEpoch, heightWithinEpoch } from "./epochs";
import type { Block, Epoch } from "./types";

export const HALL_HALF_WIDTH = 9;
export const EPOCH_DEPTH = 28;
export const EPOCH_GAP = 4;
export const PAGE_TILT = 0.105;
export const HALL_FLOOR_Y = -2.6;

export const HALL_TOTAL_DEPTH =
  EPOCHS.length * EPOCH_DEPTH + (EPOCHS.length - 1) * EPOCH_GAP;

export interface EpochLayout {
  readonly epoch: Epoch;
  /** World-space Z of the near (camera-side) edge. */
  readonly zNear: number;
  /** World-space Z of the far edge. */
  readonly zFar: number;
  /** Z midpoint of the panel. */
  readonly zCenter: number;
  /** Markers shown in the field for this epoch. */
  readonly markerCount: number;
  /** 0..1 — visual intensity scaled to subsidy (genesis = 1.0). */
  readonly intensity: number;
}

const FIRST_SUBSIDY = EPOCHS[0]?.subsidy ?? 50;

const EPOCH_LAYOUTS: readonly EpochLayout[] = EPOCHS.map((epoch, index) => {
  const zNear = index * (EPOCH_DEPTH + EPOCH_GAP);
  const zFar = zNear + EPOCH_DEPTH;
  return {
    epoch,
    zNear,
    zFar,
    zCenter: (zNear + zFar) / 2,
    markerCount: 1,
    intensity: epoch.subsidy / FIRST_SUBSIDY,
  };
});

export function getEpochLayouts(
  deviceClass: "desktop" | "mobile",
): readonly EpochLayout[] {
  const perEpoch = deviceClass === "mobile" ? 520 : 1100;
  return EPOCH_LAYOUTS.map((layout) => {
    if (layout.epoch.index === EPOCHS.length - 1) {
      const ratio = epochProgressRatio(layout.epoch);
      return { ...layout, markerCount: Math.max(80, Math.round(perEpoch * ratio)) };
    }
    return { ...layout, markerCount: perEpoch };
  });
}

function epochProgressRatio(epoch: Epoch): number {
  const heights = epoch.endHeight - epoch.startHeight + 1;
  if (heights <= 0) return 1;
  const today = APPROX_TIP_HEIGHT;
  const within = Math.max(0, Math.min(heights, today - epoch.startHeight));
  return within / heights;
}

export const APPROX_TIP_HEIGHT = 945_000;

export interface MarkerPosition {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly rotation: number;
  readonly scale: number;
}

/**
 * Generates deterministic marker positions for a given epoch panel.
 * Returns a flat Float32 buffer of [x,y,z, x,y,z, ...] for fast InstancedMesh setup.
 */
export function buildEpochMarkers(
  layout: EpochLayout,
  count: number,
): readonly MarkerPosition[] {
  const seed = (layout.epoch.index + 1) * 9_739_217;
  const rng = mulberry32(seed);
  const out: MarkerPosition[] = [];
  for (let i = 0; i < count; i++) {
    const t = (i + rng() * 0.6) / count;
    const z = layout.zNear + t * EPOCH_DEPTH;

    // Two-band stratification: keep most markers near the floor with a
    // gentle vertical scatter, like ink settling on a page. Add a subtle
    // sinusoid to suggest the manuscript's organic rhythm.
    const wave = Math.sin(t * Math.PI * 4 + layout.epoch.index) * 0.4;
    const y = HALL_FLOOR_Y + 0.3 + (rng() - 0.5) * 0.9 + wave;

    // Width spread: slight curl per epoch. Marker x ranges across the page.
    const xJitter = (rng() - 0.5) * 2;
    const x = xJitter * HALL_HALF_WIDTH * (0.55 + rng() * 0.4);

    const rotation = rng() * Math.PI;

    // Glyph size encodes subsidy: Genesis blocks loom; Saturation blocks
    // are pinpoints. Capped to keep silhouettes readable.
    const baseScale = 0.07 + layout.intensity * 0.18;
    const scale = baseScale * (0.85 + rng() * 0.3);

    out.push({ x, y, z, rotation, scale });
  }
  return out;
}

/**
 * Map a live block to a world-space position. Used to "ghost in" mempool
 * arrivals at their true position before they settle into the field.
 */
export function liveBlockToWorld(block: Block): MarkerPosition {
  const epoch = getEpoch(block.height);
  const layout = EPOCH_LAYOUTS[epoch.index];
  if (!layout) throw new Error(`No layout for epoch ${epoch.index}`);

  const within = heightWithinEpoch(block.height);
  const t = Math.min(0.999, within / BLOCKS_PER_EPOCH);
  const z = layout.zNear + t * EPOCH_DEPTH;

  const seed = hashSeedNumber(block.hash);
  const rng = mulberry32(seed);
  const x = (rng() - 0.5) * HALL_HALF_WIDTH * 1.6;
  const y = HALL_FLOOR_Y + 0.7 + (rng() - 0.5) * 0.9;
  const rotation = rng() * Math.PI;
  const scale = 0.22 + layout.intensity * 0.14;

  return { x, y, z, rotation, scale };
}

function hashSeedNumber(hash: string): number {
  if (hash.length < 8) {
    let h = 2_166_136_261 >>> 0;
    for (let i = 0; i < hash.length; i++) {
      h ^= hash.charCodeAt(i);
      h = Math.imul(h, 16_777_619);
    }
    return h >>> 0;
  }
  const n = Number.parseInt(hash.slice(0, 8), 16);
  return Number.isFinite(n) ? n >>> 0 : 0;
}

/**
 * The Z position of the gate between epoch i and epoch i+1, centered in
 * the gap. Returns null if no gate exists past `index`.
 */
export function gateZ(leftEpochIndex: number): number | null {
  const left = EPOCH_LAYOUTS[leftEpochIndex];
  const right = EPOCH_LAYOUTS[leftEpochIndex + 1];
  if (!left || !right) return null;
  return (left.zFar + right.zNear) / 2;
}
