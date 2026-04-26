"use client";

import { ModuleHeroChrome } from "@/components/sketch/ModuleHeroChrome";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import dynamic from "next/dynamic";
import { useState } from "react";
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
    <ModuleHeroChrome
      moduleNumber="01"
      edition="Fascicle I · 2026 Edition"
      eyebrow="Praxeos · No.1"
      bigTitle="Monetary Garden"
      quote="When the unit of account is itself a politically administered variable, every price quoted in it inherits the politics of its administration."
      attribution="Mises · 1912"
      scene={<MonetaryGardenScene distortion={distortion} />}
      directionsSlot={<ExplanationPanel distortion={distortion} />}
      controlSlot={<MoneySlider value={distortion} onChange={setDistortion} />}
    />
  );
}
