"use client";

import { useSceneColors } from "@/sketches/lib/tokenColors";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, type Mesh, type MeshStandardMaterial } from "three";
import { paramsFor } from "../../lib/distortion";
import { useDistortionRefs } from "../../lib/distortionContext";
import { PLOT_HALF } from "../../lib/gardenLayout";

export function Ground() {
  const colors = useSceneColors();
  const matRef = useRef<MeshStandardMaterial>(null);
  const meshRef = useRef<Mesh>(null);
  const { eased } = useDistortionRefs();

  const baseColor = useMemo(
    () =>
      new Color().lerpColors(
        colors["--paper-elevated"],
        colors["--accent-capital"],
        0.18,
      ),
    [colors],
  );
  const decayColor = useMemo(
    () =>
      new Color().lerpColors(colors["--paper-sunk"], colors["--accent-action"], 0.35),
    [colors],
  );
  const tmpColor = useMemo(() => new Color(), []);

  useFrame(() => {
    const mat = matRef.current;
    if (!mat) return;
    const params = paramsFor(eased.current);
    tmpColor.lerpColors(
      baseColor,
      decayColor,
      params.deadZoneArea * 0.7 + params.signalCorruption * 0.15,
    );
    mat.color.copy(tmpColor);
    mat.roughness = 0.85 + params.signalCorruption * 0.1;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[PLOT_HALF * 2.6, PLOT_HALF * 2.6, 64, 64]} />
      <meshStandardMaterial
        ref={matRef}
        color={baseColor}
        roughness={0.95}
        metalness={0.02}
      />
    </mesh>
  );
}
