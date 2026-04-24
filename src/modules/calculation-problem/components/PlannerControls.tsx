"use client";

import { useMemo, useState } from "react";
import type { PlannerOverrides } from "../lib/engine";
import { ARC_TOTAL_MS, type ArcState, totalProgress } from "../lib/planner-arc";
import type { State } from "../lib/types";

const DISPLAY_LIMIT = 24; // cap producers shown so high-G doesn't explode the DOM

type Props = {
  state: State;
  overrides: PlannerOverrides;
  arc: ArcState;
  metrics: { plannerSat: number; marketSat: number };
  onOverride: (
    producerId: number,
    recipeIdx: number | null,
    capFrac: number | null,
  ) => void;
  onBegin: () => void;
  onCancel: () => void;
  onReset: () => void;
};

export function PlannerControls({
  state,
  overrides,
  arc,
  metrics,
  onOverride,
  onBegin,
  onCancel,
  onReset,
}: Props) {
  const [showAllSingle, setShowAllSingle] = useState(false);

  const multiRecipe = useMemo(
    () => state.producers.filter((p) => p.recipes.length > 1).slice(0, DISPLAY_LIMIT),
    [state.producers],
  );
  const singleRecipe = useMemo(
    () => state.producers.filter((p) => p.recipes.length === 1).slice(0, DISPLAY_LIMIT),
    [state.producers],
  );

  const multiTotal = state.producers.filter((p) => p.recipes.length > 1).length;
  const gap = Math.max(0, metrics.marketSat - metrics.plannerSat);

  const arcRunning = arc.phase !== "idle" && arc.phase !== "complete";
  const arcComplete = arc.phase === "complete";

  return (
    <section
      aria-labelledby="planner-heading"
      style={{
        borderBlockStart: "1px solid var(--rule)",
        paddingBlockStart: "1.25rem",
        display: "grid",
        gap: "1.25rem",
      }}
    >
      {/* Header: title + timer + arc controls */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          paddingInline: "var(--gutter-inline)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <h3 id="planner-heading" style={{ margin: 0, fontSize: "var(--step-1)" }}>
            Be the Planner
          </h3>
          <p
            className="label-mono"
            style={{ color: "var(--ink-tertiary)", maxWidth: "60ch" }}
          >
            Pick a recipe for every multi-recipe producer. Watch the market panel keep
            coordinating while you fall behind.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <div
            className="label-mono"
            style={{
              color: "var(--ink-secondary)",
              fontVariantNumeric: "tabular-nums",
              minWidth: "9ch",
            }}
          >
            {formatElapsed(arc.elapsedMs)} / {formatElapsed(ARC_TOTAL_MS)}
          </div>
          {arcRunning ? (
            <button
              type="button"
              onClick={onCancel}
              className="label-mono"
              data-interactive
              style={buttonStyle("action")}
            >
              Cancel arc
            </button>
          ) : arcComplete ? (
            <button
              type="button"
              onClick={onReset}
              className="label-mono"
              data-interactive
              style={buttonStyle("neutral")}
            >
              Reset
            </button>
          ) : (
            <button
              type="button"
              onClick={onBegin}
              className="label-mono"
              data-interactive
              style={buttonStyle("action")}
            >
              Start 45s arc
            </button>
          )}
        </div>
      </header>

      {/* Arc progress bar */}
      <div
        style={{
          paddingInline: "var(--gutter-inline)",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <div
          aria-hidden
          style={{
            height: 2,
            background: "var(--rule)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: `${totalProgress(arc) * 100}%`,
              background: "var(--accent-action)",
              transition: "width 120ms linear",
            }}
          />
          {/* Act boundaries */}
          {[0.333, 0.666].map((p) => (
            <div
              key={p}
              aria-hidden
              style={{
                position: "absolute",
                top: -3,
                bottom: -3,
                left: `${p * 100}%`,
                width: 1,
                background: "var(--ink-tertiary)",
                opacity: 0.3,
              }}
            />
          ))}
        </div>
        <div
          className="label-mono"
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "var(--ink-tertiary)",
          }}
        >
          <span>Act I · the simple economy</span>
          <span>Act II · the onset of overwhelm</span>
          <span>Act III · the breaking point</span>
        </div>
      </div>

      {/* Live comparison metrics */}
      <div
        style={{
          paddingInline: "var(--gutter-inline)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(14ch, 1fr))",
          gap: "1rem 2rem",
        }}
      >
        <Metric
          label="Your satisfaction"
          value={`${(metrics.plannerSat * 100).toFixed(0)}%`}
          tone="action"
        />
        <Metric
          label="Market satisfaction"
          value={`${(metrics.marketSat * 100).toFixed(0)}%`}
          tone="ink"
        />
        <Metric
          label="Gap"
          value={`${(gap * 100).toFixed(0)}%`}
          tone={gap > 0.2 ? "action" : "ink-tertiary"}
        />
        <Metric label="Producers to plan" value={`${multiTotal}`} tone="ink-tertiary" />
      </div>

      {/* Recipe allocation grid */}
      <div
        style={{
          paddingInline: "var(--gutter-inline)",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <div className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
          Multi-recipe producers — showing {multiRecipe.length} of {multiTotal}
          {multiTotal > DISPLAY_LIMIT ? " (excess is hash-assigned)" : ""}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {multiRecipe.map((p) => {
            const override = overrides.recipeByProducer?.get(p.id);
            const capFrac = overrides.capacityFractionByProducer?.get(p.id);
            return (
              <RecipeCard
                key={p.id}
                producerId={p.id}
                goodIdx={p.goodIdx}
                recipeCount={p.recipes.length}
                currentIdx={override ?? p.chosenRecipeIdx}
                overridden={typeof override === "number"}
                capFrac={capFrac ?? 1}
                onRecipe={(idx) => onOverride(p.id, idx, null)}
                onCap={(frac) => onOverride(p.id, null, frac)}
              />
            );
          })}
        </div>
      </div>

      {singleRecipe.length > 0 ? (
        <div
          style={{
            paddingInline: "var(--gutter-inline)",
            color: "var(--ink-tertiary)",
          }}
          className="label-mono"
        >
          <button
            type="button"
            onClick={() => setShowAllSingle((v) => !v)}
            style={{
              ...buttonStyle("ghost"),
              padding: "0.3rem 0.6rem",
            }}
          >
            {showAllSingle ? "— hide" : "+ show"} {singleRecipe.length} single-recipe
            producers
          </button>
          {showAllSingle ? (
            <p
              style={{
                marginBlockStart: "0.75rem",
                fontStyle: "italic",
              }}
            >
              Primary and single-recipe producers have nothing to choose. The planner's
              only lever over them is capacity; they are automatically run at 100%.
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

/* ------------------------------------------------------------------------ */

function RecipeCard({
  producerId,
  goodIdx,
  recipeCount,
  currentIdx,
  overridden,
  capFrac,
  onRecipe,
  onCap,
}: {
  producerId: number;
  goodIdx: number;
  recipeCount: number;
  currentIdx: number;
  overridden: boolean;
  capFrac: number;
  onRecipe: (idx: number) => void;
  onCap: (frac: number) => void;
}) {
  return (
    <article
      style={{
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-sm)",
        padding: "0.65rem 0.75rem",
        background: overridden ? "var(--accent-action-wash)" : "var(--paper)",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        transition: "background var(--dur-micro) var(--ease-organic)",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <span className="label-mono" style={{ color: "var(--ink-secondary)" }}>
          p<sub>{producerId}</sub> → g<sub>{goodIdx}</sub>
        </span>
        <span
          className="label-mono"
          style={{
            color: overridden ? "var(--accent-action)" : "var(--ink-tertiary)",
          }}
        >
          {overridden ? "your choice" : "hash-assigned"}
        </span>
      </header>
      <div
        role="radiogroup"
        aria-label={`recipe for producer ${producerId}`}
        style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}
      >
        {Array.from({ length: recipeCount }, (_, i) => {
          const letter = String.fromCharCode(65 + i);
          const active = i === currentIdx;
          const id = `recipe-${producerId}-${letter}`;
          return (
            <label
              key={letter}
              htmlFor={id}
              className="label-mono"
              data-interactive
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "2.4em",
                padding: "0.3rem 0.6rem",
                border: "1px solid",
                borderColor: active ? "var(--accent-action)" : "var(--rule)",
                color: active ? "var(--accent-action)" : "var(--ink-secondary)",
                background: active ? "var(--accent-action-wash)" : "transparent",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <input
                id={id}
                type="radio"
                name={`recipe-${producerId}`}
                checked={active}
                onChange={() => onRecipe(i)}
                style={{
                  position: "absolute",
                  width: 1,
                  height: 1,
                  margin: -1,
                  padding: 0,
                  border: 0,
                  clip: "rect(0 0 0 0)",
                  overflow: "hidden",
                }}
              />
              {letter}
            </label>
          );
        })}
      </div>
      <label
        className="label-mono"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "var(--ink-tertiary)",
          fontSize: "var(--step--2)",
        }}
      >
        <span style={{ minWidth: "3ch" }}>{Math.round(capFrac * 100)}%</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={capFrac}
          onChange={(e) => onCap(Number(e.target.value))}
          data-interactive
          style={{ flex: 1, accentColor: "var(--accent-action)" }}
          aria-label={`capacity for producer ${producerId}`}
        />
      </label>
    </article>
  );
}

/* ------------------------------------------------------------------------ */

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "action" | "ink" | "ink-tertiary";
}) {
  const colorVar =
    tone === "action"
      ? "var(--accent-action)"
      : tone === "ink"
        ? "var(--ink-primary)"
        : "var(--ink-tertiary)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
      <span className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--step-1)",
          color: colorVar,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function buttonStyle(kind: "action" | "neutral" | "ghost"): React.CSSProperties {
  if (kind === "action") {
    return {
      padding: "0.45rem 0.9rem",
      border: "1px solid var(--accent-action)",
      color: "var(--accent-action)",
      background: "transparent",
      cursor: "pointer",
      fontFamily: "var(--font-mono)",
      letterSpacing: "0.05em",
      borderRadius: "var(--radius-sm)",
    };
  }
  if (kind === "neutral") {
    return {
      padding: "0.45rem 0.9rem",
      border: "1px solid var(--rule-strong)",
      color: "var(--ink-secondary)",
      background: "transparent",
      cursor: "pointer",
      fontFamily: "var(--font-mono)",
      borderRadius: "var(--radius-sm)",
    };
  }
  return {
    padding: "0.3rem 0.6rem",
    border: "1px solid var(--rule)",
    color: "var(--ink-secondary)",
    background: "transparent",
    cursor: "pointer",
    borderRadius: "var(--radius-sm)",
  };
}

function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
