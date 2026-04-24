import { hashSeed, mulberry32 } from "@/sketches/lib/rng";
import type { Consumer, Producer, Recipe, SimMode, State } from "./types";

export interface InitParams {
  G: number;
  consumerCount: number;
  producerCount: number;
  /** Fraction of G that is primary (raw). */
  primaryFraction?: number;
  mode: SimMode;
  seed: string;
  width: number;
  height: number;
}

/**
 * Deterministically construct an initial simulation state.
 * Both panels of the visualization should be init'd with the SAME seed — the
 * economies are identical at t=0; only the mode differs.
 */
export function init(params: InitParams): State {
  const {
    G,
    consumerCount,
    producerCount,
    primaryFraction = 0.25,
    mode,
    seed,
    width,
    height,
  } = params;

  const rng = mulberry32(hashSeed(seed));
  const G0 = Math.max(1, Math.floor(G * primaryFraction));

  // Consumer preferences spread across more goods as the economy grows —
  // the Misesian argument is precisely that larger economies are harder
  // to plan. log2 scaling keeps preference breadth bounded but sensitive to G.
  const prefCount = Math.min(G, Math.max(3, 3 + Math.floor(Math.log2(G) * 1.4)));

  // --- Consumers ---
  const consumers: Consumer[] = [];
  for (let i = 0; i < consumerCount; i++) {
    // Draw a sparse Cobb-Douglas preference vector: concentrated mass on
    // `prefCount` goods (which scales with G), then normalized.
    const alpha = new Array<number>(G).fill(0);
    let sum = 0;
    for (let k = 0; k < prefCount; k++) {
      const idx = Math.floor(rng() * G);
      const weight = 0.2 + rng() * 0.8;
      alpha[idx] = (alpha[idx] ?? 0) + weight;
      sum += weight;
    }
    // Always a minimum floor so nobody has zero demand across the board.
    const floor = 0.02;
    for (let k = 0; k < G; k++) {
      alpha[k] = ((alpha[k] ?? 0) + floor) / (sum + floor * G);
    }
    consumers.push({
      id: i,
      x: rng() * width,
      y: rng() * height,
      alpha,
      income: 10,
      owned: new Array<number>(G).fill(0),
      satisfaction: 0,
      lastSatisfaction: 0,
    });
  }

  // --- Producers ---
  const producers: Producer[] = [];
  for (let j = 0; j < producerCount; j++) {
    // Each producer makes some good, chosen with a bias toward final goods.
    const goodIdx =
      rng() < 0.7
        ? G0 + Math.floor(rng() * (G - G0)) // final/intermediate
        : Math.floor(rng() * G0); // primary

    // Recipe count and complexity scale with log(G). Larger economies have
    // more possible production techniques for each good — which is exactly
    // where arbitrary planner choice becomes more destructive.
    const maxRecipes = Math.min(6, 2 + Math.floor(Math.log2(G)));
    const recipeCount = goodIdx < G0 ? 1 : 1 + Math.floor(rng() * maxRecipes);
    const recipes: Recipe[] = [];
    for (let r = 0; r < recipeCount; r++) {
      const inputs = new Array<number>(G).fill(0);
      if (goodIdx >= G0) {
        // Non-primary: require several inputs. Input count scales with G to
        // reflect longer production chains in larger economies.
        const inputCount = Math.min(
          8,
          2 + Math.floor(rng() * Math.max(1, Math.floor(Math.log2(G)))),
        );
        for (let n = 0; n < inputCount; n++) {
          const inputIdx =
            rng() < 0.55
              ? Math.floor(rng() * G0) // prefer primaries
              : Math.floor(rng() * goodIdx); // any earlier good
          inputs[inputIdx] = (inputs[inputIdx] ?? 0) + 0.3 + rng() * 0.4;
        }
      }
      recipes.push({ inputs });
    }

    producers.push({
      id: j,
      x: rng() * width,
      y: rng() * height,
      goodIdx,
      recipes,
      chosenRecipeIdx: 0,
      capacity: 2 + rng() * 3,
      inventory: 1 + rng() * 2,
      askPrice: 1,
      balance: 5,
      soldLastTick: 0,
      producedLastTick: 0,
    });
  }

  const primarySupply = new Array<number>(G).fill(0);
  for (let k = 0; k < G0; k++) {
    primarySupply[k] = 1 + rng() * 2; // 1-3 units of each primary good per tick
  }

  const prices = new Array<number>(G).fill(1);

  return {
    mode,
    tick: 0,
    G,
    consumers,
    producers,
    primarySupply,
    prices,
    totalTradeVolume: 0,
    totalWaste: 0,
    seedBase: hashSeed(seed),
    priceDeltaHistory: [],
  };
}
