"use client";

import type { CSSProperties } from "react";

interface Props {
  readonly mode: "guided" | "explore";
  readonly onModeChange: (m: "guided" | "explore") => void;
  readonly hoveredId: number | null;
  readonly recentActionCount: number;
}

export function InteractionPanel({
  mode,
  onModeChange,
  hoveredId,
  recentActionCount,
}: Props) {
  const headline =
    mode === "guided"
      ? "Each act radiates."
      : hoveredId !== null
        ? `Actor ${(hoveredId + 1).toString().padStart(2, "0")} — click to act.`
        : "Click any cypress to broadcast an action.";

  const subline =
    mode === "guided"
      ? "Watch the orchard reorganize as actors at different points choose. Coordination is the residue."
      : `${recentActionCount} action${recentActionCount === 1 ? "" : "s"} are propagating across the network.`;

  return (
    <aside style={panelStyle} aria-live="polite">
      <div style={topRowStyle}>
        <div className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
          Signal Orchard · {mode === "guided" ? "Guided" : "Explore"}
        </div>
        <div aria-label="Mode toggle" style={{ display: "flex", gap: "0.4rem" }}>
          <ModeButton active={mode === "guided"} onClick={() => onModeChange("guided")}>
            Guided
          </ModeButton>
          <ModeButton
            active={mode === "explore"}
            onClick={() => onModeChange("explore")}
          >
            Explore
          </ModeButton>
        </div>
      </div>
      <p style={headlineStyle}>{headline}</p>
      <p style={sublineStyle}>{subline}</p>
    </aside>
  );
}

function ModeButton({
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
        padding: "0.32rem 0.7rem",
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
  gap: "0.5rem",
  padding: "0.95rem 1.1rem",
  background: "color-mix(in oklab, var(--paper-elevated) 84%, transparent)",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  maxWidth: "min(46ch, 100%)",
};

const topRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
  flexWrap: "wrap",
};

const headlineStyle: CSSProperties = {
  margin: "0.25rem 0 0",
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
