"use client";

import { useSceneColors } from "@/sketches/lib/tokenColors";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, type Mesh, type MeshBasicMaterial } from "three";
import { paramsFor } from "../../lib/distortion";
import { useDistortionRefs } from "../../lib/distortionContext";

/**
 * Vertical translucent cone above the plot — the "money signal" itself.
 * Color shifts from Bitcoin orange (sound) to oxblood (debased); opacity
 * tracks signal strength.
 */
export function SignalBeam() {
  const colors = useSceneColors();
  const meshRef = useRef<Mesh>(null);
  const matRef = useRef<MeshBasicMaterial>(null);
  const { eased } = useDistortionRefs();

  const sound = useMemo(() => colors["--accent-bitcoin"].clone(), [colors]);
  const debased = useMemo(
    () =>
      new Color().lerpColors(colors["--accent-action"], colors["--ink-secondary"], 0.2),
    [colors],
  );

  useFrame((state) => {
    const mat = matRef.current;
    const mesh = meshRef.current;
    if (!mat || !mesh) return;
    const params = paramsFor(eased.current);
    const t = state.clock.getElapsedTime();

    mat.color.lerpColors(sound, debased, params.signalCorruption);
    mat.opacity = (0.16 + Math.sin(t * 0.8) * 0.02) * params.signalStrength;
    // Beam slightly wobbles as corruption rises.
    mesh.rotation.y =
      Math.sin(t * 0.4) * 0.05 + params.signalCorruption * Math.sin(t * 1.2) * 0.12;
  });

  return (
    <mesh ref={meshRef} position={[0, 8, 0]}>
      <coneGeometry args={[3.4, 12, 28, 1, true]} />
      <meshBasicMaterial
        ref={matRef}
        color={sound}
        transparent
        opacity={0.18}
        depthWrite={false}
        side={2}
        toneMapped={false}
      />
    </mesh>
  );
}
