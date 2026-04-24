/**
 * A fast, deterministic pseudo-random generator.
 * Mulberry32 — small, sufficient for visual sketches, not for cryptography.
 */
export type RNG = () => number;

export function mulberry32(seed: number): RNG {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hash a string into a 32-bit seed. */
export function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Uniform in [min, max). */
export function range(rng: RNG, min: number, max: number): number {
  return min + (max - min) * rng();
}

/** Pick one element. */
export function pick<T>(rng: RNG, items: readonly T[]): T {
  if (items.length === 0) throw new Error("pick: empty array");
  const idx = Math.floor(rng() * items.length);
  // biome-ignore lint/style/noNonNullAssertion: checked length above
  return items[idx]!;
}
