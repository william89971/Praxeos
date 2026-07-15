import type {
  GuidedAction,
  GuidedMetrics,
  GuidedState,
} from "@/labs/components/GuidedLabRuntime";
import type { LabEngine, LabExplanation } from "@/labs/types";

export type OpportunityRegion = "commuters" | "students" | "small-teams" | "weekends";
export type EvidenceSignal = "weak" | "mixed" | "strong";

export interface DiscoveryAssumptions {
  customerSegments: 4;
  experimentNoise: "moderate";
  hiddenEnvironment: "seeded";
}

export interface DiscoveryAction extends GuidedAction {
  type: "observe" | "hypothesize" | "experiment" | "interpret" | "revise" | "decide";
  region?: OpportunityRegion;
  timeCost?: number;
  capitalCost?: number;
  decision?: "continue" | "pivot" | "stop";
  guided?: true;
}

export interface DiscoveryResult {
  id: string;
  region: OpportunityRegion;
  signal: EvidenceSignal;
  detail: string;
}

export interface DiscoveryState extends GuidedState {
  assumptions: DiscoveryAssumptions;
  timeRemaining: number;
  capitalRemaining: number;
  activeHypothesis: string | null;
  priorHypotheses: string[];
  results: DiscoveryResult[];
  decision: "continue" | "pivot" | "stop" | null;
  uncertainty: number;
}

export const DEFAULT_DISCOVERY_ASSUMPTIONS: DiscoveryAssumptions = {
  customerSegments: 4,
  experimentNoise: "moderate",
  hiddenEnvironment: "seeded",
};

export const DISCOVERY_GUIDED_ACTIONS: readonly DiscoveryAction[] = [
  {
    id: "observe-task-dropoff",
    label: "Observe where people stop",
    type: "observe",
    guided: true,
  },
  {
    id: "form-pickup-hypothesis",
    label: "Form a pickup hypothesis",
    type: "hypothesize",
    guided: true,
  },
  {
    id: "interview-commuters",
    label: "Interview commuters",
    type: "experiment",
    region: "commuters",
    timeCost: 1,
    capitalCost: 0,
    guided: true,
  },
  {
    id: "prototype-small-teams",
    label: "Build a small-team prototype",
    type: "experiment",
    region: "small-teams",
    timeCost: 2,
    capitalCost: 25,
    guided: true,
  },
  {
    id: "interpret-customer-action",
    label: "Compare action with the hypothesis",
    type: "interpret",
    guided: true,
  },
  {
    id: "revise-convenience-hypothesis",
    label: "Revise the hypothesis",
    type: "revise",
    guided: true,
  },
  {
    id: "pilot-students",
    label: "Run a limited student pilot",
    type: "experiment",
    region: "students",
    timeCost: 2,
    capitalCost: 30,
    guided: true,
  },
  {
    id: "choose-pivot",
    label: "Choose pivot and preserve resources",
    type: "decide",
    decision: "pivot",
    guided: true,
  },
] as const;

export const DISCOVERY_EXPLORE_ACTIONS: readonly DiscoveryAction[] = [
  {
    id: "explore-weekend-test",
    label: "Test weekend users",
    type: "experiment",
    region: "weekends",
    timeCost: 1,
    capitalCost: 10,
  },
  {
    id: "explore-commuter-pilot",
    label: "Run commuter pilot",
    type: "experiment",
    region: "commuters",
    timeCost: 1,
    capitalCost: 15,
  },
  {
    id: "explore-continue",
    label: "Continue carefully",
    type: "decide",
    decision: "continue",
  },
  {
    id: "explore-stop",
    label: "Stop and preserve capital",
    type: "decide",
    decision: "stop",
  },
] as const;

const ALL_ACTIONS = [...DISCOVERY_GUIDED_ACTIONS, ...DISCOVERY_EXPLORE_ACTIONS];

export const discoveryEngine: LabEngine<
  DiscoveryState,
  DiscoveryAction,
  GuidedMetrics,
  DiscoveryAssumptions
> = {
  create(seed, assumptions) {
    return {
      seed,
      assumptions,
      guidedStep: 0,
      completed: false,
      observations: [],
      timeRemaining: 7,
      capitalRemaining: 90,
      activeHypothesis: null,
      priorHypotheses: [],
      results: [],
      decision: null,
      uncertainty: 100,
    };
  },

  reduce(state, action) {
    if (state.observations.some((item) => item.id === action.id) && action.guided) {
      return state;
    }
    if (
      action.type === "experiment" &&
      ((action.timeCost ?? 0) > state.timeRemaining ||
        (action.capitalCost ?? 0) > state.capitalRemaining)
    ) {
      return state;
    }
    const next: DiscoveryState = {
      ...state,
      observations: [...state.observations],
      priorHypotheses: [...state.priorHypotheses],
      results: [...state.results],
    };
    let observation: LabExplanation;

    if (action.type === "observe") {
      observation = simulationObservation(
        action.id,
        "A repeatable drop-off becomes visible",
        "Several people abandon the task between planning and pickup, but the observation does not reveal why.",
      );
    } else if (action.type === "hypothesize") {
      next.activeHypothesis =
        "A shorter pickup handoff will reduce abandonment for time-constrained users.";
      observation = simulationObservation(
        action.id,
        "A testable hypothesis replaces a vague idea",
        "The claim names a user, a change, and an observable behavior without treating the opportunity as known.",
      );
    } else if (action.type === "experiment" && action.region) {
      const signal = signalFor(state.seed, action.id, action.region);
      next.timeRemaining -= action.timeCost ?? 0;
      next.capitalRemaining -= action.capitalCost ?? 0;
      next.results.push({
        id: action.id,
        region: action.region,
        signal,
        detail: signalDetail(signal, action.region),
      });
      next.uncertainty = Math.max(28, 100 - uniqueRegions(next.results).length * 18);
      observation = simulationObservation(
        action.id,
        `${regionLabel(action.region)} returns a ${signal} signal`,
        `${signalDetail(signal, action.region)} Resources were consumed, and the rest of the opportunity map remains hidden.`,
      );
    } else if (action.type === "interpret") {
      const latest = next.results.at(-1);
      observation = simulationObservation(
        action.id,
        "Observed behavior is compared with the prediction",
        latest
          ? `The ${latest.signal} ${regionLabel(latest.region).toLowerCase()} signal narrows one question without proving the whole hypothesis.`
          : "No experiment exists to compare, so the hypothesis remains unsupported in this record.",
      );
    } else if (action.type === "revise") {
      if (next.activeHypothesis) next.priorHypotheses.push(next.activeHypothesis);
      next.activeHypothesis =
        "A predictable handoff may matter more than speed for users coordinating with a group.";
      observation = simulationObservation(
        action.id,
        "The hypothesis changes without erasing earlier evidence",
        "The new claim shifts from speed to predictability and can be tested against a different customer action.",
      );
    } else if (action.type === "decide" && action.decision) {
      next.decision = action.decision;
      if (action.guided) next.completed = true;
      observation = simulationObservation(
        action.id,
        `${capitalize(action.decision)} becomes the current decision`,
        action.decision === "stop"
          ? "Stopping preserves remaining time and capital; it does not prove that no opportunity exists."
          : action.decision === "pivot"
            ? "Pivoting changes the next hypothesis while preserving the incomplete evidence record."
            : "Continuing spends no resource yet; the next experiment still carries uncertainty.",
      );
    } else {
      return state;
    }

    next.observations.push(observation);
    if (action.guided) {
      next.guidedStep = Math.min(DISCOVERY_GUIDED_ACTIONS.length, state.guidedStep + 1);
    }
    return next;
  },

  derive(state) {
    return {
      cards: [
        { label: "Time left", value: `${state.timeRemaining}h` },
        { label: "Capital left", value: `$${state.capitalRemaining}` },
        { label: "Regions tested", value: String(uniqueRegions(state.results).length) },
        {
          label: "Uncertainty",
          value: `${state.uncertainty}%`,
          detail: "illustrative",
        },
      ],
      summary: state.activeHypothesis ?? "No hypothesis has been recorded yet.",
    };
  },

  describeChange(previous, next) {
    return next.observations.slice(previous.observations.length);
  },

  validate(state) {
    const errors: string[] = [];
    if (state.timeRemaining < 0)
      errors.push("An experiment cannot consume unavailable time.");
    if (state.capitalRemaining < 0)
      errors.push("An experiment cannot consume unavailable capital.");
    if (state.uncertainty < 20)
      errors.push(
        "This model must preserve material uncertainty after every experiment.",
      );
    if (state.guidedStep > DISCOVERY_GUIDED_ACTIONS.length)
      errors.push("Guided progress exceeds the Discovery stages.");
    return errors;
  },
};

export function discoveryActionById(id: string): DiscoveryAction | null {
  return ALL_ACTIONS.find((action) => action.id === id) ?? null;
}

export function normalizeDiscoveryAssumptions(): DiscoveryAssumptions {
  return DEFAULT_DISCOVERY_ASSUMPTIONS;
}

export function regionLabel(region: OpportunityRegion) {
  return {
    commuters: "Commuters",
    students: "Students",
    "small-teams": "Small teams",
    weekends: "Weekend users",
  }[region];
}

function signalFor(
  seed: string,
  actionId: string,
  region: OpportunityRegion,
): EvidenceSignal {
  const score = hash(`${seed}:${actionId}:${region}`) % 3;
  return (["weak", "mixed", "strong"] as const)[score] ?? "mixed";
}

function signalDetail(signal: EvidenceSignal, region: OpportunityRegion) {
  const subject = regionLabel(region);
  if (signal === "strong")
    return `${subject} complete the tested behavior more often in this seeded run.`;
  if (signal === "weak")
    return `${subject} rarely complete the tested behavior in this seeded run.`;
  return `${subject} split between completion and abandonment in this seeded run.`;
}

function uniqueRegions(results: readonly DiscoveryResult[]) {
  return [...new Set(results.map((result) => result.region))];
}

function hash(value: string) {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function simulationObservation(
  id: string,
  title: string,
  detail: string,
): LabExplanation {
  return { id, kind: "simulation observation", title, detail };
}

function capitalize(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
