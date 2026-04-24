import {
  CORRECTION_DURATION_MS,
  DEFAULT_STATE,
  type ForestState,
  beginCorrection,
  fallAmount,
  interventionBoost,
  naturalHeight,
  rootDepth,
  tickCorrection,
} from "@/modules/time-preference-forest/lib/abct";
import {
  forestMetrics,
  generateForest,
} from "@/modules/time-preference-forest/lib/forest";
import { describe, expect, it } from "vitest";

function at(patch: Partial<ForestState>): ForestState {
  return { ...DEFAULT_STATE, ...patch };
}

describe("time-preference forest — ABCT invariants", () => {
  it("low time preference produces deeper roots than high", () => {
    const patient = at({ timePreference: 0.1, savingsRate: 0.6 });
    const impatient = at({ timePreference: 0.9, savingsRate: 0.6 });
    expect(rootDepth(patient)).toBeGreaterThan(rootDepth(impatient));
  });

  it("higher savings rate produces taller natural canopy (without intervention)", () => {
    const low = at({ timePreference: 0.4, savingsRate: 0.1 });
    const high = at({ timePreference: 0.4, savingsRate: 0.9 });
    expect(naturalHeight(high)).toBeGreaterThan(naturalHeight(low));
  });

  it("intervention adds canopy boost without adding root depth", () => {
    const base = at({ timePreference: 0.5, savingsRate: 0.4, intervention: 0 });
    const inflated = at({
      timePreference: 0.5,
      savingsRate: 0.4,
      intervention: 0.9,
    });
    expect(rootDepth(inflated)).toBeCloseTo(rootDepth(base), 6);
    expect(interventionBoost(inflated)).toBeGreaterThan(0);
    expect(interventionBoost(base)).toBe(0);
  });

  it("correction cascade runs over 8000ms and clears intervention", () => {
    const pre = at({ intervention: 0.8 });
    const started = beginCorrection(pre, 1000);
    expect(started.correctionStartedAt).toBe(1000);

    // Mid-cascade: intervention fading, fall amount rising.
    const mid = tickCorrection(started, 1000 + CORRECTION_DURATION_MS * 0.5);
    expect(mid.correctionStartedAt).not.toBeNull();
    expect(mid.intervention).toBe(0); // gone after 25% mark
    expect(fallAmount(mid)).toBeGreaterThan(0);

    // After the duration: cascade terminates and intervention is zero.
    const done = tickCorrection(started, 1000 + CORRECTION_DURATION_MS + 10);
    expect(done.correctionStartedAt).toBeNull();
    expect(done.intervention).toBe(0);
    expect(done.hasExperiencedCorrection).toBe(true);
  });

  it("same state + seed produces identical forest geometry", () => {
    const s = at({ timePreference: 0.3, savingsRate: 0.6 });
    const a = generateForest({
      seed: "determinism-v1",
      width: 800,
      height: 500,
      state: s,
    });
    const b = generateForest({
      seed: "determinism-v1",
      width: 800,
      height: 500,
      state: s,
    });
    expect(forestMetrics(a)).toEqual(forestMetrics(b));
    // First tree's first segment matches exactly.
    expect(a.trees[0]?.segments[0]).toEqual(b.trees[0]?.segments[0]);
  });

  it("intervention produces artificial segments; correction removes them via boost = 0", () => {
    const w = 800;
    const h = 500;
    const intervened = generateForest({
      seed: "art-v1",
      width: w,
      height: h,
      state: at({ timePreference: 0.5, intervention: 0.8 }),
    });
    const natural = generateForest({
      seed: "art-v1",
      width: w,
      height: h,
      state: at({ timePreference: 0.5, intervention: 0 }),
    });
    expect(forestMetrics(intervened).artificialFraction).toBeGreaterThan(0);
    expect(forestMetrics(natural).artificialFraction).toBe(0);
  });

  it("mycorrhizal network appears only at low time preference + meaningful savings", () => {
    const w = 800;
    const h = 500;
    const noMyc = generateForest({
      seed: "myc-v1",
      width: w,
      height: h,
      state: at({ timePreference: 0.85, savingsRate: 0.8 }),
    });
    const hasMyc = generateForest({
      seed: "myc-v1",
      width: w,
      height: h,
      state: at({ timePreference: 0.15, savingsRate: 0.9 }),
    });
    expect(noMyc.mycorrhiza.length).toBe(0);
    expect(hasMyc.mycorrhiza.length).toBeGreaterThan(0);
  });
});
