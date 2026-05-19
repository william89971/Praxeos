import type { SummaryRow } from "@/lib/module-runtime";
import type { CSSProperties, ReactNode } from "react";

interface Props {
  readonly label?: string;
  readonly insight: string;
  readonly rows: readonly SummaryRow[];
  readonly children?: ReactNode;
}

export function ResultSummaryCard({
  label = "Result summary",
  insight,
  rows,
  children,
}: Props) {
  return (
    <div style={resultStyle}>
      <p className="label-mono" style={resultLabelStyle}>
        {label}
      </p>
      <p style={insightStyle}>{insight}</p>
      <div style={summaryGridStyle}>
        {rows.map((row) => (
          <span key={row.label} style={summaryCellStyle}>
            <span className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
              {row.label}
            </span>
            <strong>{row.value}</strong>
          </span>
        ))}
      </div>
      {children}
    </div>
  );
}

const resultStyle: CSSProperties = {
  display: "grid",
  gap: "0.65rem",
  padding: "0.75rem",
  borderRadius: "var(--radius-sm)",
  background: "var(--paper)",
  border: "1px solid var(--rule)",
};

const resultLabelStyle: CSSProperties = {
  margin: 0,
  color: "var(--accent-capital)",
};

const insightStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  color: "var(--ink-primary)",
  lineHeight: 1.4,
};

const summaryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "0.45rem",
};

const summaryCellStyle: CSSProperties = {
  display: "grid",
  gap: "0.15rem",
  padding: "0.5rem",
  borderRadius: "var(--radius-sm)",
  background: "var(--paper-sunk)",
  color: "var(--ink-primary)",
};
