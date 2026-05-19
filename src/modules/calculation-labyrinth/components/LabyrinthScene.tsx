"use client";

import { SceneCanvas } from "@/components/sketch/SceneCanvas";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { type CellCoord, buildMaze } from "../lib/labyrinthLayout";
import { CameraRig } from "./scene/CameraRig";
import { Goal } from "./scene/Goal";
import { Pawn } from "./scene/Pawn";
import { PriceMarkers } from "./scene/PriceMarkers";
import { SceneLighting } from "./scene/SceneLighting";
import { Walls } from "./scene/Walls";

interface Props {
  readonly priced: boolean;
  readonly current: CellCoord;
  readonly challenge: number;
  readonly fallback: ReactNode;
  readonly overlay?: ReactNode;
}

export function LabyrinthScene({
  priced,
  current,
  challenge,
  fallback,
  overlay,
}: Props) {
  const maze = useMemo(() => buildMaze(0xc4_0a_71_3f + challenge * 7919), [challenge]);

  return (
    <SceneCanvas
      ariaLabel="Calculation Labyrinth interactive scene"
      fallback={fallback}
      overlay={overlay}
      height="100%"
      moduleSlug="calculation-labyrinth"
      camera={{ position: [0, 11, 12], fov: 38, near: 0.1, far: 80 }}
      frameloop="always"
    >
      <SceneLighting />
      <Walls maze={maze} priced={priced} />
      <PriceMarkers maze={maze} priced={priced} />
      <Pawn maze={maze} priced={priced} current={current} />
      <Goal maze={maze} priced={priced} />
      <CameraRig />
    </SceneCanvas>
  );
}
