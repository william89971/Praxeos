import type { CSSProperties } from "react";

const ENTRIES = [
  {
    token: "Walls",
    meaning: "The space of possible production decisions. Most of them are dead ends.",
    accent: "ink",
  },
  {
    token: "Markers",
    meaning:
      "Prices. Each one tells the planner whether this junction lies along a cheaper path.",
    accent: "bitcoin",
  },
  {
    token: "Pawn",
    meaning:
      "The planner. It computes its route by reading the markers — when they exist.",
    accent: "bitcoin",
  },
  {
    token: "Goal",
    meaning:
      "A production target. Reachable only when the cost of every alternative can be compared.",
    accent: "bitcoin",
  },
] as const;

export function Legend() {
  return (
    <section
      aria-label="Legend"
      style={{
        maxWidth: "var(--measure-prose)",
        marginInline: "auto",
        paddingInline: "var(--gutter-inline)",
        paddingBlock: "calc(var(--gutter-block) * 0.7) 0",
        display: "grid",
        gap: "1.2rem",
      }}
    >
      <header>
        <p className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
          What you are seeing
        </p>
        <h2 style={titleStyle}>The map of an economy</h2>
      </header>
      <dl style={dlStyle}>
        {ENTRIES.map((entry) => (
          <div key={entry.token} style={rowStyle}>
            <span aria-hidden="true" style={tabStyle(entry.accent)} />
            <dt style={dtStyle}>{entry.token}</dt>
            <dd style={ddStyle}>{entry.meaning}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const titleStyle: CSSProperties = {
  margin: "0.5rem 0 0",
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-3)",
  lineHeight: 1.1,
  color: "var(--ink-primary)",
};
const dlStyle: CSSProperties = { margin: 0, display: "grid", gap: "1rem" };
const rowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "0.5rem 14ch 1fr",
  gap: "0.85rem",
  alignItems: "baseline",
};
function tabStyle(accent: "ink" | "bitcoin" | "action" | "capital"): CSSProperties {
  const map = {
    ink: "var(--ink-primary)",
    bitcoin: "var(--accent-bitcoin)",
    action: "var(--accent-action)",
    capital: "var(--accent-capital)",
  } as const;
  return {
    width: "0.45rem",
    height: "1.1rem",
    background: map[accent],
    borderRadius: "1px",
    display: "inline-block",
  };
}
const dtStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-0)",
  fontStyle: "italic",
  color: "var(--ink-primary)",
  margin: 0,
};
const ddStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-0)",
  lineHeight: 1.55,
  color: "var(--ink-secondary)",
};
