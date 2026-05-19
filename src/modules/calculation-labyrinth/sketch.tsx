"use client";

import { MobileModuleActionBar } from "@/components/experience/MobileModuleActionBar";
import { ModuleChallengePanel } from "@/components/experience/ModuleChallengePanel";
import { OnboardingOverlay } from "@/components/experience/OnboardingOverlay";
import { ModuleHeroChrome } from "@/components/sketch/ModuleHeroChrome";
import { useModuleRuntime } from "@/hooks/useModuleRuntime";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo } from "react";
import { ModeToggle } from "./components/ModeToggle";
import { ReducedMotionPoster } from "./components/ReducedMotionPoster";
import {
  type Direction,
  buildMaze,
  cellKey,
  directionToNextPathCell,
  legalMoves,
  moveCell,
} from "./lib/labyrinthLayout";
import {
  calculationLabyrinthRuntime,
  seedForChallenge,
  startCellForChallenge,
} from "./runtime";

const LabyrinthScene = dynamic(
  () => import("./components/LabyrinthScene").then((m) => m.LabyrinthScene),
  { ssr: false, loading: () => <ReducedMotionPoster /> },
);

export default function CalculationLabyrinthSketch() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const runtime = useModuleRuntime(calculationLabyrinthRuntime);
  const updateRuntimeState = runtime.updateState;
  const { priced, challenge, current, waste } = runtime.state;
  const maze = useMemo(() => buildMaze(seedForChallenge(challenge)), [challenge]);

  const setPriced = (next: boolean) => {
    updateRuntimeState((state) => ({ ...state, priced: next }), {
      eventName: "control_changed",
      payload: { control: "calculation-priced", priced: next },
    });
  };

  const reset = () => {
    updateRuntimeState(
      (state) => ({
        ...state,
        current: startCellForChallenge(state.challenge),
        waste: 0,
      }),
      {
        eventName: "control_changed",
        payload: { control: "calculation-reset" },
      },
    );
  };

  const newChallenge = () => {
    const next = challenge + 1;
    updateRuntimeState(
      (state) => ({
        ...state,
        challenge: next,
        current: startCellForChallenge(next),
        waste: 0,
      }),
      {
        eventName: "control_changed",
        payload: { control: "calculation-new-challenge", challenge: next },
      },
    );
  };

  const handleMove = useCallback(
    (direction: Direction) => {
      const legal = legalMoves(maze, current);
      if (!legal.includes(direction)) {
        updateRuntimeState((state) => ({ ...state, waste: state.waste + 2 }), {
          eventName: "control_changed",
          payload: { control: "calculation-move", direction, legal: false },
        });
        return;
      }

      const next = moveCell(current, direction);
      const best = directionToNextPathCell(maze, current);
      const nextKey = cellKey(next);
      const currentPathIndex = maze.pathCells.findIndex(
        (cell) => cellKey(cell) === cellKey(current),
      );
      const nextPathIndex = maze.pathCells.findIndex(
        (cell) => cellKey(cell) === nextKey,
      );
      const badStep = best !== direction || nextPathIndex <= currentPathIndex;
      const wasteDelta = badStep ? (priced ? 1 : 3) : priced ? 0 : 1;

      updateRuntimeState(
        (state) => ({
          ...state,
          current: next,
          waste: state.waste + wasteDelta,
        }),
        {
          eventName: "control_changed",
          payload: {
            control: "calculation-move",
            direction,
            legal: true,
            wasteDelta,
          },
        },
      );
    },
    [current, maze, priced, updateRuntimeState],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: "N",
        ArrowRight: "E",
        ArrowDown: "S",
        ArrowLeft: "W",
      };
      const direction = map[event.key];
      if (!direction) return;
      event.preventDefault();
      handleMove(direction);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleMove]);

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
      scene={
        <LabyrinthScene
          priced={priced}
          current={current}
          challenge={challenge}
          fallback={<ReducedMotionPoster />}
        />
      }
      taskSlot={
        <ModuleChallengePanel
          slug="calculation-labyrinth"
          goals={runtime.goals}
          currentHint={runtime.currentHint}
          insight={runtime.insight}
          summaryRows={runtime.summaryRows}
          sourceLabel={runtime.sourceLabel}
        />
      }
      onboardingSlot={
        <OnboardingOverlay
          slug="calculation-labyrinth"
          body="Use the move buttons first with Prices on. Then switch to No prices and feel the difference."
        />
      }
      directionsSlot={
        <ModeToggle
          priced={priced}
          onPricedChange={setPriced}
          maze={maze}
          current={current}
          waste={waste}
          onMove={handleMove}
          onReset={reset}
          onNewChallenge={newChallenge}
        />
      }
      controlSlot={null}
      mobileActionBar={
        <MobileModuleActionBar
          nextHref="/modules/coordination-engine?path=beginner"
          nextLabel="Next"
          controlsHref="#module-directions"
        />
      }
    />
  );
}
