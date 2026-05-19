import type { ModuleRuntimeAdapter } from "@/lib/module-runtime";
import type { ActionKind } from "./lib/signals";

export interface SignalRuntimeState {
  readonly mode: "guided" | "explore";
  readonly action: ActionKind;
  readonly sentKinds: readonly ActionKind[];
  readonly tappedActors: readonly number[];
}

interface SignalRuntimeMetrics {
  readonly actionTypes: number;
  readonly actorsTapped: number;
  readonly mode: "guided" | "explore";
  readonly latestAction: ActionKind;
}

const ALL_ACTIONS: readonly ActionKind[] = ["buy", "sell", "wait", "discover"];

export const signalOrchardRuntime: ModuleRuntimeAdapter<
  SignalRuntimeState,
  SignalRuntimeMetrics
> = {
  slug: "signal-orchard",
  queryKeys: ["mode", "action"],
  deserialize: (params) => ({
    mode: parseMode(params.get("mode")),
    action: parseAction(params.get("action")),
    sentKinds: [],
    tappedActors: [],
  }),
  serialize: (state) => ({
    mode: state.mode,
    action: state.action,
  }),
  deriveMetrics: (state) => ({
    actionTypes: state.sentKinds.length,
    actorsTapped: state.tappedActors.length,
    mode: state.mode,
    latestAction: state.action,
  }),
  challenges: [
    {
      id: "all-actions",
      label: "Send Buy, Sell, Wait, and Discover signals.",
      test: ({ state }) =>
        ALL_ACTIONS.every((action) => state.sentKinds.includes(action)),
    },
    {
      id: "three-actors",
      label: "Tap three actors and observe propagation.",
      test: ({ state }) => state.tappedActors.length >= 3,
    },
  ],
  currentHint: () =>
    "Choose an action, then tap cypress actors in the scene. Each pulse shows private action becoming public order.",
  insight: (_state, metrics) =>
    `You sent ${metrics.actionTypes} action types across ${metrics.actorsTapped} actors, turning private choices into visible coordination.`,
  summaryRows: (_state, metrics) => [
    { label: "Action types", value: `${metrics.actionTypes}/4` },
    { label: "Actors tapped", value: String(metrics.actorsTapped) },
    { label: "Mode", value: metrics.mode === "guided" ? "Guided" : "Explore" },
    { label: "Latest action", value: metrics.latestAction },
  ],
  sourceLabel: "Hayek frames prices as signals for dispersed knowledge",
};

function parseMode(value: string | null): "guided" | "explore" {
  return value === "explore" ? "explore" : "guided";
}

function parseAction(value: string | null): ActionKind {
  if (value === "sell" || value === "wait" || value === "discover") return value;
  return "buy";
}
