import type { CSSProperties } from "react";

interface Entry {
  readonly token: string;
  readonly meaning: string;
  readonly accent: "capital" | "bitcoin" | "action" | "ink";
}

const ENTRIES: readonly Entry[] = [
  {
    token: "Trees",
    meaning:
      "Long-term capital. Lengthening structures of production grown patiently from saving.",
    accent: "capital",
  },
  {
    token: "Grass",
    meaning: "Consumption. Quick pleasure, easy to overgrow when credit is cheap.",
    accent: "capital",
  },
  {
    token: "Water",
    meaning:
      "Savings. The reservoir that funds genuine investment; it cannot be conjured.",
    accent: "capital",
  },
  {
    token: "Production nodes",
    meaning:
      "Industry — the productive cells of the economy. Their pulse is the rhythm of working markets.",
    accent: "bitcoin",
  },
  {
    token: "Paths",
    meaning:
      "Price signals — the connective tissue. Smooth when honest, warped when not.",
    accent: "bitcoin",
  },
  {
    token: "Dead zones",
    meaning:
      "Malinvestment. Capital committed to projects only credit expansion made look profitable.",
    accent: "action",
  },
  {
    token: "Signal beam",
    meaning:
      "The money signal itself. Bright at sound; tinted oxblood as the unit of account is debased.",
    accent: "bitcoin",
  },
];

/**
 * "What you are seeing" — a literal legend of the metaphor. Renders as
 * an editorial dl, paired with a small color tab to indicate accent.
 */
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
        gap: "1.3rem",
      }}
    >
      <header>
        <p className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
          What you are seeing
        </p>
        <h2 style={titleStyle}>The metaphor, made literal</h2>
      </header>

      <dl style={dlStyle}>
        {ENTRIES.map((entry) => (
          <Row key={entry.token} entry={entry} />
        ))}
      </dl>
    </section>
  );
}

function Row({ entry }: { readonly entry: Entry }) {
  return (
    <div style={rowStyle}>
      <span aria-hidden="true" style={tabStyle(entry.accent)} />
      <dt style={dtStyle}>{entry.token}</dt>
      <dd style={ddStyle}>{entry.meaning}</dd>
    </div>
  );
}

const titleStyle: CSSProperties = {
  margin: "0.5rem 0 0",
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-3)",
  lineHeight: 1.1,
  color: "var(--ink-primary)",
};

const dlStyle: CSSProperties = {
  margin: 0,
  display: "grid",
  gap: "1.1rem",
};

const rowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "0.5rem 14ch 1fr",
  gap: "0.85rem",
  alignItems: "baseline",
};

function tabStyle(accent: Entry["accent"]): CSSProperties {
  const colorMap: Record<Entry["accent"], string> = {
    capital: "var(--accent-capital)",
    bitcoin: "var(--accent-bitcoin)",
    action: "var(--accent-action)",
    ink: "var(--ink-primary)",
  };
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
