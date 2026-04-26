"use client";

import { ModuleHeroChrome } from "@/components/sketch/ModuleHeroChrome";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
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
  const prefersReducedMotion = usePrefersReducedMotion();
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

  if (prefersReducedMotion) {
    return <ReducedMotionPoster />;
  }

  return (
    <ModuleHeroChrome
      moduleNumber="04"
      edition="Fascicle I · 2026 Edition"
      eyebrow="Praxeos · No.4"
      bigTitle="Coordination Engine"
      quote="Each pulse arrives where it is meant to arrive. Coordination is invisible because it is working."
      attribution="Lachmann · 1986"
      scene={
        <CoordinationEngineScene
          distortion={distortion}
          fallback={<ReducedMotionPoster />}
        />
      }
      directionsSlot={
        <StatePanel distortion={distortion} mode={mode} onModeChange={setMode} />
      }
      controlSlot={
        <DistortionSlider
          value={distortion}
          onChange={(v) => {
            if (mode === "guided") setMode("explore");
            setDistortion(v);
          }}
        />
      }
    />
  );
}
