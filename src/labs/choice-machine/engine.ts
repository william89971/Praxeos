import type {
  GuidedAction,
  GuidedMetrics,
  GuidedState,
} from "@/labs/components/GuidedLabRuntime";
import type { LabEngine, LabExplanation } from "@/labs/types";

export type ChoiceActivity = "community-event" | "paid-shift" | "study" | "rest";

export interface ChoiceConstraints {
  time: number;
  money: number;
  attention: number;
  energy: number;
}

export interface ChoiceAssumptions {
  scenario: "open-afternoon";
  revealAlternatives: boolean;
}

export interface ChoiceAction extends GuidedAction {
  type: "inspect" | "choose" | "reveal" | "change-constraint" | "complete";
  activity?: ChoiceActivity;
  constraint?: keyof ChoiceConstraints;
  delta?: number;
  guided?: true;
}

export interface ChoiceState extends GuidedState {
  assumptions: ChoiceAssumptions;
  constraints: ChoiceConstraints;
  selectedActivity: ChoiceActivity | null;
  previousSelections: ChoiceActivity[];
  visibleAlternatives: ChoiceActivity[];
  constraintChanges: number;
}

const ACTIVITIES: Record<
  ChoiceActivity,
  { label: string; future: string; costs: ChoiceConstraints }
> = {
  "community-event": {
    label: "Help at the community event",
    future: "A stronger relationship and a finished event",
    costs: { time: 3, money: 8, attention: 2, energy: 2 },
  },
  "paid-shift": {
    label: "Take a paid shift",
    future: "More income and less open time",
    costs: { time: 4, money: 0, attention: 2, energy: 3 },
  },
  study: {
    label: "Study for the exam",
    future: "More preparation and a quieter afternoon",
    costs: { time: 2, money: 0, attention: 3, energy: 2 },
  },
  rest: {
    label: "Rest without a schedule",
    future: "Recovered energy and unfinished alternatives",
    costs: { time: 2, money: 0, attention: 1, energy: 0 },
  },
};

export const DEFAULT_CHOICE_ASSUMPTIONS: ChoiceAssumptions = {
  scenario: "open-afternoon",
  revealAlternatives: true,
};

export const CHOICE_GUIDED_ACTIONS: readonly ChoiceAction[] = [
  {
    id: "inspect-constraints",
    label: "Inspect the limits",
    type: "inspect",
    guided: true,
  },
  {
    id: "choose-community-event",
    label: "Choose the community event",
    type: "choose",
    activity: "community-event",
    guided: true,
  },
  {
    id: "reveal-forgone-paths",
    label: "Reveal the paths not taken",
    type: "reveal",
    guided: true,
  },
  {
    id: "lose-two-hours",
    label: "Lose two available hours",
    type: "change-constraint",
    constraint: "time",
    delta: -2,
    guided: true,
  },
  {
    id: "revise-to-study",
    label: "Revise the choice",
    type: "choose",
    activity: "study",
    guided: true,
  },
  {
    id: "complete-choice",
    label: "Open interpretation",
    type: "complete",
    guided: true,
  },
] as const;

export const CHOICE_EXPLORE_ACTIONS: readonly ChoiceAction[] = [
  {
    id: "explore-add-hour",
    label: "Add one hour",
    type: "change-constraint",
    constraint: "time",
    delta: 1,
  },
  {
    id: "explore-lose-money",
    label: "Remove $10",
    type: "change-constraint",
    constraint: "money",
    delta: -10,
  },
  {
    id: "explore-paid-shift",
    label: "Choose paid shift",
    type: "choose",
    activity: "paid-shift",
  },
  { id: "explore-rest", label: "Choose rest", type: "choose", activity: "rest" },
] as const;

const ALL_ACTIONS = [...CHOICE_GUIDED_ACTIONS, ...CHOICE_EXPLORE_ACTIONS];

export const choiceEngine: LabEngine<
  ChoiceState,
  ChoiceAction,
  GuidedMetrics,
  ChoiceAssumptions
> = {
  create(seed, assumptions) {
    return {
      seed,
      assumptions,
      guidedStep: 0,
      completed: false,
      observations: [],
      constraints: { time: 4, money: 30, attention: 3, energy: 3 },
      selectedActivity: null,
      previousSelections: [],
      visibleAlternatives: [],
      constraintChanges: 0,
    };
  },

  reduce(state, action) {
    if (state.observations.some((item) => item.id === action.id) && action.guided) {
      return state;
    }
    const next: ChoiceState = {
      ...state,
      constraints: { ...state.constraints },
      previousSelections: [...state.previousSelections],
      visibleAlternatives: [...state.visibleAlternatives],
      observations: [...state.observations],
    };
    let observation: LabExplanation;

    if (action.type === "inspect") {
      observation = observationFor(
        action.id,
        "Four limits are visible",
        "The afternoon contains four hours, $30, three attention units, and three energy units. None is unlimited.",
      );
    } else if (action.type === "choose" && action.activity) {
      if (!isFeasible(action.activity, next.constraints)) {
        observation = observationFor(
          action.id,
          `${ACTIVITIES[action.activity].label} does not fit`,
          "At least one visible constraint is below the programmed requirement, so this path remains unavailable under the current conditions.",
        );
      } else {
        if (
          next.selectedActivity &&
          next.selectedActivity !== action.activity &&
          !next.previousSelections.includes(next.selectedActivity)
        ) {
          next.previousSelections.push(next.selectedActivity);
        }
        next.selectedActivity = action.activity;
        observation = observationFor(
          action.id,
          `${ACTIVITIES[action.activity].label} becomes the selected path`,
          `${ACTIVITIES[action.activity].future}. The other futures remain visible but unrealized.`,
        );
      }
    } else if (action.type === "reveal") {
      next.visibleAlternatives = (Object.keys(ACTIVITIES) as ChoiceActivity[]).filter(
        (activity) => activity !== next.selectedActivity,
      );
      observation = observationFor(
        action.id,
        "The forgone paths remain visible",
        "The paid shift, study, and rest futures do not disappear; they are the alternatives not selected in this moment.",
      );
    } else if (
      action.type === "change-constraint" &&
      action.constraint &&
      typeof action.delta === "number"
    ) {
      const before = next.constraints[action.constraint];
      next.constraints[action.constraint] = Math.max(0, before + action.delta);
      next.constraintChanges += 1;
      observation = observationFor(
        action.id,
        `${capitalize(action.constraint)} changes`,
        `${capitalize(action.constraint)} moves from ${before} to ${next.constraints[action.constraint]}. The ranking revealed by the earlier choice need not survive changed conditions.`,
      );
    } else if (action.type === "complete") {
      next.completed = true;
      observation = observationFor(
        action.id,
        "The comparison is ready",
        "The record now contains an initial selection, preserved alternatives, a changed constraint, and a revised selection.",
      );
    } else {
      return state;
    }

    next.observations.push(observation);
    if (action.guided)
      next.guidedStep = Math.min(CHOICE_GUIDED_ACTIONS.length, state.guidedStep + 1);
    return next;
  },

  derive(state) {
    const feasible = (Object.keys(ACTIVITIES) as ChoiceActivity[]).filter((activity) =>
      isFeasible(activity, state.constraints),
    );
    return {
      cards: [
        { label: "Time", value: `${state.constraints.time}h` },
        { label: "Money", value: `$${state.constraints.money}` },
        { label: "Feasible paths", value: String(feasible.length) },
        { label: "Constraint changes", value: String(state.constraintChanges) },
      ],
      summary: state.selectedActivity
        ? `${ACTIVITIES[state.selectedActivity].label} is selected under the current visible constraints.`
        : "No path is selected yet.",
    };
  },

  describeChange(previous, next) {
    return next.observations.slice(previous.observations.length);
  },

  validate(state) {
    const errors: string[] = [];
    for (const [key, value] of Object.entries(state.constraints)) {
      if (!Number.isFinite(value) || value < 0)
        errors.push(`${key} cannot be negative.`);
    }
    if (state.guidedStep < 0 || state.guidedStep > CHOICE_GUIDED_ACTIONS.length) {
      errors.push("Guided progress is outside the known Choice Machine stages.");
    }
    return errors;
  },
};

export function choiceActionById(id: string): ChoiceAction | null {
  return ALL_ACTIONS.find((action) => action.id === id) ?? null;
}

export function normalizeChoiceAssumptions(
  value: Record<string, unknown>,
): ChoiceAssumptions {
  return {
    scenario: "open-afternoon",
    revealAlternatives: value.revealAlternatives !== false,
  };
}

export function activityLabel(activity: ChoiceActivity) {
  return ACTIVITIES[activity].label;
}

function isFeasible(activity: ChoiceActivity, constraints: ChoiceConstraints) {
  const costs = ACTIVITIES[activity].costs;
  return (
    costs.time <= constraints.time &&
    costs.money <= constraints.money &&
    costs.attention <= constraints.attention &&
    costs.energy <= constraints.energy
  );
}

function observationFor(id: string, title: string, detail: string): LabExplanation {
  return { id, kind: "simulation observation", title, detail };
}

function capitalize(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
