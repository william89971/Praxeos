"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

interface Choice {
  readonly label: string;
  readonly feedback: string;
  readonly strong?: boolean;
}

interface Props {
  readonly id: string;
  readonly question: string;
  readonly choices: readonly Choice[];
}

export function JudgmentCheck({ id, question, choices }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex === null ? null : (choices[selectedIndex] ?? null);
  const answered = selectedIndex !== null;

  return (
    <section aria-labelledby={`${id}-heading`} style={shellStyle}>
      <p className="label-mono" style={labelStyle}>
        Judgment check
      </p>
      <h3 id={`${id}-heading`} style={questionStyle}>
        {question}
      </h3>

      <fieldset style={choiceGridStyle}>
        <legend style={legendStyle}>{question}</legend>
        {choices.map((choice, index) => {
          const selectedChoice = selectedIndex === index;
          const showStrongMark = answered && choice.strong;
          return (
            <button
              key={choice.label}
              type="button"
              data-interactive
              aria-pressed={selectedChoice}
              onClick={() => setSelectedIndex(index)}
              style={{
                ...choiceButtonStyle,
                borderColor: selectedChoice
                  ? "var(--accent-action)"
                  : showStrongMark
                    ? "var(--accent-capital)"
                    : "var(--rule)",
                background: selectedChoice
                  ? "color-mix(in oklab, var(--accent-action) 9%, var(--paper-elevated))"
                  : "var(--paper-elevated)",
              }}
            >
              <span style={choiceTitleStyle}>{choice.label}</span>
              {showStrongMark ? (
                <span className="label-mono" style={strongMarkStyle}>
                  Strongest answer
                </span>
              ) : null}
            </button>
          );
        })}
      </fieldset>

      {selected ? (
        <div style={feedbackStyle} aria-live="polite">
          <p className="label-mono" style={feedbackLabelStyle}>
            Feedback
          </p>
          <p style={feedbackCopyStyle}>{selected.feedback}</p>
        </div>
      ) : null}
    </section>
  );
}

const shellStyle: CSSProperties = {
  display: "grid",
  gap: "0.75rem",
};

const labelStyle: CSSProperties = {
  margin: 0,
  color: "var(--accent-bitcoin)",
};

const questionStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-1)",
};

const choiceGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 16rem), 1fr))",
  gap: "0.8rem",
  padding: 0,
  margin: 0,
  border: 0,
};

const legendStyle: CSSProperties = {
  position: "absolute",
  inlineSize: "1px",
  blockSize: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
};

const choiceButtonStyle: CSSProperties = {
  display: "grid",
  gap: "0.45rem",
  alignContent: "start",
  minHeight: "6.75rem",
  padding: "0.85rem",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  color: "var(--ink-primary)",
  textAlign: "start",
};

const choiceTitleStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-0)",
  lineHeight: 1.25,
};

const strongMarkStyle: CSSProperties = {
  color: "var(--accent-capital)",
};

const feedbackStyle: CSSProperties = {
  display: "grid",
  gap: "0.35rem",
  padding: "0.85rem 1rem",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  background: "var(--paper-sunk)",
};

const feedbackLabelStyle: CSSProperties = {
  margin: 0,
  color: "var(--accent-action)",
};

const feedbackCopyStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  color: "var(--ink-secondary)",
  lineHeight: 1.45,
};
