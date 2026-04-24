/**
 * Calculation Problem — simulation engine.
 *
 * Pure function: `step(state, params) → state`. Zero rendering coupling.
 *
 * The two modes express Mises's 1920 argument concretely:
 *
 * MARKET MODE — prices emerge via adaptive tatonnement. Consumers demand
 * goods by Cobb-Douglas preference weighted by inverse price. Producers
 * who sell out raise asks; producers with surplus inventory lower asks.
 * Producers use revenue to buy inputs from other producers at market
 * prices. Prices are the common unit of valuation.
 *
 * PLANNED MODE — no prices. Planner observes only aggregate technology
 * and fixed resource supply. When a good has multiple recipes, the planner
 * picks by `hash(tick, k)` — deterministic but economically meaningless.
 * Allocation is equal-share. Shortages accrue as unmet demand; surpluses
 * decay. Total waste = shortages + surplus decay.
 *
 * Invariants (verified in tests/unit/calc-engine.test.ts):
 *  - Market prices converge under fixed shocks.
 *  - Socialist waste grows superlinearly with G.
 *  - Both modes conserve primary resource inputs.
 *  - Same seed → identical trajectory.
 */

import { DEFAULT_PARAMS, type Params, type State } from "./types";

// Re-export for convenience.
export { DEFAULT_PARAMS } from "./types";
export type { Consumer, Params, Producer, Recipe, State } from "./types";

export function step(state: State, params: Params = DEFAULT_PARAMS): State {
  return state.mode === "market"
    ? stepMarket(state, params)
    : stepPlanned(state, params);
}

/* ======================================================================= */
/* MARKET                                                                  */
/* ======================================================================= */

function stepMarket(state: State, params: Params): State {
  const next = structuredClone(state) as State;
  next.tick += 1;
  const G = next.G;

  // 1. Inject primary resource supply into a "nature-producer" pool.
  //    We model this by crediting all producers of good k<G0 with extra inventory
  //    proportional to the primary supply, split among them.
  injectPrimarySupply(next);

  // 2. Update market prices used by CONSUMERS' demand calculation.
  //    Use the lowest active ask for each good.
  const lowestAsks = computeLowestAsks(next);
  for (let k = 0; k < G; k++) {
    // Smooth the market price (what we display) toward the lowest ask.
    next.prices[k] = 0.7 * (next.prices[k] ?? 1) + 0.3 * (lowestAsks[k] ?? 1);
  }

  // 3. Consumers form demand & transact.
  let tradeVolume = 0;
  let deltaPriceSum = 0;
  for (const c of next.consumers) {
    const priorOwned = c.owned.slice();
    let desiredValueTotal = 0;
    let satisfiedValueTotal = 0;
    let remainingBudget = c.income;

    // Desired quantities by Cobb-Douglas rule x*_k = alpha_k * m / p_k.
    for (let k = 0; k < G; k++) {
      const price = Math.max(0.001, next.prices[k] ?? 1);
      const alpha_k = c.alpha[k] ?? 0;
      if (alpha_k < 0.001) continue;
      const desiredQty = (alpha_k * c.income) / price;
      const desiredValue = alpha_k * c.income;
      desiredValueTotal += desiredValue;

      // Find nearest producer of good k with lowest ask that has inventory.
      const bestProducer = findBestProducer(next, c, k);
      if (!bestProducer) continue;

      const ask = bestProducer.askPrice;
      const affordable = remainingBudget / ask;
      const available = bestProducer.inventory;
      const qty = Math.min(desiredQty, affordable, available);
      if (qty <= 0) continue;

      const cost = qty * ask;
      bestProducer.inventory -= qty;
      bestProducer.balance += cost;
      bestProducer.soldLastTick += qty;
      c.owned[k] = (c.owned[k] ?? 0) + qty;
      remainingBudget -= cost;
      tradeVolume += cost;
      satisfiedValueTotal += qty * ask;
    }

    c.lastSatisfaction =
      desiredValueTotal > 0 ? satisfiedValueTotal / desiredValueTotal : 1;
    c.satisfaction += c.lastSatisfaction;

    // Simple utility consumption: "use up" half of what's owned to track
    // time-preference-ish throughput without unbounded accumulation.
    for (let k = 0; k < G; k++) {
      c.owned[k] = (c.owned[k] ?? 0) * 0.5 + (priorOwned[k] ?? 0) * 0 || 0;
    }
  }
  next.totalTradeVolume += tradeVolume;

  // 4. Producers adjust asks by excess-demand signal and buy inputs.
  for (const p of next.producers) {
    const prevAsk = p.askPrice;
    if (p.inventory <= params.excessDemandThreshold) {
      p.askPrice = p.askPrice * (1 + params.priceEpsilon);
    } else if (p.inventory >= params.excessSupplyThreshold) {
      p.askPrice = p.askPrice * (1 - params.priceEpsilon);
    }
    deltaPriceSum += Math.abs(p.askPrice - prevAsk) / Math.max(0.001, prevAsk);

    // Buy inputs (if any) to produce more.
    const recipe = p.recipes[p.chosenRecipeIdx];
    if (!recipe) continue;

    // Compute input cost at current market prices.
    let inputCost = 0;
    for (let k = 0; k < G; k++) {
      inputCost += (recipe.inputs[k] ?? 0) * (next.prices[k] ?? 1);
    }

    // How many units can we afford to produce?
    const affordableUnits = inputCost > 0 ? p.balance / inputCost : p.capacity;
    const units = Math.max(0, Math.min(p.capacity, affordableUnits));

    // "Pay" for inputs — subtract from balance (flows to input producers
    //  implicitly over time via their sales).
    p.balance -= units * inputCost;
    p.inventory += units;
    p.producedLastTick = units;
    p.soldLastTick = 0;
  }

  // 5. Record price-change magnitude for convergence testing.
  next.priceDeltaHistory.push(
    next.producers.length > 0 ? deltaPriceSum / next.producers.length : 0,
  );
  if (next.priceDeltaHistory.length > 50) next.priceDeltaHistory.shift();

  return next;
}

function computeLowestAsks(state: State): number[] {
  const asks = new Array<number>(state.G).fill(Number.POSITIVE_INFINITY);
  for (const p of state.producers) {
    if (p.inventory > 0) {
      const k = p.goodIdx;
      asks[k] = Math.min(asks[k] ?? Number.POSITIVE_INFINITY, p.askPrice);
    }
  }
  for (let k = 0; k < state.G; k++) {
    if (!Number.isFinite(asks[k] ?? 0)) asks[k] = state.prices[k] ?? 1;
  }
  return asks;
}

function findBestProducer(state: State, consumer: { x: number; y: number }, k: number) {
  let best: State["producers"][number] | null = null;
  let bestScore = Number.POSITIVE_INFINITY;
  for (const p of state.producers) {
    if (p.goodIdx !== k || p.inventory <= 0) continue;
    const dx = p.x - consumer.x;
    const dy = p.y - consumer.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    // Score = ask + small distance cost. Lower is better.
    const score = p.askPrice + dist * 0.01;
    if (score < bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return best;
}

/* ======================================================================= */
/* PLANNED                                                                 */
/* ======================================================================= */

function stepPlanned(state: State, params: Params): State {
  const next = structuredClone(state) as State;
  next.tick += 1;
  const G = next.G;

  injectPrimarySupply(next);

  // 1. Planner picks recipe by hash(tick, id) for every multi-recipe producer.
  //    The Misesian point: this choice is economically meaningless — the planner
  //    has no common unit of valuation with which to compare recipes.
  for (const p of next.producers) {
    if (p.recipes.length <= 1) {
      p.chosenRecipeIdx = 0;
      continue;
    }
    const h = plannerHash(next.seedBase, next.tick, p.id);
    p.chosenRecipeIdx = h % p.recipes.length;
  }

  // 2. Planner's aspirational input demand from the chosen recipes, at capacity.
  const inputDemand = new Array<number>(G).fill(0);
  for (const p of next.producers) {
    const recipe = p.recipes[p.chosenRecipeIdx];
    if (!recipe) continue;
    for (let k = 0; k < G; k++) {
      inputDemand[k] = (inputDemand[k] ?? 0) + (recipe.inputs[k] ?? 0) * p.capacity;
    }
  }

  // 3. Stock available for inputs = current producer inventories per good.
  const stockByGood = new Array<number>(G).fill(0);
  for (const p of next.producers) {
    stockByGood[p.goodIdx] = (stockByGood[p.goodIdx] ?? 0) + p.inventory;
  }

  // 4. Allocation ratio per good: min(1, stock / demand).
  const allocationRatio = new Array<number>(G).fill(1);
  for (let k = 0; k < G; k++) {
    const demand = inputDemand[k] ?? 0;
    const stock = stockByGood[k] ?? 0;
    if (demand > 0) {
      allocationRatio[k] = Math.min(1, stock / demand);
    }
  }

  // 5. Per-producer production = capacity × min(allocationRatio across its recipe inputs).
  //    Waste the "unrealized capacity" as misallocation cost (weighted by recipe
  //    complexity, which stands in for value-added in a chain economy).
  let inputWaste = 0;
  for (const p of next.producers) {
    const recipe = p.recipes[p.chosenRecipeIdx];
    if (!recipe) continue;
    let limitingRatio = 1;
    let recipeComplexity = 0;
    for (let k = 0; k < G; k++) {
      const need = recipe.inputs[k] ?? 0;
      if (need > 0) {
        limitingRatio = Math.min(limitingRatio, allocationRatio[k] ?? 1);
        recipeComplexity += need;
      }
    }
    const output = p.capacity * limitingRatio;
    p.inventory += output;
    p.producedLastTick = output;
    p.soldLastTick = 0;
    // Misallocation waste: unrealized capacity, weighted by the intended recipe complexity.
    // More complex recipes (longer production chains) waste more value when blocked.
    inputWaste += (p.capacity - output) * (1 + recipeComplexity);
  }

  // 6. Consume the inputs that WERE used in production.
  for (let k = 0; k < G; k++) {
    const used = (inputDemand[k] ?? 0) * (allocationRatio[k] ?? 1);
    if (used > 0) consumeProducersInventory(next, k, used);
  }

  // 7. Consumer distribution — equal-share weighted by alpha — on what's left.
  let shortageWaste = 0;
  let surplusWaste = 0;
  const desiredByGood = new Array<number>(G).fill(0);
  for (const c of next.consumers) {
    for (let k = 0; k < G; k++) {
      desiredByGood[k] =
        (desiredByGood[k] ?? 0) + Math.max(0, c.alpha[k] ?? 0) * c.income;
    }
  }
  const remainingStock = new Array<number>(G).fill(0);
  for (const p of next.producers) {
    remainingStock[p.goodIdx] = (remainingStock[p.goodIdx] ?? 0) + p.inventory;
  }

  for (let k = 0; k < G; k++) {
    const stock = remainingStock[k] ?? 0;
    const desired = desiredByGood[k] ?? 0;
    if (desired > stock) {
      shortageWaste += desired - stock;
      distributeEqualShare(next, k, stock);
      consumeProducersInventory(next, k, stock);
    } else {
      distributeEqualShare(next, k, desired);
      consumeProducersInventory(next, k, desired);
      const remaining = stock - desired;
      const decay = remaining * params.surplusDecay;
      surplusWaste += decay;
      consumeProducersInventory(next, k, decay);
    }
  }

  next.totalWaste += inputWaste + shortageWaste + surplusWaste;

  // Consumer satisfaction update + owned decay (same pattern as market).
  for (const c of next.consumers) {
    let desiredValue = 0;
    let receivedValue = 0;
    for (let k = 0; k < next.G; k++) {
      const weight = Math.max(0, c.alpha[k] ?? 0) * c.income;
      desiredValue += weight;
      // We recorded the *planner-allocated* units back into c.owned in distribute.
      receivedValue += Math.min(c.owned[k] ?? 0, weight);
    }
    c.lastSatisfaction = desiredValue > 0 ? receivedValue / desiredValue : 1;
    c.satisfaction += c.lastSatisfaction;
    for (let k = 0; k < next.G; k++) c.owned[k] = (c.owned[k] ?? 0) * 0.5;
  }

  return next;
}

function distributeEqualShare(state: State, k: number, total: number) {
  // Divide `total` units among consumers weighted by alpha_k.
  let weightSum = 0;
  for (const c of state.consumers) weightSum += Math.max(0, c.alpha[k] ?? 0);
  if (weightSum <= 0) return;
  for (const c of state.consumers) {
    const share = ((c.alpha[k] ?? 0) / weightSum) * total;
    c.owned[k] = (c.owned[k] ?? 0) + share;
  }
}

function consumeProducersInventory(state: State, k: number, qty: number) {
  if (qty <= 0) return;
  let remaining = qty;
  for (const p of state.producers) {
    if (p.goodIdx !== k || p.inventory <= 0) continue;
    const taken = Math.min(remaining, p.inventory);
    p.inventory -= taken;
    remaining -= taken;
    if (remaining <= 0) break;
  }
}

function injectPrimarySupply(state: State) {
  // Split each primary good's supply equally among the producers who make it.
  for (let k = 0; k < state.G; k++) {
    const supply = state.primarySupply[k] ?? 0;
    if (supply <= 0) continue;
    const producersOfK = state.producers.filter((p) => p.goodIdx === k);
    if (producersOfK.length === 0) continue;
    const perProducer = supply / producersOfK.length;
    for (const p of producersOfK) p.inventory += perProducer;
  }
}

function plannerHash(seed: number, tick: number, id: number): number {
  // FNV-ish deterministic mix. Economically meaningless by construction.
  let h = seed ^ 2166136261;
  h = Math.imul(h ^ tick, 16777619) >>> 0;
  h = Math.imul(h ^ id, 16777619) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 16777619) >>> 0;
  return h >>> 0;
}
