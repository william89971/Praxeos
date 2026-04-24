"use client";

import { cssVar } from "@/sketches/lib/cssVar";
import { useEffect, useRef } from "react";
import { EPOCHS } from "../lib/epochs";
import { computePanels, positionOfBlock } from "../lib/layout";
import { generateOrganism } from "../lib/organism";
import type { Block } from "../lib/types";
import {
  type GardenView,
  WORLD_HEIGHT,
  WORLD_TOP_PADDING,
  WORLD_WIDTH,
  worldRectForView,
} from "../lib/viewport";

const PANELS = computePanels(
  WORLD_WIDTH,
  WORLD_HEIGHT,
  WORLD_TOP_PADDING,
  EPOCHS.length,
);

export function LiveLayer({
  blocks,
  view,
  width,
  height,
}: {
  blocks: readonly Block[];
  view: GardenView;
  width: number;
  height: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bornAtRef = useRef(new Map<number, number>());
  // Latest-values refs let the raf loop read changing props without
  // tearing down and restarting the animation on every React render.
  const blocksRef = useRef<readonly Block[]>(blocks);
  const viewRef = useRef<GardenView>(view);
  blocksRef.current = blocks;
  viewRef.current = view;

  // Record a "born at" timestamp per block height for the fade-in.
  useEffect(() => {
    const now = performance.now();
    for (const block of blocks) {
      if (!bornAtRef.current.has(block.height)) {
        bornAtRef.current.set(block.height, now);
      }
    }
  }, [blocks]);

  // Resize the canvas buffer exactly when the viewport changes — not on
  // every animation frame.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= 0 || height <= 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }, [width, height]);

  // Render loop: start/stop gated by IntersectionObserver +
  // prefers-reduced-motion. This is the LiveLayer's analogue of the
  // canonical <Sketch> wrapper's contract.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= 0 || height <= 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let running = false;
    let destroyed = false;
    let frame = 0;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      if (reducedMotion) stop();
      else if (onScreen) start();
    };
    motionQuery.addEventListener("change", onMotionChange);

    let onScreen = true;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          onScreen = entry.isIntersecting;
        }
        if (reducedMotion || destroyed) return;
        if (onScreen) start();
        else stop();
      },
      { threshold: 0.05 },
    );
    observer.observe(canvas);

    const draw = (now: number) => {
      if (destroyed || !running) return;
      frame += 1;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const rect = worldRectForView(viewRef.current, width, height);
      const bornAt = bornAtRef.current;

      const orange = (alpha: number) => cssVar("--accent-bitcoin", "#E87722", alpha);
      const ink = (alpha: number) => cssVar("--ink-primary", "#1C1814", alpha);

      for (const block of blocksRef.current) {
        const positioned = positionOfBlock(block.height, PANELS, 7);
        if (!positioned) continue;

        const age = now - (bornAt.get(block.height) ?? now);
        const alpha = Math.max(0, 1 - age / 10_000);
        if (alpha <= 0) continue;

        const organism = generateOrganism(block, 6.2);
        const screenX = (positioned.x - rect.left) * rect.scale;
        const screenY = (positioned.y - rect.top) * rect.scale;
        if (
          screenX < -80 ||
          screenX > width + 80 ||
          screenY < -80 ||
          screenY > height + 80
        ) {
          continue;
        }

        ctx.save();
        ctx.translate(screenX, screenY);
        const pulse = 1 + Math.sin(frame * 0.08 + block.height) * 0.05;
        ctx.scale(rect.scale * pulse, rect.scale * pulse);

        if (organism.hasOrangeCore) {
          ctx.strokeStyle = orange(0.95 * alpha);
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.arc(0, 0, organism.radius * 0.24, 0, Math.PI * 2);
          ctx.stroke();
        }

        for (const segment of organism.segments) {
          ctx.strokeStyle =
            segment.kind === 3 && organism.hasOrangeCore
              ? orange(0.95 * alpha)
              : ink(0.82 * alpha);
          ctx.lineWidth = Math.max(0.7, segment.weight * 0.9);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(segment.x1, segment.y1);
          ctx.lineTo(segment.x2, segment.y2);
          ctx.stroke();
        }

        ctx.restore();
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

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
