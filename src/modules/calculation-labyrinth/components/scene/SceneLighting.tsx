"use client";

import { useSceneColors } from "@/sketches/lib/tokenColors";

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
        position={[8, 14, 6]}
        intensity={0.55}
        color={colors["--paper"]}
      />
      <pointLight
        position={[0, 4, 0]}
        intensity={4}
        distance={18}
        decay={1.6}
        color={colors["--accent-bitcoin"]}
      />
    </>
  );
}
