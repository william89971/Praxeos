import {
  DEFAULT_DISCOVERY_ASSUMPTIONS,
  DISCOVERY_EXPLORE_ACTIONS,
  DISCOVERY_GUIDED_ACTIONS,
  discoveryEngine,
} from "@/labs/entrepreneurs-discovery/engine";
import { describe, expect, it } from "vitest";

describe("Entrepreneur's Discovery engine", () => {
  it("replays a seeded environment deterministically", () => {
    const run = () =>
      DISCOVERY_GUIDED_ACTIONS.reduce(
        (state, action) => discoveryEngine.reduce(state, action),
        discoveryEngine.create("discovery-test", DEFAULT_DISCOVERY_ASSUMPTIONS),
      );
    expect(run()).toEqual(run());
    expect(run().completed).toBe(true);
    expect(run().decision).toBe("pivot");
  });

  it("spends resources while preserving material uncertainty", () => {
    const state = DISCOVERY_GUIDED_ACTIONS.reduce(
      (current, action) => discoveryEngine.reduce(current, action),
      discoveryEngine.create("discovery-test", DEFAULT_DISCOVERY_ASSUMPTIONS),
    );
    expect(state.timeRemaining).toBe(2);
    expect(state.capitalRemaining).toBe(35);
    expect(state.results).toHaveLength(3);
    expect(state.uncertainty).toBeGreaterThanOrEqual(28);
    expect(discoveryEngine.validate(state)).toEqual([]);
  });

  it("rejects an experiment when its resources are unavailable", () => {
    const experiment = DISCOVERY_EXPLORE_ACTIONS[0];
    if (!experiment) throw new Error("Missing experiment");
    let state = discoveryEngine.create("resource-test", DEFAULT_DISCOVERY_ASSUMPTIONS);
    for (let index = 0; index < 7; index += 1) {
      state = discoveryEngine.reduce(state, experiment);
    }
    const rejected = discoveryEngine.reduce(state, experiment);
    expect(rejected).toBe(state);
    expect(state.timeRemaining).toBe(0);
  });

  it("does not predetermine one experiment outcome for every seed", () => {
    const experiment = DISCOVERY_EXPLORE_ACTIONS[0];
    if (!experiment) throw new Error("Missing experiment");
    const signals = new Set(
      Array.from({ length: 18 }, (_, index) => {
        const state = discoveryEngine.reduce(
          discoveryEngine.create(`seed-${index}`, DEFAULT_DISCOVERY_ASSUMPTIONS),
          experiment,
        );
        return state.results[0]?.signal;
      }),
    );
    expect(signals.size).toBeGreaterThan(1);
  });
});
