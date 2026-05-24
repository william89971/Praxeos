"use client";

import { useLearningStore } from "@/hooks/useLearningStore";
import type { CSSProperties } from "react";

export function ActionJournalPanel() {
  const { state, clearJournal } = useLearningStore();
  const entries = state.journal.slice(0, 5);

  return (
    <section aria-labelledby="action-journal-heading" style={shellStyle}>
      <div style={headerStyle}>
        <div>
          <p className="label-mono" style={eyebrowStyle}>
            Study notes
          </p>
          <h2 id="action-journal-heading" style={headingStyle}>
            My saved notes
          </h2>
        </div>
        {state.journal.length > 0 ? (
          <button
            type="button"
            data-interactive
            className="label-mono"
            onClick={clearJournal}
            style={clearStyle}
          >
            Clear
          </button>
        ) : null}
      </div>

      {entries.length > 0 ? (
        <ol style={listStyle}>
          {entries.map((entry) => (
            <li key={entry.id} style={entryStyle}>
              <p className="label-mono" style={entryMetaStyle}>
                {entry.sourceType} - {formatDate(entry.createdAt)}
              </p>
              <h3 style={entryTitleStyle}>{entry.title}</h3>
              <p style={entryCopyStyle}>{entry.insight}</p>
              <p style={entryQuestionStyle}>
                <strong>Action:</strong> {entry.snapshot.actor} used{" "}
                {entry.snapshot.means} to pursue {entry.snapshot.end}.
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <p style={emptyStyle}>
          Notes you save will show up here. They stay in this browser for now.
        </p>
      )}
    </section>
  );
}

function formatDate(value: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return "Saved";
  }
}

const shellStyle: CSSProperties = {
  display: "grid",
  gap: "1rem",
  padding: "1rem",
  border: "1px solid color-mix(in oklab, var(--accent-capital) 30%, var(--rule))",
  borderRadius: "var(--radius-sm)",
  background: "color-mix(in oklab, var(--accent-capital) 5%, var(--paper-elevated))",
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "start",
  justifyContent: "space-between",
  gap: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  marginBlockEnd: "0.35rem",
  color: "var(--accent-capital)",
};

const headingStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-1)",
};

const clearStyle: CSSProperties = {
  color: "var(--ink-tertiary)",
  textDecoration: "underline",
};

const listStyle: CSSProperties = {
  display: "grid",
  gap: "0.75rem",
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const entryStyle: CSSProperties = {
  display: "grid",
  gap: "0.35rem",
  paddingBlockStart: "0.75rem",
  borderBlockStart: "1px solid var(--rule)",
};

const entryMetaStyle: CSSProperties = {
  margin: 0,
  color: "var(--ink-tertiary)",
};

const entryTitleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-0)",
};

const entryCopyStyle: CSSProperties = {
  margin: 0,
  color: "var(--ink-secondary)",
  fontFamily: "var(--font-serif)",
  lineHeight: 1.45,
};

const entryQuestionStyle: CSSProperties = {
  margin: 0,
  color: "var(--ink-primary)",
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step--1)",
  lineHeight: 1.45,
};

const emptyStyle: CSSProperties = {
  margin: 0,
  color: "var(--ink-secondary)",
  fontFamily: "var(--font-serif)",
  lineHeight: 1.5,
};
