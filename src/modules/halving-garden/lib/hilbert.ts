/**
 * Hilbert curve — bijective mapping between a 1D index and a 2D grid cell.
 *
 * Preserves locality: consecutive indices map to adjacent cells. That is
 * the whole reason the Halving Garden uses it: consecutive Bitcoin blocks
 * sit together on the canvas, so difficulty adjustments and miner clusters
 * show up as visible spatial ripples.
 *
 * Reference implementation follows Wikipedia's section on "Applications
 * and mapping algorithms." `n` is the grid side (a power of two).
 */

export type HilbertOrder = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** Grid side length for a given order. 2^order. */
export function gridSide(order: HilbertOrder): number {
  return 1 << order;
}

/** Total cell count for a given order. (2^order)^2. */
export function cellCount(order: HilbertOrder): number {
  const s = gridSide(order);
  return s * s;
}

/**
 * Convert a 1D Hilbert index to integer grid coordinates on an n × n grid.
 * `n` must be a power of two.
 */
export function d2xy(n: number, d: number): readonly [number, number] {
  let rx: number;
  let ry: number;
  let t = d;
  let x = 0;
  let y = 0;

  for (let s = 1; s < n; s <<= 1) {
    rx = 1 & (t >> 1);
    ry = 1 & (t ^ rx);
    if (ry === 0) {
      if (rx === 1) {
        x = s - 1 - x;
        y = s - 1 - y;
      }
      const tmp = x;
      x = y;
      y = tmp;
    }
    x += s * rx;
    y += s * ry;
    t >>= 2;
  }
  return [x, y];
}

/**
 * Inverse of d2xy: grid coordinates → 1D Hilbert index.
 */
export function xy2d(n: number, x0: number, y0: number): number {
  let x = x0;
  let y = y0;
  let d = 0;
  let rx: number;
  let ry: number;

  for (let s = n >> 1; s > 0; s >>= 1) {
    rx = (x & s) > 0 ? 1 : 0;
    ry = (y & s) > 0 ? 1 : 0;
    d += s * s * ((3 * rx) ^ ry);
    if (ry === 0) {
      if (rx === 1) {
        x = s - 1 - x;
        y = s - 1 - y;
      }
      const tmp = x;
      x = y;
      y = tmp;
    }
  }
  return d;
}

/**
 * Map a linear index into [0, 1)² space on an order-`order` Hilbert curve.
 * Useful when the caller's real data has a non-power-of-two count — they
 * normalize into the curve's cell count first.
 */
export function hilbertNormalized(
  linearIndex: number,
  totalItems: number,
  order: HilbertOrder,
): readonly [number, number] {
  const n = gridSide(order);
  const cells = cellCount(order);
  const clamped = Math.max(0, Math.min(totalItems - 1, linearIndex));
  const d = Math.floor((clamped / Math.max(1, totalItems)) * cells);
  const [x, y] = d2xy(n, d);
  return [x / n, y / n];
}
