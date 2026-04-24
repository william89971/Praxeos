"use client";

import { PosterFallback } from "@/components/sketch/PosterFallback";
import { Sketch, type SketchRenderFn } from "@/components/sketch/Sketch";
import { cssVar } from "@/sketches/lib/cssVar";
import { useRef } from "react";
import { TeleologySim } from "./simulation";

type Props = {
  /** Agent count. Desktop sweet spot ~90; mobile degrades automatically via DPR cap. */
  agentCount?: number;
  /** Number of attractor points. 6–10 reads best. */
  attractorCount?: number;
  /** Seed — same seed → same trajectory. */
  seed?: string;
  /** Fill parent height instead of using aspect ratio. */
  fill?: boolean;
};

/**
 * "Teleology" — the homepage ambient sketch.
 *
 * Purposeful agents moving toward chosen ends; emergent order forms and
 * dissolves in slow cycles. Ink on paper. Honors reduced-motion.
 */
export function Teleology({
  agentCount = 92,
  attractorCount = 7,
  seed = "praxeos-teleology-v1",
  fill = false,
}: Props) {
  const simRef = useRef<TeleologySim | null>(null);

  const render: SketchRenderFn = ({ canvas, width, height, dpr, delta }) => {
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Lazy init — sim persists across frames.
    if (!simRef.current) {
      simRef.current = new TeleologySim({
        width,
        height,
        agentCount,
        attractorCount,
        seed,
      });
    } else {
      // Propagate resize.
      simRef.current.resize(width, height);
    }

    // Step simulation.
    simRef.current.step(delta);

    // Clear with slight alpha to preserve subtle trails (motion blur aesthetic).
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.globalCompositeOperation = "source-over";

    // Paper-tinted fade instead of full clear — leaves a soft ink ghost.
    ctx.fillStyle = cssVar("--paper", "#F5F0E6", 0.18);
    ctx.fillRect(0, 0, width, height);

    // Trails.
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const a of simRef.current.agents) {
      if (a.trail.length < 4) continue;
      ctx.beginPath();
      ctx.moveTo(a.trail[0] ?? 0, a.trail[1] ?? 0);
      for (let i = 2; i < a.trail.length; i += 2) {
        ctx.lineTo(a.trail[i] ?? 0, a.trail[i + 1] ?? 0);
      }
      const fade = 0.22 + a.intent * 0.35;
      ctx.strokeStyle =
        a.intent > 0.55
          ? cssVar("--accent-action", "#8B3A3A", fade)
          : cssVar("--ink-primary", "#1C1814", fade);
      ctx.lineWidth = 0.9;
      ctx.stroke();
    }

    // Agents as small marks.
    for (const a of simRef.current.agents) {
      ctx.fillStyle =
        a.intent < 0.15
          ? cssVar("--accent-capital", "#3A5A4A", 0.85)
          : cssVar("--ink-primary", "#1C1814", 0.88);
      ctx.beginPath();
      ctx.arc(a.x, a.y, 1.3 + a.intent * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  return (
    <Sketch
      render={render}
      teardown={() => {
        simRef.current = null;
      }}
      alt="Teleology — ambient simulation of purposeful agents moving toward chosen ends. An ink-on-paper animation that forms and dissolves emergent patterns across minute-long cycles."
      poster={
        <PosterFallback src="/posters/teleology.svg" alt="Teleology poster frame." />
      }
      className="teleology-sketch"
      aspectRatio={16 / 9}
      maxDpr={2}
      fill={fill}
    />
  );
}
