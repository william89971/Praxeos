/**
 * Halving Garden — organism geometry.
 *
 * Pure function: given a Block and a rendering scale, produce an `Organism`
 * whose segment array can be drawn directly to Canvas 2D or converted to
 * WebGL vertex data.
 *
 * Design: each organism is a small radial botanical form in the Haeckel
 * register — a flower with a small pistil, a handful of petals, and
 * optional tendrils for high-transaction blocks. The form is seeded by
 * the block's hash so the mapping is deterministic; a given block always
 * produces the same geometry. Block properties drive the parameters:
 *
 *   size           → overall radius
 *   txCount        → petal count
 *   feeRate        → petal curl, tendril density
 *   hash           → rotation, asymmetry, fine variation
 *   hash[0..3]     → orange-core threshold (low-hash-prefix blocks were
 *                    mined against high difficulty and earn a Bitcoin
 *                    orange center)
 */

import { hashSeed, mulberry32 } from "@/sketches/lib/rng";
import type { Block, Organism, Segment } from "./types";

/**
 * Convert the first 32 bits of a hex hash into a 32-bit unsigned integer.
 * Defensive against short or invalid hashes.
 */
export function hashToSeed(hexHash: string): number {
  if (hexHash.length < 8) return hashSeed(hexHash);
  // Interpret first 8 hex chars as unsigned integer.
  const prefix = hexHash.slice(0, 8);
  const n = Number.parseInt(prefix, 16);
  return Number.isFinite(n) ? n >>> 0 : hashSeed(hexHash);
}

/**
 * The orange-core threshold: blocks whose hash is below this numeric cap
 * get a Bitcoin-orange pistil. Roughly 1/64 of blocks (first hex nibble is
 * zero), calibrated to be visually rare but not accidental.
 */
const ORANGE_CORE_THRESHOLD = 0x04000000;

export function generateOrganism(block: Block, scale: number): Organism {
  const seed = hashToSeed(block.hash);
  const rng = mulberry32(seed);

  // Base radius: scale × factor-of-block-size (log-compressed).
  const sizeFactor = Math.log2(Math.max(1, block.size / 1024)) / 12; // kB, log-compressed
  const radius = scale * (0.55 + Math.min(0.9, sizeFactor * 0.8));

  const petalCount =
    3 + Math.floor(rng() * 5) + Math.min(3, Math.floor(block.txCount / 800));
  const baseRotation = rng() * Math.PI * 2;
  const curl = (rng() - 0.5) * 0.4 + (block.feeRate > 20 ? 0.25 : 0);
  const chirality = rng() < 0.5 ? -1 : 1;

  const segments: Segment[] = [];
  let totalLength = 0;

  // Central pistil: a short vertical mark.
  const pistilLen = radius * 0.18;
  segments.push({
    x1: 0,
    y1: -pistilLen * 0.35,
    x2: 0,
    y2: pistilLen * 0.65,
    weight: 1.2,
    kind: 3,
  });
  totalLength += pistilLen;

  // Petals — each is a small arc rendered as ~5 short chord segments.
  for (let p = 0; p < petalCount; p++) {
    const angle = baseRotation + (p / petalCount) * Math.PI * 2 + rng() * 0.08;
    const length = radius * (0.72 + rng() * 0.3);
    const thickness = 0.8 + rng() * 0.6;

    const arcCurl = chirality * (curl + (rng() - 0.5) * 0.1);
    const segCount = 4 + Math.floor(rng() * 3);

    for (let s = 0; s < segCount; s++) {
      const t0 = s / segCount;
      const t1 = (s + 1) / segCount;
      const theta0 = angle + arcCurl * t0 * t0;
      const theta1 = angle + arcCurl * t1 * t1;
      const r0 = length * t0;
      const r1 = length * t1;

      const x1 = Math.cos(theta0) * r0;
      const y1 = Math.sin(theta0) * r0;
      const x2 = Math.cos(theta1) * r1;
      const y2 = Math.sin(theta1) * r1;

      // Taper: thicker at root, thinner at tip.
      const weight = thickness * (1 - t1 * 0.7);
      const kind: Segment["kind"] = s === segCount - 1 ? 2 : 1;

      segments.push({ x1, y1, x2, y2, weight, kind });
      totalLength += Math.hypot(x2 - x1, y2 - y1);

      // Petal tip filigree on some petals (driven by rng, biased by fee rate).
      if (s === segCount - 1 && rng() < 0.15 + Math.min(0.3, block.feeRate / 120)) {
        const filigreeLen = length * 0.12;
        const perpAngle = theta1 + Math.PI / 2;
        const fx = x2 + Math.cos(perpAngle) * filigreeLen * chirality;
        const fy = y2 + Math.sin(perpAngle) * filigreeLen * chirality;
        segments.push({
          x1: x2,
          y1: y2,
          x2: fx,
          y2: fy,
          weight: weight * 0.6,
          kind: 2,
        });
      }
    }
  }

  // Tendrils for busy blocks: a couple of wispy loose lines at the core.
  const tendrilCount = Math.min(3, Math.floor(block.txCount / 1200));
  for (let t = 0; t < tendrilCount; t++) {
    const ang = rng() * Math.PI * 2;
    const len = radius * (0.25 + rng() * 0.2);
    segments.push({
      x1: 0,
      y1: 0,
      x2: Math.cos(ang) * len,
      y2: Math.sin(ang) * len,
      weight: 0.6,
      kind: 0,
    });
  }

  const hasOrangeCore = seed < ORANGE_CORE_THRESHOLD;

  return {
    segments,
    radius,
    petalCount,
    density: Math.min(1, totalLength / (radius * petalCount * 1.6)),
    hasOrangeCore,
  };
}
