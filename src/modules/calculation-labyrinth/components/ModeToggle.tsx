"use client";

import type { CSSProperties } from "react";

interface Props {
  readonly priced: boolean;
  readonly onChange: (priced: boolean) => void;
}

export function ModeToggle({ priced, onChange }: Props) {
  return (
    <aside style={panelStyle} aria-live="polite">
      <div className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
        Calculation Labyrinth ·{" "}
        {priced ? "With market prices" : "Without market prices"}
      </div>
      <p style={headlineStyle}>
        {priced
          ? "The path is computable. Prices are the medium of computation."
          : "Without prices, the planner cannot tell which path is cheaper."}
      </p>
      <p style={sublineStyle}>
        {priced
          ? "Each marker glows in a chain. The pawn follows the canonical shortest route — not because it is told to, but because the prices make that route legible."
          : "The walls flicker. The markers go dark. The pawn wanders — there is no signal to compute against."}
      </p>
      <div
        aria-label="Mode"
        style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}
      >
        <Button active={priced} onClick={() => onChange(true)}>
          With market prices
        </Button>
        <Button active={!priced} onClick={() => onChange(false)}>
          Without market prices
        </Button>
      </div>
    </aside>
  );
}

function Button({
  active,
  onClick,
  children,
}: {
  readonly active: boolean;
  readonly onClick: () => void;
  readonly children: string;
}) {
  return (
    <button
      type="button"
      data-interactive
      className="label-mono"
      aria-pressed={active}
      onClick={onClick}
      style={{
        padding: "0.4rem 0.85rem",
        border: `1px solid ${active ? "var(--ink-secondary)" : "var(--rule)"}`,
        borderRadius: "var(--radius-sm)",
        background: active ? "var(--paper)" : "transparent",
        color: active ? "var(--ink-primary)" : "var(--ink-secondary)",
      }}
    >
      {children}
    </button>
  );
}

const panelStyle: CSSProperties = {
  display: "grid",
  gap: "0.6rem",
  padding: "0.95rem 1.1rem",
  background: "color-mix(in oklab, var(--paper-elevated) 85%, transparent)",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  maxWidth: "min(48ch, 100%)",
};

const headlineStyle: CSSProperties = {
  margin: "0.2rem 0 0",
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)",
  lineHeight: 1.25,
  color: "var(--ink-primary)",
};

const sublineStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step--1)",
  lineHeight: 1.55,
  color: "var(--ink-secondary)",
};
