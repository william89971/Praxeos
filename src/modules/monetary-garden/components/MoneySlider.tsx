"use client";

import type { CSSProperties, ChangeEvent, KeyboardEvent } from "react";

interface Props {
  readonly value: number;
  readonly onChange: (value: number) => void;
}

const TICKS = [
  { value: 0.0, label: "Steady" },
  { value: 0.33, label: "Warm" },
  { value: 0.66, label: "Feverish" },
  { value: 1.0, label: "Broken" },
] as const;

const STEP = 0.001;

/**
 * The single control of the Monetary Garden. A custom-styled range input
 * with four labeled tick zones beneath. Keyboard: ←/→ ±0.02, Home/End
 * jump to ends. The numeric readout uses tabular-nums for stability.
 */
export function MoneySlider({ value, onChange }: Props) {
  const handle = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number.parseFloat(event.target.value);
    if (Number.isFinite(next)) onChange(clamp01(next));
  };

  const handleKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Home") {
      event.preventDefault();
      onChange(0);
    } else if (event.key === "End") {
      event.preventDefault();
      onChange(1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      onChange(clamp01(value - 0.02));
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      onChange(clamp01(value + 0.02));
    }
  };

  const percent = Math.round(value * 100);

  return (
    <div style={containerStyle}>
      <div style={topRowStyle}>
        <div className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
          Money supply · signal distortion
        </div>
        <div
          className="label-mono"
          style={{
            color: "var(--ink-primary)",
            fontVariantNumeric: "tabular-nums",
          }}
          aria-hidden="true"
        >
          {percent.toString().padStart(3, "0")} / 100
        </div>
      </div>

      <div
        style={
          {
            ...trackContainerStyle,
            // Position fill via CSS variable so the slider thumb sits on top.
            ["--mg-fill" as string]: `${value * 100}%`,
          } satisfies CSSProperties
        }
      >
        <div style={trackBaseStyle} aria-hidden="true" />
        <div style={trackFillStyle} aria-hidden="true" />
        <input
          type="range"
          min={0}
          max={1}
          step={STEP}
          value={value}
          onChange={handle}
          onKeyDown={handleKey}
          aria-label="Money supply distortion"
          aria-valuemin={0}
          aria-valuemax={1}
          aria-valuenow={value}
          aria-valuetext={`${percent} percent`}
          style={inputStyle}
        />
        {TICKS.map((tick) => (
          <button
            key={tick.label}
            type="button"
            data-interactive
            className="label-mono"
            onClick={() => onChange(tick.value)}
            style={tickButtonStyle(tick.value, value)}
          >
            {tick.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

const containerStyle: CSSProperties = {
  display: "grid",
  gap: "0.55rem",
  padding: "0.95rem 1.1rem",
  background: "color-mix(in oklab, var(--paper-elevated) 85%, transparent)",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
};

const topRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  gap: "1rem",
};

const trackContainerStyle: CSSProperties = {
  position: "relative",
  paddingBlock: "1.6rem 1.7rem",
};

const trackBaseStyle: CSSProperties = {
  position: "absolute",
  insetInlineStart: 0,
  insetInlineEnd: 0,
  insetBlockStart: "50%",
  height: "2px",
  background: "var(--rule-strong)",
  transform: "translateY(-1px)",
};

const trackFillStyle: CSSProperties = {
  position: "absolute",
  insetInlineStart: 0,
  insetBlockStart: "50%",
  height: "2px",
  width: "var(--mg-fill, 0%)",
  background:
    "linear-gradient(90deg, var(--accent-bitcoin) 0%, var(--accent-bitcoin) 55%, var(--accent-action) 100%)",
  transform: "translateY(-1px)",
  transition: "width var(--dur-micro) var(--ease-organic)",
};

const inputStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  background: "transparent",
  appearance: "none",
  WebkitAppearance: "none",
  cursor: "ew-resize",
  // Hide native track; thumb styling is done via global CSS in tokens.
  outline: "none",
};

function tickButtonStyle(tickValue: number, current: number): CSSProperties {
  const active = Math.abs(tickValue - current) < 0.08;
  const left = `${tickValue * 100}%`;
  return {
    position: "absolute",
    insetBlockEnd: 0,
    insetInlineStart: left,
    transform: "translateX(-50%)",
    padding: "0.2rem 0.45rem",
    fontSize: "var(--step--2)",
    color: active ? "var(--ink-primary)" : "var(--ink-tertiary)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "color var(--dur-micro) var(--ease-organic)",
  };
}
