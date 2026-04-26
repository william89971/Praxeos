"use client";

import dynamic from "next/dynamic";
import { type CSSProperties, useEffect, useState } from "react";
import { DistortionSlider } from "./components/DistortionSlider";
import { ReducedMotionPoster } from "./components/ReducedMotionPoster";
import { StatePanel } from "./components/StatePanel";

const CoordinationEngineScene = dynamic(
  () =>
    import("./components/CoordinationEngineScene").then(
      (m) => m.CoordinationEngineScene,
    ),
  { ssr: false, loading: () => <ReducedMotionPoster /> },
);

const GUIDED_PRESETS: readonly { value: number; hold: number }[] = [
  { value: 0.05, hold: 4500 },
  { value: 0.32, hold: 4500 },
  { value: 0.6, hold: 4500 },
  { value: 0.9, hold: 4500 },
];

export default function CoordinationEngineSketch() {
  const [distortion, setDistortion] = useState(0);
  const [mode, setMode] = useState<"guided" | "explore">("guided");

  useEffect(() => {
    if (mode !== "guided") return;
    let i = 0;
    const tick = () => {
      const preset = GUIDED_PRESETS[i % GUIDED_PRESETS.length];
      if (!preset) return;
      setDistortion(preset.value);
      i++;
    };
    tick();
    const interval = window.setInterval(tick, 4500);
    return () => window.clearInterval(interval);
  }, [mode]);

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <p style={introStyle}>
        <em>
          Money is the shared signal layer of the economy. Move the slider and watch the
          network breathe — or stop breathing — together.
        </em>
      </p>
      <CoordinationEngineScene
        distortion={distortion}
        fallback={<ReducedMotionPoster />}
        overlay={
          <>
            <div style={topOverlayStyle}>
              <StatePanel distortion={distortion} mode={mode} onModeChange={setMode} />
            </div>
            <div style={bottomOverlayStyle}>
              <DistortionSlider
                value={distortion}
                onChange={(v) => {
                  if (mode === "guided") setMode("explore");
                  setDistortion(v);
                }}
              />
            </div>
          </>
        }
      />
    </div>
  );
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

const topOverlayStyle: CSSProperties = {
  position: "absolute",
  insetBlockStart: "1rem",
  insetInlineStart: "1rem",
  pointerEvents: "auto",
};

const bottomOverlayStyle: CSSProperties = {
  position: "absolute",
  insetBlockEnd: "1rem",
  insetInlineEnd: "1rem",
  insetInlineStart: "1rem",
  maxWidth: "min(56ch, calc(100% - 2rem))",
  marginInlineStart: "auto",
  pointerEvents: "auto",
};
