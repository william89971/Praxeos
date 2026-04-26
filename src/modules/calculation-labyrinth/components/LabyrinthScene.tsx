"use client";

import { SceneCanvas } from "@/components/sketch/SceneCanvas";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { buildMaze } from "../lib/labyrinthLayout";
import { CameraRig } from "./scene/CameraRig";
import { Goal } from "./scene/Goal";
import { Pawn } from "./scene/Pawn";
import { PriceMarkers } from "./scene/PriceMarkers";
import { SceneLighting } from "./scene/SceneLighting";
import { Walls } from "./scene/Walls";

interface Props {
  readonly priced: boolean;
  readonly fallback: ReactNode;
  readonly overlay?: ReactNode;
}

export function LabyrinthScene({ priced, fallback, overlay }: Props) {
  const maze = useMemo(() => buildMaze(), []);

  return (
    <SceneCanvas
      ariaLabel="Calculation Labyrinth interactive scene"
      fallback={fallback}
      overlay={overlay}
      camera={{ position: [0, 11, 12], fov: 38, near: 0.1, far: 80 }}
    >
      <SceneLighting />
      <Walls maze={maze} priced={priced} />
      <PriceMarkers maze={maze} priced={priced} />
      <Pawn maze={maze} priced={priced} />
      <Goal maze={maze} priced={priced} />
      <CameraRig />
    </SceneCanvas>
  );
}
