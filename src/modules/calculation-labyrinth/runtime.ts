import type { ModuleRuntimeAdapter } from "@/lib/module-runtime";
import { type CellCoord, buildMaze } from "./lib/labyrinthLayout";

export interface CalculationRuntimeState {
  readonly priced: boolean;
  readonly challenge: number;
  readonly current: CellCoord;
  readonly waste: number;
}

export interface CalculationRuntimeMetrics {
  readonly waste: number;
  readonly priced: boolean;
  readonly challengeNumber: number;
  readonly position: string;
  readonly atGoal: boolean;
}

export const calculationLabyrinthRuntime: ModuleRuntimeAdapter<
  CalculationRuntimeState,
  CalculationRuntimeMetrics
> = {
  slug: "calculation-labyrinth",
  queryKeys: ["priced", "challenge"],
  deserialize: (params) => {
    const challenge = parseChallenge(params.get("challenge"));
    return {
      priced: parsePriced(params.get("priced")),
      challenge,
      current: startCellForChallenge(challenge),
      waste: 0,
    };
  },
  serialize: (state) => ({
    priced: state.priced ? "1" : "0",
    challenge: String(state.challenge),
  }),
  deriveMetrics: (state) => {
    const maze = buildMaze(seedForChallenge(state.challenge));
    const goalCell = maze.pathCells[maze.pathCells.length - 1];
    return {
      waste: state.waste,
      priced: state.priced,
      challengeNumber: state.challenge + 1,
      position: `${state.current.x},${state.current.y}`,
      atGoal: state.current.x === goalCell?.x && state.current.y === goalCell?.y,
    };
  },
  challenges: [
    {
      id: "priced-exit",
      label: "Reach the exit with prices visible.",
      test: ({ state, metrics }) => state.priced && metrics.atGoal,
    },
    {
      id: "unpriced-attempt",
      label: "Try without prices and compare waste.",
      test: ({ state }) => !state.priced && state.waste > 0,
    },
  ],
  currentHint: () =>
    "Use the direction buttons or arrow keys. With prices, the cheapest legal move is marked; without prices, cost markers disappear.",
  insight: (state, metrics) =>
    `Your planner accumulated ${metrics.waste} waste in the ${state.priced ? "priced" : "unpriced"} maze.`,
  summaryRows: (_state, metrics) => [
    { label: "Waste", value: String(metrics.waste) },
    { label: "Mode", value: metrics.priced ? "Prices" : "No prices" },
    { label: "Challenge", value: String(metrics.challengeNumber) },
    { label: "Position", value: metrics.position },
  ],
  sourceLabel: "Mises argues calculation requires market prices for capital goods",
};

export function seedForChallenge(challenge: number): number {
  return 0xc4_0a_71_3f + challenge * 7919;
}

export function startCellForChallenge(challenge: number): CellCoord {
  return buildMaze(seedForChallenge(challenge)).pathCells[0] ?? { x: 0, y: 0 };
}

function parseChallenge(value: string | null): number {
  const parsed = Number.parseInt(value ?? "0", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function parsePriced(value: string | null): boolean {
  return value !== "0" && value !== "false";
}
