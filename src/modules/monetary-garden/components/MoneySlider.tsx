"use client";

import type { CSSProperties, ChangeEvent, KeyboardEvent } from "react";
import { type GardenPhase, type GardenState, metricsFor } from "../lib/distortion";

interface Props {
  readonly value: GardenState;
  readonly onChange: (value: GardenState) => void;
}

const STEP = 0.01;

export function MoneyControls({ value, onChange }: Props) {
  const metrics = metricsFor(value);

  const update = (patch: Partial<GardenState>) => onChange({ ...value, ...patch });

  return (
    <div style={containerStyle}>
      <div style={topRowStyle}>
        <div>
          <div className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
            Money signal laboratory
          </div>
          <p style={microcopyStyle}>
            Expand credit, compare it to real savings, then reveal the correction.
          </p>
        </div>
        <PhaseButton phase={value.phase} onChange={(phase) => update({ phase })} />
      </div>

      <ControlSlider
        label="Credit expansion"
        value={value.credit}
        onChange={(credit) => update({ credit })}
        left="Disciplined"
        right="Artificial boom"
      />
      <ControlSlider
        label="Savings backing"
        value={value.savings}
        onChange={(savings) => update({ savings })}
        left="Thin"
        right="Deep"
      />

      <div style={metricGridStyle} aria-label="Garden metrics">
        <Metric label="Savings" value={metrics.savings} />
        <Metric label="Signal clarity" value={metrics.signalClarity} />
        <Metric label="Malinvestment" value={metrics.malinvestment} invert />
        <Metric label="Output" value={metrics.output} />
      </div>
    </div>
  );
}

function PhaseButton({
  phase,
  onChange,
}: {
  readonly phase: GardenPhase;
  readonly onChange: (phase: GardenPhase) => void;
}) {
  const correcting = phase === "correction";
  return (
    <button
      type="button"
      data-interactive
      className="label-mono"
      aria-pressed={correcting}
      onClick={() => onChange(correcting ? "boom" : "correction")}
      style={{
        padding: "0.55rem 0.75rem",
        borderRadius: "var(--radius-sm)",
        border: `1px solid ${correcting ? "var(--accent-action)" : "var(--rule-strong)"}`,
        background: correcting ? "var(--accent-action-wash)" : "var(--paper)",
        color: correcting ? "var(--accent-action)" : "var(--ink-primary)",
        whiteSpace: "nowrap",
      }}
    >
      {correcting ? "Correction revealed" : "Reveal correction"}
    </button>
  );
}

function ControlSlider({
  label,
  value,
  onChange,
  left,
  right,
}: {
  readonly label: string;
  readonly value: number;
  readonly onChange: (value: number) => void;
  readonly left: string;
  readonly right: string;
}) {
  const percent = Math.round(value * 100);

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
      onChange(clamp01(value - 0.03));
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      onChange(clamp01(value + 0.03));
    }
  };

  return (
    <label style={sliderBlockStyle}>
      <span style={sliderTopStyle}>
        <span className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
          {label}
        </span>
        <span
          className="label-mono"
          style={{ color: "var(--ink-primary)", fontVariantNumeric: "tabular-nums" }}
        >
          {percent.toString().padStart(3, "0")} / 100
        </span>
      </span>
      <span
        style={
          {
            ...trackContainerStyle,
            ["--mg-fill" as string]: `${value * 100}%`,
          } satisfies CSSProperties
        }
      >
        <span style={trackBaseStyle} aria-hidden="true" />
        <span style={trackFillStyle} aria-hidden="true" />
        <input
          type="range"
          min={0}
          max={1}
          step={STEP}
          value={value}
          onChange={handle}
          onKeyDown={handleKey}
          aria-label={label}
          aria-valuetext={`${percent} percent`}
          style={inputStyle}
        />
      </span>
      <span style={endsStyle}>
        <span>{left}</span>
        <span>{right}</span>
      </span>
    </label>
  );
}

function Metric({
  label,
  value,
  invert = false,
}: {
  readonly label: string;
  readonly value: number;
  readonly invert?: boolean;
}) {
  const color =
    invert && value > 0.5
      ? "var(--accent-action)"
      : value > 0.55
        ? "var(--accent-capital)"
        : "var(--ink-secondary)";

  return (
    <div style={metricStyle}>
      <span className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
        {label}
      </span>
      <strong
        className="label-mono"
        style={{
          color,
          fontSize: "var(--step--1)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {Math.round(value * 100)}%
      </strong>
    </div>
  );
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

const containerStyle: CSSProperties = {
  display: "grid",
  gap: "0.8rem",
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
  alignItems: "start",
  gap: "1rem",
  flexWrap: "wrap",
};

const microcopyStyle: CSSProperties = {
  margin: "0.25rem 0 0",
  maxWidth: "38ch",
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step--1)",
  lineHeight: 1.35,
  color: "var(--ink-secondary)",
};

const sliderBlockStyle: CSSProperties = {
  display: "grid",
  gap: "0.35rem",
};

const sliderTopStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  gap: "1rem",
};

const trackContainerStyle: CSSProperties = {
  position: "relative",
  display: "block",
  height: "1.35rem",
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
    "linear-gradient(90deg, var(--accent-capital) 0%, var(--accent-bitcoin) 58%, var(--accent-action) 100%)",
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

const endsStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "1rem",
  fontFamily: "var(--font-mono)",
  fontSize: "var(--step--2)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "var(--ink-tertiary)",
};

const metricGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "0.45rem",
};

const metricStyle: CSSProperties = {
  display: "grid",
  gap: "0.2rem",
  padding: "0.55rem",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  background: "color-mix(in oklab, var(--paper) 72%, transparent)",
};
