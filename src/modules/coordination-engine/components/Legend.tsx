import type { CSSProperties } from "react";

const ENTRIES = [
  {
    token: "Agents",
    meaning:
      "Each icosahedron is one decision-making unit — a household, a firm, a saver, a buyer.",
    accent: "bitcoin",
  },
  {
    token: "Edges",
    meaning: "Voluntary monetary relationships. Where prices flow, edges glow.",
    accent: "bitcoin",
  },
  {
    token: "Pulses",
    meaning:
      "Information moving through the system: what someone is willing to pay, accept, or refuse.",
    accent: "bitcoin",
  },
  {
    token: "Phase coherence",
    meaning:
      "The synchrony you see at low distortion. Coordination is what coherence looks like.",
    accent: "ink",
  },
  {
    token: "Breakage",
    meaning:
      "Edges that fail intermittently as money quality falls. Plans built across them miss.",
    accent: "action",
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
        <h2 style={titleStyle}>Money as the shared signal layer</h2>
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
