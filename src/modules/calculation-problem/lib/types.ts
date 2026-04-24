/**
 * Calculation Problem — agent types.
 *
 * The simulation runs two economies in parallel with identical agents and
 * technology: the market panel discovers prices and self-organises; the
 * planned panel has no prices and fails by Misesian necessity.
 */

export interface Recipe {
  /** Units of each good (length G) required to produce one unit of output. */
  inputs: readonly number[];
}

export interface Consumer {
  id: number;
  x: number;
  y: number;
  /** Cobb-Douglas preference weights. Length = G. Sums to 1. */
  alpha: readonly number[];
  /** Budget replenished each tick (exogenous income from "labour"). */
  income: number;
  /** Inventory of each good, length G. */
  owned: number[];
  /** Cumulative satisfaction score. */
  satisfaction: number;
  /** Fraction of desired demand met this tick (0..1). */
  lastSatisfaction: number;
}

export interface Producer {
  id: number;
  x: number;
  y: number;
  /** Which good this producer makes. 0..G-1. */
  goodIdx: number;
  /** All recipes that yield goodIdx; planner/market picks one. */
  recipes: readonly Recipe[];
  /** Index into recipes. */
  chosenRecipeIdx: number;
  /** Current per-tick capacity. */
  capacity: number;
  /** Units on hand ready to sell. */
  inventory: number;
  /** Posted ask price. */
  askPrice: number;
  /** Money balance — revenue accumulates, used to buy inputs. */
  balance: number;
  /** Diagnostics. */
  soldLastTick: number;
  producedLastTick: number;
}

export type SimMode = "market" | "planned";

export interface State {
  mode: SimMode;
  tick: number;
  /** Number of goods. */
  G: number;
  consumers: Consumer[];
  producers: Producer[];
  /** Exogenous supply per tick of each good (primary goods > 0, final goods = 0). */
  primarySupply: readonly number[];
  /** Current market prices per good. Length G. */
  prices: number[];
  /** Cumulative trade volume — diagnostic. */
  totalTradeVolume: number;
  /** Cumulative unsatisfied demand + surplus decay. Waste measure. */
  totalWaste: number;
  /** For determinism in planner-mode arbitrary recipe choice. */
  seedBase: number;
  /** Satisfaction history for the most recent N ticks (for convergence tests). */
  priceDeltaHistory: number[];
}

export interface Params {
  /** Speed of price adjustment per tick (~2–5% of current ask). */
  priceEpsilon: number;
  /** Inventory threshold below which producer raises ask. */
  excessDemandThreshold: number;
  /** Inventory threshold above which producer lowers ask. */
  excessSupplyThreshold: number;
  /** Decay rate of surplus inventory in planned mode (fraction per tick). */
  surplusDecay: number;
}

export const DEFAULT_PARAMS: Params = {
  priceEpsilon: 0.035,
  excessDemandThreshold: 0,
  excessSupplyThreshold: 4,
  surplusDecay: 0.06,
};
