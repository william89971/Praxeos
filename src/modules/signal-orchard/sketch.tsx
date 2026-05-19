"use client";

import { MobileModuleActionBar } from "@/components/experience/MobileModuleActionBar";
import { ModuleChallengePanel } from "@/components/experience/ModuleChallengePanel";
import { OnboardingOverlay } from "@/components/experience/OnboardingOverlay";
import { ModuleHeroChrome } from "@/components/sketch/ModuleHeroChrome";
import { useModuleRuntime } from "@/hooks/useModuleRuntime";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import dynamic from "next/dynamic";
import { useState } from "react";
import { InteractionPanel } from "./components/InteractionPanel";
import { ReducedMotionPoster } from "./components/ReducedMotionPoster";
import type { ActionKind, ActiveAction } from "./lib/signals";
import { signalOrchardRuntime } from "./runtime";

const SignalOrchardScene = dynamic(
  () => import("./components/SignalOrchardScene").then((m) => m.SignalOrchardScene),
  { ssr: false, loading: () => <ReducedMotionPoster /> },
);

export default function SignalOrchardSketch() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const runtime = useModuleRuntime(signalOrchardRuntime);
  const mode = runtime.state.mode;
  const selectedAction = runtime.state.action;
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [actions, setActions] = useState<readonly ActiveAction[]>([]);

  const setMode = (nextMode: "guided" | "explore") => {
    runtime.updateState((current) => ({ ...current, mode: nextMode }), {
      eventName: "control_changed",
      payload: { control: "signal-mode", mode: nextMode },
    });
  };

  const setSelectedAction = (action: ActionKind) => {
    runtime.updateState((current) => ({ ...current, mode: "explore", action }), {
      eventName: "control_changed",
      payload: { control: "signal-action", action },
    });
  };

  if (prefersReducedMotion) {
    return <ReducedMotionPoster />;
  }

  const onSelect = (id: number) => {
    setActions((current) => [
      ...current,
      { originId: id, startedAt: performance.now() / 1000, kind: selectedAction },
    ]);
    runtime.updateState(
      (current) => ({
        ...current,
        mode: "explore",
        sentKinds: current.sentKinds.includes(selectedAction)
          ? current.sentKinds
          : [...current.sentKinds, selectedAction],
        tappedActors: current.tappedActors.includes(id)
          ? current.tappedActors
          : [...current.tappedActors, id],
      }),
      {
        eventName: "control_changed",
        payload: {
          control: "signal-actor",
          action: selectedAction,
          actorId: id,
        },
      },
    );
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
          selectedAction={selectedAction}
          hoveredId={hoveredId}
          onHover={setHoveredId}
          onSelect={onSelect}
          actionsQueue={actions}
          setActionsQueue={setActions}
          fallback={<ReducedMotionPoster />}
        />
      }
      taskSlot={
        <ModuleChallengePanel
          slug="signal-orchard"
          goals={runtime.goals}
          currentHint={runtime.currentHint}
          insight={runtime.insight}
          summaryRows={runtime.summaryRows}
          sourceLabel={runtime.sourceLabel}
        />
      }
      onboardingSlot={
        <OnboardingOverlay
          slug="signal-orchard"
          body="Pick Buy, Sell, Wait, or Discover, then tap any cypress actor in the scene."
        />
      }
      directionsSlot={
        <InteractionPanel
          mode={mode}
          onModeChange={setMode}
          hoveredId={hoveredId}
          recentActions={actions}
          selectedAction={selectedAction}
          onActionChange={setSelectedAction}
        />
      }
      controlSlot={null}
      mobileActionBar={
        <MobileModuleActionBar
          nextHref="/modules/monetary-garden?path=beginner"
          nextLabel="Next"
          controlsHref="#module-directions"
        />
      }
    />
  );
}
