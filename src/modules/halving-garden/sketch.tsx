"use client";

import { PosterFallback } from "@/components/sketch/PosterFallback";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { AudioToggle } from "./components/AudioToggle";
import { HilbertField } from "./components/HilbertField";
import { M2Meter } from "./components/M2Meter";
import { EPOCHS, getEpoch } from "./lib/epochs";
import { computePanels } from "./lib/layout";
import { useLiveBlocks } from "./lib/useLiveBlocks";
import {
  type GardenView,
  WORLD_HEIGHT,
  WORLD_TOP_PADDING,
  WORLD_WIDTH,
  clampView,
} from "./lib/viewport";

const DEFAULT_VIEW: GardenView = {
  zoom: 0.45,
  centerX: WORLD_WIDTH / 2,
  centerY: WORLD_HEIGHT / 2,
};

const PANELS = computePanels(
  WORLD_WIDTH,
  WORLD_HEIGHT,
  WORLD_TOP_PADDING,
  EPOCHS.length,
);

const canBakeLocally = process.env.NODE_ENV === "development";

type Mode = "guided" | "explore";

type FocusPreset =
  | { kind: "overview"; zoom: number }
  | { kind: "epoch"; epochIndex: number; zoom: number }
  | { kind: "boundary"; leftEpochIndex: number; rightEpochIndex: number; zoom: number };

type TourStep = {
  id: string;
  label: string;
  title: string;
  body: string;
  focus: FocusPreset;
};

const TOUR_STEPS: readonly TourStep[] = [
  {
    id: "field",
    label: "1. What is this?",
    title: "A block history you can move through",
    body: "Each mark in the garden stands for one Bitcoin block. The field keeps the blocks in order, then groups them into halving eras so the monetary schedule becomes visible.",
    focus: { kind: "overview", zoom: 0.1 },
  },
  {
    id: "block",
    label: "2. What is a block?",
    title: "A block is one confirmed batch of transactions",
    body: "Roughly every ten minutes the network confirms a new block. In this module, new arrivals glow first and then settle into the manuscript as part of the permanent record.",
    focus: { kind: "epoch", epochIndex: 4, zoom: 0.8 },
  },
  {
    id: "halving",
    label: "3. What changes at a halving?",
    title: "The new-coin reward gets cut in half",
    body: "Every 210,000 blocks, Bitcoin reduces the block subsidy. The garden is divided into eras because each halving changes how quickly new coins enter circulation.",
    focus: { kind: "boundary", leftEpochIndex: 3, rightEpochIndex: 4, zoom: 0.25 },
  },
  {
    id: "why",
    label: "4. Why people care",
    title: "The schedule is fixed before the day arrives",
    body: "No committee votes on these drops. Bitcoin treats issuance as a rule to be discovered on-chain, not a policy choice to be revised later.",
    focus: { kind: "epoch", epochIndex: 4, zoom: 0.55 },
  },
] as const;

const EPOCH_SUMMARIES: readonly string[] = [
  "50 BTC per block. The network is tiny, experimental, and visibly sparse.",
  "25 BTC per block. The first halving proves the schedule is not just theory.",
  "12.5 BTC per block. Bitcoin starts to look less like a curiosity and more like a monetary asset.",
  "6.25 BTC per block. Adoption broadens while issuance keeps shrinking on schedule.",
  "3.125 BTC per block. This is the live era: fresh blocks arrive here first, then settle into the field.",
] as const;

const FACT_CHIPS = [
  "1 block = one confirmed batch",
  "1 halving = 210,000 blocks",
  "Supply reward keeps falling",
] as const;

type ViewportSize = {
  width: number;
  height: number;
};

export default function HalvingGardenSketch() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { blocks, newest, source } = useLiveBlocks(18);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [view, setView] = useState<GardenView>(DEFAULT_VIEW);
  const [mode, setMode] = useState<Mode>("guided");
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeEpochIndex, setActiveEpochIndex] = useState(EPOCHS.length - 1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [viewport, setViewport] = useState<ViewportSize>({ width: 1, height: 1 });
  const containerRef = useRef<HTMLDivElement>(null);
  // Set only by the AudioToggle click handler (a user gesture), so the
  // Web Audio API will allow playback on Safari/Chrome.
  const audioContextRef = useRef<AudioContext | null>(null);
  const bakedHeightRef = useRef<number | null>(null);
  const heardHeightRef = useRef<number | null>(null);

  const activeStep = getRequiredItem(TOUR_STEPS, activeStepIndex, "tour step");
  const latestEpochIndex = newest ? getEpoch(newest.height).index : EPOCHS.length - 1;
  const activeEpoch = getRequiredItem(EPOCHS, activeEpochIndex, "epoch");

  const handleAudioToggle = (enabled: boolean, ctx: AudioContext | null) => {
    audioContextRef.current = ctx;
    setAudioEnabled(enabled);
  };

  const applyView = (next: GardenView) => {
    setView(clampView(next, viewport.width, viewport.height));
  };

  const jumpToPreset = (preset: FocusPreset) => {
    if (viewport.width <= 1 || viewport.height <= 1) return;
    applyView(viewForPreset(preset, viewport));
  };

  const jumpToEpoch = (epochIndex: number, zoom = 0.55) => {
    setMode("explore");
    setActiveEpochIndex(epochIndex);
    jumpToPreset({ kind: "epoch", epochIndex, zoom });
  };

  const resetCamera = () => {
    if (mode === "guided" && activeStep) {
      jumpToPreset(activeStep.focus);
      return;
    }
    applyView(DEFAULT_VIEW);
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
    if (viewport.width <= 1 || viewport.height <= 1) return;
    if (mode !== "guided" || !activeStep) return;
    setView(viewForPreset(activeStep.focus, viewport));
    if (activeStep.focus.kind === "epoch") {
      setActiveEpochIndex(activeStep.focus.epochIndex);
    }
    if (activeStep.focus.kind === "boundary") {
      setActiveEpochIndex(activeStep.focus.rightEpochIndex);
    }
  }, [activeStep, mode, viewport]);

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

    // If the toggle is on but the AudioContext has not been created yet
    // (e.g. first load after a prior session persisted enabled=true),
    // skip this tick — the user needs to click Audio once to give us a
    // gesture. No silent failures, no auto-resume from a timer.
    const context = audioContextRef.current;
    if (!context) return;
    if (context.state === "suspended") {
      void context.resume();
    }
    if (context.state !== "running") return;

    heardHeightRef.current = newest.height;

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

  // Sketch-level cleanup: close any AudioContext when the page unmounts.
  useEffect(() => {
    return () => {
      audioContextRef.current?.close().catch(() => {
        /* already closed */
      });
      audioContextRef.current = null;
    };
  }, []);

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
        <HilbertField
          blocks={blocks}
          view={view}
          onViewChange={applyView}
          width={viewport.width}
          height={viewport.height}
        />
        {showAdvanced ? <M2Meter /> : null}

        <section
          aria-label="Halving Garden guide"
          className="label-mono"
          style={guidePanelStyle}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ color: "var(--ink-secondary)" }}>
              {mode === "guided" ? "Start here" : "Explore mode"}
            </div>
            <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
              <button
                type="button"
                data-interactive
                className="label-mono"
                onClick={() => setMode("guided")}
                style={toggleButtonStyle(mode === "guided")}
              >
                Guided
              </button>
              <button
                type="button"
                data-interactive
                className="label-mono"
                onClick={() => setMode("explore")}
                style={toggleButtonStyle(mode === "explore")}
              >
                Explore
              </button>
            </div>
          </div>

          {mode === "guided" ? (
            <>
              <div
                style={{
                  marginTop: "0.55rem",
                  color: "var(--ink-primary)",
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.15rem, 2vw, 1.45rem)",
                  lineHeight: 1.1,
                }}
              >
                {activeStep.title}
              </div>
              <p
                style={{
                  margin: "0.65rem 0 0",
                  color: "var(--ink-secondary)",
                  fontFamily: "var(--font-serif)",
                  fontSize: "var(--step--1)",
                  lineHeight: 1.55,
                }}
              >
                {activeStep.body}
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.45rem",
                  marginTop: "0.8rem",
                }}
              >
                {FACT_CHIPS.map((fact) => (
                  <span key={fact} style={factChipStyle}>
                    {fact}
                  </span>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.45rem",
                  marginTop: "0.9rem",
                }}
              >
                {TOUR_STEPS.map((step, index) => (
                  <button
                    key={step.id}
                    type="button"
                    data-interactive
                    className="label-mono"
                    onClick={() => {
                      setMode("guided");
                      setActiveStepIndex(index);
                    }}
                    style={stepButtonStyle(index === activeStepIndex)}
                  >
                    {step.label}
                  </button>
                ))}
              </div>

              <div
                style={{
                  marginTop: "0.95rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ color: "var(--ink-tertiary)" }}>
                  Live source: {formatSource(source)}
                  {newest ? ` · Tracking block ${newest.height}` : ""}
                </div>
                <button
                  type="button"
                  data-interactive
                  className="label-mono"
                  onClick={() =>
                    setActiveStepIndex((current) => (current + 1) % TOUR_STEPS.length)
                  }
                  style={controlButtonStyle}
                >
                  Next stop
                </button>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  marginTop: "0.55rem",
                  color: "var(--ink-primary)",
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.15rem, 2vw, 1.45rem)",
                  lineHeight: 1.1,
                }}
              >
                {activeEpoch?.label} era
              </div>
              <p
                style={{
                  margin: "0.65rem 0 0",
                  color: "var(--ink-secondary)",
                  fontFamily: "var(--font-serif)",
                  fontSize: "var(--step--1)",
                  lineHeight: 1.55,
                }}
              >
                {activeEpoch ? EPOCH_SUMMARIES[activeEpoch.index] : null}
              </p>
              {activeEpoch ? (
                <div style={{ marginTop: "0.8rem", color: "var(--ink-tertiary)" }}>
                  {activeEpoch.startDate} to {activeEpoch.endDate} ·{" "}
                  {activeEpoch.subsidy} BTC per block
                </div>
              ) : null}
              <div style={{ marginTop: "0.4rem", color: "var(--ink-tertiary)" }}>
                Live source: {formatSource(source)}
                {newest ? ` · Newest block tracked: ${newest.height}` : ""}
              </div>
              <div
                style={{
                  marginTop: "0.95rem",
                  display: "flex",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  data-interactive
                  className="label-mono"
                  onClick={() => {
                    setMode("guided");
                    setActiveStepIndex(0);
                  }}
                  style={controlButtonStyle}
                >
                  Restart tour
                </button>
                <button
                  type="button"
                  data-interactive
                  className="label-mono"
                  onClick={() => jumpToEpoch(latestEpochIndex, 0.75)}
                  style={controlButtonStyle}
                >
                  Focus today
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      <div
        aria-label="Halving era timeline"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "0.75rem",
          paddingInline: "var(--gutter-inline)",
        }}
      >
        {EPOCHS.map((epoch) => {
          const selected = activeEpochIndex === epoch.index;
          return (
            <button
              key={epoch.index}
              type="button"
              data-interactive
              onClick={() =>
                jumpToEpoch(epoch.index, epoch.index === latestEpochIndex ? 0.75 : 0.55)
              }
              style={epochCardStyle(selected)}
            >
              <div
                className="label-mono"
                style={{
                  color: selected ? "var(--ink-primary)" : "var(--ink-tertiary)",
                }}
              >
                Era {epoch.roman}
              </div>
              <div
                style={{
                  marginTop: "0.35rem",
                  fontFamily: "var(--font-display)",
                  fontSize: "1.05rem",
                  color: "var(--ink-primary)",
                }}
              >
                {epoch.label}
              </div>
              <div
                className="label-mono"
                style={{ marginTop: "0.45rem", color: "var(--accent-action)" }}
              >
                {epoch.subsidy} BTC reward
              </div>
              <div
                className="label-mono"
                style={{ marginTop: "0.35rem", color: "var(--ink-tertiary)" }}
              >
                {epoch.startDate} to {epoch.endDate}
              </div>
            </button>
          );
        })}
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
        <div
          className="label-mono"
          style={{ color: "var(--ink-tertiary)", maxWidth: "58ch" }}
        >
          {mode === "guided"
            ? "Use Guided mode for the basic questions first, then jump across eras to compare how the reward changes over time."
            : canBakeLocally
              ? "Drag to pan. Scroll to zoom. New blocks glow before they bake into the local tile field."
              : "Drag to pan. Scroll to zoom. New blocks glow live over the manuscript field."}
        </div>
        <div
          style={{
            display: "flex",
            gap: "0.65rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            data-interactive
            className="label-mono"
            onClick={() => setShowAdvanced((current) => !current)}
            style={toggleButtonStyle(showAdvanced)}
          >
            {showAdvanced ? "Hide live metrics" : "Show live metrics"}
          </button>
          <button
            type="button"
            data-interactive
            className="label-mono"
            onClick={resetCamera}
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
          <AudioToggle onToggle={handleAudioToggle} />
        </div>
      </div>
    </div>
  );
}

function viewForPreset(preset: FocusPreset, viewport: ViewportSize): GardenView {
  if (preset.kind === "overview") {
    return clampView(
      {
        zoom: preset.zoom,
        centerX: WORLD_WIDTH / 2,
        centerY: WORLD_TOP_PADDING + (WORLD_HEIGHT - WORLD_TOP_PADDING) * 0.52,
      },
      viewport.width,
      viewport.height,
    );
  }

  if (preset.kind === "epoch") {
    const panel = PANELS[preset.epochIndex] ?? PANELS[PANELS.length - 1];
    return clampView(
      {
        zoom: preset.zoom,
        centerX: panel ? panel.x + panel.width / 2 : WORLD_WIDTH / 2,
        centerY: panel ? panel.y + panel.height * 0.52 : WORLD_HEIGHT / 2,
      },
      viewport.width,
      viewport.height,
    );
  }

  const leftPanel = PANELS[preset.leftEpochIndex] ?? PANELS[0];
  const rightPanel = PANELS[preset.rightEpochIndex] ?? PANELS[PANELS.length - 1];
  const leftCenter = leftPanel ? leftPanel.x + leftPanel.width / 2 : WORLD_WIDTH / 2;
  const rightCenter = rightPanel
    ? rightPanel.x + rightPanel.width / 2
    : WORLD_WIDTH / 2;
  const centerY = rightPanel
    ? rightPanel.y + rightPanel.height * 0.52
    : WORLD_HEIGHT / 2;

  return clampView(
    {
      zoom: preset.zoom,
      centerX: (leftCenter + rightCenter) / 2,
      centerY,
    },
    viewport.width,
    viewport.height,
  );
}

function formatSource(source: "websocket" | "polling" | "fallback") {
  if (source === "websocket") return "websocket";
  if (source === "polling") return "polling";
  return "fallback feed";
}

function getRequiredItem<T>(items: readonly T[], index: number, label: string): T {
  const direct = items[index];
  if (direct !== undefined) return direct;
  const first = items[0];
  if (first !== undefined) return first;
  throw new Error(`Missing ${label}`);
}

const guidePanelStyle: CSSProperties = {
  position: "absolute",
  insetBlockStart: "1rem",
  insetInlineStart: "1rem",
  padding: "0.85rem 1rem",
  background: "var(--paper-elevated)",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  backdropFilter: "blur(8px)",
  maxWidth: "42ch",
  zIndex: 1,
};

const factChipStyle: CSSProperties = {
  padding: "0.28rem 0.55rem",
  border: "1px solid var(--rule)",
  borderRadius: "999px",
  color: "var(--ink-secondary)",
};

const controlButtonStyle: CSSProperties = {
  padding: "0.45rem 0.8rem",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  color: "var(--ink-secondary)",
  background: "transparent",
};

function toggleButtonStyle(active: boolean): CSSProperties {
  return {
    ...controlButtonStyle,
    color: active ? "var(--ink-primary)" : "var(--ink-secondary)",
    background: active ? "var(--paper)" : "transparent",
    borderColor: active ? "var(--ink-secondary)" : "var(--rule)",
  };
}

function stepButtonStyle(active: boolean): CSSProperties {
  return {
    ...controlButtonStyle,
    padding: "0.35rem 0.6rem",
    color: active ? "var(--ink-primary)" : "var(--ink-tertiary)",
    background: active ? "rgba(216, 207, 190, 0.35)" : "transparent",
  };
}

function epochCardStyle(active: boolean): CSSProperties {
  return {
    textAlign: "left",
    padding: "0.85rem 0.9rem",
    border: "1px solid var(--rule)",
    borderRadius: "var(--radius-sm)",
    background: active ? "rgba(216, 207, 190, 0.24)" : "var(--paper-elevated)",
    boxShadow: active ? "0 10px 24px rgba(92, 83, 72, 0.08)" : "none",
  };
}
