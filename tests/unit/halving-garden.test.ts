import {
  EPOCHS,
  getEpoch,
  heightWithinEpoch,
} from "@/modules/halving-garden/lib/epochs";
import {
  d2xy,
  gridSide,
  hilbertNormalized,
  xy2d,
} from "@/modules/halving-garden/lib/hilbert";
import { generateOrganism } from "@/modules/halving-garden/lib/organism";
import { generateSyntheticBlocks } from "@/modules/halving-garden/lib/synthetic";
import type { Block } from "@/modules/halving-garden/lib/types";
import { describe, expect, it } from "vitest";

describe("halving-garden — Hilbert curve", () => {
  it("d2xy and xy2d are inverses on an 8×8 grid", () => {
    const n = 8;
    for (let d = 0; d < n * n; d++) {
      const [x, y] = d2xy(n, d);
      const back = xy2d(n, x, y);
      expect(back).toBe(d);
    }
  });

  it("d2xy is a bijection on a 16×16 grid", () => {
    const n = 16;
    const seen = new Set<string>();
    for (let d = 0; d < n * n; d++) {
      const [x, y] = d2xy(n, d);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(n);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThan(n);
      seen.add(`${x},${y}`);
    }
    expect(seen.size).toBe(n * n);
  });

  it("preserves locality: consecutive indices map to adjacent cells", () => {
    const n = 16;
    for (let d = 0; d < n * n - 1; d++) {
      const [x1, y1] = d2xy(n, d);
      const [x2, y2] = d2xy(n, d + 1);
      const chebyshev = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
      expect(chebyshev).toBe(1);
    }
  });

  it("hilbertNormalized returns coordinates in [0, 1)", () => {
    const [x, y] = hilbertNormalized(42_000, 100_000, 10);
    expect(x).toBeGreaterThanOrEqual(0);
    expect(x).toBeLessThan(1);
    expect(y).toBeGreaterThanOrEqual(0);
    expect(y).toBeLessThan(1);
  });

  it("known order-2 values match Wikipedia reference", () => {
    const n = gridSide(1); // order 1 → 2x2
    expect(d2xy(n, 0)).toEqual([0, 0]);
    expect(d2xy(n, 1)).toEqual([0, 1]);
    expect(d2xy(n, 2)).toEqual([1, 1]);
    expect(d2xy(n, 3)).toEqual([1, 0]);
  });
});

/* ================================================================ */

describe("halving-garden — epochs", () => {
  it("genesis block is epoch 0", () => {
    expect(getEpoch(0).index).toBe(0);
  });

  it("block 209999 is epoch 0; block 210000 is epoch 1", () => {
    expect(getEpoch(209_999).index).toBe(0);
    expect(getEpoch(210_000).index).toBe(1);
  });

  it("block 840000 is epoch 4 with 3.125 subsidy", () => {
    const e = getEpoch(840_000);
    expect(e.index).toBe(4);
    expect(e.subsidy).toBe(3.125);
  });

  it("halvings are every 210,000 blocks", () => {
    for (let i = 1; i < EPOCHS.length; i++) {
      expect(EPOCHS[i]?.startHeight).toBe(i * 210_000);
    }
  });

  it("subsidy halves each epoch", () => {
    for (let i = 1; i < EPOCHS.length; i++) {
      expect(EPOCHS[i]?.subsidy).toBeCloseTo((EPOCHS[i - 1]?.subsidy ?? 0) / 2, 6);
    }
  });

  it("heightWithinEpoch is zero at epoch start", () => {
    expect(heightWithinEpoch(0)).toBe(0);
    expect(heightWithinEpoch(210_000)).toBe(0);
    expect(heightWithinEpoch(840_000)).toBe(0);
  });
});

/* ================================================================ */

describe("halving-garden — organism geometry", () => {
  const block: Block = {
    height: 500_000,
    hash: "0000000000000000000a0b1c2d3e4f5061728394a5b6c7d8e9f0a1b2c3d4e5f6",
    timestamp: 1500000000,
    size: 800_000,
    txCount: 2500,
    feeRate: 30,
  };

  it("same hash → identical geometry", () => {
    const a = generateOrganism(block, 10);
    const b = generateOrganism(block, 10);
    expect(a.segments).toEqual(b.segments);
    expect(a.radius).toBe(b.radius);
  });

  it("different hashes produce different geometries", () => {
    const b1 = { ...block, hash: `1${block.hash.slice(1)}` };
    const b2 = { ...block, hash: `2${block.hash.slice(1)}` };
    const a = generateOrganism(b1, 10);
    const b = generateOrganism(b2, 10);
    expect(a.segments).not.toEqual(b.segments);
  });

  it("all segments lie within the bounding radius", () => {
    const o = generateOrganism(block, 12);
    for (const seg of o.segments) {
      const r1 = Math.hypot(seg.x1, seg.y1);
      const r2 = Math.hypot(seg.x2, seg.y2);
      expect(Math.max(r1, r2)).toBeLessThanOrEqual(o.radius * 1.05);
    }
  });

  it("petal count is within expected range", () => {
    const o = generateOrganism(block, 10);
    expect(o.petalCount).toBeGreaterThanOrEqual(3);
    expect(o.petalCount).toBeLessThanOrEqual(16);
  });

  it("orange core is rare (< ~5% of blocks on a synthetic sample)", () => {
    const blocks = generateSyntheticBlocks({ seed: "orange-core-v1", count: 1000 });
    const orangeCount = blocks.filter(
      (b) => generateOrganism(b, 10).hasOrangeCore,
    ).length;
    // Threshold is 1/64 ≈ 1.5%, but we allow slack for sampling noise.
    expect(orangeCount).toBeLessThan(50);
  });

  it("higher fee rate tends to produce more segments (tendrils + filigree)", () => {
    const low = { ...block, feeRate: 2 };
    const high = { ...block, feeRate: 80 };
    // Sample multiple hashes to average out hash-variation noise.
    let lowTotal = 0;
    let highTotal = 0;
    for (let i = 0; i < 40; i++) {
      const hash = `${i.toString(16).padStart(2, "0")}${block.hash.slice(2)}`;
      lowTotal += generateOrganism({ ...low, hash }, 10).segments.length;
      highTotal += generateOrganism({ ...high, hash }, 10).segments.length;
    }
    expect(highTotal).toBeGreaterThan(lowTotal);
  });
});

/* ================================================================ */

describe("halving-garden — synthetic blocks", () => {
  it("generates a deterministic dataset per seed", () => {
    const a = generateSyntheticBlocks({ seed: "det-v1", count: 50 });
    const b = generateSyntheticBlocks({ seed: "det-v1", count: 50 });
    expect(a).toEqual(b);
  });

  it("block heights are monotonically nondecreasing", () => {
    const blocks = generateSyntheticBlocks({ seed: "mono-v1", count: 100 });
    for (let i = 1; i < blocks.length; i++) {
      expect(blocks[i]?.height).toBeGreaterThanOrEqual(blocks[i - 1]?.height ?? 0);
    }
  });

  it("hashes are 64-character hex strings", () => {
    const blocks = generateSyntheticBlocks({ seed: "hash-v1", count: 10 });
    for (const b of blocks) {
      expect(b.hash).toMatch(/^[0-9a-f]{64}$/);
    }
  });

  it("covers multiple epochs when tipHeight spans them", () => {
    const blocks = generateSyntheticBlocks({
      seed: "epoch-cover-v1",
      count: 300,
      tipHeight: 900_000,
    });
    const epochIndices = new Set(blocks.map((b) => getEpoch(b.height).index));
    expect(epochIndices.size).toBeGreaterThan(2);
  });
});
