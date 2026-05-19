"use client";

import { MobileModuleActionBar } from "@/components/experience/MobileModuleActionBar";
import { ModuleChallengePanel } from "@/components/experience/ModuleChallengePanel";
import { OnboardingOverlay } from "@/components/experience/OnboardingOverlay";
import { ModuleHeroChrome } from "@/components/sketch/ModuleHeroChrome";
import { useModuleRuntime } from "@/hooks/useModuleRuntime";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { CoordinationControls } from "./components/DistortionSlider";
import { ReducedMotionPoster } from "./components/ReducedMotionPoster";
import { StatePanel } from "./components/StatePanel";
import type { CoordMode, CoordPulse, CoordState } from "./lib/distortion";
import { coordinationEngineRuntime } from "./runtime";

const CoordinationEngineScene = dynamic(
  () =>
    import("./components/CoordinationEngineScene").then(
      (m) => m.CoordinationEngineScene,
    ),
  { ssr: false, loading: () => <ReducedMotionPoster /> },
);

const GUIDED_PRESETS: readonly { reliability: number; latency: number }[] = [
  { reliability: 0.92, latency: 0.08 },
  { reliability: 0.74, latency: 0.28 },
  { reliability: 0.54, latency: 0.48 },
  { reliability: 0.36, latency: 0.72 },
];

export default function CoordinationEngineSketch() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const runtime = useModuleRuntime(coordinationEngineRuntime);
  const updateRuntimeState = runtime.updateState;
  const mode = runtime.state.mode;
  const coordState: CoordState = {
    reliability: runtime.state.reliability,
    latency: runtime.state.latency,
    shock: runtime.state.shock,
  };
  const [pulse, setPulse] = useState<CoordPulse | undefined>();

  const updateState = (nextState: CoordState) => {
    updateRuntimeState(
      (state) => ({
        ...state,
        mode: "explore",
        reliability: nextState.reliability,
        latency: nextState.latency,
        shock: state.shock,
      }),
      {
        eventName: "control_changed",
        payload: {
          control: "coordination-state",
          reliability: nextState.reliability,
          latency: nextState.latency,
        },
      },
    );
  };

  const handleModeChange = (nextMode: CoordMode) => {
    updateRuntimeState((state) => ({ ...state, mode: nextMode }), {
      eventName: "control_changed",
      payload: { control: "coordination-mode", mode: nextMode },
    });
  };

  const injectShock = () => {
    updateRuntimeState((state) => ({ ...state, mode: "explore", shock: 1 }), {
      eventName: "control_changed",
      payload: { control: "coordination-shock" },
    });
  };

  const pulseNode = (nodeId: number) => {
    const kind = nodeId % 2 === 0 ? "demand" : "supply";
    setPulse((current) => ({ nodeId, kind, nonce: (current?.nonce ?? 0) + 1 }));
    injectShock();
  };

  useEffect(() => {
    if (mode !== "guided") return;
    let i = 0;
    const tick = () => {
      const preset = GUIDED_PRESETS[i % GUIDED_PRESETS.length];
      if (!preset) return;
      updateRuntimeState(
        (current) => ({
          ...current,
          reliability: preset.reliability,
          latency: preset.latency,
          shock: 0,
        }),
        { syncUrl: false },
      );
      i++;
    };
    tick();
    const interval = window.setInterval(tick, 4500);
    return () => window.clearInterval(interval);
  }, [mode, updateRuntimeState]);

  useEffect(() => {
    if (runtime.state.shock <= 0.01) return;
    const timeout = window.setTimeout(() => {
      updateRuntimeState(
        (current) => ({
          ...current,
          shock: Math.max(0, current.shock - 0.08),
        }),
        { syncUrl: false },
      );
    }, 120);
    return () => window.clearTimeout(timeout);
  }, [runtime.state.shock, updateRuntimeState]);

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
          state={coordState}
          pulse={pulse}
          onNodePulse={pulseNode}
          fallback={<ReducedMotionPoster />}
        />
      }
      taskSlot={
        <ModuleChallengePanel
          slug="coordination-engine"
          goals={runtime.goals}
          currentHint={runtime.currentHint}
          insight={runtime.insight}
          summaryRows={runtime.summaryRows}
          sourceLabel={runtime.sourceLabel}
        />
      }
      onboardingSlot={
        <OnboardingOverlay
          slug="coordination-engine"
          body="Press Inject shock, then tune Reliability and Latency until coherence recovers."
        />
      }
      directionsSlot={
        <StatePanel
          state={coordState}
          pulse={pulse}
          mode={mode}
          onModeChange={handleModeChange}
        />
      }
      controlSlot={
        <CoordinationControls
          value={coordState}
          onChange={updateState}
          onInjectShock={injectShock}
        />
      }
      mobileActionBar={
        <MobileModuleActionBar nextHref="/#beginner-path" nextLabel="Done" />
      }
    />
  );
}
