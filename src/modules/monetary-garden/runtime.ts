import type { ModuleRuntimeAdapter } from "@/lib/module-runtime";
import {
  DEFAULT_GARDEN_STATE,
  type GardenPhase,
  type GardenState,
  metricsFor,
} from "./lib/distortion";

type MonetaryMetrics = ReturnType<typeof metricsFor>;

export const monetaryGardenRuntime: ModuleRuntimeAdapter<GardenState, MonetaryMetrics> =
  {
    slug: "monetary-garden",
    queryKeys: ["credit", "savings", "phase"],
    deserialize: (params) => ({
      credit: parseUnit(params.get("credit"), DEFAULT_GARDEN_STATE.credit),
      savings: parseUnit(params.get("savings"), DEFAULT_GARDEN_STATE.savings),
      phase: parsePhase(params.get("phase")),
    }),
    serialize: (state) => ({
      credit: state.credit.toFixed(2),
      savings: state.savings.toFixed(2),
      phase: state.phase,
    }),
    deriveMetrics: metricsFor,
    challenges: [
      {
        id: "boom",
        label: "Create a boom: credit above 70% and savings below 35%.",
        test: ({ state }) => state.credit >= 0.7 && state.savings <= 0.35,
      },
      {
        id: "correction",
        label: "Reveal the correction.",
        test: ({ state }) => state.phase === "correction",
      },
      {
        id: "recovery",
        label: "Reduce malinvestment below 30%.",
        test: ({ state, metrics }) =>
          state.phase === "correction" && metrics.malinvestment <= 0.3,
      },
    ],
    currentHint: () =>
      "Drag Credit expansion high, pull Savings backing low, then reveal the correction and repair the signal.",
    insight: (_state, metrics) =>
      `You ended with ${Math.round(metrics.malinvestment * 100)}% malinvestment and ${Math.round(metrics.signalClarity * 100)}% signal clarity.`,
    summaryRows: (_state, metrics) => [
      { label: "Savings", value: `${Math.round(metrics.savings * 100)}%` },
      {
        label: "Malinvestment",
        value: `${Math.round(metrics.malinvestment * 100)}%`,
      },
      {
        label: "Signal clarity",
        value: `${Math.round(metrics.signalClarity * 100)}%`,
      },
      { label: "Output", value: `${Math.round(metrics.output * 100)}%` },
    ],
    sourceLabel: "Mises connects credit expansion to distorted calculation",
  };

function parseUnit(value: string | null, fallback: number): number {
  if (value === null) return fallback;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.min(1, parsed)) : fallback;
}

function parsePhase(value: string | null): GardenPhase {
  return value === "correction" ? "correction" : "boom";
}
