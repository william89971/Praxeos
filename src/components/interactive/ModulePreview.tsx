"use client";

import { useIsOnScreen } from "@/hooks/useIsOnScreen";
import { mulberry32 } from "@/sketches/lib/rng";
import { type CSSProperties, useEffect, useRef } from "react";

export type ModulePreviewVariant =
  | "monetary-garden"
  | "signal-orchard"
  | "calculation-labyrinth"
  | "coordination-engine";

interface Props {
  readonly variant: ModulePreviewVariant;
  readonly width?: number;
  readonly height?: number;
  /** When true, the preview animates more intensely (hover state). */
  readonly active?: boolean;
}

/**
 * Canvas 2D animated preview for module cards on the homepage.
 *
 * One canvas per card is meaningfully cheaper than mounting a separate
 * R3F scene per card, while still signalling that the destination is
 * an interactive piece. Each variant renders a stylised hint of that
 * module's visual vocabulary.
 *
 * Pauses RAF when scrolled off-screen to save battery.
 */
export function ModulePreview({
  variant,
  width = 280,
  height = 160,
  active = false,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onScreen = useIsOnScreen(canvasRef, { threshold: 0 });
  const activeRef = useRef(active);
  const startRef = useRef(0);

  // Sync active prop to ref without re-triggering effect
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !onScreen) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const styles = window.getComputedStyle(document.documentElement);
    const v = (name: string) => styles.getPropertyValue(name).trim();
    const palette = {
      paper: v("--paper-elevated") || "#EDE6D6",
      ink: v("--ink-secondary") || "#5C5348",
      capital: v("--accent-capital") || "#3A5A4A",
      bitcoin: v("--accent-bitcoin") || "#E87722",
      action: v("--accent-action") || "#8B3A3A",
      rule: v("--rule") || "#D8CFBE",
    };

    startRef.current = performance.now();
    let raf = 0;

    const draw = (now: number) => {
      const speed = activeRef.current ? 1.6 : 1.0;
      const t = ((now - startRef.current) / 1000) * speed;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = palette.paper;
      ctx.fillRect(0, 0, width, height);

      switch (variant) {
        case "monetary-garden":
          drawMonetaryGarden(ctx, t, width, height, palette, activeRef.current);
          break;
        case "signal-orchard":
          drawSignalOrchard(ctx, t, width, height, palette, activeRef.current);
          break;
        case "calculation-labyrinth":
          drawCalculationLabyrinth(ctx, t, width, height, palette, activeRef.current);
          break;
        case "coordination-engine":
          drawCoordinationEngine(ctx, t, width, height, palette, activeRef.current);
          break;
        default: {
          const _exhaustive: never = variant;
          void _exhaustive;
          break;
        }
      }

      if (!reduced) raf = window.requestAnimationFrame(draw);
    };

    if (reduced) {
      draw(performance.now());
    } else {
      raf = window.requestAnimationFrame(draw);
    }

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [variant, width, height, onScreen]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      tabIndex={-1}
      style={canvasStyle(width, height)}
    />
  );
}

function canvasStyle(w: number, h: number): CSSProperties {
  return {
    width: w,
    height: h,
    display: "block",
    borderRadius: "var(--radius-sm)",
    overflow: "hidden",
    transition: "transform 600ms var(--ease-organic)",
  };
}

type Palette = {
  paper: string;
  ink: string;
  capital: string;
  bitcoin: string;
  action: string;
  rule: string;
};

function drawMonetaryGarden(
  ctx: CanvasRenderingContext2D,
  t: number,
  w: number,
  h: number,
  p: Palette,
  active: boolean,
) {
  // Stylised low-poly trees with subtle sway.
  const baseY = h - 24;
  const trees = 11;
  const swayAmp = active ? 2.5 : 1.5;
  for (let i = 0; i < trees; i++) {
    const x = 28 + (i / (trees - 1)) * (w - 56);
    const sway = Math.sin(t * 0.7 + i * 0.8) * swayAmp;
    const heightT = 42 + (i % 3) * 8 + (active ? Math.sin(t * 0.4 + i) * 3 : 0);
    ctx.fillStyle = p.capital;
    ctx.beginPath();
    ctx.moveTo(x + sway, baseY - heightT);
    ctx.lineTo(x + 14 + sway, baseY);
    ctx.lineTo(x - 14 + sway, baseY);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = p.ink;
    ctx.fillRect(x - 1.5 + sway, baseY, 3, 7);
  }
  // Faint amber signal beam at top.
  const grad = ctx.createLinearGradient(0, 0, 0, h * 0.5);
  grad.addColorStop(0, `${p.bitcoin}${active ? "50" : "38"}`);
  grad.addColorStop(1, `${p.bitcoin}00`);
  ctx.fillStyle = grad;
  ctx.fillRect(w / 2 - 42, 0, 84, h * 0.5);

  // Edge instability — faint decay patches when active
  if (active) {
    ctx.fillStyle = `${p.action}18`;
    for (let i = 0; i < 3; i++) {
      const px = 20 + ((t * 0.3 + i * 2.1) % (w - 40));
      const py = baseY - 10 - Math.sin(t * 0.5 + i) * 8;
      ctx.beginPath();
      ctx.arc(px, py, 4 + Math.sin(t + i) * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawSignalOrchard(
  ctx: CanvasRenderingContext2D,
  t: number,
  w: number,
  h: number,
  p: Palette,
  active: boolean,
) {
  const cx = w / 2;
  const cy = h / 2;
  const rng = mulberry32(0x37_8a_91);
  const positions: Array<{ x: number; y: number }> = [];
  for (let ring = 0; ring < 3; ring++) {
    const radius = 20 + ring * 24;
    const count = 6 + ring * 4;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + ring * 0.2;
      positions.push({
        x: cx + Math.cos(angle) * radius + (rng() - 0.5) * 2,
        y: cy + Math.sin(angle) * radius * 0.55 + (rng() - 0.5) * 2,
      });
    }
  }
  // Edges to nearest 2 (approximate).
  ctx.strokeStyle = `${p.ink}${active ? "70" : "55"}`;
  ctx.lineWidth = 0.6;
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const a = positions[i];
      const b = positions[j];
      if (!a || !b) continue;
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d > 16 && d < 30) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
  // Traveling pulse along edges when active
  if (active) {
    const pulseT = (t * 1.2) % 1;
    const pulseIdx = Math.floor((t * 0.4) % positions.length);
    const from = positions[pulseIdx];
    const to = positions[(pulseIdx + 1) % positions.length];
    if (from && to) {
      const px = from.x + (to.x - from.x) * pulseT;
      const py = from.y + (to.y - from.y) * pulseT;
      ctx.fillStyle = p.bitcoin;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  // Nodes
  const pulseIdx = Math.floor((t * 0.4) % positions.length);
  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];
    if (!pos) continue;
    const dist = Math.hypot(
      pos.x - (positions[pulseIdx]?.x ?? cx),
      pos.y - (positions[pulseIdx]?.y ?? cy),
    );
    const intensity = Math.max(0, 1 - dist / 60);
    ctx.fillStyle = intensity > 0.1 ? p.bitcoin : p.capital;
    ctx.globalAlpha = 0.7 + intensity * 0.3;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 2 + intensity * (active ? 2 : 1.5), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawCalculationLabyrinth(
  ctx: CanvasRenderingContext2D,
  t: number,
  w: number,
  h: number,
  p: Palette,
  active: boolean,
) {
  // Tiny maze grid with a glowing path.
  const margin = 24;
  const cell = 14;
  const cols = Math.floor((w - margin * 2) / cell);
  const rows = Math.floor((h - margin * 2) / cell);
  ctx.strokeStyle = `${p.ink}cc`;
  ctx.lineWidth = 1;

  // Outer wall
  ctx.strokeRect(margin, margin, cols * cell, rows * cell);

  // Stylised internal walls (deterministic).
  const rng = mulberry32(0x42_aa);
  for (let i = 0; i < 14; i++) {
    const x = margin + Math.floor(rng() * cols) * cell;
    const y = margin + Math.floor(rng() * rows) * cell;
    const horiz = rng() > 0.5;
    ctx.beginPath();
    if (horiz) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + cell * 2, y);
    } else {
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + cell * 2);
    }
    ctx.stroke();
  }

  // Path markers — chain from lower-left to upper-right.
  const path: Array<[number, number]> = [
    [1, 6],
    [2, 6],
    [2, 5],
    [3, 5],
    [3, 4],
    [4, 4],
    [4, 3],
    [5, 3],
    [5, 2],
    [6, 2],
  ];
  path.forEach(([cx, cy], i) => {
    const x = margin + cx * cell + cell / 2;
    const y = margin + cy * cell + cell / 2;
    const phase = (t * 1.4 + i * 0.4) % (Math.PI * 2);
    const flicker = 0.5 + Math.sin(phase) * 0.4;
    ctx.fillStyle = p.bitcoin;
    ctx.globalAlpha = flicker;
    ctx.beginPath();
    ctx.arc(x, y, 1.8, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // Pawn (animated along path).
  const tt = (t * 0.55) % path.length;
  const fromIdx = Math.floor(tt);
  const toIdx = Math.min(path.length - 1, fromIdx + 1);
  const f = tt - fromIdx;
  const fromCell = path[fromIdx];
  const toCell = path[toIdx];
  if (fromCell && toCell) {
    const fx = margin + fromCell[0] * cell + cell / 2;
    const fy = margin + fromCell[1] * cell + cell / 2;
    const tx = margin + toCell[0] * cell + cell / 2;
    const ty = margin + toCell[1] * cell + cell / 2;
    const px = fx + (tx - fx) * f;
    const py = fy + (ty - fy) * f;
    ctx.fillStyle = p.bitcoin;
    ctx.beginPath();
    ctx.arc(px, py, active ? 4 : 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Shifting walls when active
  if (active) {
    ctx.strokeStyle = `${p.action}30`;
    ctx.lineWidth = 1;
    const shiftT = Math.sin(t * 0.8) * 0.5 + 0.5;
    const sx = margin + cols * cell * 0.3 + shiftT * cols * cell * 0.4;
    ctx.beginPath();
    ctx.moveTo(sx, margin);
    ctx.lineTo(sx, margin + rows * cell);
    ctx.stroke();
  }
}

function drawCoordinationEngine(
  ctx: CanvasRenderingContext2D,
  t: number,
  w: number,
  h: number,
  p: Palette,
  active: boolean,
) {
  const cx = w / 2;
  const cy = h / 2;
  const radii = [22, 38, 54];
  const counts = [6, 10, 14];

  // Rings (faint).
  ctx.strokeStyle = `${p.rule}${active ? "cc" : "aa"}`;
  ctx.setLineDash([3, 5]);
  for (const r of radii) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, r, r * 0.55, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Nodes + synchronised pulse.
  const sharedPhase = t * 1.6;
  for (let r = 0; r < radii.length; r++) {
    const radius = radii[r] ?? 0;
    const count = counts[r] ?? 0;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + r * 0.13;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius * 0.55;
      const pulse = 0.5 + Math.sin(sharedPhase + r * 0.3) * 0.4;
      ctx.fillStyle = p.bitcoin;
      ctx.globalAlpha = 0.55 + pulse * 0.45;
      ctx.beginPath();
      ctx.arc(x, y, 2 + pulse * (active ? 1.2 : 0.6), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;

  // A few edges between nearest agents.
  ctx.strokeStyle = `${p.bitcoin}${active ? "aa" : "88"}`;
  ctx.lineWidth = 0.6;
  for (let r = 0; r < radii.length - 1; r++) {
    const radius = radii[r] ?? 0;
    const radius2 = radii[r + 1] ?? 0;
    const count = counts[r] ?? 0;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x1 = cx + Math.cos(angle) * radius;
      const y1 = cy + Math.sin(angle) * radius * 0.55;
      const x2 = cx + Math.cos(angle) * radius2;
      const y2 = cy + Math.sin(angle) * radius2 * 0.55;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  // Desync hint when active — one ring drifts
  if (active) {
    const r = 1;
    const radius = radii[r] ?? 0;
    const count = counts[r] ?? 0;
    const drift = t * 0.4;
    ctx.strokeStyle = `${p.action}40`;
    ctx.lineWidth = 0.8;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + r * 0.13 + drift;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius * 0.55;
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}
