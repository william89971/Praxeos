import {
  DEFAULT_MARKET_ASSUMPTIONS,
  MARKET_GUIDED_ACTIONS,
  type MarketAction,
  marketEngine,
  replayMarket,
} from "@/labs/market-without-a-manager/engine";
import { describe, expect, it } from "vitest";

const action = (id: string): MarketAction => {
  const found = MARKET_GUIDED_ACTIONS.find((item) => item.id === id);
  if (!found) throw new Error(`Missing action ${id}`);
  return found;
};

describe("Market Without a Manager engine", () => {
  it("is deterministic and replayable from seed, assumptions, and actions", () => {
    const actions = MARKET_GUIDED_ACTIONS.slice(0, 7);
    const first = replayMarket("same-seed", DEFAULT_MARKET_ASSUMPTIONS, actions);
    const second = replayMarket("same-seed", DEFAULT_MARKET_ASSUMPTIONS, actions);
    expect(second).toEqual(first);
    expect(marketEngine.validate(first)).toEqual([]);
  });

  it("rejects barter when the seller does not rank the offered good above the surrendered good", () => {
    const before = replayMarket("market", DEFAULT_MARKET_ASSUMPTIONS, [
      action("meet-market"),
      action("inspect-priorities"),
    ]);
    const after = marketEngine.reduce(before, action("barter-ada-cleo"));
    expect(after.offers.at(-1)).toMatchObject({
      status: "rejected",
      offeredGood: "apples",
      requestedGood: "cloth",
    });
    expect(after.trades).toHaveLength(0);
    expect(after.participants).toEqual(before.participants);
  });

  it("does not display an unaccepted offer as a price", () => {
    const state = replayMarket("market", DEFAULT_MARKET_ASSUMPTIONS, [
      ...MARKET_GUIDED_ACTIONS.slice(0, 4),
      action("low-offer-bread"),
    ]);
    expect(state.offers.at(-1)?.status).toBe("rejected");
    expect(state.trades).toHaveLength(0);
    expect(marketEngine.derive(state).displayedPrices).toEqual({});
  });

  it("changes inventories and records a price only after a completed monetary trade", () => {
    const state = replayMarket(
      "market",
      DEFAULT_MARKET_ASSUMPTIONS,
      MARKET_GUIDED_ACTIONS.slice(0, 6),
    );
    const trade = state.trades.at(-1);
    expect(trade).toMatchObject({
      buyerId: "ada",
      sellerId: "ben",
      good: "bread",
      moneyPrice: 4,
    });
    expect(state.participants.find((item) => item.id === "ada")?.inventory.bread).toBe(
      1,
    );
    expect(state.participants.find((item) => item.id === "ben")?.inventory.bread).toBe(
      2,
    );
    expect(marketEngine.derive(state).displayedPrices.bread).toBe(4);
    expect(marketEngine.validate(state)).toEqual([]);
  });

  it("derives shortage from remaining inventory and unmet ranked wants", () => {
    const state = replayMarket(
      "market",
      DEFAULT_MARKET_ASSUMPTIONS,
      MARKET_GUIDED_ACTIONS.slice(0, 8),
    );
    const metrics = marketEngine.derive(state);
    expect(state.externalRemovals.bread).toBe(1);
    expect(metrics.remainingSupply.bread).toBe(2);
    expect(metrics.unmetFirstPriorities).toBeGreaterThan(0);
    expect(metrics.shortages).toContain("bread");
  });

  it("blocks an above-ceiling offer without creating a trade or price", () => {
    const before = replayMarket(
      "market",
      DEFAULT_MARKET_ASSUMPTIONS,
      MARKET_GUIDED_ACTIONS.slice(0, 8),
    );
    const after = marketEngine.reduce(before, action("bread-ceiling"));
    expect(after.priceCeilings.bread).toBe(2);
    expect(after.offers.at(-1)?.status).toBe("blocked");
    expect(after.trades).toHaveLength(before.trades.length);
    expect(marketEngine.derive(after).displayedPrices.bread).toBe(4);
    expect(marketEngine.validate(after)).toEqual([]);
  });

  it("preserves state when the same action is replayed twice", () => {
    const state = marketEngine.reduce(
      marketEngine.create("market", DEFAULT_MARKET_ASSUMPTIONS),
      action("meet-market"),
    );
    expect(marketEngine.reduce(state, action("meet-market"))).toBe(state);
  });

  it("advances exactly once per guided action and reaches the interpretation stage", () => {
    const state = replayMarket(
      "market",
      DEFAULT_MARKET_ASSUMPTIONS,
      MARKET_GUIDED_ACTIONS,
    );
    expect(state.guidedStep).toBe(10);
    expect(state.completed).toBe(true);
    expect(
      state.events.some((event) => event.actionId === "bread-ceiling-blocked-offer"),
    ).toBe(true);
  });

  it("changes inspectable initial conditions when assumptions change", () => {
    const five = marketEngine.create("market", DEFAULT_MARKET_ASSUMPTIONS);
    const four = marketEngine.create("market", {
      ...DEFAULT_MARKET_ASSUMPTIONS,
      participantCount: 4,
    });
    expect(five.participants).toHaveLength(5);
    expect(four.participants).toHaveLength(4);
  });
});
