/**
 * Halving Garden — shared types.
 *
 * A `Block` is the minimal subset of on-chain data we need to produce both
 * its geometry and its Hilbert-curve placement.
 *
 * An `Organism` is the deterministic line-art rendering of a single block,
 * expressed as flat segment arrays for fast Canvas 2D drawing.
 */

export interface Block {
  height: number;
  /** 64 hex characters, lowercase. */
  hash: string;
  /** Unix seconds. */
  timestamp: number;
  /** Block size in bytes. */
  size: number;
  /** Number of transactions. */
  txCount: number;
  /** Median fee rate, sats/vByte. */
  feeRate: number;
  miner?: string;
}

export interface Epoch {
  index: number;
  startHeight: number;
  /** Inclusive. */
  endHeight: number;
  subsidy: number;
  label: string;
  /** Approximate calendar dates for the plaque. */
  startDate: string;
  endDate: string;
  /** Mnemonic — a Roman numeral-ish name appearing on the plaque. */
  roman: string;
}

export interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Stroke weight in device pixels. */
  weight: number;
  /** 0 = core, 1 = petal shaft, 2 = petal tip, 3 = pistil. */
  kind: 0 | 1 | 2 | 3;
}

export interface Organism {
  /** Centered on (0, 0). The rendering layer translates. */
  segments: readonly Segment[];
  /** Bounding radius for hit-testing and layout. */
  radius: number;
  /** Number of petals — surfaced for tests and LOD decisions. */
  petalCount: number;
  /** 0..1 — overall ink density (fraction of radius used by segments). */
  density: number;
  /** True when this organism earns a Bitcoin-orange center. */
  hasOrangeCore: boolean;
}
