"use client";

import { useSceneColors } from "@/sketches/lib/tokenColors";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh, MeshStandardMaterial } from "three";
import type { MazeData } from "../../lib/labyrinthLayout";

interface Props {
  readonly maze: MazeData;
  readonly priced: boolean;
}

export function Goal({ maze, priced }: Props) {
  const colors = useSceneColors();
  const matRef = useRef<MeshStandardMaterial>(null);
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    const mat = matRef.current;
    const mesh = meshRef.current;
    if (!mat || !mesh) return;
    const t = state.clock.getElapsedTime();
    mat.emissiveIntensity = priced ? 0.9 + Math.sin(t * 1.4) * 0.18 : 0.12;
    mesh.rotation.y = t * (priced ? 0.6 : 0.05);
  });

  return (
    <mesh ref={meshRef} position={[maze.goal.x, 0.55, maze.goal.z]}>
      <torusKnotGeometry args={[0.22, 0.07, 80, 8]} />
      <meshStandardMaterial
        ref={matRef}
        color={colors["--accent-bitcoin"]}
        emissive={colors["--accent-bitcoin"]}
        emissiveIntensity={0.9}
        roughness={0.28}
        toneMapped={false}
      />
    </mesh>
  );
}
