"use client";

import { useSceneColors } from "@/sketches/lib/tokenColors";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { PointLight } from "three";
import { paramsForState } from "../../lib/distortion";
import { useDistortionRefs } from "../../lib/distortionContext";

interface Props {
  readonly deviceClass: "desktop" | "mobile";
}

/**
 * Cinematic lighting setup:
 *   • Hemisphere fill matched to paper/ink tokens
 *   • A directional key with soft shadows (desktop only)
 *   • A coloured fixture above the plot, modulated by signal-corruption
 */
export function SceneLighting({ deviceClass }: Props) {
  const colors = useSceneColors();
  const beamRef = useRef<PointLight>(null);
  const { eased } = useDistortionRefs();

  useFrame(() => {
    const light = beamRef.current;
    if (!light) return;
    const params = paramsForState(eased.current);
    light.intensity = 12 * params.signalStrength + 1.5;
    light.color.lerpColors(
      colors["--accent-bitcoin"],
      colors["--accent-action"],
      params.signalCorruption,
    );
  });

  return (
    <>
      <hemisphereLight
        intensity={0.7}
        color={colors["--paper"]}
        groundColor={colors["--paper-sunk"]}
      />

      <directionalLight
        position={[6, 14, 5]}
        intensity={1.4}
        color={colors["--paper"]}
        castShadow={deviceClass === "desktop"}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        shadow-camera-near={1}
        shadow-camera-far={36}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
      />

      <directionalLight
        position={[-8, 6, -6]}
        intensity={0.35}
        color={colors["--accent-capital"]}
      />

      <pointLight ref={beamRef} position={[0, 5, 0]} distance={22} decay={1.4} />
    </>
  );
}
