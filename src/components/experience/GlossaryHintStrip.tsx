import type { CSSProperties } from "react";

const TERMS: Record<string, readonly { term: string; definition: string }[]> = {
  "signal-orchard": [
    {
      term: "Price signal",
      definition:
        "A price is compressed knowledge: it lets strangers adjust plans without sharing every local fact.",
    },
    {
      term: "Spontaneous order",
      definition:
        "Order that emerges from many purposeful actions without being centrally designed.",
    },
  ],
  "monetary-garden": [
    {
      term: "Malinvestment",
      definition:
        "Capital committed to projects that look profitable only because the money signal was distorted.",
    },
    {
      term: "Correction",
      definition:
        "The painful phase where the system discovers which plans cannot actually be completed.",
    },
  ],
  "calculation-labyrinth": [
    {
      term: "Economic calculation",
      definition:
        "The ability to compare alternative uses of scarce means through money prices.",
    },
    {
      term: "Capital goods",
      definition:
        "Produced means of production whose best use cannot be known without market prices.",
    },
  ],
  "coordination-engine": [
    {
      term: "Coordination",
      definition:
        "The alignment of separate plans across people who do not share one mind or one map.",
    },
    {
      term: "Latency",
      definition:
        "Delay in a signal. Even truthful information can mislead when it arrives too late.",
    },
  ],
};

export function GlossaryHintStrip({ slug }: { readonly slug: string }) {
  const terms = TERMS[slug];
  if (!terms) return null;

  return (
    <section aria-label="Beginner glossary" style={sectionStyle}>
      <p className="label-mono" style={labelStyle}>
        Beginner glossary
      </p>
      <div style={gridStyle}>
        {terms.map((entry) => (
          <details key={entry.term} style={termStyle}>
            <summary className="label-mono" style={summaryStyle}>
              {entry.term}
            </summary>
            <p style={definitionStyle}>{entry.definition}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

const sectionStyle: CSSProperties = {
  maxWidth: "var(--measure-prose)",
  marginInline: "auto",
  paddingInline: "var(--gutter-inline)",
  paddingBlock: "0 2.5rem",
};

const labelStyle: CSSProperties = {
  marginBlock: "0 0.75rem",
  color: "var(--ink-tertiary)",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))",
  gap: "0.7rem",
};

const termStyle: CSSProperties = {
  padding: "0.75rem 0.85rem",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  background: "var(--paper-sunk)",
};

const summaryStyle: CSSProperties = {
  cursor: "pointer",
  color: "var(--ink-primary)",
};

const definitionStyle: CSSProperties = {
  margin: "0.55rem 0 0",
  fontFamily: "var(--font-serif)",
  color: "var(--ink-secondary)",
  lineHeight: 1.45,
};
