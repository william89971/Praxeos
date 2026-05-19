"use client";

import type { CSSProperties } from "react";
import type { ActionKind, ActiveAction } from "../lib/signals";
import { ACTION_LABELS } from "../lib/signals";

interface Props {
  readonly mode: "guided" | "explore";
  readonly onModeChange: (m: "guided" | "explore") => void;
  readonly hoveredId: number | null;
  readonly recentActions: readonly ActiveAction[];
  readonly selectedAction: ActionKind;
  readonly onActionChange: (kind: ActionKind) => void;
}

const ACTIONS: readonly ActionKind[] = ["buy", "sell", "wait", "discover"];

export function InteractionPanel({
  mode,
  onModeChange,
  hoveredId,
  recentActions,
  selectedAction,
  onActionChange,
}: Props) {
  const activeCount = recentActions.length;
  const headline =
    mode === "guided"
      ? "Private acts become public signals."
      : hoveredId !== null
        ? `Actor ${(hoveredId + 1).toString().padStart(2, "0")} is ready to ${ACTION_LABELS[selectedAction].toLowerCase()}.`
        : "Choose an action, then tap any cypress.";

  const subline =
    mode === "guided"
      ? "Guided mode rotates through discovery, waiting, buying, and selling so the pattern of coordination emerges before the explanation."
      : `${activeCount} action${activeCount === 1 ? "" : "s"} ${activeCount === 1 ? "is" : "are"} propagating across the network.`;

  return (
    <aside style={panelStyle} aria-live="polite">
      <div style={topRowStyle}>
        <div className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
          Signal Orchard · {mode === "guided" ? "Guided" : "Explore"}
        </div>
        <Segmented
          values={["guided", "explore"]}
          labels={{ guided: "Guided", explore: "Explore" }}
          active={mode}
          onChange={onModeChange}
        />
      </div>

      <p style={headlineStyle}>{headline}</p>
      <p style={sublineStyle}>{subline}</p>

      <div style={actionGridStyle} aria-label="Action type">
        {ACTIONS.map((action) => (
          <button
            key={action}
            type="button"
            data-interactive
            className="label-mono"
            aria-pressed={selectedAction === action}
            onClick={() => onActionChange(action)}
            style={actionButtonStyle(selectedAction === action, action)}
          >
            {ACTION_LABELS[action]}
          </button>
        ))}
      </div>

      <div style={logStyle} aria-label="Recent action log">
        <span className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
          Recent signals
        </span>
        {recentActions.slice(-3).length > 0 ? (
          recentActions
            .slice(-3)
            .reverse()
            .map((action) => (
              <span key={`${action.startedAt}-${action.originId}`} style={logItemStyle}>
                Actor {(action.originId + 1).toString().padStart(2, "0")} ·{" "}
                {ACTION_LABELS[action.kind]}
              </span>
            ))
        ) : (
          <span style={logItemStyle}>No current signal.</span>
        )}
      </div>
    </aside>
  );
}

function Segmented<T extends string>({
  values,
  labels,
  active,
  onChange,
}: {
  readonly values: readonly T[];
  readonly labels: Record<T, string>;
  readonly active: T;
  readonly onChange: (value: T) => void;
}) {
  return (
    <div aria-label="Mode toggle" style={{ display: "flex", gap: "0.4rem" }}>
      {values.map((value) => (
        <button
          key={value}
          type="button"
          data-interactive
          className="label-mono"
          aria-pressed={active === value}
          onClick={() => onChange(value)}
          style={{
            padding: "0.32rem 0.7rem",
            border: `1px solid ${active === value ? "var(--ink-secondary)" : "var(--rule)"}`,
            borderRadius: "var(--radius-sm)",
            background: active === value ? "var(--paper)" : "transparent",
            color: active === value ? "var(--ink-primary)" : "var(--ink-secondary)",
          }}
        >
          {labels[value]}
        </button>
      ))}
    </div>
  );
}

function actionButtonStyle(active: boolean, action: ActionKind): CSSProperties {
  const accent =
    action === "sell"
      ? "var(--accent-action)"
      : action === "discover"
        ? "var(--accent-capital)"
        : action === "wait"
          ? "var(--ink-secondary)"
          : "var(--accent-bitcoin)";

  return {
    padding: "0.42rem 0.55rem",
    borderRadius: "var(--radius-sm)",
    border: `1px solid ${active ? accent : "var(--rule)"}`,
    background: active ? "var(--paper)" : "transparent",
    color: active ? accent : "var(--ink-secondary)",
  };
}

const panelStyle: CSSProperties = {
  display: "grid",
  gap: "0.65rem",
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

const actionGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "0.4rem",
};

const logStyle: CSSProperties = {
  display: "grid",
  gap: "0.3rem",
  paddingBlockStart: "0.2rem",
};

const logItemStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step--1)",
  color: "var(--ink-secondary)",
  lineHeight: 1.35,
};
