"use client";

import { ModuleHeroChrome } from "@/components/sketch/ModuleHeroChrome";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import dynamic from "next/dynamic";
import { useState } from "react";
import { ModeToggle } from "./components/ModeToggle";
import { ReducedMotionPoster } from "./components/ReducedMotionPoster";

const LabyrinthScene = dynamic(
  () => import("./components/LabyrinthScene").then((m) => m.LabyrinthScene),
  { ssr: false, loading: () => <ReducedMotionPoster /> },
);

export default function CalculationLabyrinthSketch() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [priced, setPriced] = useState(true);

  if (prefersReducedMotion) {
    return <ReducedMotionPoster />;
  }

  return (
    <ModuleHeroChrome
      moduleNumber="03"
      edition="Fascicle I · 2026 Edition"
      eyebrow="Praxeos · No.3"
      bigTitle="Calculation Labyrinth"
      quote="Where there is no free market, there is no pricing mechanism; without a pricing mechanism, there is no economic calculation."
      attribution="Mises · 1920"
      scene={<LabyrinthScene priced={priced} fallback={<ReducedMotionPoster />} />}
      directionsSlot={<ModeToggle priced={priced} onChange={setPriced} />}
      controlSlot={null}
    />
  );
}
