"use client";

import { useSceneColors } from "@/sketches/lib/tokenColors";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, type Mesh, type MeshPhysicalMaterial } from "three";
import { paramsFor } from "../../lib/distortion";
import { useDistortionRefs } from "../../lib/distortionContext";
import { PLOT_HALF } from "../../lib/gardenLayout";

const POND_W = 5.5;
const POND_D = 3.4;
const POND_X = -PLOT_HALF + POND_W / 2 + 0.8;
const POND_Z = PLOT_HALF - POND_D / 2 - 0.8;

export function Water() {
  const colors = useSceneColors();
  const meshRef = useRef<Mesh>(null);
  const matRef = useRef<MeshPhysicalMaterial>(null);
  const { eased } = useDistortionRefs();

  const fullColor = useMemo(
    () =>
      new Color().lerpColors(colors["--accent-capital"], colors["--ink-primary"], 0.55),
    [colors],
  );
  const drainedColor = useMemo(
    () =>
      new Color().lerpColors(colors["--paper-sunk"], colors["--accent-action"], 0.25),
    [colors],
  );
  const tmp = useMemo(() => new Color(), []);

  useFrame((state) => {
    const mesh = meshRef.current;
    const mat = matRef.current;
    if (!mesh || !mat) return;
    const params = paramsFor(eased.current);

    const t = state.clock.getElapsedTime();
    mat.emissiveIntensity = (0.16 + Math.sin(t * 0.8) * 0.04) * params.waterLevel;

    mesh.scale.x = 0.25 + 0.75 * params.waterLevel;
    mesh.scale.z = 0.4 + 0.6 * params.waterLevel;
    mat.opacity = 0.55 + 0.4 * params.waterLevel;
    mat.transmission = 0.55 * params.waterLevel;
    mat.thickness = 0.5 + 0.4 * params.waterLevel;
    mat.roughness = 0.18 + 0.18 * (1 - params.waterLevel);

    tmp.lerpColors(drainedColor, fullColor, params.waterLevel);
    mat.color.copy(tmp);
  });

  return (
    <mesh
      ref={meshRef}
      position={[POND_X, 0.02, POND_Z]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[POND_W, POND_D, 1, 1]} />
      <meshPhysicalMaterial
        ref={matRef}
        color={fullColor}
        emissive={fullColor}
        emissiveIntensity={0.18}
        roughness={0.18}
        metalness={0.0}
        transmission={0.5}
        thickness={0.6}
        ior={1.33}
        clearcoat={0.4}
        clearcoatRoughness={0.25}
        transparent
        opacity={0.85}
        toneMapped={false}
      />
    </mesh>
  );
}
