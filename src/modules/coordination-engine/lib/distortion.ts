/**
 * Coordination Engine — signal state → derived parameters.
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

export type CoordMode = "guided" | "explore";
export type CoordPulseKind = "demand" | "supply";

export interface CoordPulse {
  readonly nodeId: number;
  readonly kind: CoordPulseKind;
  readonly nonce: number;
}

export interface CoordState {
  readonly reliability: number;
  readonly latency: number;
  readonly shock: number;
}

export const DEFAULT_COORD_STATE: CoordState = {
  reliability: 0.78,
  latency: 0.22,
  shock: 0,
};

export function paramsForState(state: CoordState): CoordParams {
  const reliability = clamp01(state.reliability);
  const latency = clamp01(state.latency);
  const shock = clamp01(state.shock);
  const d = clamp01((1 - reliability) * 0.7 + latency * 0.45 + shock * 0.5);
  return {
    coherence: clamp01(reliability * (1 - latency * 0.55) - shock * 0.35),
    throughput: clamp01(reliability - latency * 0.22 - shock * 0.28),
    intensity: clamp01(0.35 + reliability * 0.55 - shock * 0.2),
    corruption: d,
    breakage: clamp01(smoothstep(0.25, 0.95, d) + (1 - reliability) * 0.3),
  };
}

export interface CoordMetrics {
  readonly coherence: number;
  readonly throughput: number;
  readonly failedLinks: number;
  readonly missedPlans: number;
}

export function metricsForState(state: CoordState): CoordMetrics {
  const params = paramsForState(state);
  return {
    coherence: Math.round(params.coherence * 100),
    throughput: Math.round(params.throughput * 100),
    failedLinks: Math.round(params.breakage * 100),
    missedPlans: Math.round(
      clamp01(
        (1 - params.coherence) * 0.65 + state.latency * 0.25 + state.shock * 0.35,
      ) * 100,
    ),
  };
}

export function easeTowards(current: number, target: number, factor = 0.12): number {
  return current + (target - current) * factor;
}

export function paramsFor(distortion: number): CoordParams {
  return paramsForState({
    reliability: clamp01(1 - distortion),
    latency: clamp01(distortion * 0.7),
    shock: 0,
  });
}

export function easeCoordState(
  current: CoordState,
  target: CoordState,
  factor = 0.12,
): CoordState {
  return {
    reliability: easeTowards(current.reliability, target.reliability, factor),
    latency: easeTowards(current.latency, target.latency, factor),
    shock: easeTowards(current.shock, target.shock, factor),
  };
}
