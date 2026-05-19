import { evaluateChallenges, runtimeSearchParams } from "@/lib/module-runtime";
import { calculationLabyrinthRuntime } from "@/modules/calculation-labyrinth/runtime";
import { coordinationEngineRuntime } from "@/modules/coordination-engine/runtime";
import { monetaryGardenRuntime } from "@/modules/monetary-garden/runtime";
import { signalOrchardRuntime } from "@/modules/signal-orchard/runtime";
import { describe, expect, it } from "vitest";

describe("module runtime adapters", () => {
  it("hydrates and serializes Monetary Garden query state", () => {
    const state = monetaryGardenRuntime.deserialize(
      new URLSearchParams("credit=1.4&savings=-0.2&phase=correction"),
    );

    expect(state).toEqual({ credit: 1, savings: 0, phase: "correction" });
    expect(monetaryGardenRuntime.serialize(state)).toEqual({
      credit: "1.00",
      savings: "0.00",
      phase: "correction",
    });
  });

  it("evaluates Monetary Garden goals from pure state and metrics", () => {
    const state = { credit: 0.88, savings: 0.2, phase: "correction" as const };
    const metrics = monetaryGardenRuntime.deriveMetrics(state);
    const completed = evaluateChallenges(
      monetaryGardenRuntime,
      state,
      metrics,
      new Set(),
    );

    expect(completed.has("boom")).toBe(true);
    expect(completed.has("correction")).toBe(true);
  });

  it("keeps Signal Orchard share URLs focused on mode and selected action", () => {
    const params = runtimeSearchParams(
      signalOrchardRuntime,
      {
        mode: "explore",
        action: "discover",
        sentKinds: ["buy", "discover"],
        tappedActors: [2, 7],
      },
      new URLSearchParams("path=beginner&mode=guided"),
    );

    expect(params.toString()).toBe("path=beginner&mode=explore&action=discover");
  });

  it("detects Calculation Labyrinth priced completion and unpriced waste", () => {
    const pricedState = calculationLabyrinthRuntime.deserialize(
      new URLSearchParams("priced=1&challenge=0"),
    );
    const mazeMetrics = calculationLabyrinthRuntime.deriveMetrics({
      ...pricedState,
      current: { x: 9, y: 9 },
    });
    const pricedCompleted = evaluateChallenges(
      calculationLabyrinthRuntime,
      { ...pricedState, current: { x: 9, y: 9 } },
      mazeMetrics,
      new Set(),
    );

    const unpricedState = { ...pricedState, priced: false, waste: 3 };
    const unpricedCompleted = evaluateChallenges(
      calculationLabyrinthRuntime,
      unpricedState,
      calculationLabyrinthRuntime.deriveMetrics(unpricedState),
      pricedCompleted,
    );

    expect(pricedCompleted.has("priced-exit")).toBe(true);
    expect(unpricedCompleted.has("unpriced-attempt")).toBe(true);
  });

  it("requires a shock before Coordination Engine recovery can complete", () => {
    const stable = {
      mode: "explore" as const,
      reliability: 0.95,
      latency: 0.05,
      shock: 0,
    };
    const stableMetrics = coordinationEngineRuntime.deriveMetrics(stable);

    expect(
      evaluateChallenges(
        coordinationEngineRuntime,
        stable,
        stableMetrics,
        new Set(),
      ).has("restore"),
    ).toBe(false);

    const afterShock = new Set(["shock"]);
    expect(
      evaluateChallenges(
        coordinationEngineRuntime,
        stable,
        stableMetrics,
        afterShock,
      ).has("restore"),
    ).toBe(true);
  });
});
