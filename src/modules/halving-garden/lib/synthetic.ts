/**
 * Deterministic synthetic block dataset — used by the preview sketch until
 * the real mempool.space-backed pipeline ships in Phase 6b.
 *
 * Each block is generated from a single seed, and its hash is derived from
 * its height + that seed so the set is perfectly reproducible.
 */

import { hashSeed, mulberry32 } from "@/sketches/lib/rng";
import { APPROX_CURRENT_HEIGHT, EPOCHS } from "./epochs";
import type { Block } from "./types";

export interface SyntheticParams {
  seed: string;
  count: number;
  /** Optional override of tip height for testing. */
  tipHeight?: number;
}

export function generateSyntheticBlocks(params: SyntheticParams): Block[] {
  const { seed, count } = params;
  const tip = params.tipHeight ?? APPROX_CURRENT_HEIGHT;

  const rng = mulberry32(hashSeed(seed));
  const blocks: Block[] = [];

  // We distribute the sampled blocks across the entire chain so the preview
  // shows every epoch populated. We sample rather than take contiguous
  // heights because rendering 500 contiguous blocks would crowd one small
  // corner of a single panel.
  for (let i = 0; i < count; i++) {
    const height = Math.floor((i / count) * tip);
    blocks.push(syntheticBlockAt(height, rng));
  }
  return blocks;
}

function syntheticBlockAt(height: number, rng: () => number): Block {
  // Derive a hex hash from the rng — 64 characters.
  let hash = "";
  for (let i = 0; i < 16; i++) {
    // 8 hex chars per iteration (32 bits)
    const v = Math.floor(rng() * 0xffffffff) >>> 0;
    hash += v.toString(16).padStart(8, "0");
  }
  hash = hash.slice(0, 64);

  const size = 100_000 + Math.floor(rng() * 1_400_000); // 100 KB – 1.5 MB
  const txCount = 200 + Math.floor(rng() * 3500);
  const feeRate = 1 + Math.floor(rng() * 60); // 1–60 sats/vB

  // Approximate timestamp: 10 minutes per block from genesis.
  const timestamp = 1231006505 + height * 600 + Math.floor(rng() * 120 - 60);

  return { height, hash, timestamp, size, txCount, feeRate };
}

/** All halving events within [0, tipHeight]. Useful for plaque placement. */
export function halvingEvents(tipHeight = APPROX_CURRENT_HEIGHT) {
  return EPOCHS.filter((e) => e.startHeight > 0 && e.startHeight <= tipHeight).map(
    (e) => ({
      height: e.startHeight,
      epochIndex: e.index,
      subsidy: e.subsidy,
      date: e.startDate,
      roman: e.roman,
    }),
  );
}
