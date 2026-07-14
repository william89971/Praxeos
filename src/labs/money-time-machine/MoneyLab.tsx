"use client";

import {
  type GuidedLabDefinition,
  GuidedLabRuntime,
  type GuidedMetrics,
} from "@/labs/components/GuidedLabRuntime";
import { getLab } from "@/labs/registry";
import {
  DEFAULT_MONEY_ASSUMPTIONS,
  MONEY_EXPLORE_ACTIONS,
  MONEY_GUIDED_ACTIONS,
  MONEY_ROLES,
  type MoneyAction,
  type MoneyAssumptions,
  type MoneyState,
  latestSnapshot,
  moneyActionById,
  moneyEngine,
  normalizeMoneyAssumptions,
  roleLabel,
  ruleLabel,
} from "./engine";

const definition: GuidedLabDefinition<MoneyState, MoneyAction, MoneyAssumptions> = {
  lab: getLab("money-time-machine"),
  seed: "money-time-2026",
  defaultAssumptions: DEFAULT_MONEY_ASSUMPTIONS,
  engine: moneyEngine,
  guidedActions: MONEY_GUIDED_ACTIONS,
  exploreActions: MONEY_EXPLORE_ACTIONS,
  actionById: moneyActionById,
  normalizeAssumptions: normalizeMoneyAssumptions,
  Visual: MoneyTimeline,
  stages: [
    {
      question: "Who begins in a different economic position?",
      why: "The same monetary rule can meet people through wages, debt, rent, enterprise, cash, or assets.",
      concept: "Distribution begins from different positions",
    },
    {
      question: "Which monetary rule will the timeline use?",
      why: "Selecting a rule makes the growth input inspectable instead of hiding it in an outcome.",
      concept: "A model starts with explicit rules",
    },
    {
      question: "Who changes during the first period?",
      why: "Programmed timing makes early and late effects visible across participant lanes.",
      concept: "Monetary changes need not arrive simultaneously",
    },
    {
      question: "What accumulates after more time passes?",
      why: "Advancing the same assumptions reveals a distribution path rather than one average number.",
      concept: "Time changes distribution",
    },
    {
      question: "Which lanes respond first—and why?",
      why: "The order can be inspected, but it remains an assumption of this illustrative model.",
      concept: "Order matters in the Austrian interpretation",
    },
    {
      question: "Does a second rule create the same path?",
      why: "A side-by-side comparison holds participant profiles constant while changing one rule.",
      concept: "Comparison needs controlled assumptions",
    },
    {
      question: "How sensitive is the result to pass-through?",
      why: "Changing one assumption recomputes every affected lane and exposes model dependence.",
      concept: "Simulation outputs are assumption-sensitive",
    },
    {
      question: "What can this timeline support?",
      why: "Interpret the displayed results as illustrative consequences, not a forecast or ideological answer.",
      concept: "A traceable model is not a prediction",
    },
  ],
  assumptions: [
    {
      id: "six-roles",
      label:
        "Six simplified participant roles stand in for diverse real households and firms.",
    },
    {
      id: "timing-order",
      label: "Each role has a fixed programmed timing for modeled effects.",
    },
    {
      id: "pass-through",
      label: "Pass-through applies uniformly within a selected sensitivity run.",
    },
    {
      id: "no-forecast",
      label:
        "Outcome indices are illustrative and are not forecasts or measured impacts.",
    },
  ],
  sourceClaim:
    "Mises and Cantillon discuss non-neutral monetary change and differential timing; the source packet separates their arguments from modern empirical transmission research.",
  counterargument:
    "Actual distribution depends on policy design, expectations, contracts, banking structure, fiscal choices, production, demographics, and measurement that this six-lane model omits.",
  reflectionPrompt:
    "Which assumption most affects your interpretation, and what real evidence would you need before making a forecast?",
};

export default function MoneyLab() {
  return <GuidedLabRuntime definition={definition} />;
}

function MoneyTimeline({ state }: { state: MoneyState; metrics: GuidedMetrics }) {
  const primary = state.selectedRule
    ? latestSnapshot(state, state.selectedRule, state.period)
    : null;
  const comparison = state.comparisonRule
    ? latestSnapshot(state, state.comparisonRule, state.period)
    : null;
  return (
    <div className="lab-native-visual lab-native-visual--money">
      <svg
        viewBox="0 0 840 510"
        role="img"
        aria-labelledby="money-timeline-title money-timeline-description"
      >
        <title id="money-timeline-title">Multi-lane participant outcome timeline</title>
        <desc id="money-timeline-description">
          Six participant lanes show illustrative outcome indices under the selected
          monetary rule and, when available, a comparison rule.
        </desc>
        {[0, 1, 2, 3, 4].map((period) => (
          <g key={period}>
            <line
              x1={190 + period * 135}
              y1="45"
              x2={190 + period * 135}
              y2="465"
              className="money-grid-line"
            />
            <text x={190 + period * 135} y="30" className="native-small">
              P{period}
            </text>
          </g>
        ))}
        {MONEY_ROLES.map((role, index) => {
          const y = 75 + index * 70;
          const primaryValue = primary?.outcomes[role] ?? 100;
          const comparisonValue = comparison?.outcomes[role] ?? null;
          return (
            <g key={role}>
              <text x="92" y={y + 5} className="native-label">
                {roleLabel(role)}
              </text>
              <line x1="190" y1={y} x2="730" y2={y} className="money-lane" />
              <circle
                cx={190 + state.period * 135}
                cy={y - (primaryValue - 100) * 0.8}
                r="10"
                className="money-point money-point--primary"
              />
              {comparisonValue !== null ? (
                <circle
                  cx={190 + state.period * 135}
                  cy={y - (comparisonValue - 100) * 0.8}
                  r="7"
                  className="money-point money-point--comparison"
                />
              ) : null}
              <text x="790" y={y + 5} className="native-small">
                {primaryValue.toFixed(1)}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="native-visual-summary">
        <span className="label-mono">Illustrative simulation results</span>
        <strong>
          {state.selectedRule ? ruleLabel(state.selectedRule) : "No rule selected"}
          {state.comparisonRule ? ` vs. ${ruleLabel(state.comparisonRule)}` : ""}
        </strong>
        <span>Not a forecast · assumptions remain inspectable</span>
      </div>
    </div>
  );
}
