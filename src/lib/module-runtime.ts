import type { InteractionEventName, TelemetryValue } from "@/lib/telemetry";
import { trackInteraction } from "@/lib/telemetry";

export type RuntimeSearchParams = Pick<URLSearchParams, "get" | "toString">;
export type ModuleState = Record<string, unknown>;
export type ModuleMetrics = Record<string, unknown>;

export interface SummaryRow {
  readonly label: string;
  readonly value: string;
}

export interface ChallengeGoal {
  readonly id: string;
  readonly label: string;
  readonly completed: boolean;
}

export interface ModuleChallenge<State extends object, Metrics extends object> {
  readonly id: string;
  readonly label: string;
  readonly hint?: string;
  readonly completionCopy?: string;
  readonly test: (context: {
    readonly state: State;
    readonly metrics: Metrics;
    readonly completedIds: ReadonlySet<string>;
  }) => boolean;
}

export interface ModuleRuntimeAdapter<State extends object, Metrics extends object> {
  readonly slug: string;
  readonly queryKeys: readonly string[];
  readonly deserialize: (params: RuntimeSearchParams) => State;
  readonly serialize: (state: State) => Record<string, string>;
  readonly deriveMetrics: (state: State) => Metrics;
  readonly challenges: readonly ModuleChallenge<State, Metrics>[];
  readonly currentHint: (state: State, metrics: Metrics) => string;
  readonly insight: (state: State, metrics: Metrics) => string;
  readonly summaryRows: (state: State, metrics: Metrics) => readonly SummaryRow[];
  readonly sourceLabel: string;
}

export interface ModuleRun<State extends object, Metrics extends object> {
  readonly id: string;
  readonly slug: string;
  readonly state: State;
  readonly metrics: Metrics;
  readonly completedGoals: readonly string[];
  readonly timestamp: string;
  readonly insight: string;
}

const RUN_STORAGE_KEY = "praxeos.learning.v2";
const MAX_RUNS = 60;

export function evaluateChallenges<State extends object, Metrics extends object>(
  adapter: ModuleRuntimeAdapter<State, Metrics>,
  state: State,
  metrics: Metrics,
  previousCompleted: ReadonlySet<string>,
): Set<string> {
  const next = new Set(previousCompleted);
  for (const challenge of adapter.challenges) {
    if (next.has(challenge.id)) continue;
    if (challenge.test({ state, metrics, completedIds: next })) {
      next.add(challenge.id);
    }
  }
  return next;
}

export function goalsFor<State extends object, Metrics extends object>(
  adapter: ModuleRuntimeAdapter<State, Metrics>,
  completedIds: ReadonlySet<string>,
): readonly ChallengeGoal[] {
  return adapter.challenges.map((challenge) => ({
    id: challenge.id,
    label: challenge.label,
    completed: completedIds.has(challenge.id),
  }));
}

export function runtimeSearchParams<State extends object, Metrics extends object>(
  adapter: ModuleRuntimeAdapter<State, Metrics>,
  state: State,
  currentParams: RuntimeSearchParams,
): URLSearchParams {
  const params = new URLSearchParams(currentParams.toString());
  for (const key of adapter.queryKeys) params.delete(key);
  const serialized = adapter.serialize(state);
  for (const [key, value] of Object.entries(serialized)) {
    params.set(key, value);
  }
  return params;
}

export function sameCompletedIds(
  a: readonly string[],
  b: ReadonlySet<string>,
): boolean {
  if (a.length !== b.size) return false;
  return a.every((id) => b.has(id));
}

export function recordModuleRun<State extends object, Metrics extends object>(
  run: Omit<ModuleRun<State, Metrics>, "id" | "timestamp">,
): ModuleRun<State, Metrics> | null {
  if (typeof window === "undefined") return null;
  const recorded: ModuleRun<State, Metrics> = {
    ...run,
    id: createRunId(run.slug),
    timestamp: new Date().toISOString(),
  };

  try {
    const currentStore = JSON.parse(window.localStorage.getItem(RUN_STORAGE_KEY) ?? "{}") as { labRuns?: ModuleRun<object, object>[] };
    const next = [recorded, ...(currentStore.labRuns ?? [])].slice(0, MAX_RUNS);
    window.localStorage.setItem(RUN_STORAGE_KEY, JSON.stringify({ ...currentStore, version: 2, labRuns: next }));
    trackInteraction("run_recorded", {
      moduleSlug: run.slug,
      payload: { completedGoals: run.completedGoals.length },
    });
  } catch {
    return recorded;
  }

  return recorded;
}

export function readModuleRuns(): ModuleRun<object, object>[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RUN_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { labRuns?: ModuleRun<object, object>[] };
    return Array.isArray(parsed.labRuns) ? parsed.labRuns : [];
  } catch {
    return [];
  }
}

export function telemetryPayloadForState(
  state: object,
): Record<string, TelemetryValue> {
  const payload: Record<string, TelemetryValue> = {};
  for (const [key, value] of Object.entries(state)) {
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      value === null
    ) {
      payload[key] = value;
    }
  }
  return payload;
}

export interface RuntimeUpdateOptions {
  readonly syncUrl?: boolean;
  readonly eventName?: InteractionEventName;
  readonly payload?: Record<string, TelemetryValue>;
}

function createRunId(slug: string): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${slug}_${random}`;
}
