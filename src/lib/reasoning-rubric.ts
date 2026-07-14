export type ReasoningField =
  | "actor"
  | "end"
  | "means"
  | "constraint"
  | "opportunityCost"
  | "interpretation";

export type RubricStatus = "needs evidence" | "concept mismatch" | "ready to revise";

export interface RubricFeedback {
  field: ReasoningField;
  status: RubricStatus;
  message: string;
  evidence: readonly string[];
}

const PLACEHOLDERS = /^(idk|i don't know|none|n\/a|test|asdf|yes|no|the answer)$/i;

const RULES: Record<
  ReasoningField,
  { concepts: readonly RegExp[]; evidence: readonly RegExp[]; distinction: string }
> = {
  actor: {
    concepts: [/student/i, /team/i, /volunteer/i, /organizer/i, /school/i],
    evidence: [/plan/i, /event/i, /choose/i, /decid/i],
    distinction:
      "Name the person or group making the choice, not the budget or the event.",
  },
  end: {
    concepts: [/event/i, /attend/i, /community/i, /fund/i, /successful/i, /welcom/i],
    evidence: [/want/i, /goal/i, /aim/i, /so that/i, /purpose/i],
    distinction:
      "State the desired result; money and volunteer-hours are means or constraints.",
  },
  means: {
    concepts: [/budget/i, /dollar/i, /volunteer/i, /hour/i, /room/i, /food/i, /music/i],
    evidence: [/use/i, /spend/i, /allocate/i, /provide/i],
    distinction:
      "Name resources the team can use, not the outcome those resources serve.",
  },
  constraint: {
    concepts: [/1200/i, /budget/i, /20/i, /hour/i, /limited/i, /scarce/i],
    evidence: [/only/i, /cannot/i, /limit/i, /forces/i, /because/i],
    distinction:
      "A constraint limits the menu of possible plans; it is not simply a disliked result.",
  },
  opportunityCost: {
    concepts: [/give up/i, /forgo/i, /instead/i, /other/i, /next best/i, /less/i],
    evidence: [/food/i, /music/i, /decor/i, /space/i, /time/i, /path/i, /plan/i],
    distinction:
      "Opportunity cost is the best forgone alternative, not every possible downside.",
  },
  interpretation: {
    concepts: [
      /price/i,
      /signal/i,
      /compare/i,
      /waste/i,
      /uncertain/i,
      /knowledge/i,
      /coordinate/i,
    ],
    evidence: [/priced/i, /unpriced/i, /marker/i, /path/i, /resource/i, /labyrinth/i],
    distinction: "Connect the concept to something that happened in the labyrinth.",
  },
};

export function evaluateReasoning(field: ReasoningField, raw: string): RubricFeedback {
  const text = raw.trim();
  const rule = RULES[field];
  if (text.length < 12 || PLACEHOLDERS.test(text)) {
    return {
      field,
      status: "needs evidence",
      message: `Add a specific detail from the school-event scenario. ${rule.distinction}`,
      evidence: [],
    };
  }

  const concepts = rule.concepts.filter((pattern) => pattern.test(text)).map(String);
  const evidence = rule.evidence.filter((pattern) => pattern.test(text)).map(String);
  if (concepts.length === 0) {
    return {
      field,
      status: "concept mismatch",
      message: rule.distinction,
      evidence,
    };
  }

  if (evidence.length === 0) {
    return {
      field,
      status: "needs evidence",
      message:
        "The concept fits. Now explain how a concrete scenario detail supports it.",
      evidence: concepts,
    };
  }

  return {
    field,
    status: "ready to revise",
    message:
      "This is grounded enough to revise. Another interpretation may also be defensible if it uses scenario evidence.",
    evidence: [...concepts, ...evidence],
  };
}

export function evaluateReasoningSet(
  reasoning: Partial<Record<ReasoningField, string>>,
): RubricFeedback[] {
  return (Object.keys(RULES) as ReasoningField[]).map((field) =>
    evaluateReasoning(field, reasoning[field] ?? ""),
  );
}
