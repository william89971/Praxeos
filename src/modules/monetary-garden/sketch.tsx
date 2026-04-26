"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import dynamic from "next/dynamic";
import { type CSSProperties, useState } from "react";
import { ExplanationPanel } from "./components/ExplanationPanel";
import { MoneySlider } from "./components/MoneySlider";
import { ReducedMotionPoster } from "./components/ReducedMotionPoster";

const MonetaryGardenScene = dynamic(
  () => import("./components/MonetaryGardenScene").then((m) => m.MonetaryGardenScene),
  { ssr: false, loading: () => <ReducedMotionPoster /> },
);

export default function MonetaryGardenSketch() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [distortion, setDistortion] = useState(0.0);

  if (prefersReducedMotion) {
    return <ReducedMotionPoster />;
  }

  return (
    <div style={frameStyle}>
      <MonetaryGardenScene distortion={distortion} />

      {/* Cinematic title — sits in the upper-right corner of the frame, not duplicating the page hero. */}
      <div style={titleOverlayStyle} aria-hidden="true">
        <span className="label-mono" style={titleEyebrow}>
          Module 01 · Praxeos
        </span>
        <span style={titleStyle}>The Monetary Garden</span>
        <span style={titleSublineStyle}>A living model of monetary distortion</span>
      </div>

      <div style={overlayWrapperStyle}>
        <div style={topOverlayStyle}>
          <ExplanationPanel distortion={distortion} />
        </div>

        <div style={bottomOverlayStyle}>
          <MoneySlider value={distortion} onChange={setDistortion} />
        </div>
      </div>

      <div style={vignetteStyle} aria-hidden="true" />
    </div>
  );
}

const frameStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  height: "min(92vh, 900px)",
  background: "var(--paper-sunk)",
  borderBlock: "1px solid var(--rule)",
  overflow: "hidden",
};

const overlayWrapperStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "grid",
  gridTemplateRows: "auto 1fr auto",
  padding: "clamp(1rem, 2.5vw, 1.6rem)",
  pointerEvents: "none",
};

const topOverlayStyle: CSSProperties = {
  display: "flex",
  justifyContent: "flex-start",
  pointerEvents: "auto",
};

const bottomOverlayStyle: CSSProperties = {
  gridRow: 3,
  pointerEvents: "auto",
  maxWidth: "min(56ch, 100%)",
  marginInlineStart: "auto",
  marginInlineEnd: 0,
};

const titleOverlayStyle: CSSProperties = {
  position: "absolute",
  insetBlockStart: "clamp(1rem, 2.5vw, 1.6rem)",
  insetInlineEnd: "clamp(1rem, 2.5vw, 1.6rem)",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "0.35rem",
  textAlign: "right",
  pointerEvents: "none",
  textShadow: "0 1px 12px rgba(20, 17, 13, 0.35)",
};

const titleEyebrow: CSSProperties = {
  color: "color-mix(in oklab, var(--paper-elevated) 92%, transparent)",
  letterSpacing: "0.18em",
};

const titleStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontSize: "clamp(1.4rem, 2.8vw, 2.4rem)",
  lineHeight: 1.05,
  fontWeight: 400,
  color: "var(--ink-primary)",
};

const titleSublineStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "clamp(0.85rem, 1.2vw, 1rem)",
  color: "var(--ink-secondary)",
  fontStyle: "italic",
};

const vignetteStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  background:
    "radial-gradient(ellipse at center, transparent 55%, color-mix(in oklab, var(--paper-sunk) 70%, black 30%) 110%)",
  mixBlendMode: "multiply",
  opacity: 0.5,
};
