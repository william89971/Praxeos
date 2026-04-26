/**
 * Monetary Garden — distortion → derived parameters.
 *
 * Pure: a single `distortion ∈ [0, 1]` is mapped to every visible
 * parameter of the scene. Keeping this isolated makes the visual
 * lesson auditable: read this file to see exactly what the slider
 * does to the world.
 */

export interface GardenParams {
  /** 0..1 — water level / savings reservoir. 1 = full. */
  readonly waterLevel: number;
  /** 0..1.6 — instanced grass density multiplier. 1 = baseline. */
  readonly grassDensity: number;
  /** 0..1 — fraction of grass blades dyed oxblood (overgrowth → die-off). */
  readonly grassDecay: number;
  /** 0..1 — overall canopy health. 1 = lush. */
  readonly treeHealth: number;
  /** 0..1 — fraction of trees that have collapsed. */
  readonly treeCollapse: number;
  /** 0..1 — chaos applied to production-node pulse phase. */
  readonly nodeChaos: number;
  /** 0..1 — clarity of the price-signal paths. 1 = crisp, 0 = warped/dim. */
  readonly pathClarity: number;
  /** 0..1 — area fraction covered by dead zones. */
  readonly deadZoneArea: number;
  /** 0..1 — money-signal beam strength. */
  readonly signalStrength: number;
  /** 0..1 — interpolant from "sound money" green/orange to "broken" oxblood. */
  readonly signalCorruption: number;
}

const clamp01 = (n: number): number => Math.max(0, Math.min(1, n));

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function paramsFor(distortion: number): GardenParams {
  const d = clamp01(distortion);

  return {
    waterLevel: clamp01(1 - 0.85 * d),
    grassDensity: 1 + 1.4 * d - 0.7 * smoothstep(0.6, 1.0, d),
    grassDecay: smoothstep(0.55, 1.0, d),
    treeHealth: 1 - 0.85 * d ** 1.5,
    treeCollapse: smoothstep(0.62, 0.95, d),
    nodeChaos: d ** 1.2,
    pathClarity: clamp01(1 - 1.05 * d),
    deadZoneArea: clamp01((d - 0.38) * 1.7) ** 1.3,
    signalStrength: clamp01(1 - 0.7 * d),
    signalCorruption: d,
  };
}

/**
 * Per-frame eased distortion. The slider snaps; the scene breathes.
 * Returns the next eased value given the current and target.
 */
export function easeTowards(current: number, target: number, factor = 0.12): number {
  return current + (target - current) * factor;
}
