import { DEFAULT_PARAMS, step } from "@/modules/calculation-problem/lib/engine";
import { init } from "@/modules/calculation-problem/lib/init";
import type { State } from "@/modules/calculation-problem/lib/types";
import { describe, expect, it } from "vitest";

/**
 * Four Misesian invariants.
 *
 * These tests are load-bearing. If they regress the module has lost its
 * pedagogical claim and should not ship.
 */

function runFor(state: State, ticks: number): State {
  let s = state;
  for (let i = 0; i < ticks; i++) s = step(s, DEFAULT_PARAMS);
  return s;
}

describe("calc engine — Misesian invariants", () => {
  /* ================================================================ */
  it("market prices converge (mean abs change trends down) under fixed shocks", () => {
    const state = init({
      G: 12,
      consumerCount: 30,
      producerCount: 24,
      mode: "market",
      seed: "convergence-test-v1",
      width: 100,
      height: 100,
    });

    const final = runFor(state, 120);

    // Check that price-delta in the last 20 ticks is lower than in the first 20.
    const hist = final.priceDeltaHistory;
    expect(hist.length).toBeGreaterThanOrEqual(40);
    const early = hist.slice(0, 20).reduce((a, b) => a + b, 0) / 20;
    const late = hist.slice(-20).reduce((a, b) => a + b, 0) / 20;

    // Late should be no higher than early (convergence).
    // Tight equality would be fragile; we allow small tolerance.
    expect(late).toBeLessThanOrEqual(early + 0.005);
  });

  /* ================================================================ */
  it("socialist waste grows meaningfully with economic complexity (G)", () => {
    const runWithG = (G: number): number => {
      // Scale producer count with G so coverage per good stays comparable;
      // the claim we're testing is about complexity, not sparsity.
      const state = init({
        G,
        consumerCount: 40,
        producerCount: Math.max(30, G * 2),
        mode: "planned",
        seed: "waste-vs-complexity-v1",
        width: 100,
        height: 100,
      });
      const after = runFor(state, 60);
      return after.totalWaste / after.tick;
    };

    const wasteSmall = runWithG(8);
    const wasteMedium = runWithG(32);
    const wasteLarge = runWithG(96);

    // Waste must grow with complexity — this is the Misesian claim.
    expect(wasteMedium).toBeGreaterThan(wasteSmall);
    expect(wasteLarge).toBeGreaterThan(wasteMedium);
    // And not trivially: 12× more goods should produce more than 3× the waste.
    expect(wasteLarge / Math.max(0.001, wasteSmall)).toBeGreaterThan(3);
  });

  /* ================================================================ */
  it("same seed produces an identical trajectory", () => {
    const makeAndRun = (mode: "market" | "planned") => {
      const s0 = init({
        G: 10,
        consumerCount: 20,
        producerCount: 18,
        mode,
        seed: "determinism-test-v1",
        width: 100,
        height: 100,
      });
      return runFor(s0, 40);
    };

    const a = makeAndRun("market");
    const b = makeAndRun("market");
    expect(a.totalTradeVolume).toBeCloseTo(b.totalTradeVolume, 6);
    expect(a.prices).toEqual(b.prices);
    expect(a.producers.map((p) => p.askPrice)).toEqual(
      b.producers.map((p) => p.askPrice),
    );

    const ap = makeAndRun("planned");
    const bp = makeAndRun("planned");
    expect(ap.totalWaste).toBeCloseTo(bp.totalWaste, 6);
    expect(ap.producers.map((p) => p.inventory)).toEqual(
      bp.producers.map((p) => p.inventory),
    );
  });

  /* ================================================================ */
  it("planner's arbitrary recipe choice varies with tick (showing no optimization)", () => {
    const s0 = init({
      G: 20,
      consumerCount: 20,
      producerCount: 30,
      mode: "planned",
      seed: "recipe-arbitrary-v1",
      width: 100,
      height: 100,
    });
    const s1 = step(s0);
    const s2 = step(s1);
    const s3 = step(s2);

    // For producers with multi-recipe options, at least ONE should differ
    // between ticks — proving the choice is tick-dependent, not optimising.
    const multiRecipeProducers = s0.producers.filter((p) => p.recipes.length > 1);
    const changed = multiRecipeProducers.filter((_, idx) => {
      const p1 = s1.producers.find((p) => p.id === multiRecipeProducers[idx]?.id);
      const p3 = s3.producers.find((p) => p.id === multiRecipeProducers[idx]?.id);
      return p1 && p3 && p1.chosenRecipeIdx !== p3.chosenRecipeIdx;
    });

    // With a reasonable seed and multi-recipe fraction, at least one should flip.
    // (Too strict would be flaky; this asserts the *capacity* for change, not
    // a specific instance.)
    expect(changed.length).toBeGreaterThan(0);
  });

  /* ================================================================ */
  it("market-mode consumer satisfaction is higher than planned at moderate G", () => {
    const make = (mode: "market" | "planned") =>
      runFor(
        init({
          G: 24,
          consumerCount: 30,
          producerCount: 30,
          mode,
          seed: "satisfaction-v1",
          width: 100,
          height: 100,
        }),
        80,
      );

    const market = make("market");
    const planned = make("planned");

    const avgSat = (s: State) =>
      s.consumers.reduce((a, c) => a + c.satisfaction, 0) /
      Math.max(1, s.consumers.length) /
      s.tick;

    expect(avgSat(market)).toBeGreaterThan(avgSat(planned));
  });
});
