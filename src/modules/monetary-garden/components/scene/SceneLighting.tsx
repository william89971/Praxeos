"use client";

import { useSceneColors } from "@/sketches/lib/tokenColors";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { PointLight } from "three";
import { paramsFor } from "../../lib/distortion";
import { useDistortionRefs } from "../../lib/distortionContext";

export function SceneLighting() {
  const colors = useSceneColors();
  const beamRef = useRef<PointLight>(null);
  const { eased } = useDistortionRefs();

  useFrame(() => {
    const light = beamRef.current;
    if (!light) return;
    const params = paramsFor(eased.current);
    light.intensity = 14 * params.signalStrength;
    light.color.lerpColors(
      colors["--accent-bitcoin"],
      colors["--accent-action"],
      params.signalCorruption,
    );
  });

  return (
    <>
      <ambientLight intensity={0.5} color={colors["--ink-secondary"]} />
      <hemisphereLight
        intensity={0.45}
        color={colors["--paper"]}
        groundColor={colors["--paper-sunk"]}
      />
      <directionalLight
        position={[8, 12, 6]}
        intensity={0.5}
        color={colors["--paper"]}
      />
      <pointLight ref={beamRef} position={[0, 6, 0]} distance={22} decay={1.6} />
    </>
  );
}
