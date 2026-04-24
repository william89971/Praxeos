/**
 * Halving epochs.
 *
 * Each epoch begins at a height that is a multiple of 210,000 and has a
 * fixed subsidy. The first subsidy was 50 BTC; each halving cuts it in half.
 *
 * Dates are approximate (blocks do not arrive on a schedule), taken from
 * the actual on-chain halving timestamps.
 */

import type { Epoch } from "./types";

export const BLOCKS_PER_EPOCH = 210_000;

export const EPOCHS: readonly Epoch[] = [
  {
    index: 0,
    startHeight: 0,
    endHeight: 209_999,
    subsidy: 50,
    label: "Genesis",
    roman: "I",
    startDate: "2009-01-03",
    endDate: "2012-11-28",
  },
  {
    index: 1,
    startHeight: 210_000,
    endHeight: 419_999,
    subsidy: 25,
    label: "Settling",
    roman: "II",
    startDate: "2012-11-28",
    endDate: "2016-07-09",
  },
  {
    index: 2,
    startHeight: 420_000,
    endHeight: 629_999,
    subsidy: 12.5,
    label: "Institutional",
    roman: "III",
    startDate: "2016-07-09",
    endDate: "2020-05-11",
  },
  {
    index: 3,
    startHeight: 630_000,
    endHeight: 839_999,
    subsidy: 6.25,
    label: "Maturation",
    roman: "IV",
    startDate: "2020-05-11",
    endDate: "2024-04-20",
  },
  {
    index: 4,
    startHeight: 840_000,
    endHeight: 1_049_999,
    subsidy: 3.125,
    label: "Saturation",
    roman: "V",
    startDate: "2024-04-20",
    endDate: "(~2028)",
  },
] as const;

/**
 * Look up the epoch containing a given block height.
 * Heights beyond the currently-defined range return the last epoch.
 */
export function getEpoch(height: number): Epoch {
  for (const epoch of EPOCHS) {
    if (height >= epoch.startHeight && height <= epoch.endHeight) {
      return epoch;
    }
  }
  // Height is past the last defined epoch — return the last one as a
  // graceful fallback. (Real site would add more epochs as halvings occur.)
  const last = EPOCHS[EPOCHS.length - 1];
  if (!last) throw new Error("EPOCHS array is empty");
  return last;
}

/**
 * Relative height within the epoch. 0 for the first block of the epoch.
 */
export function heightWithinEpoch(height: number): number {
  const epoch = getEpoch(height);
  return height - epoch.startHeight;
}

/**
 * Tip height used as the upper bound for most preview computations. Defaults
 * to the approximate height at the project's cutoff (2026-04). Real data,
 * when integrated, will override.
 */
export const APPROX_CURRENT_HEIGHT = 945_000;
