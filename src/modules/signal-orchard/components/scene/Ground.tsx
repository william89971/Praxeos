"use client";

import { useSceneColors } from "@/sketches/lib/tokenColors";
import { PLOT_RADIUS } from "../../lib/orchardLayout";

export function Ground() {
  const colors = useSceneColors();
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[PLOT_RADIUS + 1.5, 64]} />
        <meshStandardMaterial color={colors["--paper-elevated"]} roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <ringGeometry args={[PLOT_RADIUS * 0.97, PLOT_RADIUS, 64]} />
        <meshBasicMaterial color={colors["--rule"]} transparent opacity={0.45} />
      </mesh>
    </>
  );
}
