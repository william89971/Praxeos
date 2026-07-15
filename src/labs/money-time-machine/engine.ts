import type {
  GuidedAction,
  GuidedMetrics,
  GuidedState,
} from "@/labs/components/GuidedLabRuntime";
import type { LabEngine, LabExplanation } from "@/labs/types";

export type MoneyRole =
  | "worker"
  | "saver"
  | "borrower"
  | "entrepreneur"
  | "renter"
  | "asset-owner";
export type MoneyRule = "steady-growth" | "credit-expansion" | "fixed-stock";

export interface MoneyAssumptions {
  passThrough: number;
  productivityGrowth: number;
  periods: 4;
}

export interface MoneyAction extends GuidedAction {
  type:
    | "meet"
    | "select-rule"
    | "advance"
    | "inspect-order"
    | "compare"
    | "sensitivity"
    | "complete";
  rule?: MoneyRule;
  period?: number;
  passThrough?: number;
  guided?: true;
}

export interface MoneySnapshot {
  id: string;
  rule: MoneyRule;
  period: number;
  outcomes: Record<MoneyRole, number>;
}

export interface MoneyState extends GuidedState {
  assumptions: MoneyAssumptions;
  selectedRule: MoneyRule | null;
  comparisonRule: MoneyRule | null;
  period: number;
  snapshots: MoneySnapshot[];
  orderInspected: boolean;
}

const ROLES: readonly MoneyRole[] = [
  "worker",
  "saver",
  "borrower",
  "entrepreneur",
  "renter",
  "asset-owner",
];

const ROLE_RULES: Record<
  MoneyRole,
  { timing: number; exposure: number; label: string }
> = {
  worker: { timing: 2, exposure: 0.42, label: "Worker" },
  saver: { timing: 3, exposure: -0.34, label: "Saver" },
  borrower: { timing: 1, exposure: 0.58, label: "Borrower" },
  entrepreneur: { timing: 1, exposure: 0.78, label: "Entrepreneur" },
  renter: { timing: 2, exposure: -0.48, label: "Renter / buyer" },
  "asset-owner": { timing: 0, exposure: 1.05, label: "Asset owner" },
};

const RULE_GROWTH: Record<MoneyRule, number> = {
  "steady-growth": 2,
  "credit-expansion": 8,
  "fixed-stock": 0,
};

export const DEFAULT_MONEY_ASSUMPTIONS: MoneyAssumptions = {
  passThrough: 1,
  productivityGrowth: 1.5,
  periods: 4,
};

export const MONEY_GUIDED_ACTIONS: readonly MoneyAction[] = [
  {
    id: "meet-six-roles",
    label: "Meet the six participants",
    type: "meet",
    guided: true,
  },
  {
    id: "select-credit-expansion",
    label: "Select the credit-expansion rule",
    type: "select-rule",
    rule: "credit-expansion",
    guided: true,
  },
  {
    id: "advance-period-one",
    label: "Advance to period one",
    type: "advance",
    period: 1,
    guided: true,
  },
  {
    id: "advance-period-three",
    label: "Advance to period three",
    type: "advance",
    period: 3,
    guided: true,
  },
  {
    id: "inspect-receipt-order",
    label: "Inspect who changes first",
    type: "inspect-order",
    guided: true,
  },
  {
    id: "compare-steady-growth",
    label: "Compare a steady-growth rule",
    type: "compare",
    rule: "steady-growth",
    guided: true,
  },
  {
    id: "increase-pass-through",
    label: "Test higher asset pass-through",
    type: "sensitivity",
    passThrough: 1.3,
    guided: true,
  },
  {
    id: "complete-money",
    label: "Open interpretation",
    type: "complete",
    guided: true,
  },
] as const;

export const MONEY_EXPLORE_ACTIONS: readonly MoneyAction[] = [
  {
    id: "explore-fixed-stock",
    label: "Use fixed-stock scenario",
    type: "select-rule",
    rule: "fixed-stock",
  },
  {
    id: "explore-credit-expansion",
    label: "Use credit expansion",
    type: "select-rule",
    rule: "credit-expansion",
  },
  {
    id: "explore-period-four",
    label: "Advance to period four",
    type: "advance",
    period: 4,
  },
  {
    id: "explore-lower-pass-through",
    label: "Lower pass-through",
    type: "sensitivity",
    passThrough: 0.7,
  },
] as const;

const ALL_ACTIONS = [...MONEY_GUIDED_ACTIONS, ...MONEY_EXPLORE_ACTIONS];

export const moneyEngine: LabEngine<
  MoneyState,
  MoneyAction,
  GuidedMetrics,
  MoneyAssumptions
> = {
  create(seed, assumptions) {
    return {
      seed,
      assumptions: { ...assumptions },
      guidedStep: 0,
      completed: false,
      observations: [],
      selectedRule: null,
      comparisonRule: null,
      period: 0,
      snapshots: [],
      orderInspected: false,
    };
  },

  reduce(state, action) {
    if (state.observations.some((item) => item.id === action.id) && action.guided) {
      return state;
    }
    const next: MoneyState = {
      ...state,
      assumptions: { ...state.assumptions },
      observations: [...state.observations],
      snapshots: [...state.snapshots],
    };
    let observation: LabExplanation;

    if (action.type === "meet") {
      observation = simulationObservation(
        action.id,
        "Six starting positions are recorded",
        "A worker, saver, borrower, entrepreneur, renter or buyer, and asset owner begin at the same index but with different programmed timing and exposure.",
      );
    } else if (action.type === "select-rule" && action.rule) {
      next.selectedRule = action.rule;
      ensureSnapshot(next, action.rule, next.period, action.id);
      observation = simulationObservation(
        action.id,
        `${ruleLabel(action.rule)} becomes the selected rule`,
        `The rule sets an illustrative monetary-growth input of ${RULE_GROWTH[action.rule]}% per period. It is an inspectable assumption, not a forecast.`,
      );
    } else if (action.type === "advance" && typeof action.period === "number") {
      if (
        !next.selectedRule ||
        action.period < 0 ||
        action.period > next.assumptions.periods
      )
        return state;
      next.period = action.period;
      const snapshot = ensureSnapshot(
        next,
        next.selectedRule,
        action.period,
        action.id,
      );
      observation = simulationObservation(
        action.id,
        `The timeline advances to period ${action.period}`,
        `${largestMover(snapshot)} changes most in this programmed period while other lanes respond at different times.`,
      );
    } else if (action.type === "inspect-order") {
      next.orderInspected = true;
      observation = simulationObservation(
        action.id,
        "The order of modeled effects becomes visible",
        "Asset owners, borrowers, and entrepreneurs respond earlier in this rule set; wages and renter outcomes respond later. The order is assumed, not measured here.",
      );
    } else if (action.type === "compare" && action.rule && next.selectedRule) {
      next.comparisonRule = action.rule;
      const primary = ensureSnapshot(next, next.selectedRule, next.period, action.id);
      const comparison = ensureSnapshot(
        next,
        action.rule,
        next.period,
        `${action.id}-comparison`,
      );
      observation = simulationObservation(
        action.id,
        "A second rule creates a different distribution path",
        `At period ${next.period}, the selected-rule spread is ${spread(primary).toFixed(1)} points and the comparison spread is ${spread(comparison).toFixed(1)} points.`,
      );
    } else if (
      action.type === "sensitivity" &&
      typeof action.passThrough === "number"
    ) {
      const before = next.assumptions.passThrough;
      next.assumptions.passThrough = action.passThrough;
      if (next.selectedRule)
        replaceSnapshot(next, next.selectedRule, next.period, action.id);
      if (next.comparisonRule)
        replaceSnapshot(
          next,
          next.comparisonRule,
          next.period,
          `${action.id}-comparison`,
        );
      observation = simulationObservation(
        action.id,
        "An assumption changes the displayed distribution",
        `Pass-through moves from ${before.toFixed(1)} to ${action.passThrough.toFixed(1)}. Every affected lane is recomputed from the visible rule.`,
      );
    } else if (action.type === "complete") {
      next.completed = true;
      observation = simulationObservation(
        action.id,
        "The rule comparison is ready",
        "The record now separates simulated outcomes, timing assumptions, a source-grounded interpretation, and limits that the model cannot settle.",
      );
    } else {
      return state;
    }

    next.observations.push(observation);
    if (action.guided) {
      next.guidedStep = Math.min(MONEY_GUIDED_ACTIONS.length, state.guidedStep + 1);
    }
    return next;
  },

  derive(state) {
    const snapshot = state.selectedRule
      ? latestSnapshot(state, state.selectedRule, state.period)
      : null;
    return {
      cards: [
        { label: "Period", value: String(state.period) },
        {
          label: "Selected rule",
          value: state.selectedRule ? shortRule(state.selectedRule) : "None",
        },
        {
          label: "Outcome spread",
          value: snapshot ? `${spread(snapshot).toFixed(1)} pts` : "0.0 pts",
        },
        {
          label: "Pass-through",
          value: `${state.assumptions.passThrough.toFixed(1)}×`,
          detail: "assumption",
        },
      ],
      summary: snapshot
        ? `Illustrative outcomes at period ${snapshot.period}; every value is derived from visible assumptions.`
        : "Choose a monetary rule before advancing time.",
    };
  },

  describeChange(previous, next) {
    return next.observations.slice(previous.observations.length);
  },

  validate(state) {
    const errors: string[] = [];
    if (state.period < 0 || state.period > state.assumptions.periods)
      errors.push("The selected period is outside the modeled timeline.");
    if (state.assumptions.passThrough < 0.5 || state.assumptions.passThrough > 1.5)
      errors.push("Pass-through must stay within the visible sensitivity range.");
    if (
      state.snapshots.some((snapshot) =>
        Object.values(snapshot.outcomes).some((value) => !Number.isFinite(value)),
      )
    )
      errors.push("Every participant outcome must be a finite illustrative index.");
    return errors;
  },
};

export function moneyActionById(id: string): MoneyAction | null {
  return ALL_ACTIONS.find((action) => action.id === id) ?? null;
}

export function normalizeMoneyAssumptions(
  value: Record<string, unknown>,
): MoneyAssumptions {
  const passThrough =
    typeof value.passThrough === "number" &&
    value.passThrough >= 0.5 &&
    value.passThrough <= 1.5
      ? value.passThrough
      : DEFAULT_MONEY_ASSUMPTIONS.passThrough;
  return { ...DEFAULT_MONEY_ASSUMPTIONS, passThrough };
}

export function roleLabel(role: MoneyRole) {
  return ROLE_RULES[role].label;
}

export function ruleLabel(rule: MoneyRule) {
  return {
    "steady-growth": "Steady-growth rule",
    "credit-expansion": "Credit-expansion rule",
    "fixed-stock": "Fixed-stock rule",
  }[rule];
}

export function latestSnapshot(state: MoneyState, rule: MoneyRule, period: number) {
  return (
    state.snapshots
      .filter((item) => item.rule === rule && item.period === period)
      .at(-1) ?? null
  );
}

export const MONEY_ROLES = ROLES;

function ensureSnapshot(
  state: MoneyState,
  rule: MoneyRule,
  period: number,
  id: string,
) {
  const existing = latestSnapshot(state, rule, period);
  if (existing) return existing;
  const snapshot = createSnapshot(state, rule, period, id);
  state.snapshots.push(snapshot);
  return snapshot;
}

function replaceSnapshot(
  state: MoneyState,
  rule: MoneyRule,
  period: number,
  id: string,
) {
  state.snapshots = state.snapshots.filter(
    (snapshot) => !(snapshot.rule === rule && snapshot.period === period),
  );
  const snapshot = createSnapshot(state, rule, period, id);
  state.snapshots.push(snapshot);
  return snapshot;
}

function createSnapshot(
  state: MoneyState,
  rule: MoneyRule,
  period: number,
  id: string,
): MoneySnapshot {
  return {
    id,
    rule,
    period,
    outcomes: Object.fromEntries(
      ROLES.map((role) => [role, outcomeFor(state.assumptions, rule, role, period)]),
    ) as Record<MoneyRole, number>,
  };
}

function outcomeFor(
  assumptions: MoneyAssumptions,
  rule: MoneyRule,
  role: MoneyRole,
  period: number,
) {
  const profile = ROLE_RULES[role];
  const activePeriods = Math.max(0, period + 1 - profile.timing);
  const monetaryEffect =
    RULE_GROWTH[rule] * profile.exposure * activePeriods * assumptions.passThrough;
  const productivityEffect = assumptions.productivityGrowth * period * 0.45;
  return round(100 + monetaryEffect + productivityEffect);
}

function largestMover(snapshot: MoneySnapshot) {
  const role = ROLES.reduce((largest, candidate) =>
    Math.abs(snapshot.outcomes[candidate] - 100) >
    Math.abs(snapshot.outcomes[largest] - 100)
      ? candidate
      : largest,
  );
  return roleLabel(role);
}

function spread(snapshot: MoneySnapshot) {
  const values = Object.values(snapshot.outcomes);
  return Math.max(...values) - Math.min(...values);
}

function shortRule(rule: MoneyRule) {
  return rule.replace("-", " ");
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}

function simulationObservation(
  id: string,
  title: string,
  detail: string,
): LabExplanation {
  return { id, kind: "simulation observation", title, detail };
}
