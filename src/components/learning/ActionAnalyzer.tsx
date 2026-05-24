"use client";

import { useLearningStore } from "@/hooks/useLearningStore";
import type { ActionAnalyzerSeed } from "@/lib/praxeology";
import { useMemo, useState } from "react";
import type { CSSProperties, FormEvent } from "react";

type AnalyzerField = keyof ActionAnalyzerSeed;

const EMPTY_ANSWERS: ActionAnalyzerSeed = {
  actor: "",
  end: "",
  means: "",
  constraint: "",
  tradeoff: "",
  opportunityCost: "",
  revealedPreference: "",
};

interface Props {
  readonly id: string;
  readonly title: string;
  readonly scenario: string;
  readonly seed: ActionAnalyzerSeed;
  readonly insight: string;
  readonly sourceNote?: string;
  readonly completion?: {
    readonly type: "lesson" | "case";
    readonly id: string;
  };
}

const FIELDS: readonly {
  readonly key: AnalyzerField;
  readonly label: string;
  readonly hint: string;
}[] = [
  {
    key: "actor",
    label: "Actor",
    hint: "Who is choosing?",
  },
  {
    key: "end",
    label: "End",
    hint: "What improvement is being sought?",
  },
  {
    key: "means",
    label: "Means",
    hint: "What is being used to pursue the end?",
  },
  {
    key: "constraint",
    label: "Constraint",
    hint: "What scarcity, rule, or limit shapes the choice?",
  },
  {
    key: "tradeoff",
    label: "Tradeoff",
    hint: "What is accepted to get the end?",
  },
  {
    key: "opportunityCost",
    label: "Opportunity cost",
    hint: "What is the best forgone alternative?",
  },
  {
    key: "revealedPreference",
    label: "Revealed preference",
    hint: "What did the action rank highest in that moment?",
  },
];

export function ActionAnalyzer({
  id,
  title,
  scenario,
  seed,
  insight,
  sourceNote,
  completion,
}: Props) {
  const modelAnswer = seed;
  const { markLessonComplete, markCaseComplete, saveJournalEntry } = useLearningStore();
  const [answers, setAnswers] = useState<ActionAnalyzerSeed>(EMPTY_ANSWERS);
  const [complete, setComplete] = useState(false);
  const [saved, setSaved] = useState(false);

  const allFieldsComplete = FIELDS.every(
    (field) => answers[field.key].trim().length > 0,
  );
  const snapshot = useMemo(
    () => ({
      situation: scenario,
      ...answers,
    }),
    [answers, scenario],
  );

  function updateField(key: AnalyzerField, value: string) {
    setSaved(false);
    setComplete(false);
    setAnswers((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!allFieldsComplete) return;

    setComplete(true);
    if (completion?.type === "lesson") {
      markLessonComplete(completion.id);
    }
    if (completion?.type === "case") {
      markCaseComplete(completion.id);
    }
  }

  function saveEntry() {
    if (!complete) return;

    saveJournalEntry({
      sourceType: completion?.type ?? "practice",
      sourceId: completion?.id ?? id,
      title,
      insight,
      snapshot,
    });
    setSaved(true);
  }

  return (
    <section aria-labelledby={`${id}-heading`} style={shellStyle}>
      <div style={headerStyle}>
        <p className="label-mono" style={eyebrowStyle}>
          Action Analyzer
        </p>
        <h3 id={`${id}-heading`} style={headingStyle}>
          {title}
        </h3>
        <p style={scenarioStyle}>{scenario}</p>
      </div>

      <form onSubmit={handleSubmit} style={formStyle}>
        {FIELDS.map((field) => (
          <label key={field.key} style={fieldStyle}>
            <span className="label-mono" style={fieldLabelStyle}>
              {field.label}
            </span>
            <textarea
              data-interactive
              value={answers[field.key]}
              aria-describedby={`${id}-${field.key}-hint`}
              onChange={(event) => updateField(field.key, event.target.value)}
              placeholder={modelAnswer[field.key]}
              required
              style={textareaStyle}
              rows={2}
            />
            <span id={`${id}-${field.key}-hint`} style={hintStyle}>
              {field.hint}
            </span>
          </label>
        ))}

        <div style={buttonRowStyle}>
          <button
            type="submit"
            data-interactive
            className="label-mono"
            disabled={!allFieldsComplete}
            style={{
              ...primaryButtonStyle,
              opacity: allFieldsComplete ? 1 : 0.45,
              cursor: allFieldsComplete ? "pointer" : "not-allowed",
            }}
          >
            Check the action
          </button>
          <button
            type="button"
            data-interactive
            className="label-mono"
            onClick={saveEntry}
            disabled={!complete || saved}
            style={{
              ...secondaryButtonStyle,
              opacity: complete && !saved ? 1 : 0.45,
              cursor: complete && !saved ? "pointer" : "not-allowed",
            }}
          >
            {saved ? "Saved to journal" : "Save to journal"}
          </button>
        </div>
      </form>

      {complete ? (
        <div style={resultStyle} aria-live="polite">
          <p className="label-mono" style={resultLabelStyle}>
            You just did praxeology.
          </p>
          <p style={resultCopyStyle}>{insight}</p>
          {sourceNote ? <p style={sourceStyle}>{sourceNote}</p> : null}
        </div>
      ) : null}
    </section>
  );
}

const shellStyle: CSSProperties = {
  display: "grid",
  gap: "1rem",
  padding: "1rem",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  background: "var(--paper-elevated)",
  boxShadow: "0 18px 55px -42px rgb(28 24 20 / 0.55)",
};

const headerStyle: CSSProperties = {
  display: "grid",
  gap: "0.45rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: "var(--accent-action)",
};

const headingStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-1)",
  lineHeight: 1.15,
};

const scenarioStyle: CSSProperties = {
  margin: 0,
  color: "var(--ink-secondary)",
  fontFamily: "var(--font-serif)",
  lineHeight: 1.5,
};

const formStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))",
  gap: "0.85rem",
};

const fieldStyle: CSSProperties = {
  display: "grid",
  gap: "0.35rem",
};

const fieldLabelStyle: CSSProperties = {
  color: "var(--ink-primary)",
};

const textareaStyle: CSSProperties = {
  minHeight: "4.2rem",
  resize: "vertical",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  background: "var(--paper)",
  color: "var(--ink-primary)",
  padding: "0.65rem",
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step--1)",
  lineHeight: 1.35,
};

const hintStyle: CSSProperties = {
  color: "var(--ink-tertiary)",
  fontSize: "var(--step--2)",
  lineHeight: 1.35,
};

const buttonRowStyle: CSSProperties = {
  gridColumn: "1 / -1",
  display: "flex",
  gap: "0.75rem",
  alignItems: "center",
  flexWrap: "wrap",
};

const primaryButtonStyle: CSSProperties = {
  padding: "0.68rem 0.9rem",
  borderRadius: "var(--radius-sm)",
  background: "var(--ink-primary)",
  color: "var(--paper)",
  border: "1px solid var(--ink-primary)",
};

const secondaryButtonStyle: CSSProperties = {
  padding: "0.68rem 0.9rem",
  borderRadius: "var(--radius-sm)",
  background: "var(--paper)",
  color: "var(--ink-primary)",
  border: "1px solid var(--rule-strong)",
};

const resultStyle: CSSProperties = {
  display: "grid",
  gap: "0.45rem",
  padding: "0.85rem 1rem",
  borderRadius: "var(--radius-sm)",
  border: "1px solid color-mix(in oklab, var(--accent-capital) 62%, var(--rule))",
  background: "color-mix(in oklab, var(--accent-capital) 9%, var(--paper))",
};

const resultLabelStyle: CSSProperties = {
  margin: 0,
  color: "var(--accent-capital)",
};

const resultCopyStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  lineHeight: 1.5,
  color: "var(--ink-primary)",
};

const sourceStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step--1)",
  lineHeight: 1.45,
  color: "var(--ink-tertiary)",
};
