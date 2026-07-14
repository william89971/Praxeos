import {
  DEFAULT_MONEY_ASSUMPTIONS,
  MONEY_GUIDED_ACTIONS,
  latestSnapshot,
  moneyActionById,
  moneyEngine,
} from "@/labs/money-time-machine/engine";
import { describe, expect, it } from "vitest";

describe("Money Time Machine engine", () => {
  it("replays the complete rule comparison deterministically", () => {
    const run = () =>
      MONEY_GUIDED_ACTIONS.reduce(
        (state, action) => moneyEngine.reduce(state, action),
        moneyEngine.create("money-test", DEFAULT_MONEY_ASSUMPTIONS),
      );
    expect(run()).toEqual(run());
    expect(run().completed).toBe(true);
    expect(run().comparisonRule).toBe("steady-growth");
  });

  it("derives different participant outcomes from timing and exposure assumptions", () => {
    const state = MONEY_GUIDED_ACTIONS.slice(0, 4).reduce(
      (current, action) => moneyEngine.reduce(current, action),
      moneyEngine.create("money-test", DEFAULT_MONEY_ASSUMPTIONS),
    );
    const snapshot = latestSnapshot(state, "credit-expansion", 3);
    expect(snapshot).not.toBeNull();
    expect(snapshot?.outcomes["asset-owner"]).not.toBe(snapshot?.outcomes.renter);
    expect(moneyEngine.derive(state).cards[2]?.value).not.toBe("0.0 pts");
  });

  it("recomputes outcomes when an inspectable assumption changes", () => {
    const selected = moneyActionById("select-credit-expansion");
    const advance = moneyActionById("advance-period-three");
    const sensitivity = moneyActionById("increase-pass-through");
    if (!selected || !advance || !sensitivity) throw new Error("Missing action");
    let state = moneyEngine.create("money-test", DEFAULT_MONEY_ASSUMPTIONS);
    state = moneyEngine.reduce(state, selected);
    state = moneyEngine.reduce(state, advance);
    const before = latestSnapshot(state, "credit-expansion", 3);
    state = moneyEngine.reduce(state, sensitivity);
    const after = latestSnapshot(state, "credit-expansion", 3);
    expect(after?.outcomes["asset-owner"]).not.toBe(before?.outcomes["asset-owner"]);
    expect(state.assumptions.passThrough).toBe(1.3);
  });

  it("keeps fixed-stock and expansion scenarios as comparisons, not forecasts", () => {
    const fixed = moneyActionById("explore-fixed-stock");
    const advance = moneyActionById("explore-period-four");
    if (!fixed || !advance) throw new Error("Missing action");
    let state = moneyEngine.create("money-test", DEFAULT_MONEY_ASSUMPTIONS);
    state = moneyEngine.reduce(state, fixed);
    state = moneyEngine.reduce(state, advance);
    expect(state.selectedRule).toBe("fixed-stock");
    expect(moneyEngine.validate(state)).toEqual([]);
    expect(moneyEngine.derive(state).summary).toContain("Illustrative outcomes");
  });
});
