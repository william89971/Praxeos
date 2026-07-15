"use client";

import {
  type GuidedLabDefinition,
  GuidedLabRuntime,
  type GuidedMetrics,
} from "@/labs/components/GuidedLabRuntime";
import { getLab } from "@/labs/registry";
import {
  CHOICE_EXPLORE_ACTIONS,
  CHOICE_GUIDED_ACTIONS,
  type ChoiceAction,
  type ChoiceAssumptions,
  type ChoiceState,
  DEFAULT_CHOICE_ASSUMPTIONS,
  activityLabel,
  choiceActionById,
  choiceEngine,
  normalizeChoiceAssumptions,
} from "./engine";

const definition: GuidedLabDefinition<ChoiceState, ChoiceAction, ChoiceAssumptions> = {
  lab: getLab("choice-machine"),
  seed: "choice-2026",
  defaultAssumptions: DEFAULT_CHOICE_ASSUMPTIONS,
  engine: choiceEngine,
  guidedActions: CHOICE_GUIDED_ACTIONS,
  exploreActions: CHOICE_EXPLORE_ACTIONS,
  actionById: choiceActionById,
  normalizeAssumptions: normalizeChoiceAssumptions,
  Visual: ChoiceTimeline,
  stages: [
    {
      question: "What is limited before anything is chosen?",
      why: "A meaningful choice begins from scarce time, money, attention, and energy.",
      concept: "Scarcity is situational",
    },
    {
      question: "Which future will you make actual?",
      why: "Selecting one feasible activity gives up control of the same resources elsewhere.",
      concept: "Choice reveals a momentary ranking",
    },
    {
      question: "What happened to the paths not taken?",
      why: "Forgone alternatives remain conceptually important even though they were not observed.",
      concept: "Opportunity cost is the valued alternative forgone",
    },
    {
      question: "Does the same ranking survive a changed limit?",
      why: "A change in available time can alter which paths fit and which end is chosen.",
      concept: "Preferences are revealed under conditions",
    },
    {
      question: "What changes when you choose again?",
      why: "The revised choice records a new decision under new conditions, not a permanent personality score.",
      concept: "One action is not a complete preference map",
    },
    {
      question: "What does this pair of choices support?",
      why: "Compare the two visible decisions while keeping unobserved motives and future changes explicit.",
      concept: "Interpret the record without overclaiming",
    },
  ],
  assumptions: [
    {
      id: "fixed-costs",
      label: "Each activity uses fixed, simplified resource amounts.",
    },
    {
      id: "four-paths",
      label: "Only four named activities exist in this small scenario.",
    },
    {
      id: "visible-limits",
      label: "All relevant limits are represented by four visible counters.",
    },
    {
      id: "momentary-ranking",
      label: "A choice reveals only a momentary ranking under these conditions.",
    },
  ],
  sourceClaim:
    "Mises treats action as choosing among ends with scarce means; the source packet distinguishes that claim from what this scenario directly observes.",
  counterargument:
    "Observed choices can be shaped by habit, framing, social pressure, incomplete awareness, or mistaken beliefs that this four-counter model does not represent.",
  reflectionPrompt:
    "Which changed constraint would you test next, and what would a different choice fail to prove?",
};

export default function ChoiceLab() {
  return <GuidedLabRuntime definition={definition} />;
}

function ChoiceTimeline({
  state,
}: {
  state: ChoiceState;
  metrics: GuidedMetrics;
}) {
  const activities = ["community-event", "paid-shift", "study", "rest"] as const;
  return (
    <div className="lab-native-visual lab-native-visual--choice">
      <svg
        viewBox="0 0 760 430"
        role="img"
        aria-labelledby="choice-timeline-title choice-timeline-description"
      >
        <title id="choice-timeline-title">Branching choice timeline</title>
        <desc id="choice-timeline-description">
          Four possible activities branch from the present. The selected path is solid;
          alternatives remain visible as dashed paths.
        </desc>
        <circle cx="90" cy="215" r="42" className="native-origin" />
        <text x="90" y="210" className="native-label">
          NOW
        </text>
        <text x="90" y="232" className="native-small">
          {state.constraints.time}h · ${state.constraints.money}
        </text>
        {activities.map((activity, index) => {
          const y = 65 + index * 100;
          const selected = state.selectedActivity === activity;
          const visible = selected || state.visibleAlternatives.includes(activity);
          return (
            <g key={activity} opacity={visible || state.guidedStep < 2 ? 1 : 0.45}>
              <path
                d={`M132 215 C220 215 220 ${y} 320 ${y}`}
                className={
                  selected ? "native-path native-path--selected" : "native-path"
                }
              />
              <rect
                x="320"
                y={y - 30}
                width="190"
                height="60"
                rx="30"
                className={
                  selected ? "native-node native-node--selected" : "native-node"
                }
              />
              <text x="415" y={y + 5} className="native-label">
                {activityLabel(activity)}
              </text>
              <path
                d={`M510 ${y} C570 ${y} 575 ${y} 635 ${y}`}
                className={
                  selected ? "native-path native-path--selected" : "native-path"
                }
              />
              <circle
                cx="665"
                cy={y}
                r="28"
                className={
                  selected ? "native-future native-future--selected" : "native-future"
                }
              />
            </g>
          );
        })}
      </svg>
      <div className="native-visual-summary">
        <span className="label-mono">Current selected future</span>
        <strong>
          {state.selectedActivity
            ? activityLabel(state.selectedActivity)
            : "No path selected"}
        </strong>
        <span>{state.visibleAlternatives.length} forgone paths remain visible</span>
      </div>
    </div>
  );
}
