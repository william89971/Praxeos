"use client";

import { useSceneColors } from "@/sketches/lib/tokenColors";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  CatmullRomCurve3,
  Color,
  type Group,
  type Mesh,
  type MeshStandardMaterial,
  TubeGeometry,
  Vector3,
} from "three";
import { paramsFor } from "../../lib/distortion";
import { useDistortionRefs } from "../../lib/distortionContext";
import { nodePositions, pathSegments } from "../../lib/gardenLayout";

const TUBE_SEGMENTS = 28;
const TUBE_RADIUS = 0.04;
const TUBE_RADIAL_SEGMENTS = 4;

export function Paths() {
  const nodes = useMemo(() => nodePositions(), []);
  const segments = useMemo(() => pathSegments(), []);
  const colors = useSceneColors();
  const groupRef = useRef<Group>(null);
  const { eased } = useDistortionRefs();

  const clearColor = useMemo(
    () =>
      new Color().lerpColors(colors["--accent-bitcoin"], colors["--ink-primary"], 0.32),
    [colors],
  );
  const corruptedColor = useMemo(
    () =>
      new Color().lerpColors(colors["--accent-action"], colors["--ink-tertiary"], 0.35),
    [colors],
  );

  // Pre-build tube geometries; we only mutate emissive/opacity per frame.
  const tubes = useMemo(() => {
    return segments.map((seg) => {
      const a = nodes[seg.from];
      const b = nodes[seg.to];
      if (!a || !b) return null;
      // Add a midpoint with slight curve for organic feel.
      const mid = new Vector3((a.x + b.x) / 2, 0.18, (a.z + b.z) / 2);
      const ax = new Vector3(a.x, 0.45, a.z);
      const bx = new Vector3(b.x, 0.45, b.z);
      const curve = new CatmullRomCurve3([ax, mid, bx], false, "centripetal");
      return new TubeGeometry(
        curve,
        TUBE_SEGMENTS,
        TUBE_RADIUS,
        TUBE_RADIAL_SEGMENTS,
        false,
      );
    });
  }, [nodes, segments]);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    const params = paramsFor(eased.current);
    const t = state.clock.getElapsedTime();

    for (let i = 0; i < tubes.length; i++) {
      const child = group.children[i] as Mesh | undefined;
      if (!child) continue;
      const mat = child.material as MeshStandardMaterial;
      mat.color.lerpColors(clearColor, corruptedColor, params.signalCorruption);
      mat.emissive.copy(mat.color);
      mat.emissiveIntensity =
        (0.45 + Math.sin(t * 0.6 + i) * 0.05) * params.pathClarity + 0.05;
      mat.opacity = 0.35 + 0.65 * params.pathClarity;
      // Wobble: rotate the path slightly as corruption increases.
      child.rotation.y = Math.sin(t * 0.6 + i * 1.7) * params.signalCorruption * 0.18;
    }
  });

  return (
    <group ref={groupRef}>
      {tubes.map((geom, i) => {
        if (!geom) return null;
        const seg = segments[i];
        return (
          <mesh key={`path-${seg?.from ?? i}-${seg?.to ?? i}`} geometry={geom}>
            <meshStandardMaterial
              color={clearColor}
              emissive={clearColor}
              emissiveIntensity={0.5}
              roughness={0.35}
              metalness={0.0}
              toneMapped={false}
              transparent
              opacity={1}
            />
          </mesh>
        );
      })}
    </group>
  );
}
