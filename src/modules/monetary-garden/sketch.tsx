"use client";

import { MobileModuleActionBar } from "@/components/experience/MobileModuleActionBar";
import { ModuleChallengePanel } from "@/components/experience/ModuleChallengePanel";
import { OnboardingOverlay } from "@/components/experience/OnboardingOverlay";
import { ModuleHeroChrome } from "@/components/sketch/ModuleHeroChrome";
import { useModuleRuntime } from "@/hooks/useModuleRuntime";
import dynamic from "next/dynamic";
import { ExplanationPanel } from "./components/ExplanationPanel";
import { MoneyControls } from "./components/MoneySlider";
import { ReducedMotionPoster } from "./components/ReducedMotionPoster";
import type { GardenState } from "./lib/distortion";
import { monetaryGardenRuntime } from "./runtime";

const MonetaryGardenScene = dynamic(
  () => import("./components/MonetaryGardenScene").then((m) => m.MonetaryGardenScene),
  { ssr: false, loading: () => <ReducedMotionPoster /> },
);

export default function MonetaryGardenSketch() {
  const runtime = useModuleRuntime(monetaryGardenRuntime);
  const gardenState = runtime.state;

  const updateGardenState = (next: GardenState) => {
    runtime.updateState(next, {
      eventName: "control_changed",
      payload: {
        control: "monetary-garden-state",
        credit: next.credit,
        savings: next.savings,
        phase: next.phase,
      },
    });
  };

  return (
    <ModuleHeroChrome
      moduleNumber="01"
      edition="Fascicle I · 2026 Edition"
      eyebrow="Praxeos · No.1"
      bigTitle="Monetary Garden"
      quote="When the unit of account is itself a politically administered variable, every price quoted in it inherits the politics of its administration."
      attribution="Mises · 1912"
      scene={
        <MonetaryGardenScene state={gardenState} fallback={<ReducedMotionPoster />} />
      }
      taskSlot={
        <ModuleChallengePanel
          slug="monetary-garden"
          goals={runtime.goals}
          currentHint={runtime.currentHint}
          insight={runtime.insight}
          summaryRows={runtime.summaryRows}
          sourceLabel={runtime.sourceLabel}
        />
      }
      onboardingSlot={
        <OnboardingOverlay
          slug="monetary-garden"
          body="Start with the two sliders: raise credit, lower savings, then press Reveal correction."
        />
      }
      directionsSlot={<ExplanationPanel state={gardenState} />}
      controlSlot={<MoneyControls value={gardenState} onChange={updateGardenState} />}
      mobileActionBar={
        <MobileModuleActionBar
          nextHref="/labs/calculation-labyrinth?path=beginner"
          nextLabel="Next"
        />
      }
    />
  );
}
