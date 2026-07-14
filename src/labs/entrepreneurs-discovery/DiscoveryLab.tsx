"use client";

import {
  type GuidedLabDefinition,
  GuidedLabRuntime,
  type GuidedMetrics,
} from "@/labs/components/GuidedLabRuntime";
import { getLab } from "@/labs/registry";
import {
  DEFAULT_DISCOVERY_ASSUMPTIONS,
  DISCOVERY_EXPLORE_ACTIONS,
  DISCOVERY_GUIDED_ACTIONS,
  type DiscoveryAction,
  type DiscoveryAssumptions,
  type DiscoveryState,
  discoveryActionById,
  discoveryEngine,
  normalizeDiscoveryAssumptions,
  regionLabel,
} from "./engine";

const definition: GuidedLabDefinition<
  DiscoveryState,
  DiscoveryAction,
  DiscoveryAssumptions
> = {
  lab: getLab("entrepreneurs-discovery"),
  seed: "discovery-2026",
  defaultAssumptions: DEFAULT_DISCOVERY_ASSUMPTIONS,
  engine: discoveryEngine,
  guidedActions: DISCOVERY_GUIDED_ACTIONS,
  exploreActions: DISCOVERY_EXPLORE_ACTIONS,
  actionById: discoveryActionById,
  normalizeAssumptions: normalizeDiscoveryAssumptions,
  Visual: OpportunityMap,
  stages: [
    {
      question: "What behavior is visible before an opportunity is named?",
      why: "Observation can expose a recurring difficulty without revealing its cause or solution.",
      concept: "Notice a problem before claiming an answer",
    },
    {
      question: "What would make this idea testable?",
      why: "A hypothesis connects a user, a change, and an observable action.",
      concept: "Entrepreneurial judgment forms a conjecture",
    },
    {
      question: "Which low-cost evidence should come first?",
      why: "An interview spends time and illuminates one region without proving demand.",
      concept: "Evidence has a cost and a scope",
    },
    {
      question: "Is a prototype worth scarce capital?",
      why: "Customer action after a prototype can contradict the story told in an interview.",
      concept: "Experiments expose plans to consequence",
    },
    {
      question: "Did behavior match the prediction?",
      why: "Interpreting a signal requires separating what happened from what the hypothesis claimed.",
      concept: "Action is evidence, not certainty",
    },
    {
      question: "What should change after mixed evidence?",
      why: "A revision preserves prior observations while changing what the next test predicts.",
      concept: "Discovery is a revisable process",
    },
    {
      question: "What does another segment add?",
      why: "A limited pilot consumes resources and reduces only part of the uncertainty.",
      concept: "No experiment reveals the whole map",
    },
    {
      question: "Continue, pivot, or stop?",
      why: "A decision commits scarce resources under uncertainty; none of the options proves a perfect path.",
      concept: "Judgment remains after evidence",
    },
  ],
  assumptions: [
    {
      id: "four-segments",
      label: "Only four customer regions exist in the opportunity map.",
    },
    {
      id: "seeded-signals",
      label: "Experiment signals come from a deterministic hidden seed.",
    },
    {
      id: "fixed-costs",
      label: "Each experiment uses fixed time and capital amounts.",
    },
    {
      id: "moderate-noise",
      label: "Signals are simplified as weak, mixed, or strong.",
    },
  ],
  sourceClaim:
    "Kirzner describes entrepreneurial discovery as alertness within a market process; the source packet presents the locator and competing accounts of innovation.",
  counterargument:
    "Discovery also depends on institutions, teams, financing, power, technology, luck, and selection effects that a seeded four-region map cannot reproduce.",
  reflectionPrompt:
    "Which experiment would you run next, what would it cost, and what would it still leave uncertain?",
};

export default function DiscoveryLab() {
  return <GuidedLabRuntime definition={definition} />;
}

function OpportunityMap({ state }: { state: DiscoveryState; metrics: GuidedMetrics }) {
  const regions = ["commuters", "students", "small-teams", "weekends"] as const;
  return (
    <div className="lab-native-visual lab-native-visual--discovery">
      <svg
        viewBox="0 0 760 440"
        role="img"
        aria-labelledby="opportunity-title opportunity-description"
      >
        <title id="opportunity-title">Partially obscured opportunity map</title>
        <desc id="opportunity-description">
          Four customer regions remain obscured until an experiment returns a weak,
          mixed, or strong signal. Tested regions do not reveal a perfect path.
        </desc>
        <defs>
          <pattern
            id="discovery-hatch"
            width="12"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <path d="M0 12 L12 0" className="discovery-hatch-line" />
          </pattern>
        </defs>
        {regions.map((region, index) => {
          const x = 60 + (index % 2) * 350;
          const y = 45 + Math.floor(index / 2) * 190;
          const result = state.results.filter((item) => item.region === region).at(-1);
          return (
            <g key={region}>
              <rect
                x={x}
                y={y}
                width="290"
                height="145"
                rx="12"
                className={`opportunity-region ${result ? `opportunity-region--${result.signal}` : ""}`}
              />
              {!result ? (
                <rect
                  x={x}
                  y={y}
                  width="290"
                  height="145"
                  rx="12"
                  fill="url(#discovery-hatch)"
                />
              ) : null}
              <text x={x + 145} y={y + 60} className="native-label">
                {regionLabel(region)}
              </text>
              <text x={x + 145} y={y + 92} className="native-small">
                {result ? `${result.signal} signal` : "untested · still hidden"}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="native-visual-summary">
        <span className="label-mono">Active hypothesis</span>
        <strong>{state.activeHypothesis ?? "No hypothesis yet"}</strong>
        <span>{state.uncertainty}% illustrative uncertainty remains</span>
      </div>
    </div>
  );
}
