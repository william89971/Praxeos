"use client";

import type { CSSProperties, ChangeEvent, KeyboardEvent } from "react";
import type { CoordState } from "../lib/distortion";

interface Props {
  readonly value: CoordState;
  readonly onChange: (value: CoordState) => void;
  readonly onInjectShock: () => void;
}

const RELIABILITY_TICKS = [
  { value: 0.25, label: "Fragile" },
  { value: 0.65, label: "Mixed" },
  { value: 0.95, label: "Reliable" },
] as const;

const LATENCY_TICKS = [
  { value: 0.05, label: "Fast" },
  { value: 0.45, label: "Lagged" },
  { value: 0.85, label: "Delayed" },
] as const;

export function CoordinationControls({ value, onChange, onInjectShock }: Props) {
  return (
    <div style={containerStyle}>
      <Slider
        label="Signal reliability"
        value={value.reliability}
        ticks={RELIABILITY_TICKS}
        onChange={(next) => onChange({ ...value, reliability: next })}
      />
      <Slider
        label="Latency"
        value={value.latency}
        ticks={LATENCY_TICKS}
        onChange={(next) => onChange({ ...value, latency: next })}
      />
      <button
        type="button"
        data-interactive
        className="label-mono"
        onClick={onInjectShock}
        style={shockButtonStyle}
      >
        Inject shock
      </button>
    </div>
  );
}

function Slider({
  label,
  value,
  ticks,
  onChange,
}: {
  readonly label: string;
  readonly value: number;
  readonly ticks: readonly { value: number; label: string }[];
  readonly onChange: (value: number) => void;
}) {
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
    <div style={sliderBlockStyle}>
      <div style={topRowStyle}>
        <div className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
          {label}
        </div>
        <div
          className="label-mono"
          style={{ color: "var(--ink-primary)", fontVariantNumeric: "tabular-nums" }}
          aria-hidden="true"
        >
          {percent.toString().padStart(3, "0")} / 100
        </div>
      </div>
      <div
        style={
          {
            ...trackContainerStyle,
            ["--ce-fill" as string]: `${value * 100}%`,
          } satisfies CSSProperties
        }
      >
        <div style={trackBaseStyle} aria-hidden="true" />
        <div style={trackFillStyle} aria-hidden="true" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={value}
          onChange={handle}
          onKeyDown={handleKey}
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={1}
          aria-valuenow={value}
          aria-valuetext={`${percent} percent`}
          style={inputStyle}
        />
        {ticks.map((tick) => (
          <button
            key={tick.label}
            type="button"
            data-interactive
            className="label-mono"
            onClick={() => onChange(tick.value)}
            style={tickStyle(tick.value, value)}
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
  gap: "0.75rem",
  padding: "0.95rem 1.1rem",
  background: "color-mix(in oklab, var(--paper-elevated) 85%, transparent)",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
};

const sliderBlockStyle: CSSProperties = {
  display: "grid",
  gap: "0.4rem",
};

const topRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  gap: "1rem",
};

const trackContainerStyle: CSSProperties = {
  position: "relative",
  paddingBlock: "1.45rem 1.55rem",
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
  width: "var(--ce-fill, 0%)",
  background:
    "linear-gradient(90deg, var(--accent-action) 0%, var(--accent-bitcoin) 100%)",
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
  outline: "none",
};

const shockButtonStyle: CSSProperties = {
  padding: "0.72rem 0.9rem",
  border: "1px solid var(--ink-secondary)",
  borderRadius: "var(--radius-sm)",
  background: "var(--paper)",
  color: "var(--ink-primary)",
  cursor: "pointer",
};

function tickStyle(tickValue: number, current: number): CSSProperties {
  const active = Math.abs(tickValue - current) < 0.06;
  return {
    position: "absolute",
    insetBlockEnd: 0,
    insetInlineStart: `${tickValue * 100}%`,
    transform: "translateX(-50%)",
    padding: "0.2rem 0.45rem",
    fontSize: "var(--step--2)",
    color: active ? "var(--ink-primary)" : "var(--ink-tertiary)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}
