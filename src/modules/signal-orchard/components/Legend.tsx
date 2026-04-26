import type { CSSProperties } from "react";

const ENTRIES = [
  {
    token: "Cypresses",
    meaning:
      "Individual actors. Each one is a person making a choice — buying, selling, refusing, waiting.",
    accent: "capital",
  },
  {
    token: "Network",
    meaning:
      "The web of voluntary relationships through which information about preferences travels.",
    accent: "ink",
  },
  {
    token: "Pulses",
    meaning:
      "Action made visible. A purchase, an offer, a refusal — every act is a signal others can read.",
    accent: "bitcoin",
  },
  {
    token: "Coordination",
    meaning:
      "What you see emerge when many private acts meet a shared price. No-one designs it.",
    accent: "ink",
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
        <h2 style={titleStyle}>Acts becoming a system</h2>
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

function tabStyle(accent: "capital" | "bitcoin" | "action" | "ink"): CSSProperties {
  const colorMap = {
    capital: "var(--accent-capital)",
    bitcoin: "var(--accent-bitcoin)",
    action: "var(--accent-action)",
    ink: "var(--ink-primary)",
  } as const;
  return {
    width: "0.45rem",
    height: "1.1rem",
    background: colorMap[accent],
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
