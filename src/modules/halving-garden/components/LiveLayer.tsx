"use client";

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

  useEffect(() => {
    const now = performance.now();
    for (const block of blocks) {
      if (!bornAtRef.current.has(block.height)) {
        bornAtRef.current.set(block.height, now);
      }
    }
  }, [blocks]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= 0 || height <= 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let rafId = 0;
    const draw = (now: number) => {
      frame += 1;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const rect = worldRectForView(view, width, height);
      for (const block of blocks) {
        const positioned = positionOfBlock(block.height, PANELS, 7);
        if (!positioned) continue;

        const age = now - (bornAtRef.current.get(block.height) ?? now);
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
          ctx.strokeStyle = `rgba(232, 119, 34, ${0.95 * alpha})`;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.arc(0, 0, organism.radius * 0.24, 0, Math.PI * 2);
          ctx.stroke();
        }

        for (const segment of organism.segments) {
          ctx.strokeStyle =
            segment.kind === 3 && organism.hasOrangeCore
              ? `rgba(232, 119, 34, ${0.95 * alpha})`
              : `rgba(28, 24, 20, ${0.82 * alpha})`;
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

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [blocks, height, view, width]);

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
