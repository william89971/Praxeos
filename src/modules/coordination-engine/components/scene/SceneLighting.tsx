"use client";

import { useSceneColors } from "@/sketches/lib/tokenColors";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { PointLight } from "three";
import { useCoordinationRefs } from "../../lib/coordinationContext";
import { paramsFor } from "../../lib/distortion";

export function SceneLighting() {
  const colors = useSceneColors();
  const beamRef = useRef<PointLight>(null);
  const { eased } = useCoordinationRefs();

  useFrame(() => {
    const light = beamRef.current;
    if (!light) return;
    const params = paramsFor(eased.current);
    light.intensity = 8 * params.intensity;
    light.color.lerpColors(
      colors["--accent-bitcoin"],
      colors["--accent-action"],
      params.corruption,
    );
  });

  return (
    <>
      <ambientLight intensity={0.55} color={colors["--ink-secondary"]} />
      <hemisphereLight
        intensity={0.4}
        color={colors["--paper"]}
        groundColor={colors["--paper-sunk"]}
      />
      <directionalLight
        position={[8, 10, 6]}
        intensity={0.55}
        color={colors["--paper"]}
      />
      <pointLight ref={beamRef} position={[0, 3, 0]} distance={20} decay={1.6} />
    </>
  );
}
