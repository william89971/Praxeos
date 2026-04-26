/**
 * Monetary Garden — distortion → editorial band.
 *
 * Four bands, each with a one-sentence headline and a longer subline.
 * The slider triggers a crossfade between bands; copy is intentionally
 * Austrian in vocabulary and avoids the word "model" — this is meant
 * to read as observation, not simulation.
 */

export type BandIndex = 0 | 1 | 2 | 3;

export interface Band {
  readonly index: BandIndex;
  readonly label: string;
  readonly headline: string;
  readonly subline: string;
}

export const BANDS: readonly [Band, Band, Band, Band] = [
  {
    index: 0,
    label: "Steady",
    headline: "Signals are clear. Long-term coordination is possible.",
    subline:
      "Prices tell the truth about scarcity. Producers can plan, savers can wait, and capital structures lengthen because the discount rate is honest.",
  },
  {
    index: 1,
    label: "Warm",
    headline: "Consumption surges. Savings begin to erode.",
    subline:
      "Cheap money lifts demand before it lifts supply. The garden flushes green; underneath, the reservoir is dropping faster than anyone notices.",
  },
  {
    index: 2,
    label: "Feverish",
    headline: "The capital structure begins to distort.",
    subline:
      "Resources shift toward projects that look profitable only at the artificial price of credit. The trees grow unevenly; some lean past their roots.",
  },
  {
    index: 3,
    label: "Broken",
    headline: "Coordination fails when signals lose meaning.",
    subline:
      "Malinvestment spreads as patches in the ground. Production nodes flicker out of sync. The signal that was the entire point of money is gone.",
  },
];

const THRESHOLDS = [0.0, 0.27, 0.58, 0.83] as const;

export function bandFor(distortion: number): Band {
  if (distortion >= THRESHOLDS[3]) return BANDS[3];
  if (distortion >= THRESHOLDS[2]) return BANDS[2];
  if (distortion >= THRESHOLDS[1]) return BANDS[1];
  return BANDS[0];
}
