/**
 * Time Preference Forest — Austrian Business Cycle Theory state model.
 *
 * Pure functions only. The rendering layer consumes this state to produce
 * the woodcut forest visualisation.
 *
 * The model encodes four Austrian claims:
 *
 *  1. Low time preference deepens real capital (tall trees, deep roots).
 *  2. Savings translates into longer production structures over time.
 *  3. Central-bank intervention inflates the visible economy — the canopy —
 *     without adding to real capital depth (root system unchanged).
 *  4. Market correction reveals actual capital depth by stripping away the
 *     intervention-driven artificial growth.
 */

export interface ForestState {
  /** 0 = extreme patience, 1 = extreme present-orientation. */
  timePreference: number;
  /** 0..1 — intensity of central-bank intervention (credit expansion). */
  intervention: number;
  /** 0..1 — savings rate (shown after first correction). */
  savingsRate: number;
  /** Whether the user has experienced one correction cycle. */
  hasExperiencedCorrection: boolean;
  /** ms when the correction was triggered, else null. */
  correctionStartedAt: number | null;
  /** Derived: 0..1 progress through the 8-second correction cascade. */
  correctionProgress: number;
  /** Seed for deterministic geometry. Changes when user wants a new forest. */
  seed: string;
}

export const CORRECTION_DURATION_MS = 8000;

export const DEFAULT_STATE: ForestState = {
  timePreference: 0.35,
  intervention: 0,
  savingsRate: 0.5,
  hasExperiencedCorrection: false,
  correctionStartedAt: null,
  correctionProgress: 0,
  seed: "forest-v1",
};

/**
 * Update state forward in time. Pure.
 * `now` is `performance.now()` or equivalent.
 */
export function tickCorrection(state: ForestState, now: number): ForestState {
  if (state.correctionStartedAt === null) return state;

  const elapsed = now - state.correctionStartedAt;
  const progress = Math.min(1, elapsed / CORRECTION_DURATION_MS);

  if (progress >= 1) {
    return {
      ...state,
      correctionStartedAt: null,
      correctionProgress: 0,
      intervention: 0,
      hasExperiencedCorrection: true,
    };
  }

  return {
    ...state,
    correctionProgress: progress,
    // During correction, intervention glow dissipates in the first quarter.
    intervention: progress < 0.25 ? state.intervention * (1 - progress / 0.25) : 0,
  };
}

export function beginCorrection(state: ForestState, now: number): ForestState {
  if (state.correctionStartedAt !== null) return state;
  return {
    ...state,
    correctionStartedAt: now,
    correctionProgress: 0,
  };
}

/* ------------------------------------------------------------------------- */
/* Derived metrics — used by both the renderer and the test suite.            */
/* ------------------------------------------------------------------------- */

/** Root depth is a function of low time preference and accumulated savings. */
export function rootDepth(state: ForestState): number {
  // Range 0..1. 0 = surface roots only. 1 = deepest.
  const patience = 1 - state.timePreference;
  return 0.15 + 0.55 * patience + 0.3 * state.savingsRate;
}

/** "Natural" tree height — what real capital depth warrants. */
export function naturalHeight(state: ForestState): number {
  // Taller trees correspond to deeper roots, roughly proportional.
  return rootDepth(state) * 0.95 + 0.05;
}

/** Canopy inflation from intervention. Adds apparent height above the natural. */
export function interventionBoost(state: ForestState): number {
  // At correction-progress 0..0.25 the boost is still visible but fading.
  // At >0.25 the boost is 0.
  if (state.correctionStartedAt !== null && state.correctionProgress > 0.25) {
    return 0;
  }
  return state.intervention * 0.5;
}

/** Degree of tree "falling" during correction. 0 = upright, 1 = flat. */
export function fallAmount(state: ForestState): number {
  if (state.correctionStartedAt === null) return 0;
  if (state.correctionProgress < 0.25) return 0;
  if (state.correctionProgress > 0.85) return 1;
  return (state.correctionProgress - 0.25) / 0.6;
}

/** Darkness of the artificial/intervention-grown parts during correction. */
export function blacknessOfInflation(state: ForestState): number {
  if (state.correctionStartedAt === null) return 0;
  const p = state.correctionProgress;
  if (p < 0.25) return 0;
  if (p > 0.75) return 1;
  return (p - 0.25) / 0.5;
}
