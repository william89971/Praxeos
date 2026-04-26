"use client";

import { useSceneColors } from "@/sketches/lib/tokenColors";
import { HALL_TOTAL_DEPTH } from "../../lib/sceneLayout";

export function SceneLighting() {
  const colors = useSceneColors();

  return (
    <>
      <ambientLight intensity={0.55} color={colors["--ink-secondary"]} />
      <hemisphereLight
        intensity={0.4}
        color={colors["--paper"]}
        groundColor={colors["--paper-sunk"]}
      />
      <directionalLight
        position={[6, 10, -8]}
        intensity={0.55}
        color={colors["--paper"]}
      />
      <pointLight
        position={[0, 4, HALL_TOTAL_DEPTH * 0.85]}
        intensity={9}
        distance={70}
        decay={1.4}
        color={colors["--accent-bitcoin"]}
      />
    </>
  );
}
