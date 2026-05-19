import type { ModuleRuntimeAdapter } from "@/lib/module-runtime";
import {
  type CoordMode,
  type CoordState,
  DEFAULT_COORD_STATE,
  metricsForState,
} from "./lib/distortion";

export interface CoordinationRuntimeState extends CoordState {
  readonly mode: CoordMode;
}

type CoordinationMetrics = ReturnType<typeof metricsForState>;

export const coordinationEngineRuntime: ModuleRuntimeAdapter<
  CoordinationRuntimeState,
  CoordinationMetrics
> = {
  slug: "coordination-engine",
  queryKeys: ["mode", "reliability", "latency"],
  deserialize: (params) => ({
    mode: readMode(params.get("mode")),
    reliability: readNumber(params.get("reliability"), DEFAULT_COORD_STATE.reliability),
    latency: readNumber(params.get("latency"), DEFAULT_COORD_STATE.latency),
    shock: 0,
  }),
  serialize: (state) => ({
    mode: state.mode,
    reliability: trimParam(state.reliability),
    latency: trimParam(state.latency),
  }),
  deriveMetrics: (state) => metricsForState(state),
  challenges: [
    {
      id: "shock",
      label: "Inject a shock or tap a node to emit a demand/supply pulse.",
      test: ({ state }) => state.shock >= 0.95,
    },
    {
      id: "restore",
      label: "Restore coherence above 70%.",
      test: ({ metrics, completedIds }) =>
        completedIds.has("shock") && metrics.coherence >= 70,
    },
  ],
  currentHint: () =>
    "Press Inject shock, then raise reliability and lower latency until the network regains coherence.",
  insight: (_state, metrics) =>
    `You stabilized the network at ${metrics.coherence}% coherence with ${metrics.failedLinks}% failed links.`,
  summaryRows: (_state, metrics) => [
    { label: "Coherence", value: `${metrics.coherence}%` },
    { label: "Throughput", value: `${metrics.throughput}%` },
    { label: "Failed links", value: `${metrics.failedLinks}%` },
    { label: "Missed plans", value: `${metrics.missedPlans}%` },
  ],
  sourceLabel: "Hayek and Lachmann show coordination as a signal problem",
};

function readMode(value: string | null): CoordMode {
  return value === "explore" ? "explore" : "guided";
}

function readNumber(value: string | null, fallback: number): number {
  const parsed = Number.parseFloat(value ?? "");
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.min(1, parsed));
}

function trimParam(value: number): string {
  return value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}
