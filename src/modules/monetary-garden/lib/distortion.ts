/**
 * Monetary Garden — monetary state → derived parameters.
 *
 * Pure: the controls model the difference between credit expansion,
 * real savings, and the correction that reveals bad capital commitments.
 * Keeping this isolated makes the visual lesson auditable.
 */

export type GardenPhase = "boom" | "correction";

export interface GardenState {
  readonly credit: number;
  readonly savings: number;
  readonly phase: GardenPhase;
}

export const DEFAULT_GARDEN_STATE: GardenState = {
  credit: 0.35,
  savings: 0.72,
  phase: "boom",
};

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

export function stressFor(state: GardenState): number {
  const credit = clamp01(state.credit);
  const savingsGap = 1 - clamp01(state.savings);
  const correction = state.phase === "correction" ? 0.28 : 0;
  return clamp01(
    credit * 0.58 + savingsGap * 0.5 + credit * savingsGap * 0.35 + correction,
  );
}

export function paramsForState(state: GardenState): GardenParams {
  const credit = clamp01(state.credit);
  const savings = clamp01(state.savings);
  const correction = state.phase === "correction" ? 1 : 0;
  const gap = 1 - savings;
  const d = stressFor(state);
  const revealedMalinvestment = smoothstep(
    0.26,
    0.85,
    credit * gap + correction * 0.45,
  );

  return {
    waterLevel: clamp01(savings - credit * 0.42 - correction * gap * 0.25),
    grassDensity:
      0.75 + 1.15 * credit + 0.35 * savings - 0.65 * correction * revealedMalinvestment,
    grassDecay: clamp01(smoothstep(0.55, 1.0, d) + correction * 0.45 * gap),
    treeHealth: clamp01(
      1 - 0.45 * credit * gap - 0.55 * correction * revealedMalinvestment,
    ),
    treeCollapse: clamp01(smoothstep(0.48, 0.92, revealedMalinvestment)),
    nodeChaos: clamp01(credit * 0.55 + gap * 0.55 + correction * 0.35),
    pathClarity: clamp01(1 - credit * 0.62 - gap * 0.45 - correction * 0.2),
    deadZoneArea: clamp01(revealedMalinvestment) ** 1.25,
    signalStrength: clamp01(1 - credit * 0.36 - correction * 0.18),
    signalCorruption: d,
  };
}

export function paramsFor(distortion: number): GardenParams {
  return paramsForState({
    credit: clamp01(distortion),
    savings: clamp01(1 - distortion * 0.65),
    phase: distortion > 0.7 ? "correction" : "boom",
  });
}

export interface GardenMetrics {
  readonly savings: number;
  readonly signalClarity: number;
  readonly malinvestment: number;
  readonly output: number;
}

export function metricsFor(state: GardenState): GardenMetrics {
  const params = paramsForState(state);
  return {
    savings: params.waterLevel,
    signalClarity: params.pathClarity,
    malinvestment: params.deadZoneArea,
    output: clamp01(
      0.35 +
        params.grassDensity * 0.18 +
        params.treeHealth * 0.28 +
        params.pathClarity * 0.24 -
        params.deadZoneArea * 0.3,
    ),
  };
}

export function easeGardenState(
  current: GardenState,
  target: GardenState,
  factor = 0.12,
): GardenState {
  return {
    credit: easeTowards(current.credit, target.credit, factor),
    savings: easeTowards(current.savings, target.savings, factor),
    phase: target.phase,
  };
}

/**
 * Per-frame eased distortion. The slider snaps; the scene breathes.
 * Returns the next eased value given the current and target.
 */
export function easeTowards(current: number, target: number, factor = 0.12): number {
  return current + (target - current) * factor;
}
