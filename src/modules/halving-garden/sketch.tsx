"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import dynamic from "next/dynamic";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { AudioToggle } from "./components/AudioToggle";
import { EpochInfoPanel } from "./components/EpochInfoPanel";
import { GuidedTimeline } from "./components/GuidedTimeline";
import { type GardenMode, ModeToggle } from "./components/ModeToggle";
import { ReducedMotionPoster } from "./components/ReducedMotionPoster";
import { type FocusKind, TOUR_STEPS } from "./lib/cameraPresets";
import { EPOCHS, getEpoch } from "./lib/epochs";
import { useLiveBlocks } from "./lib/useLiveBlocks";

const HalvingGarden3D = dynamic(
  () => import("./components/HalvingGarden3D").then((m) => m.HalvingGarden3D),
  { ssr: false, loading: () => <ReducedMotionPoster /> },
);

export default function HalvingGardenSketch() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { blocks, newest, source } = useLiveBlocks(18);

  const [mode, setMode] = useState<GardenMode>("guided");
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeEpochIndex, setActiveEpochIndex] = useState(EPOCHS.length - 1);
  const [hoveredEpochIndex, setHoveredEpochIndex] = useState<number | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const heardHeightRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioEnabled || !newest || heardHeightRef.current === newest.height) return;
    const ctx = audioContextRef.current;
    if (!ctx) return;
    if (ctx.state === "suspended") void ctx.resume();
    if (ctx.state !== "running") return;
    heardHeightRef.current = newest.height;
    const startAt = ctx.currentTime + 0.02;
    const frequencies = [220, 330, 440];
    for (const [index, frequency] of frequencies.entries()) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = frequency + (newest.height % 17) * 2;
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(0.02, startAt + 0.04 + index * 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.32 + index * 0.03);
      osc.connect(gain).connect(ctx.destination);
      osc.start(startAt + index * 0.02);
      osc.stop(startAt + 0.42 + index * 0.03);
    }
  }, [audioEnabled, newest]);

  useEffect(() => {
    return () => {
      audioContextRef.current?.close().catch(() => {});
      audioContextRef.current = null;
    };
  }, []);

  const liveEpochIndex = newest ? getEpoch(newest.height).index : null;
  const focus: FocusKind = (() => {
    if (mode === "guided") {
      const step = TOUR_STEPS[activeStepIndex];
      return step?.focus ?? { kind: "overview" };
    }
    return { kind: "epoch", epochIndex: activeEpochIndex };
  })();

  const dossierIndex =
    mode === "guided" ? guidedDossier(activeStepIndex) : activeEpochIndex;

  if (prefersReducedMotion) {
    return <ReducedMotionPoster />;
  }

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <p style={introStyle}>
        <em>
          Move through Bitcoin's monetary epochs. Each threshold cuts new issuance in
          half.
        </em>
      </p>

      <div style={canvasFrameStyle}>
        <HalvingGarden3D
          mode={mode}
          focus={focus}
          blocks={blocks}
          newest={newest}
          liveEpochIndex={liveEpochIndex}
          onHoverEpoch={(info) => setHoveredEpochIndex(info?.epochIndex ?? null)}
          onSelectEpoch={({ epochIndex }) => {
            setMode("explore");
            setActiveEpochIndex(epochIndex);
          }}
        />

        <header style={headerStyle}>
          <div className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
            {mode === "guided" ? "Guided tour" : "Free exploration"}
          </div>
          <ModeToggle mode={mode} onChange={setMode} />
        </header>

        <EpochInfoPanel
          epochIndex={hoveredEpochIndex ?? dossierIndex}
          tipHeight={newest?.height ?? null}
        />
      </div>

      {mode === "guided" ? (
        <GuidedTimeline
          steps={TOUR_STEPS}
          activeIndex={activeStepIndex}
          onSelect={setActiveStepIndex}
          onNext={() =>
            setActiveStepIndex((current) => (current + 1) % TOUR_STEPS.length)
          }
        />
      ) : (
        <ExploreTimeline
          activeEpochIndex={activeEpochIndex}
          onSelectEpoch={setActiveEpochIndex}
        />
      )}

      <footer style={footerStyle}>
        <div
          className="label-mono"
          style={{ color: "var(--ink-tertiary)", maxWidth: "62ch" }}
        >
          {mode === "guided"
            ? "Walk through the four stops, then switch to Explore for free movement."
            : "Drag to orbit. Scroll to dolly. Click an era card to glide there."}
          {newest
            ? ` · Live source: ${formatSource(source)} · Block ${newest.height}`
            : ""}
        </div>
        <AudioToggle
          onToggle={(enabled, ctx) => {
            audioContextRef.current = ctx;
            setAudioEnabled(enabled);
          }}
        />
      </footer>
    </div>
  );
}

function guidedDossier(stepIndex: number): number {
  const step = TOUR_STEPS[stepIndex];
  if (!step) return EPOCHS.length - 1;
  if (step.focus.kind === "epoch") return step.focus.epochIndex;
  if (step.focus.kind === "boundary") return step.focus.leftEpochIndex + 1;
  return EPOCHS.length - 1;
}

function ExploreTimeline({
  activeEpochIndex,
  onSelectEpoch,
}: {
  readonly activeEpochIndex: number;
  readonly onSelectEpoch: (index: number) => void;
}) {
  return (
    <div
      aria-label="Halving era timeline"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
        gap: "0.75rem",
      }}
    >
      {EPOCHS.map((epoch) => {
        const selected = activeEpochIndex === epoch.index;
        return (
          <button
            key={epoch.index}
            type="button"
            data-interactive
            onClick={() => onSelectEpoch(epoch.index)}
            style={epochCardStyle(selected)}
          >
            <div
              className="label-mono"
              style={{ color: selected ? "var(--ink-primary)" : "var(--ink-tertiary)" }}
            >
              Era {epoch.roman}
            </div>
            <div
              style={{
                marginTop: "0.35rem",
                fontFamily: "var(--font-serif)",
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
              {epoch.startDate} → {epoch.endDate}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function formatSource(source: "websocket" | "polling" | "fallback"): string {
  if (source === "websocket") return "websocket";
  if (source === "polling") return "polling";
  return "fallback feed";
}

const introStyle: CSSProperties = {
  margin: 0,
  paddingInline: "var(--gutter-inline)",
  maxWidth: "var(--measure-narrow)",
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-0)",
  lineHeight: 1.5,
  color: "var(--ink-secondary)",
};

const canvasFrameStyle: CSSProperties = {
  position: "relative",
  height: "min(78vh, 720px)",
  background: "var(--paper-sunk)",
  borderBlock: "1px solid var(--rule)",
  overflow: "hidden",
};

const headerStyle: CSSProperties = {
  position: "absolute",
  insetBlockStart: "1rem",
  insetInlineStart: "1rem",
  insetInlineEnd: "1rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "0.75rem",
  flexWrap: "wrap",
  padding: "0.55rem 0.85rem",
  background: "color-mix(in oklab, var(--paper-elevated) 82%, transparent)",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  zIndex: 2,
};

const footerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  flexWrap: "wrap",
  paddingInline: "var(--gutter-inline)",
};

function epochCardStyle(active: boolean): CSSProperties {
  return {
    textAlign: "left",
    padding: "0.85rem 0.9rem",
    border: `1px solid ${active ? "var(--ink-secondary)" : "var(--rule)"}`,
    borderRadius: "var(--radius-sm)",
    background: active ? "var(--accent-bitcoin-wash)" : "var(--paper-elevated)",
    boxShadow: active ? "var(--shadow-lift)" : "var(--shadow-sheet)",
    transition:
      "background var(--dur-micro) var(--ease-organic), box-shadow var(--dur-std) var(--ease-organic)",
    cursor: "pointer",
  };
}
