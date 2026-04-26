/**
 * Coordination Engine — distortion → derived parameters.
 */

const clamp01 = (n: number): number => Math.max(0, Math.min(1, n));

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export interface CoordParams {
  /** 0..1 — phase coherence across the network. 1 = fully synchronized. */
  readonly coherence: number;
  /** 0..1 — probability that each edge is currently transmitting. */
  readonly throughput: number;
  /** 0..1 — pulse intensity (signal brightness on edges). */
  readonly intensity: number;
  /** 0..1 — corruption color shift from amber → oxblood. */
  readonly corruption: number;
  /** 0..1 — fraction of edges that are intermittently broken. */
  readonly breakage: number;
}

export function paramsFor(distortion: number): CoordParams {
  const d = clamp01(distortion);
  return {
    coherence: 1 - smoothstep(0.05, 0.95, d),
    throughput: clamp01(1 - 1.05 * d),
    intensity: clamp01(1 - 0.55 * d),
    corruption: d,
    breakage: smoothstep(0.35, 0.95, d),
  };
}

export function easeTowards(current: number, target: number, factor = 0.12): number {
  return current + (target - current) * factor;
}
