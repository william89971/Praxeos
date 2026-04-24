"use client";

import { PosterFallback } from "@/components/sketch/PosterFallback";
import { Sketch, type SketchRenderFn } from "@/components/sketch/Sketch";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CORRECTION_DURATION_MS,
  DEFAULT_STATE,
  type ForestState,
  beginCorrection,
  blacknessOfInflation,
  fallAmount,
  tickCorrection,
} from "./lib/abct";
import { type Forest, generateForest } from "./lib/forest";

export default function TimePreferenceForestSketch() {
  const [state, setState] = useState<ForestState>(DEFAULT_STATE);
  const stateRef = useRef<ForestState>(state);
  stateRef.current = state;

  const forestRef = useRef<Forest | null>(null);
  const hydratedFromUrlRef = useRef(false);
  const lastParamsRef = useRef<{
    tp: number;
    savings: number;
    intervention: number;
    width: number;
    height: number;
  } | null>(null);

  // Regenerate forest when meaningful params change.
  const maybeRegen = useCallback((width: number, height: number) => {
    const s = stateRef.current;
    const last = lastParamsRef.current;
    const changed =
      !last ||
      Math.abs(last.tp - s.timePreference) > 0.01 ||
      Math.abs(last.savings - s.savingsRate) > 0.01 ||
      Math.abs(last.intervention - s.intervention) > 0.01 ||
      last.width !== width ||
      last.height !== height;

    if (changed) {
      forestRef.current = generateForest({
        seed: s.seed,
        width,
        height,
        state: s,
      });
      lastParamsRef.current = {
        tp: s.timePreference,
        savings: s.savingsRate,
        intervention: s.intervention,
        width,
        height,
      };
    }
  }, []);

  const render: SketchRenderFn = useCallback(
    ({ canvas, width, height, dpr, now }) => {
      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      // Tick correction if running.
      if (stateRef.current.correctionStartedAt !== null) {
        const newState = tickCorrection(stateRef.current, now);
        stateRef.current = newState;
        // Only update React state at terminal boundaries to avoid re-renders per frame.
        if (
          newState.correctionStartedAt === null &&
          state.correctionStartedAt !== null
        ) {
          setState(newState);
        }
      }

      maybeRegen(width, height);
      const forest = forestRef.current;
      if (!forest) return;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      drawForestScene(ctx, forest, stateRef.current, width, height);

      ctx.restore();
    },
    [maybeRegen, state.correctionStartedAt],
  );

  // Handlers.
  const onTpChange = (tp: number) => setState((s) => ({ ...s, timePreference: tp }));
  const onInterventionChange = (v: number) =>
    setState((s) => ({ ...s, intervention: v }));
  const onSavingsChange = (v: number) => setState((s) => ({ ...s, savingsRate: v }));

  const onCorrection = () => {
    setState((s) => beginCorrection(s, performance.now()));
  };

  // When correction terminates, sync React state.
  useEffect(() => {
    if (state.correctionStartedAt === null) return;
    const id = window.setTimeout(() => {
      setState((s) => {
        if (s.correctionStartedAt === null) return s;
        return {
          ...s,
          correctionStartedAt: null,
          correctionProgress: 0,
          intervention: 0,
          hasExperiencedCorrection: true,
        };
      });
    }, CORRECTION_DURATION_MS + 50);
    return () => window.clearTimeout(id);
  }, [state.correctionStartedAt]);

  useEffect(() => {
    if (hydratedFromUrlRef.current || typeof window === "undefined") return;
    hydratedFromUrlRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const tp = readUnitInterval(params.get("tp"));
    const intervention = readUnitInterval(params.get("cb"));
    const savingsRate = readUnitInterval(params.get("sv"));
    const revealed = params.get("revealed") === "1" || savingsRate !== null;

    setState((current) => ({
      ...current,
      timePreference: tp ?? current.timePreference,
      intervention: intervention ?? current.intervention,
      savingsRate: savingsRate ?? current.savingsRate,
      hasExperiencedCorrection: revealed || current.hasExperiencedCorrection,
    }));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !hydratedFromUrlRef.current) return;
    const params = new URLSearchParams(window.location.search);
    params.set("tp", state.timePreference.toFixed(3));
    params.set("cb", state.intervention.toFixed(3));

    if (state.hasExperiencedCorrection) {
      params.set("revealed", "1");
      params.set("sv", state.savingsRate.toFixed(3));
    } else {
      params.delete("revealed");
      params.delete("sv");
    }

    const next = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", next);
  }, [
    state.hasExperiencedCorrection,
    state.intervention,
    state.savingsRate,
    state.timePreference,
  ]);

  const isCorrecting = state.correctionStartedAt !== null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div
        style={{
          height: "min(70vh, 620px)",
          background: "var(--paper)",
          position: "relative",
        }}
      >
        <Sketch
          render={render}
          alt="Time Preference Forest — a woodcut-style generative forest whose tree heights and root depths respond to the reader's chosen time preference. A central-bank intervention slider inflates the visible canopy without changing root depth; a market-correction button plays an 8-second cascade that reveals actual capital depth."
          poster={
            <PosterFallback
              src="/posters/time-preference-forest.svg"
              alt="The Time Preference Forest poster frame."
            />
          }
          fill
          maxDpr={2}
        />
        {state.intervention > 0 && !isCorrecting ? (
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: `radial-gradient(60% 50% at 50% 62%, rgba(232, 119, 34, ${state.intervention * 0.28}) 0%, transparent 70%)`,
              transition: "background var(--dur-std) var(--ease-organic)",
            }}
          />
        ) : null}
      </div>

      <Controls
        state={state}
        isCorrecting={isCorrecting}
        onTp={onTpChange}
        onIntervention={onInterventionChange}
        onSavings={onSavingsChange}
        onCorrection={onCorrection}
      />
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Rendering                                                                 */
/* ------------------------------------------------------------------------- */

function drawForestScene(
  ctx: CanvasRenderingContext2D,
  forest: Forest,
  state: ForestState,
  width: number,
  height: number,
) {
  // Ground hatching (below line) — soft parallel strokes indicating soil.
  ctx.save();
  ctx.strokeStyle = "rgba(28, 24, 20, 0.09)";
  ctx.lineWidth = 0.5;
  for (
    let y = forest.groundY + 8;
    y < Math.min(height, forest.groundY + forest.groundY * 0.9);
    y += 9
  ) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    const jitterPhase = Math.sin(y * 0.05) * 2;
    ctx.lineTo(width, y + jitterPhase);
    ctx.stroke();
  }
  ctx.restore();

  // Ground line itself.
  ctx.strokeStyle = "rgba(28, 24, 20, 0.6)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, forest.groundY);
  ctx.lineTo(width, forest.groundY);
  ctx.stroke();

  // Mycorrhiza first (so roots draw on top).
  if (forest.mycorrhiza.length > 0) {
    ctx.save();
    ctx.strokeStyle = "rgba(58, 90, 74, 0.28)"; // forest green wash
    ctx.lineWidth = 0.8;
    for (const seg of forest.mycorrhiza) {
      // Curved connection.
      ctx.beginPath();
      ctx.moveTo(seg.x1, seg.y1);
      const midX = (seg.x1 + seg.x2) / 2;
      const midY = Math.max(seg.y1, seg.y2) + 22;
      ctx.quadraticCurveTo(midX, midY, seg.x2, seg.y2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Trees.
  const fall = fallAmount(state);
  const blackness = blacknessOfInflation(state);
  const orangeVisible =
    state.correctionStartedAt === null
      ? state.intervention
      : state.correctionProgress < 0.25
        ? state.intervention * (1 - state.correctionProgress / 0.25)
        : 0;

  for (const tree of forest.trees) {
    ctx.save();
    // Apply tilt during correction — each tree chooses left or right per x.
    const tiltDir = tree.rootX < forest.width / 2 ? -1 : 1;
    const tiltAmount = fall * (Math.PI / 2) * 0.85 * tiltDir;
    ctx.translate(tree.rootX, tree.groundY);
    ctx.rotate(tiltAmount);
    ctx.translate(-tree.rootX, -tree.groundY);

    for (const seg of tree.segments) {
      // Color logic.
      let color = "rgba(28, 24, 20, 0.92)";
      let lineWidth = seg.weight;

      if (seg.artificial) {
        if (blackness > 0) {
          // Blackening during correction.
          const a = 0.4 + blackness * 0.55;
          color = `rgba(12, 10, 8, ${a})`;
        } else {
          // Highlighted orange-tinted ink while intervention is active.
          const orangeTint = Math.min(1, orangeVisible * 1.2);
          color = `rgba(${Math.round(28 + orangeTint * 180)}, ${Math.round(24 + orangeTint * 70)}, ${Math.round(20 + orangeTint * 10)}, 0.9)`;
        }
        lineWidth *= 0.75;
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(seg.x1, seg.y1);
      ctx.lineTo(seg.x2, seg.y2);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Intervention-mode legend subtle text.
  if (orangeVisible > 0.08) {
    ctx.save();
    ctx.fillStyle = `rgba(232, 119, 34, ${orangeVisible * 0.7})`;
    ctx.font = "600 10px ui-monospace, monospace";
    ctx.textBaseline = "top";
    ctx.fillText("CREDIT EXPANSION", 16, 16);
    ctx.restore();
  }
}

/* ------------------------------------------------------------------------- */
/* Controls                                                                  */
/* ------------------------------------------------------------------------- */

function Controls({
  state,
  isCorrecting,
  onTp,
  onIntervention,
  onSavings,
  onCorrection,
}: {
  state: ForestState;
  isCorrecting: boolean;
  onTp: (v: number) => void;
  onIntervention: (v: number) => void;
  onSavings: (v: number) => void;
  onCorrection: () => void;
}) {
  const savingsVisible = state.hasExperiencedCorrection;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "1rem",
        paddingInline: "var(--gutter-inline)",
        paddingBlockStart: "1rem",
        borderBlockStart: "1px solid var(--rule)",
      }}
    >
      <SliderRow
        label="Time Preference"
        hint={describeTp(state.timePreference)}
        value={state.timePreference}
        onChange={onTp}
        disabled={isCorrecting}
      />
      <SliderRow
        label="Central-bank intervention"
        hint={describeIntervention(state.intervention)}
        value={state.intervention}
        onChange={onIntervention}
        accent="bitcoin"
        disabled={isCorrecting}
      />
      {savingsVisible ? (
        <SliderRow
          label="Savings rate"
          hint="Real capital deepens over time."
          value={state.savingsRate}
          onChange={onSavings}
          accent="capital"
          disabled={isCorrecting}
        />
      ) : null}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBlockStart: "1rem",
          borderBlockStart: "1px solid var(--rule)",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <p
          className="label-mono"
          style={{ color: "var(--ink-tertiary)", maxWidth: "52ch" }}
        >
          {isCorrecting
            ? `Market correction — ${Math.round(state.correctionProgress * 100)}%`
            : state.intervention > 0.15
              ? "The canopy is inflating. Roots stay shallow. When the credit stops, what remains?"
              : savingsVisible
                ? "Try different time preferences. Inject intervention. Let it correct. Feel how the forest changes."
                : "Raise intervention, then press the correction button to feel the cascade."}
        </p>
        <button
          type="button"
          onClick={onCorrection}
          disabled={isCorrecting || state.intervention < 0.05}
          className="label-mono"
          data-interactive
          style={{
            padding: "0.55rem 1.1rem",
            border: "1px solid var(--accent-action)",
            color:
              isCorrecting || state.intervention < 0.05
                ? "var(--ink-tertiary)"
                : "var(--accent-action)",
            background: "transparent",
            cursor:
              isCorrecting || state.intervention < 0.05 ? "not-allowed" : "pointer",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.05em",
          }}
        >
          {isCorrecting ? "— correcting —" : "Market correction"}
        </button>
      </div>
    </div>
  );
}

function SliderRow({
  label,
  hint,
  value,
  onChange,
  disabled,
  accent = "action",
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  accent?: "action" | "bitcoin" | "capital";
}) {
  const accentColor =
    accent === "bitcoin"
      ? "var(--accent-bitcoin)"
      : accent === "capital"
        ? "var(--accent-capital)"
        : "var(--accent-action)";
  const inputId = `slider-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div style={{ display: "grid", gap: "0.35rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <label
          htmlFor={inputId}
          className="label-mono"
          style={{ color: "var(--ink-secondary)" }}
        >
          {label}
        </label>
        <span
          className="label-mono"
          style={{ color: "var(--ink-tertiary)", fontStyle: "italic" }}
        >
          {hint}
        </span>
      </div>
      <input
        id={inputId}
        type="range"
        min={0}
        max={1}
        step={0.001}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        data-interactive
        style={{
          accentColor,
          opacity: disabled ? 0.5 : 1,
        }}
      />
    </div>
  );
}

function readUnitInterval(value: string | null): number | null {
  if (value === null) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return Math.max(0, Math.min(1, parsed));
}

function describeTp(v: number): string {
  if (v < 0.2) return "Deeply patient.";
  if (v < 0.45) return "Patient.";
  if (v < 0.65) return "Ordinary.";
  if (v < 0.85) return "Present-oriented.";
  return "Radically impatient.";
}

function describeIntervention(v: number): string {
  if (v < 0.05) return "Sound money.";
  if (v < 0.35) return "Mild credit expansion.";
  if (v < 0.7) return "Strong credit expansion.";
  return "Extreme inflation.";
}
