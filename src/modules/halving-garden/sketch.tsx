"use client";

import { PosterFallback } from "@/components/sketch/PosterFallback";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { AudioToggle } from "./components/AudioToggle";
import { LiveLayer } from "./components/LiveLayer";
import { M2Meter } from "./components/M2Meter";
import { TileMap } from "./components/TileMap";
import { useLiveBlocks } from "./lib/useLiveBlocks";
import { type GardenView, WORLD_HEIGHT, WORLD_WIDTH, clampView } from "./lib/viewport";

const DEFAULT_VIEW: GardenView = {
  zoom: 0.45,
  centerX: WORLD_WIDTH / 2,
  centerY: WORLD_HEIGHT / 2,
};
const canBakeLocally = process.env.NODE_ENV === "development";

export default function HalvingGardenSketch() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { blocks, newest, source } = useLiveBlocks(18);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [view, setView] = useState<GardenView>(DEFAULT_VIEW);
  const [viewport, setViewport] = useState({ width: 1, height: 1 });
  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const bakedHeightRef = useRef<number | null>(null);
  const heardHeightRef = useRef<number | null>(null);

  const applyView = (next: GardenView) => {
    setView(clampView(next, viewport.width, viewport.height));
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect) return;
      setViewport({
        width: Math.max(1, Math.floor(rect.width)),
        height: Math.max(1, Math.floor(rect.height)),
      });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canBakeLocally) return;
    if (!newest || bakedHeightRef.current === newest.height) return;
    bakedHeightRef.current = newest.height;

    void fetch("/api/bake-single-block", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newest),
    });
  }, [newest]);

  useEffect(() => {
    if (!audioEnabled || !newest || heardHeightRef.current === newest.height) return;
    heardHeightRef.current = newest.height;

    const context =
      audioContextRef.current ??
      new AudioContext({
        latencyHint: "interactive",
      });
    audioContextRef.current = context;

    const startAt = context.currentTime + 0.02;
    const frequencies = [220, 330, 440];
    for (const [index, frequency] of frequencies.entries()) {
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = "triangle";
      osc.frequency.value = frequency + (newest.height % 17) * 2;
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(0.02, startAt + 0.04 + index * 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.32 + index * 0.03);
      osc.connect(gain).connect(context.destination);
      osc.start(startAt + index * 0.02);
      osc.stop(startAt + 0.42 + index * 0.03);
    }
  }, [audioEnabled, newest]);

  if (prefersReducedMotion) {
    return (
      <PosterFallback
        src="/posters/halving-garden.svg"
        alt="The Halving Garden poster frame."
      />
    );
  }

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div
        ref={containerRef}
        style={{
          position: "relative",
          height: "min(78vh, 720px)",
          background: "var(--paper)",
          borderBlockEnd: "1px solid var(--rule)",
        }}
      >
        <TileMap version={newest?.height ?? 0} view={view} onViewChange={applyView}>
          <LiveLayer
            blocks={blocks}
            view={view}
            width={viewport.width}
            height={viewport.height}
          />
          <M2Meter />
          <div
            className="label-mono"
            style={{
              position: "absolute",
              insetBlockStart: "1rem",
              insetInlineStart: "1rem",
              padding: "0.75rem 0.9rem",
              background: "rgba(245, 240, 230, 0.84)",
              border: "1px solid var(--rule)",
              borderRadius: "var(--radius-sm)",
              backdropFilter: "blur(8px)",
              maxWidth: "34ch",
            }}
          >
            <div style={{ color: "var(--ink-secondary)" }}>Genesis to tip</div>
            <div style={{ marginTop: "0.35rem", color: "var(--ink-primary)" }}>
              Five epochs on a Hilbert field.
            </div>
            <div style={{ marginTop: "0.35rem", color: "var(--ink-tertiary)" }}>
              Live source: {source}
            </div>
          </div>
        </TileMap>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
          paddingInline: "var(--gutter-inline)",
        }}
      >
        <div className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
          {canBakeLocally
            ? "Drag to pan. Scroll to zoom. New blocks fade in before they bake into local tiles."
            : "Drag to pan. Scroll to zoom. New blocks fade in live over the manuscript field."}
        </div>
        <div style={{ display: "flex", gap: "0.65rem", alignItems: "center" }}>
          <button
            type="button"
            data-interactive
            className="label-mono"
            onClick={() => applyView(DEFAULT_VIEW)}
            style={controlButtonStyle}
          >
            Reset view
          </button>
          <button
            type="button"
            data-interactive
            className="label-mono"
            onClick={() => applyView({ ...view, zoom: view.zoom - 0.4 })}
            style={controlButtonStyle}
          >
            Zoom out
          </button>
          <button
            type="button"
            data-interactive
            className="label-mono"
            onClick={() => applyView({ ...view, zoom: view.zoom + 0.4 })}
            style={controlButtonStyle}
          >
            Zoom in
          </button>
          <AudioToggle onToggle={setAudioEnabled} />
        </div>
      </div>
    </div>
  );
}

const controlButtonStyle: CSSProperties = {
  padding: "0.45rem 0.8rem",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  color: "var(--ink-secondary)",
};
