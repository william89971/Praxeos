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

const vignetteStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  background:
    "radial-gradient(ellipse at center, transparent 55%, color-mix(in oklab, var(--paper-sunk) 70%, black 30%) 110%)",
  mixBlendMode: "multiply",
  opacity: 0.5,
};
