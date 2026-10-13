"use client";

import type { RubricFeedback } from "@/labs/types";
import type { ReactNode } from "react";

export interface ReflectionEvidence {
  id: string;
  title: string;
  detail?: string;
  latest: boolean;
}

export interface ReflectionCheck {
  id: string;
  label: string;
}

export function LabReflection({
  initialReasoning,
  revision,
  reflection,
  evidence,
  selectedEvidenceIds,
  assumptions,
  acknowledgedAssumptionIds,
  selfReviewChecks,
  reviewChecks,
  feedback,
  conceptVisible,
  offerComparison,
  onShowConcept,
  onContinueInitial,
  onContinueEvidence,
  onContinueLimits,
  showEvidence,
  showLimits,
  showRevision,
  onWriting,
  onToggle,
  onSelfReview,
  reflectionPrompt,
  reviewOpen,
  guide,
  actions,
  nextStep,
}: {
  initialReasoning: string;
  revision: string;
  reflection: string;
  evidence: readonly ReflectionEvidence[];
  selectedEvidenceIds: readonly string[];
  assumptions: readonly ReflectionCheck[];
  acknowledgedAssumptionIds: readonly string[];
  selfReviewChecks: readonly string[];
  reviewChecks: readonly ReflectionCheck[];
  feedback: readonly RubricFeedback[];
  conceptVisible: boolean;
  offerComparison: boolean;
  onShowConcept: () => void;
  onContinueInitial: () => void;
  onContinueEvidence: () => void;
  onContinueLimits: () => void;
  showEvidence: boolean;
  showLimits: boolean;
  showRevision: boolean;
  onWriting: (
    field: "initialReasoning" | "revision" | "reflection",
    value: string,
  ) => void;
  onToggle: (
    field: "selectedEvidenceIds" | "acknowledgedAssumptionIds" | "selfReviewChecks",
    id: string,
  ) => void;
  onSelfReview: () => void;
  reflectionPrompt: string;
  reviewOpen: boolean;
  guide: ReactNode;
  actions: ReactNode;
  nextStep: ReactNode;
}) {
  return (
    <section id="interpretation" className="lab-interpretation">
      <header>
        <p className="label-mono">Interpret · select · compare</p>
        <h2>What does this record support?</h2>
        <p>
          Write what you think first. Then choose the observations that matter, name a
          limit of the model, and revise. Nothing here grades your conclusion.
        </p>
      </header>

      <div className="lab-reasoning-grid">
        <label className="role-question">
          <span>Initial thinking</span>
          <textarea
            value={initialReasoning}
            onChange={(event) => onWriting("initialReasoning", event.target.value)}
            placeholder="What do you think happened, before the concept is named?"
            aria-label="Initial interpretation"
          />
          {!initialReasoning.trim() ? (
            <button type="button" className="text-button" onClick={onContinueInitial}>
              Continue without answering
            </button>
          ) : null}
        </label>

        {showEvidence ? (
          <fieldset className="role-observation">
            <legend>Choose the relevant observations</legend>
            <p>
              The latest change is marked. It is not selected for you. Pick the
              observations your interpretation actually uses.
            </p>
            {evidence.length ? (
              evidence.map((item) => (
                <label key={item.id} className="lab-check-row">
                  <input
                    type="checkbox"
                    checked={selectedEvidenceIds.includes(item.id)}
                    onChange={() => onToggle("selectedEvidenceIds", item.id)}
                  />
                  <span>
                    {item.latest ? <em>Latest. </em> : null}
                    <strong>{item.title}</strong>
                    {item.detail ? ` ${item.detail}` : null}
                  </span>
                </label>
              ))
            ) : (
              <p>Complete an action before selecting evidence.</p>
            )}
            {!selectedEvidenceIds.length ? (
              <button
                type="button"
                className="text-button"
                onClick={onContinueEvidence}
              >
                Continue without selecting
              </button>
            ) : null}
          </fieldset>
        ) : null}

        {showLimits ? (
          <fieldset className="role-explanation">
            <legend>Name a model limitation</legend>
            {assumptions.map((assumption) => (
              <label key={assumption.id} className="lab-check-row">
                <input
                  type="checkbox"
                  checked={acknowledgedAssumptionIds.includes(assumption.id)}
                  onChange={() => onToggle("acknowledgedAssumptionIds", assumption.id)}
                />
                <span>{assumption.label}</span>
              </label>
            ))}
            {!acknowledgedAssumptionIds.length ? (
              <button type="button" className="text-button" onClick={onContinueLimits}>
                Continue without this
              </button>
            ) : null}
          </fieldset>
        ) : null}

        {showRevision ? (
          <label className="role-explanation">
            <span>Revised understanding</span>
            {offerComparison ? (
              <p>Compare this with the interpretation you wrote before the concept.</p>
            ) : (
              <p>
                This note stands on its own. A before-and-after comparison appears only
                after an interpretation written before the concept.
              </p>
            )}
            {!conceptVisible ? (
              <button type="button" className="text-button" onClick={onShowConcept}>
                Show the concept now
              </button>
            ) : null}
            <textarea
              value={revision}
              onChange={(event) => onWriting("revision", event.target.value)}
              placeholder="What changed after the evidence and the model’s limits?"
              aria-label="Revision or explicit confirmation"
            />
          </label>
        ) : null}
      </div>

      <details className="lab-review-disclosure" open={reviewOpen}>
        <summary>Review and sources</summary>
        <fieldset>
          <legend>Transparent self-review checklist</legend>
          {reviewChecks.map((check) => (
            <label key={check.id} className="lab-check-row">
              <input
                type="checkbox"
                checked={selfReviewChecks.includes(check.id)}
                onChange={() => onToggle("selfReviewChecks", check.id)}
              />
              <span>{check.label}</span>
            </label>
          ))}
        </fieldset>
        <div className="lab-inline-actions">
          <button type="button" className="button-primary" onClick={onSelfReview}>
            Run transparent self-review
          </button>
        </div>
        {feedback.length ? (
          <output className="self-review-results">
            {feedback.map((item) => (
              <article key={item.id}>
                <p className="label-mono">{item.status}</p>
                <p>{item.message}</p>
                <small>Based on: {item.basedOn}</small>
              </article>
            ))}
          </output>
        ) : null}
        {guide}
        <label>
          <span>Final reflection</span>
          <textarea
            value={reflection}
            onChange={(event) => onWriting("reflection", event.target.value)}
            placeholder={reflectionPrompt}
            aria-label="Final reflection"
          />
        </label>
        {actions}
        {nextStep}
      </details>
    </section>
  );
}
