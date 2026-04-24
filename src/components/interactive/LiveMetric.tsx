"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A live-updating metric display with a mini sparkline.
 * Designed for simulation dashboards.
 */
export function LiveMetric({
  label,
  value,
  unit = "",
  color = "var(--ink-primary)",
  history,
  maxHistory = 40,
}: {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  history?: number[];
  maxHistory?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [trend, setTrend] = useState<"up" | "down" | "flat">("flat");

  useEffect(() => {
    if (!history || history.length < 2) return;
    const last = history[history.length - 1];
    const prev = history[history.length - 2];
    if (last === undefined || prev === undefined) return;
    const diff = last - prev;
    setTrend(diff > 0.001 ? "up" : diff < -0.001 ? "down" : "flat");
  }, [history]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !history || history.length < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.scale(dpr, dpr);

    const data = history.slice(-maxHistory);
    if (data.length === 0) return;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    ctx.clearRect(0, 0, cssW, cssH);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = "round";
    ctx.beginPath();

    for (let i = 0; i < data.length; i++) {
      const val = data[i];
      if (val === undefined) continue;
      const x = (i / (maxHistory - 1)) * cssW;
      const y = cssH - ((val - min) / range) * cssH * 0.8 - cssH * 0.1;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Area fill
    ctx.lineTo(cssW, cssH);
    ctx.lineTo(0, cssH);
    ctx.closePath();
    ctx.fillStyle = color.startsWith("#") ? `${color}14` : "rgba(139, 58, 58, 0.08)";
    ctx.fill();
  }, [history, color, maxHistory]);

  const trendSymbol = trend === "up" ? "▲" : trend === "down" ? "▼" : "—";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
        padding: "1rem",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--rule)",
        background: "var(--paper-elevated)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <span
          className="label-mono"
          style={{ color: "var(--ink-tertiary)", fontSize: "var(--step--2)" }}
        >
          {label}
        </span>
        <span
          aria-hidden="true"
          style={{
            fontSize: "var(--step--2)",
            color:
              trend === "up"
                ? "var(--accent-capital)"
                : trend === "down"
                  ? "var(--accent-action)"
                  : "var(--ink-tertiary)",
          }}
        >
          {trendSymbol}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--step-3)",
            color,
            fontVariantNumeric: "tabular-nums",
            fontWeight: 500,
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {unit ? (
          <span
            className="label"
            style={{ color: "var(--ink-tertiary)", fontSize: "var(--step--1)" }}
          >
            {unit}
          </span>
        ) : null}
      </div>
      {history && history.length > 1 ? (
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "28px",
            marginTop: "0.25rem",
          }}
        />
      ) : null}
    </div>
  );
}
