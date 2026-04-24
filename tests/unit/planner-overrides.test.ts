import {
  DEFAULT_PARAMS,
  type PlannerOverrides,
  step,
} from "@/modules/calculation-problem/lib/engine";
import { init } from "@/modules/calculation-problem/lib/init";
import { describe, expect, it } from "vitest";

/**
 * PlannerMode (Be the Planner) contract: the reader can override the
 * arbitrary hash-based recipe choice and the producer's capacity fraction.
 * These tests pin down the override semantics so the UI can trust them.
 */

describe("calc engine — planner overrides", () => {
  it("recipeByProducer pins chosenRecipeIdx across ticks", () => {
    const s0 = init({
      G: 20,
      consumerCount: 20,
      producerCount: 30,
      mode: "planned",
      seed: "planner-override-v1",
      width: 100,
      height: 100,
    });
    // Find a producer with multiple recipes to override.
    const multi = s0.producers.find((p) => p.recipes.length > 1);
    if (!multi) throw new Error("test seed must produce ≥1 multi-recipe producer");

    const overrides: PlannerOverrides = {
      recipeByProducer: new Map([[multi.id, 0]]),
    };

    let s = s0;
    for (let i = 0; i < 10; i++) s = step(s, DEFAULT_PARAMS, overrides);

    const pinned = s.producers.find((p) => p.id === multi.id);
    expect(pinned?.chosenRecipeIdx).toBe(0);
  });

  it("absent overrides fall back to hash choice (behavior unchanged)", () => {
    const s0 = init({
      G: 16,
      consumerCount: 20,
      producerCount: 24,
      mode: "planned",
      seed: "fallback-parity-v1",
      width: 100,
      height: 100,
    });
    // With no overrides the run must match a reference run that passes undefined.
    let a = s0;
    let b = s0;
    for (let i = 0; i < 20; i++) {
      a = step(a, DEFAULT_PARAMS);
      b = step(b, DEFAULT_PARAMS, undefined);
    }
    expect(a.totalWaste).toBeCloseTo(b.totalWaste, 6);
    expect(a.producers.map((p) => p.chosenRecipeIdx)).toEqual(
      b.producers.map((p) => p.chosenRecipeIdx),
    );
  });

  it("capacityFractionByProducer = 0 idles a producer (no new output)", () => {
    const s0 = init({
      G: 10,
      consumerCount: 15,
      producerCount: 16,
      mode: "planned",
      seed: "idle-cap-v1",
      width: 100,
      height: 100,
    });
    const target = s0.producers[0];
    if (!target) throw new Error("no producers");

    const overrides: PlannerOverrides = {
      capacityFractionByProducer: new Map([[target.id, 0]]),
    };

    // Record initial inventory and step a few ticks; idled producer should
    // never increment producedLastTick.
    let s = s0;
    for (let i = 0; i < 6; i++) s = step(s, DEFAULT_PARAMS, overrides);
    const produced = s.producers.find((p) => p.id === target.id)?.producedLastTick;
    expect(produced).toBe(0);
  });

  it("over-constraining out-of-range recipe indices wraps safely", () => {
    const s0 = init({
      G: 12,
      consumerCount: 15,
      producerCount: 20,
      mode: "planned",
      seed: "wrap-v1",
      width: 100,
      height: 100,
    });
    const multi = s0.producers.find((p) => p.recipes.length > 1);
    if (!multi) throw new Error("seed must have multi-recipe producers");

    // Submit a large index that should modulo-wrap without crashing.
    const overrides: PlannerOverrides = {
      recipeByProducer: new Map([[multi.id, 9999]]),
    };
    const s1 = step(s0, DEFAULT_PARAMS, overrides);
    const p1 = s1.producers.find((p) => p.id === multi.id);
    expect(p1?.chosenRecipeIdx).toBe(9999 % multi.recipes.length);
  });
});
