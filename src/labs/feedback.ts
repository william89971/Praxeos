import type { RubricFeedback, SelfReviewState } from "./types";

export interface SelfReviewInput {
  guidedComplete: boolean;
  initialReasoning: string;
  selectedEvidenceIds: readonly string[];
  acknowledgedAssumptionIds: readonly string[];
  revision: string;
  selfReviewChecks: readonly string[];
  requiredSelfReviewChecks?: number;
}

export function evaluateSelfReview(input: SelfReviewInput): RubricFeedback[] {
  const feedback: RubricFeedback[] = [];
  if (!input.guidedComplete || input.initialReasoning.trim().length === 0) {
    feedback.push({
      id: "complete-attempt",
      status: "revise or confirm",
      message: "Complete the guided consequence and record an initial interpretation.",
      basedOn: "completion",
    });
  }
  if (input.selectedEvidenceIds.length === 0) {
    feedback.push({
      id: "select-evidence",
      status: "add simulation evidence",
      message:
        "Select at least one visible event or observation. Praxeos will not infer evidence from your wording.",
      basedOn: "selected evidence",
    });
  }
  if (input.acknowledgedAssumptionIds.length === 0) {
    feedback.push({
      id: "acknowledge-assumption",
      status: "acknowledge an assumption",
      message:
        "Acknowledge at least one model assumption before comparing interpretations.",
      basedOn: "acknowledged assumption",
    });
  }
  if (input.initialReasoning.trim() && input.revision.trim().length === 0) {
    feedback.push({
      id: "revise-or-confirm",
      status: "revise or confirm",
      message:
        "Revise the initial response or explicitly confirm it after reviewing the evidence and assumptions.",
      basedOn: "revision",
    });
  }
  const requiredChecks = input.requiredSelfReviewChecks ?? 3;
  if (feedback.length === 0 && input.selfReviewChecks.length < requiredChecks) {
    feedback.push({
      id: "complete-self-review",
      status: "revise or confirm",
      message:
        "Complete each visible comparison prompt. The checklist records your review; it does not grade the conclusion.",
      basedOn: "self-review checklist",
    });
  }
  if (feedback.length === 0) {
    feedback.push({
      id: "ready-for-self-review",
      status: "ready for self-review",
      message:
        "The required record and comparison checklist are complete. No semantic grade is being assigned.",
      basedOn: "completion",
    });
  }
  return feedback;
}

export function primarySelfReviewState(
  feedback: readonly RubricFeedback[],
): SelfReviewState {
  return feedback[0]?.status ?? "revise or confirm";
}
