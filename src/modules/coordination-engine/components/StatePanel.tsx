"use client";

import type { CSSProperties } from "react";

interface Props {
  readonly distortion: number;
  readonly mode: "guided" | "explore";
  readonly onModeChange: (m: "guided" | "explore") => void;
}

interface Band {
  readonly headline: string;
  readonly subline: string;
  readonly label: string;
}

const BANDS: readonly [Band, Band, Band, Band] = [
  {
    label: "Sound",
    headline: "The network is in phase. Strangers act as if they had agreed.",
    subline:
      "Each pulse arrives where it is meant to arrive. Coordination is invisible because it is working.",
  },
  {
    label: "Subtle drift",
    headline: "Some pulses lag. Edges flicker. The chord is still recognisable.",
    subline:
      "A small distortion in the unit of account creates a small disagreement about what each price means.",
  },
  {
    label: "Decoherence",
    headline: "Edges fail intermittently. Phases scatter.",
    subline:
      "Signals continue to arrive, but they no longer arrive together. Plans built across this network begin to miss each other.",
  },
  {
    label: "Broken",
    headline: "The signal layer no longer carries.",
    subline:
      "Pulses dissipate. Connections darken. What looked like an economy was the synchrony — and the synchrony is gone.",
  },
];

function bandFor(d: number): Band {
  if (d >= 0.82) return BANDS[3];
  if (d >= 0.55) return BANDS[2];
  if (d >= 0.27) return BANDS[1];
  return BANDS[0];
}

export function StatePanel({ distortion, mode, onModeChange }: Props) {
  const band = bandFor(distortion);
  return (
    <aside style={panelStyle} aria-live="polite">
      <div style={topRowStyle}>
        <div className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
          State · {band.label}
        </div>
        <div aria-label="Mode" style={{ display: "flex", gap: "0.4rem" }}>
          <ModeBtn active={mode === "guided"} onClick={() => onModeChange("guided")}>
            Guided
          </ModeBtn>
          <ModeBtn active={mode === "explore"} onClick={() => onModeChange("explore")}>
            Explore
          </ModeBtn>
        </div>
      </div>
      <p style={headlineStyle}>{band.headline}</p>
      <p style={sublineStyle}>{band.subline}</p>
    </aside>
  );
}

function ModeBtn({
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
  gap: "0.55rem",
  padding: "0.95rem 1.1rem",
  background: "color-mix(in oklab, var(--paper-elevated) 84%, transparent)",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  maxWidth: "min(48ch, 100%)",
};

const topRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
  flexWrap: "wrap",
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
