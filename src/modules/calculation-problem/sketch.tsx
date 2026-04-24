"use client";

import { PosterFallback } from "@/components/sketch/PosterFallback";
import { Sketch, type SketchRenderFn } from "@/components/sketch/Sketch";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MisesOverlay, shouldShowMisesOverlay } from "./components/MisesOverlay";
import { PlannerControls } from "./components/PlannerControls";
import { DEFAULT_PARAMS, type PlannerOverrides, step } from "./lib/engine";
import { init } from "./lib/init";
import {
  type ArcState,
  COMPLEXITY_BY_PHASE,
  IDLE_STATE,
  beginArc,
  cancelArc,
  tickArc,
} from "./lib/planner-arc";
import type { State } from "./lib/types";

const INITIAL_G = 20;
const CONSUMER_COUNT = 36;
const PRODUCER_COUNT_FACTOR = 1.6;
const LETTER_BY_ROLE: Record<string, string> = {
  consumer: "c",
  producer: "p",
  resource: "r",
  good: "g",
};

type ViewMode = "comparison" | "planner";

export default function CalculationProblemSketch() {
  const [viewMode, setViewMode] = useState<ViewMode>("comparison");
  const [manualG, setManualG] = useState(INITIAL_G);
  const [arc, setArc] = useState<ArcState>(IDLE_STATE);

  // During an active arc, G is driven by the phase. Otherwise the slider wins.
  const G =
    arc.phase !== "idle" && arc.phase !== "complete"
      ? COMPLEXITY_BY_PHASE[arc.phase]
      : manualG;

  const marketRef = useRef<State | null>(null);
  const plannedRef = useRef<State | null>(null);
  const overridesRef = useRef<PlannerOverrides>({});
  const arcRef = useRef<ArcState>(IDLE_STATE);
  arcRef.current = arc;

  const [tick, setTick] = useState(0);
  const [metrics, setMetrics] = useState({
    marketSatisfaction: 0,
    plannedSatisfaction: 0,
    plannedWaste: 0,
  });
  const [plannerSnapshot, setPlannerSnapshot] = useState<State | null>(null);
  const [misesDismissed, setMisesDismissed] = useState(false);

  const rebuildStates = useCallback(
    (width: number, height: number) => {
      const producerCount = Math.max(30, Math.floor(G * PRODUCER_COUNT_FACTOR));
      marketRef.current = init({
        G,
        consumerCount: CONSUMER_COUNT,
        producerCount,
        mode: "market",
        seed: `panel-seed-G${G}-v2`,
        width: width / 2,
        height,
      });
      plannedRef.current = init({
        G,
        consumerCount: CONSUMER_COUNT,
        producerCount,
        mode: "planned",
        seed: `panel-seed-G${G}-v2`,
        width: width / 2,
        height,
      });
      setTick(0);
      setPlannerSnapshot(plannedRef.current);
    },
    [G],
  );

  const render: SketchRenderFn = useCallback(
    ({ canvas, width, height, dpr, now }) => {
      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      if (!marketRef.current || !plannedRef.current) {
        rebuildStates(width, height);
        return;
      }

      // Progress the arc (if running); setState only on phase boundary.
      if (arcRef.current.startedAt !== null && arcRef.current.phase !== "complete") {
        const nextArc = tickArc(arcRef.current, now);
        if (nextArc.phase !== arcRef.current.phase) {
          // When the arc terminates, lock the slider to the final act's
          // complexity so the reader isn't snapped back to the pre-arc
          // value without warning.
          if (nextArc.phase === "complete") {
            setManualG(COMPLEXITY_BY_PHASE.act3);
          }
          arcRef.current = nextArc;
          setArc(nextArc);
        } else {
          // Update elapsedMs less frequently to avoid re-rendering on every frame.
          if (Math.abs(nextArc.elapsedMs - arcRef.current.elapsedMs) > 240) {
            arcRef.current = nextArc;
            setArc(nextArc);
          } else {
            arcRef.current = nextArc;
          }
        }
      }

      // Step simulations.
      marketRef.current = step(marketRef.current, DEFAULT_PARAMS);
      plannedRef.current = step(
        plannedRef.current,
        DEFAULT_PARAMS,
        viewMode === "planner" ? overridesRef.current : undefined,
      );

      ctx.save();
      ctx.scale(dpr, dpr);

      ctx.fillStyle = "rgba(245, 240, 230, 0.22)";
      ctx.fillRect(0, 0, width, height);

      const panelWidth = width / 2;
      const divider = panelWidth;

      drawPanel(
        ctx,
        marketRef.current,
        { x: 0, y: 0, width: panelWidth, height },
        { labelColor: "#5C5348", edgeColor: "#8B3A3A" },
      );
      drawPanel(
        ctx,
        plannedRef.current,
        { x: panelWidth, y: 0, width: panelWidth, height },
        { labelColor: "#5C5348", edgeColor: "#8B8275" },
      );

      ctx.strokeStyle = "#D8CFBE";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(divider, 0);
      ctx.lineTo(divider, height);
      ctx.stroke();

      // Panel headers — two lines each: title + subtitle.
      ctx.textBaseline = "top";
      ctx.textAlign = "left";

      ctx.fillStyle = "#5C5348";
      ctx.font = "600 11px ui-monospace, monospace";
      ctx.fillText("MARKET ECONOMY", 16, 12);
      ctx.fillStyle = "#8B8275";
      ctx.font = "400 10px ui-monospace, monospace";
      ctx.fillText("prices coordinate supply & demand", 16, 26);

      ctx.fillStyle = "#5C5348";
      ctx.font = "600 11px ui-monospace, monospace";
      ctx.fillText(
        viewMode === "planner" ? "CENTRAL PLAN (YOU)" : "CENTRAL PLAN",
        panelWidth + 16,
        12,
      );
      ctx.fillStyle = "#8B3A3A";
      ctx.font = "400 10px ui-monospace, monospace";
      ctx.fillText("no prices — allocation by decree", panelWidth + 16, 26);

      ctx.textAlign = "right";
      ctx.fillStyle = "#8B8275";
      ctx.font = "500 11px ui-monospace, monospace";
      ctx.fillText(`tick ${marketRef.current.tick}`, width - 16, 12);
      ctx.textAlign = "left";

      // Legend at bottom: explain the letterform agents.
      ctx.textBaseline = "bottom";
      ctx.fillStyle = "#8B8275";
      ctx.font = "400 10px ui-monospace, monospace";
      ctx.fillText("c = consumer · p = producer · r = resource", 16, height - 8);

      ctx.restore();

      if (marketRef.current.tick % 12 === 0) {
        const satMarket =
          marketRef.current.consumers.reduce((a, c) => a + c.lastSatisfaction, 0) /
          Math.max(1, marketRef.current.consumers.length);
        const satPlanned =
          plannedRef.current.consumers.reduce((a, c) => a + c.lastSatisfaction, 0) /
          Math.max(1, plannedRef.current.consumers.length);
        setTick(marketRef.current.tick);
        setMetrics({
          marketSatisfaction: satMarket,
          plannedSatisfaction: satPlanned,
          plannedWaste:
            plannedRef.current.tick > 0
              ? plannedRef.current.totalWaste / plannedRef.current.tick
              : 0,
        });
        // Refresh the snapshot used by PlannerControls.
        if (viewMode === "planner") setPlannerSnapshot(plannedRef.current);
      }
    },
    [rebuildStates, viewMode],
  );

  // Reset sims whenever effective G changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: effective G is the trigger — the effect body resets refs it does not read.
  useEffect(() => {
    marketRef.current = null;
    plannedRef.current = null;
    // Also reset Mises dismissal so it re-fades on new arc phases.
    if (arc.phase === "act3") setMisesDismissed(false);
  }, [G]);

  // Handlers -----------------------------------------------------------
  const handleOverride = useCallback(
    (producerId: number, recipeIdx: number | null, capFrac: number | null) => {
      const prev = overridesRef.current;
      const nextRecipe = new Map(prev.recipeByProducer ?? []);
      const nextCap = new Map(prev.capacityFractionByProducer ?? []);
      if (recipeIdx !== null) nextRecipe.set(producerId, recipeIdx);
      if (capFrac !== null) nextCap.set(producerId, capFrac);
      overridesRef.current = {
        recipeByProducer: nextRecipe,
        capacityFractionByProducer: nextCap,
      };
      // Bump snapshot so the card shows the new override immediately.
      setPlannerSnapshot(plannedRef.current);
    },
    [],
  );

  const handleBeginArc = useCallback(() => {
    setMisesDismissed(false);
    setArc(beginArc(performance.now()));
  }, []);

  const handleCancelArc = useCallback(() => {
    setArc(cancelArc());
  }, []);

  const handleResetArc = useCallback(() => {
    overridesRef.current = {};
    setArc(IDLE_STATE);
    setMisesDismissed(false);
    setPlannerSnapshot(plannedRef.current);
  }, []);

  const handleToggleView = useCallback(() => {
    setViewMode((v) => (v === "comparison" ? "planner" : "comparison"));
  }, []);

  const memoized = useMemo(() => ({ render, rebuildStates }), [render, rebuildStates]);

  const showMises =
    shouldShowMisesOverlay(viewMode, G, misesDismissed) && arc.phase !== "idle";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div
        style={{
          position: "relative",
          height: "min(70vh, 640px)",
          background: "var(--paper-elevated)",
        }}
      >
        <Sketch
          render={memoized.render}
          alt={LETTER_COMBINED_ALT}
          poster={
            <PosterFallback
              src="/posters/calculation-problem.svg"
              alt="The Calculation Problem poster frame."
            />
          }
          fill
          maxDpr={2}
        />
        <MisesOverlay visible={showMises} onDismiss={() => setMisesDismissed(true)} />
      </div>

      {/* Two-column explainer — tells first-time visitors what each panel is */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0",
          borderBlockEnd: "1px solid var(--rule)",
          paddingInline: "var(--gutter-inline)",
          paddingBlock: "0.75rem",
        }}
      >
        <div
          style={{ paddingInlineEnd: "1rem", borderInlineEnd: "1px solid var(--rule)" }}
        >
          <p
            className="label-mono"
            style={{
              color: "var(--ink-secondary)",
              margin: 0,
              marginBlockEnd: "0.2rem",
            }}
          >
            Market Economy
          </p>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "var(--step--1)",
              color: "var(--ink-tertiary)",
              margin: 0,
            }}
          >
            Price signals coordinate buyers and sellers — supply chains emerge without
            anyone in charge.
          </p>
        </div>
        <div style={{ paddingInlineStart: "1rem" }}>
          <p
            className="label-mono"
            style={{
              color: "var(--accent-action)",
              margin: 0,
              marginBlockEnd: "0.2rem",
            }}
          >
            Central Plan
          </p>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "var(--step--1)",
              color: "var(--ink-tertiary)",
              margin: 0,
            }}
          >
            No prices. A planner allocates by decree — shortages compound and
            satisfaction falls as complexity rises.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "1rem 2rem",
          paddingInline: "var(--gutter-inline)",
          alignItems: "baseline",
        }}
      >
        <Metric
          label="MARKET SAT"
          value={`${(metrics.marketSatisfaction * 100).toFixed(1)}%`}
          color="var(--ink-primary)"
        />
        <Metric
          label={viewMode === "planner" ? "YOUR SAT" : "PLANNED SAT"}
          value={`${(metrics.plannedSatisfaction * 100).toFixed(1)}%`}
          color="var(--accent-action)"
        />
        <Metric
          label="PLANNER WASTE / TICK"
          value={metrics.plannedWaste.toFixed(2)}
          color="var(--ink-tertiary)"
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          paddingInline: "var(--gutter-inline)",
          paddingBlockStart: "1rem",
          borderBlockStart: "1px solid var(--rule)",
          flexWrap: "wrap",
        }}
      >
        <label
          className="label-mono"
          htmlFor="complexity"
          style={{ color: "var(--ink-tertiary)", minWidth: "14ch" }}
        >
          Complexity · {G} goods
          {arc.phase !== "idle" && arc.phase !== "complete" ? (
            <span style={{ color: "var(--accent-action)" }}> · arc-driven</span>
          ) : null}
        </label>
        <input
          id="complexity"
          type="range"
          min={5}
          max={200}
          step={1}
          value={G}
          onChange={(e) => setManualG(Number(e.target.value))}
          disabled={arc.phase !== "idle" && arc.phase !== "complete"}
          data-interactive
          style={{
            flex: 1,
            minWidth: "12rem",
            accentColor: "var(--accent-action)",
          }}
        />
        <span
          className="label-mono"
          style={{ color: "var(--ink-tertiary)", minWidth: "8ch" }}
        >
          tick {tick}
        </span>
        <button
          type="button"
          onClick={handleToggleView}
          data-interactive
          className="label-mono"
          style={modeToggleStyle(viewMode)}
          aria-pressed={viewMode === "planner"}
        >
          {viewMode === "comparison" ? "Be the Planner →" : "← Comparison"}
        </button>
      </div>

      {viewMode === "comparison" ? (
        <p
          className="label-mono"
          style={{
            paddingInline: "var(--gutter-inline)",
            color: "var(--ink-tertiary)",
            fontStyle: "italic",
            marginBlock: 0,
          }}
        >
          You can also take the planner's seat. Press the button above and try to
          coordinate the right panel manually as complexity rises.
        </p>
      ) : null}

      {viewMode === "planner" && plannerSnapshot ? (
        <PlannerControls
          state={plannerSnapshot}
          overrides={overridesRef.current}
          arc={arc}
          metrics={{
            plannerSat: metrics.plannedSatisfaction,
            marketSat: metrics.marketSatisfaction,
          }}
          onOverride={handleOverride}
          onBegin={handleBeginArc}
          onCancel={handleCancelArc}
          onReset={handleResetArc}
        />
      ) : null}
    </div>
  );
}

const LETTER_COMBINED_ALT =
  "Two panels side by side. The market panel shows letterform agents — c (consumers), p (producers), r (resources), g (goods) — moving and exchanging with visible supply chains. The planned panel has no prices: agents queue, surpluses decay, and as the complexity slider rises, its failure becomes visible while the market panel continues to coordinate. A 'Be the Planner' mode lets the reader manually choose recipes and watch their satisfaction fall behind the market as complexity rises.";

function Metric({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
      <span className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--step-2)",
          color,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function modeToggleStyle(viewMode: ViewMode): CSSProperties {
  const active = viewMode === "planner";
  return {
    padding: "0.45rem 0.9rem",
    border: `1px solid ${active ? "var(--accent-action)" : "var(--rule-strong)"}`,
    color: active ? "var(--accent-action)" : "var(--ink-secondary)",
    background: active ? "var(--accent-action-wash)" : "transparent",
    cursor: "pointer",
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.04em",
    borderRadius: "var(--radius-sm)",
    transition: "all var(--dur-micro) var(--ease-organic)",
  };
}

function drawPanel(
  ctx: CanvasRenderingContext2D,
  state: State,
  bounds: { x: number; y: number; width: number; height: number },
  colors: { labelColor: string; edgeColor: string },
) {
  const { x: offsetX, y: offsetY, width: panelW, height: panelH } = bounds;

  const clampX = (x: number) => offsetX + Math.max(4, Math.min(panelW - 4, x));
  const clampY = (y: number) => offsetY + Math.max(12, Math.min(panelH - 12, y));

  if (state.mode === "market") {
    ctx.strokeStyle = "rgba(139, 58, 58, 0.2)";
    ctx.lineWidth = 0.6;
    for (const c of state.consumers) {
      let topK = 0;
      let topAlpha = 0;
      for (let k = 0; k < state.G; k++) {
        if ((c.alpha[k] ?? 0) > topAlpha) {
          topAlpha = c.alpha[k] ?? 0;
          topK = k;
        }
      }
      let best: (typeof state.producers)[number] | null = null;
      let bestDist = Number.POSITIVE_INFINITY;
      for (const p of state.producers) {
        if (p.goodIdx !== topK || p.inventory <= 0) continue;
        const dx = p.x - c.x;
        const dy = p.y - c.y;
        const d = dx * dx + dy * dy;
        if (d < bestDist) {
          bestDist = d;
          best = p;
        }
      }
      if (best && c.lastSatisfaction > 0.05) {
        ctx.beginPath();
        ctx.moveTo(clampX(c.x), clampY(c.y));
        ctx.lineTo(clampX(best.x), clampY(best.y));
        ctx.stroke();
      }
    }
  }

  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  for (const c of state.consumers) {
    const sat = c.lastSatisfaction;
    const fill =
      state.mode === "planned" && sat < 0.35
        ? "#8B3A3A"
        : sat > 0.7
          ? "#3A5A4A"
          : "#1C1814";
    const size = 12 + Math.min(6, sat * 6);
    ctx.fillStyle = fill;
    ctx.font = `${size}px var(--font-serif), serif`;
    ctx.fillText(LETTER_BY_ROLE.consumer ?? "c", clampX(c.x), clampY(c.y));
  }

  for (const p of state.producers) {
    const isPrimary = p.goodIdx < state.G * 0.25;
    const letter = isPrimary ? LETTER_BY_ROLE.resource : LETTER_BY_ROLE.producer;
    const stockRatio = Math.min(1, p.inventory / 4);
    const fill =
      p.inventory <= 0.1 ? "#8B3A3A" : stockRatio > 0.6 ? "#3A5A4A" : "#1C1814";
    const size = 13 + stockRatio * 4;
    ctx.fillStyle = fill;
    ctx.font = `500 ${size}px var(--font-serif), serif`;
    ctx.fillText(letter ?? "p", clampX(p.x), clampY(p.y));

    if (state.mode === "market" && p.askPrice > 0) {
      ctx.font = "9px var(--font-mono), ui-monospace, monospace";
      ctx.fillStyle = colors.labelColor;
      ctx.fillText(p.askPrice.toFixed(1), clampX(p.x), clampY(p.y) - size * 0.85);
    }
  }
}
