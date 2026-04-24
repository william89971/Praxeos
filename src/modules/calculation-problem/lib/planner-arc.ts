/**
 * Calculation Problem — the "Be the Planner" three-act arc.
 *
 * Pure state. The sketch drives this with `tick(now)` on every frame while
 * the arc is running; the UI reads `phase`, `complexityForPhase`, and
 * `elapsedMs` to render.
 */

export type ArcPhase = "idle" | "act1" | "act2" | "act3" | "complete";

export interface ArcState {
  phase: ArcPhase;
  /** Monotonic ms since act1 began, or 0 when idle. */
  elapsedMs: number;
  /** Timestamp of the last start or null if idle. */
  startedAt: number | null;
}

export const ARC_ACT_DURATION_MS = 15_000;
export const ARC_TOTAL_MS = ARC_ACT_DURATION_MS * 3;

/** G ramp per phase. Idle defaults to the starting act-1 value so the sim
 *  doesn't jump when the user enters the arc. */
export const COMPLEXITY_BY_PHASE: Record<ArcPhase, number> = {
  idle: 8,
  act1: 8,
  act2: 48,
  act3: 160,
  complete: 160,
};

export const IDLE_STATE: ArcState = {
  phase: "idle",
  elapsedMs: 0,
  startedAt: null,
};

export function beginArc(now: number): ArcState {
  return { phase: "act1", elapsedMs: 0, startedAt: now };
}

export function cancelArc(): ArcState {
  return IDLE_STATE;
}

/**
 * Progress the arc. Returns the new state. Pure.
 * `now` is monotonic (performance.now() or similar).
 */
export function tickArc(state: ArcState, now: number): ArcState {
  if (state.phase === "idle" || state.phase === "complete") return state;
  if (state.startedAt === null) return state;

  const elapsedMs = Math.max(0, now - state.startedAt);

  if (elapsedMs >= ARC_TOTAL_MS) {
    return { phase: "complete", elapsedMs: ARC_TOTAL_MS, startedAt: state.startedAt };
  }

  const phase: ArcPhase =
    elapsedMs < ARC_ACT_DURATION_MS
      ? "act1"
      : elapsedMs < ARC_ACT_DURATION_MS * 2
        ? "act2"
        : "act3";

  return { phase, elapsedMs, startedAt: state.startedAt };
}

/**
 * 0..1 progress through the current act. Useful for visual cues.
 */
export function actProgress(state: ArcState): number {
  if (state.phase === "idle") return 0;
  if (state.phase === "complete") return 1;
  const phaseStart =
    state.phase === "act1"
      ? 0
      : state.phase === "act2"
        ? ARC_ACT_DURATION_MS
        : ARC_ACT_DURATION_MS * 2;
  return Math.min(1, (state.elapsedMs - phaseStart) / ARC_ACT_DURATION_MS);
}

/**
 * 0..1 progress through the full three-act arc.
 */
export function totalProgress(state: ArcState): number {
  if (state.phase === "idle") return 0;
  if (state.phase === "complete") return 1;
  return Math.min(1, state.elapsedMs / ARC_TOTAL_MS);
}
