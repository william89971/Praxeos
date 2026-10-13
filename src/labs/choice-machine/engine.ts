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
  type: "inspect" | "predict" | "choose" | "reveal" | "change-constraint" | "complete";
  activity?: ChoiceActivity;
  constraint?: keyof ChoiceConstraints;
  delta?: number;
  guided?: true;
}

export interface ChoiceStageOption {
  action: ChoiceAction;
  label: string;
  disabled: boolean;
  reason: string | null;
}

export interface ChoiceStageControl {
  kind: "prediction" | "choice" | "single";
  prompt: string;
  options: ChoiceStageOption[];
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

const ACTIVITY_ORDER: readonly ChoiceActivity[] = [
  "community-event",
  "paid-shift",
  "study",
  "rest",
];

function predictAction(
  id: string,
  label: string,
  activity?: ChoiceActivity,
): ChoiceAction {
  return activity
    ? { id, label, type: "predict", activity, guided: true }
    : { id, label, type: "predict", guided: true };
}

function chooseAction(id: string, activity: ChoiceActivity): ChoiceAction {
  return {
    id,
    label: ACTIVITIES[activity].label,
    type: "choose",
    activity,
    guided: true,
  };
}

export const CHOICE_PREDICTION_ACTIONS: readonly ChoiceAction[] = [
  ...ACTIVITY_ORDER.map((activity) =>
    predictAction(
      `predict-select-${activity}`,
      `Expect ${ACTIVITIES[activity].label.toLowerCase()}`,
      activity,
    ),
  ),
  ...ACTIVITY_ORDER.map((activity) =>
    predictAction(
      `predict-forgone-${activity}`,
      `Expect to give up ${ACTIVITIES[activity].label.toLowerCase()}`,
      activity,
    ),
  ),
  predictAction("predict-fit-study-rest", "Expect study and rest to still fit"),
  predictAction("predict-fit-all", "Expect all four paths to still fit"),
  predictAction("predict-fit-community", "Expect the community event to still fit"),
  predictAction("predict-fit-none", "Expect no path to still fit"),
  ...ACTIVITY_ORDER.map((activity) =>
    predictAction(
      `predict-revise-${activity}`,
      `Expect to revise toward ${ACTIVITIES[activity].label.toLowerCase()}`,
      activity,
    ),
  ),
];

export const CHOICE_LEARNER_ACTIONS: readonly ChoiceAction[] = [
  ...ACTIVITY_ORDER.map((activity) =>
    chooseAction(`guided-choose-${activity}`, activity),
  ),
  ...ACTIVITY_ORDER.map((activity) =>
    chooseAction(`guided-revise-${activity}`, activity),
  ),
];

const ALL_ACTIONS = [
  ...CHOICE_GUIDED_ACTIONS,
  ...CHOICE_EXPLORE_ACTIONS,
  ...CHOICE_PREDICTION_ACTIONS,
  ...CHOICE_LEARNER_ACTIONS,
];

export const CHOICE_PREDICTION_IDS: readonly string[] = CHOICE_PREDICTION_ACTIONS.map(
  (action) => action.id,
);

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

    let infeasibleChoice = false;
    if (action.type === "inspect") {
      observation = observationFor(
        action.id,
        "Four limits are visible",
        "The afternoon contains four hours, $30, three attention units, and three energy units. None is unlimited.",
      );
    } else if (action.type === "predict") {
      observation = observationFor(
        action.id,
        "Prediction recorded",
        `You predicted: ${action.label.replace(/^Expect /, "")}. The model has not applied that guess.`,
      );
    } else if (action.type === "choose" && action.activity) {
      if (!isFeasible(action.activity, next.constraints)) {
        infeasibleChoice = true;
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
      const names = next.visibleAlternatives.map(
        (activity) => ACTIVITIES[activity].label,
      );
      observation = observationFor(
        action.id,
        "The forgone paths remain visible",
        names.length
          ? `${names.join(", ")} remain visible. They were not selected in this moment.`
          : "No alternative remains outside the selected path.",
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
    const advances =
      Boolean(action.guided) && action.type !== "predict" && !infeasibleChoice;
    if (advances) {
      next.guidedStep = Math.min(CHOICE_GUIDED_ACTIONS.length, state.guidedStep + 1);
    }
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

export function choiceStageControl(state: ChoiceState): ChoiceStageControl | null {
  if (state.guidedStep <= 0) {
    const inspect = CHOICE_GUIDED_ACTIONS[0];
    return inspect
      ? {
          kind: "single",
          prompt: "Look at the limits before choosing.",
          options: [option(inspect)],
        }
      : null;
  }
  if (state.guidedStep === 1) {
    if (!hasPrediction(state, "predict-select-")) {
      return {
        kind: "prediction",
        prompt: "Before you choose, which path do you expect to take?",
        options: predictionOptions("predict-select-"),
      };
    }
    return {
      kind: "choice",
      prompt: "Choose a path that fits the limits you can see.",
      options: ACTIVITY_ORDER.map((activity) =>
        feasibilityOption(chooseAction(`guided-choose-${activity}`, activity), state),
      ),
    };
  }
  if (state.guidedStep === 2) {
    if (!hasPrediction(state, "predict-forgone-")) {
      return {
        kind: "prediction",
        prompt: "Which alternative do you expect to matter most as the one given up?",
        options: predictionOptions("predict-forgone-"),
      };
    }
    const reveal = CHOICE_GUIDED_ACTIONS[2];
    return reveal
      ? {
          kind: "single",
          prompt: "Look at the paths that stayed unchosen.",
          options: [option(reveal)],
        }
      : null;
  }
  if (state.guidedStep === 3) {
    if (!hasPrediction(state, "predict-fit-")) {
      return {
        kind: "prediction",
        prompt: "If two hours disappear, which paths do you expect will still fit?",
        options: CHOICE_PREDICTION_ACTIONS.filter((action) =>
          action.id.startsWith("predict-fit-"),
        ).map((action) => option(action)),
      };
    }
    const shock = CHOICE_GUIDED_ACTIONS[3];
    return shock
      ? {
          kind: "single",
          prompt: "Apply the programmed change, then read what still fits.",
          options: [option(shock)],
        }
      : null;
  }
  if (state.guidedStep === 4) {
    if (!hasPrediction(state, "predict-revise-")) {
      return {
        kind: "prediction",
        prompt: "Under the new limit, which path do you expect to choose?",
        options: predictionOptions("predict-revise-"),
      };
    }
    return {
      kind: "choice",
      prompt: "Choose again. A path that no longer fits stays visible and unavailable.",
      options: ACTIVITY_ORDER.map((activity) =>
        feasibilityOption(chooseAction(`guided-revise-${activity}`, activity), state),
      ),
    };
  }
  if (state.guidedStep === 5) {
    const complete = CHOICE_GUIDED_ACTIONS[5];
    return complete
      ? {
          kind: "single",
          prompt: "The two decisions are ready to interpret.",
          options: [option(complete)],
        }
      : null;
  }
  return null;
}

export function feasibleActivities(state: ChoiceState): ChoiceActivity[] {
  return ACTIVITY_ORDER.filter((activity) => isFeasible(activity, state.constraints));
}

function predictionOptions(prefix: string): ChoiceStageOption[] {
  return CHOICE_PREDICTION_ACTIONS.filter((action) => action.id.startsWith(prefix)).map(
    (action) => option(action),
  );
}

function option(action: ChoiceAction): ChoiceStageOption {
  return { action, label: action.label, disabled: false, reason: null };
}

function feasibilityOption(
  action: ChoiceAction,
  state: ChoiceState,
): ChoiceStageOption {
  const activity = action.activity;
  if (!activity || isFeasible(activity, state.constraints)) return option(action);
  const costs = ACTIVITIES[activity].costs;
  const blocked = (Object.keys(costs) as Array<keyof ChoiceConstraints>).find(
    (key) => costs[key] > state.constraints[key],
  );
  return {
    action,
    label: action.label,
    disabled: true,
    reason: blocked
      ? `Needs more ${blocked} than the model currently shows.`
      : "This path does not fit the current limits.",
  };
}

function hasPrediction(state: ChoiceState, prefix: string): boolean {
  return state.observations.some((item) => item.id.startsWith(prefix));
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
