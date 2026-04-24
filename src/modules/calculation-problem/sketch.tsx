"use client";

import { PosterFallback } from "@/components/sketch/PosterFallback";
import { Sketch, type SketchRenderFn } from "@/components/sketch/Sketch";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_PARAMS, step } from "./lib/engine";
import { init } from "./lib/init";
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

export default function CalculationProblemSketch() {
  const [G, setG] = useState(INITIAL_G);
  const marketRef = useRef<State | null>(null);
  const plannedRef = useRef<State | null>(null);
  const [tick, setTick] = useState(0);
  const [metrics, setMetrics] = useState({
    marketSatisfaction: 0,
    plannedSatisfaction: 0,
    plannedWaste: 0,
  });

  const rebuildStates = useCallback(
    (width: number, height: number) => {
      const producerCount = Math.max(30, Math.floor(G * PRODUCER_COUNT_FACTOR));
      marketRef.current = init({
        G,
        consumerCount: CONSUMER_COUNT,
        producerCount,
        mode: "market",
        seed: `panel-seed-G${G}-v1`,
        width: width / 2,
        height,
      });
      plannedRef.current = init({
        G,
        consumerCount: CONSUMER_COUNT,
        producerCount,
        mode: "planned",
        seed: `panel-seed-G${G}-v1`,
        width: width / 2,
        height,
      });
      setTick(0);
    },
    [G],
  );

  const render: SketchRenderFn = useCallback(
    ({ canvas, width, height, dpr }) => {
      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      // Init on first frame or on dimension change.
      if (!marketRef.current || !plannedRef.current) {
        rebuildStates(width, height);
        return;
      }

      // Step both simulations.
      marketRef.current = step(marketRef.current, DEFAULT_PARAMS);
      plannedRef.current = step(plannedRef.current, DEFAULT_PARAMS);

      ctx.save();
      ctx.scale(dpr, dpr);

      // Gentle fade — leaves faint trails of prior frames, reinforcing the
      // emergent-order aesthetic.
      ctx.fillStyle = "rgba(245, 240, 230, 0.22)";
      ctx.fillRect(0, 0, width, height);

      const panelWidth = width / 2;
      const divider = panelWidth;

      // Market panel
      drawPanel(
        ctx,
        marketRef.current,
        { x: 0, y: 0, width: panelWidth, height },
        { labelColor: "#5C5348", edgeColor: "#8B3A3A" },
      );
      // Planned panel
      drawPanel(
        ctx,
        plannedRef.current,
        { x: panelWidth, y: 0, width: panelWidth, height },
        { labelColor: "#5C5348", edgeColor: "#8B8275" },
      );

      // Divider
      ctx.strokeStyle = "#D8CFBE";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(divider, 0);
      ctx.lineTo(divider, height);
      ctx.stroke();

      // Panel labels
      ctx.fillStyle = "#8B8275";
      ctx.font = "500 11px ui-monospace, monospace";
      ctx.textBaseline = "top";
      ctx.fillText("MARKET", 16, 14);
      ctx.fillText("PLANNED", panelWidth + 16, 14);

      // Tick counter
      ctx.textAlign = "right";
      ctx.fillText(`tick ${marketRef.current.tick}`, width - 16, 14);
      ctx.textAlign = "left";

      ctx.restore();

      // Bubble tick + metrics up every ~20 frames for React to display.
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
          plannedWaste: plannedRef.current.totalWaste / plannedRef.current.tick,
        });
      }
    },
    [rebuildStates],
  );

  // Reset sims whenever G changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: G is the trigger — the effect body resets refs it does not read. next render re-inits via rebuildStates.
  useEffect(() => {
    marketRef.current = null;
    plannedRef.current = null;
  }, [G]);

  const memoized = useMemo(() => ({ render, rebuildStates }), [render, rebuildStates]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div
        style={{
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
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
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
          label="PLANNED SAT"
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
        }}
      >
        <label
          className="label-mono"
          htmlFor="complexity"
          style={{ color: "var(--ink-tertiary)", minWidth: "14ch" }}
        >
          Complexity · {G} goods
        </label>
        <input
          id="complexity"
          type="range"
          min={5}
          max={120}
          step={1}
          value={G}
          onChange={(e) => setG(Number(e.target.value))}
          data-interactive
          style={{ flex: 1, accentColor: "var(--accent-action)" }}
        />
        <span className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
          tick {tick}
        </span>
      </div>
    </div>
  );
}

const LETTER_COMBINED_ALT =
  "Two panels side by side. The market panel shows letterform agents — c (consumers), p (producers), r (resources), g (goods) — moving and exchanging with visible supply chains. The planned panel has no prices: agents queue, surpluses decay, and as the complexity slider rises, its failure becomes visible while the market panel continues to coordinate.";

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

function drawPanel(
  ctx: CanvasRenderingContext2D,
  state: State,
  bounds: { x: number; y: number; width: number; height: number },
  colors: { labelColor: string; edgeColor: string },
) {
  // Draw supply edges (active trades — we approximate by connecting each
  //  consumer to the nearest producer of their top-preferred good).
  const { x: offsetX, y: offsetY, width: panelW, height: panelH } = bounds;

  const clampX = (x: number) => offsetX + Math.max(4, Math.min(panelW - 4, x));
  const clampY = (y: number) => offsetY + Math.max(12, Math.min(panelH - 12, y));

  // Edges — only for market mode where trade is happening.
  if (state.mode === "market") {
    ctx.strokeStyle = "rgba(139, 58, 58, 0.2)";
    ctx.lineWidth = 0.6;
    for (const c of state.consumers) {
      // Pick the good with highest alpha — visualize the dominant preference.
      let topK = 0;
      let topAlpha = 0;
      for (let k = 0; k < state.G; k++) {
        if ((c.alpha[k] ?? 0) > topAlpha) {
          topAlpha = c.alpha[k] ?? 0;
          topK = k;
        }
      }
      // Find nearest producer of topK with inventory.
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

  // Agents as letterforms.
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  // Consumers — `c`
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

  // Producers — `p` (with small inventory indicator)
  for (const p of state.producers) {
    const isPrimary = p.goodIdx < state.G * 0.25;
    const letter = isPrimary ? LETTER_BY_ROLE.resource : LETTER_BY_ROLE.producer;
    // Color by activity: green when well-stocked, oxblood when sold out.
    const stockRatio = Math.min(1, p.inventory / 4);
    const fill =
      p.inventory <= 0.1 ? "#8B3A3A" : stockRatio > 0.6 ? "#3A5A4A" : "#1C1814";
    const size = 13 + stockRatio * 4;
    ctx.fillStyle = fill;
    ctx.font = `500 ${size}px var(--font-serif), serif`;
    ctx.fillText(letter ?? "p", clampX(p.x), clampY(p.y));

    // Tiny ask-price superscript in market mode.
    if (state.mode === "market" && p.askPrice > 0) {
      ctx.font = "9px var(--font-mono), ui-monospace, monospace";
      ctx.fillStyle = colors.labelColor;
      ctx.fillText(p.askPrice.toFixed(1), clampX(p.x), clampY(p.y) - size * 0.85);
    }
  }
}
