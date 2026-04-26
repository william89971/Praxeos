"use client";

import { useSceneColors } from "@/sketches/lib/tokenColors";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import type { MazeData } from "../../lib/labyrinthLayout";

interface Props {
  readonly maze: MazeData;
  readonly priced: boolean;
}

export function PriceMarkers({ maze, priced }: Props) {
  const colors = useSceneColors();
  const groupRef = useRef<Group>(null);

  const litColor = useMemo(() => colors["--accent-bitcoin"], [colors]);

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.getElapsedTime();
    for (let i = 0; i < maze.markers.length; i++) {
      const child = g.children[i] as Mesh | undefined;
      const m = maze.markers[i];
      if (!child || !m) continue;
      const mat = child.material as MeshStandardMaterial;
      mat.color.copy(litColor);
      mat.emissive.copy(litColor);

      if (priced) {
        // Shimmering chain from start (1.0) to goal (0.0).
        const phase = (t * 1.4 + i * 0.4) % (Math.PI * 2);
        const flicker = 0.45 + Math.sin(phase) * 0.25;
        mat.emissiveIntensity = flicker * (0.4 + m.price * 0.6);
        mat.opacity = 0.85;
        child.position.y = 0.95 + Math.sin(t * 2 + i) * 0.05;
      } else {
        // Without prices, markers blink out.
        mat.emissiveIntensity = 0.04;
        mat.opacity = Math.max(0, 0.06 + Math.sin(t * 0.8 + i * 0.7) * 0.04);
        child.position.y = 0.95;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {maze.markers.map((m) => (
        <mesh
          key={`pm-${m.x.toFixed(3)}-${m.z.toFixed(3)}`}
          position={[m.x, 0.95, m.z]}
        >
          <octahedronGeometry args={[0.12, 0]} />
          <meshStandardMaterial
            color={litColor}
            emissive={litColor}
            emissiveIntensity={0.5}
            roughness={0.3}
            transparent
            opacity={0.85}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
