"use client";

import { ModuleHeroChrome } from "@/components/sketch/ModuleHeroChrome";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import dynamic from "next/dynamic";
import { useState } from "react";
import { InteractionPanel } from "./components/InteractionPanel";
import { ReducedMotionPoster } from "./components/ReducedMotionPoster";
import type { ActiveAction } from "./lib/signals";

const SignalOrchardScene = dynamic(
  () => import("./components/SignalOrchardScene").then((m) => m.SignalOrchardScene),
  { ssr: false, loading: () => <ReducedMotionPoster /> },
);

export default function SignalOrchardSketch() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [mode, setMode] = useState<"guided" | "explore">("guided");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [actions, setActions] = useState<readonly ActiveAction[]>([]);

  if (prefersReducedMotion) {
    return <ReducedMotionPoster />;
  }

  const onSelect = (id: number) => {
    if (mode === "guided") setMode("explore");
    setActions([...actions, { originId: id, startedAt: performance.now() / 1000 }]);
  };

  return (
    <ModuleHeroChrome
      moduleNumber="02"
      edition="Fascicle I · 2026 Edition"
      eyebrow="Praxeos · No.2"
      bigTitle="Signal Orchard"
      quote="The most significant fact about this system is the economy of knowledge with which it operates — how little the individual participants need to know in order to take the right action."
      attribution="Hayek · 1945"
      scene={
        <SignalOrchardScene
          mode={mode}
          hoveredId={hoveredId}
          onHover={setHoveredId}
          onSelect={onSelect}
          actionsQueue={actions}
          setActionsQueue={setActions}
          fallback={<ReducedMotionPoster />}
        />
      }
      directionsSlot={
        <InteractionPanel
          mode={mode}
          onModeChange={setMode}
          hoveredId={hoveredId}
          recentActionCount={actions.length}
        />
      }
      controlSlot={null}
    />
  );
}
