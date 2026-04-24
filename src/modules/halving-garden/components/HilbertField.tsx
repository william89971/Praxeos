"use client";

import { cssVar } from "@/sketches/lib/cssVar";
import { useEffect, useRef } from "react";
import { APPROX_CURRENT_HEIGHT, EPOCHS } from "../lib/epochs";
import { computePanels, positionOfBlock } from "../lib/layout";
import type { Block } from "../lib/types";
import {
  type GardenView,
  MAX_ZOOM,
  MIN_ZOOM,
  WORLD_HEIGHT,
  WORLD_TOP_PADDING,
  WORLD_WIDTH,
  clampView,
  worldRectForView,
  zoomScale,
} from "../lib/viewport";

const PANELS = computePanels(
  WORLD_WIDTH,
  WORLD_HEIGHT,
  WORLD_TOP_PADDING,
  EPOCHS.length,
);

// ---------------------------------------------------------------------------
// Particle pre-computation (module level — pure math, SSR-safe, runs once).
// Samples every 50th block height → ~18,900 particles, ~20ms.
// ---------------------------------------------------------------------------
type Particle = { x: number; y: number; epochIndex: number };

const PARTICLES: Particle[] = (() => {
  const out: Particle[] = [];
  for (let h = 0; h <= APPROX_CURRENT_HEIGHT; h += 50) {
    const pos = positionOfBlock(h, PANELS, 7);
    if (!pos) continue;
    let epochIndex = 0;
    for (let i = EPOCHS.length - 1; i >= 0; i--) {
      const e = EPOCHS[i];
      if (e && h >= e.startHeight) {
        epochIndex = e.index;
        break;
      }
    }
    out.push({ x: pos.x, y: pos.y, epochIndex });
  }
  return out;
})();

// Group by epoch so we set fillStyle once per group (fewer state changes).
const EPOCH_GROUPS: Particle[][] = Array.from({ length: EPOCHS.length }, () => []);
for (const p of PARTICLES) {
  EPOCH_GROUPS[Math.min(p.epochIndex, EPOCH_GROUPS.length - 1)]?.push(p);
}

// Epoch color: CSS variable name + hex fallback, ordered epoch 0→4.
// Evaluated per frame via cssVar() so dark/light mode switch is automatic.
const EPOCH_COLORS: Array<[string, string, number]> = [
  ["--ink-tertiary", "#8B8275", 0.5], // 0 genesis — dim warm grey
  ["--accent-capital", "#3A5A4A", 0.72], // 1 2012   — forest green
  ["--ink-secondary", "#5C5348", 0.65], // 2 2016   — warm brown-grey
  ["--accent-action", "#8B3A3A", 0.72], // 3 2020   — oxblood
  ["--accent-bitcoin", "#E87722", 0.92], // 4 2024+  — bitcoin orange
];

// ---------------------------------------------------------------------------

type Props = {
  blocks: readonly Block[];
  view: GardenView;
  onViewChange: (view: GardenView) => void;
  width: number;
  height: number;
};

export function HilbertField({ blocks, view, onViewChange, width, height }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; origin: GardenView } | null>(null);

  // Latest-value refs so the RAF loop never reads stale props.
  const viewRef = useRef<GardenView>(view);
  const blocksRef = useRef<readonly Block[]>(blocks);
  const clampedRef = useRef<GardenView | null>(null);
  const bornAtRef = useRef(new Map<number, number>());

  viewRef.current = view;
  blocksRef.current = blocks;

  // Track when each live block first arrived for the fade-in.
  useEffect(() => {
    const now = performance.now();
    for (const block of blocks) {
      if (!bornAtRef.current.has(block.height)) {
        bornAtRef.current.set(block.height, now);
      }
    }
  }, [blocks]);

  // Resize canvas buffer when viewport dimensions change.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= 0 || height <= 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }, [width, height]);

  // Render loop — gated by IntersectionObserver + prefers-reduced-motion.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= 0 || height <= 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let running = false;
    let destroyed = false;
    let onScreen = true;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    const onMotionChange = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
      if (reducedMotion) stop();
      else if (onScreen) start();
    };
    motionQuery.addEventListener("change", onMotionChange);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) onScreen = entry.isIntersecting;
        if (reducedMotion || destroyed) return;
        if (onScreen) start();
        else stop();
      },
      { threshold: 0.05 },
    );
    observer.observe(canvas);

    const draw = (now: number) => {
      if (destroyed || !running) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = worldRectForView(viewRef.current, width, height);

      ctx.save();
      ctx.scale(dpr, dpr);

      // Theme-correct background.
      ctx.fillStyle = cssVar("--paper", "#F5F0E6", 1);
      ctx.fillRect(0, 0, width, height);

      // Epoch panel vertical dividers.
      ctx.strokeStyle = cssVar("--rule", "#D8CFBE", 0.7);
      ctx.lineWidth = 0.5;
      for (const panel of PANELS) {
        const sx = (panel.x - rect.left) * rect.scale;
        if (sx > 0 && sx < width) {
          ctx.beginPath();
          ctx.moveTo(sx, 0);
          ctx.lineTo(sx, height);
          ctx.stroke();
        }
      }

      // Horizontal top-padding line (plaque boundary).
      const plaqueY = (WORLD_TOP_PADDING - rect.top) * rect.scale;
      if (plaqueY > 0 && plaqueY < height) {
        ctx.beginPath();
        ctx.moveTo(0, plaqueY);
        ctx.lineTo(width, plaqueY);
        ctx.stroke();
      }

      // Particle radius scales smoothly with zoom.
      const r = Math.max(0.8, rect.scale * 0.65);

      // Draw all particles in epoch batches — one fillStyle set per epoch.
      for (let ei = 0; ei < EPOCH_GROUPS.length; ei++) {
        const group = EPOCH_GROUPS[ei];
        if (!group || group.length === 0) continue;
        const [varName, fallback, alpha] = EPOCH_COLORS[ei] ??
          EPOCH_COLORS[EPOCH_COLORS.length - 1] ?? ["--ink-tertiary", "#8B8275", 0.5];
        ctx.fillStyle = cssVar(varName, fallback, alpha);
        ctx.beginPath();
        for (const p of group) {
          const sx = (p.x - rect.left) * rect.scale;
          const sy = (p.y - rect.top) * rect.scale;
          if (sx < -r || sx > width + r || sy < -r || sy > height + r) continue;
          ctx.moveTo(sx + r, sy);
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      // Live blocks — glow pulse fading over 10s.
      const bornAt = bornAtRef.current;
      for (const block of blocksRef.current) {
        const pos = positionOfBlock(block.height, PANELS, 7);
        if (!pos) continue;
        const sx = (pos.x - rect.left) * rect.scale;
        const sy = (pos.y - rect.top) * rect.scale;
        if (sx < -32 || sx > width + 32 || sy < -32 || sy > height + 32) continue;

        const age = now - (bornAt.get(block.height) ?? now);
        const alpha = Math.max(0, 1 - age / 10_000);
        if (alpha <= 0) continue;

        // Soft outer glow.
        ctx.fillStyle = cssVar("--accent-bitcoin", "#E87722", alpha * 0.3);
        ctx.beginPath();
        ctx.arc(sx, sy, r * 5, 0, Math.PI * 2);
        ctx.fill();

        // Bright core dot.
        ctx.fillStyle = cssVar("--accent-bitcoin", "#E87722", alpha * 0.95);
        ctx.beginPath();
        ctx.arc(sx, sy, r * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      rafId = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running || reducedMotion || destroyed) return;
      running = true;
      rafId = requestAnimationFrame(draw);
    };

    const stop = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    };

    if (!reducedMotion) start();

    return () => {
      destroyed = true;
      stop();
      observer.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, [width, height]);

  // Passive wheel listener — React 19 wheel events are passive, so we wire imperatively.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const current = clampedRef.current;
      if (!current) return;
      const delta = e.deltaY > 0 ? -0.25 : 0.25;
      onViewChange(
        clampView(
          {
            ...current,
            zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, current.zoom + delta)),
          },
          width,
          height,
        ),
      );
    };
    wrapper.addEventListener("wheel", onWheel, { passive: false });
    return () => wrapper.removeEventListener("wheel", onWheel);
  }, [onViewChange, width, height]);

  const clamped = clampView(view, width, height);
  clampedRef.current = clamped;

  return (
    <div
      ref={wrapperRef}
      data-interactive
      onPointerDown={(e) => {
        dragRef.current = { x: e.clientX, y: e.clientY, origin: clamped };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!dragRef.current) return;
        const scale = zoomScale(clamped.zoom);
        onViewChange(
          clampView(
            {
              ...dragRef.current.origin,
              centerX:
                dragRef.current.origin.centerX -
                (e.clientX - dragRef.current.x) / scale,
              centerY:
                dragRef.current.origin.centerY -
                (e.clientY - dragRef.current.y) / scale,
            },
            width,
            height,
          ),
        );
      }}
      onPointerUp={(e) => {
        dragRef.current = null;
        e.currentTarget.releasePointerCapture(e.pointerId);
      }}
      onPointerLeave={() => {
        dragRef.current = null;
      }}
      style={{
        position: "absolute",
        inset: 0,
        cursor: "grab",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Hilbert field of Bitcoin blocks from genesis to tip. Five epochs of blocks rendered as a particle field, colored by halving era from grey through green, oxblood, and bitcoin orange."
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
