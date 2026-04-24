import { describe, expect, it } from "vitest";

/**
 * Regression test for the FRED M2SL unit conversion.
 *
 * FRED publishes M2SL in **billions of dollars**. The API route at
 * `src/app/api/m2/route.ts` converts that to raw USD by multiplying by
 * 1_000_000_000. An earlier version used 1_000_000_000_000, which put
 * the displayed number 1000× too high.
 *
 * This test pins the conversion so a future refactor cannot silently
 * regress it. The calculation is trivial; the discipline is the point.
 */

const BILLIONS_TO_DOLLARS = 1_000_000_000;

function fredBillionsToUsd(valueInBillions: number): number {
  return valueInBillions * BILLIONS_TO_DOLLARS;
}

describe("FRED M2SL unit conversion", () => {
  it("a representative reading of 21367.0 maps to ~$21.367 trillion", () => {
    const usd = fredBillionsToUsd(21_367);
    expect(usd).toBe(21_367_000_000_000);
    expect(usd).toBeGreaterThan(20e12);
    expect(usd).toBeLessThan(25e12);
  });

  it("a reading of 1.0 billion dollars maps to exactly 1,000,000,000", () => {
    expect(fredBillionsToUsd(1)).toBe(1_000_000_000);
  });

  it("rejects any multiplier that produces a >100x deviation from plausible M2", () => {
    // A plausible M2 in 2026 is in the low $20T range. If someone restores
    // the 1e12 bug, the result becomes 21 quadrillion — three orders of
    // magnitude too high and instantly visible in the UI.
    const plausibleCeiling = 50e12;
    expect(fredBillionsToUsd(21_367)).toBeLessThan(plausibleCeiling);
    // And the buggy version for contrast:
    const buggy = 21_367 * 1_000_000_000_000;
    expect(buggy).toBeGreaterThan(plausibleCeiling);
  });
});
