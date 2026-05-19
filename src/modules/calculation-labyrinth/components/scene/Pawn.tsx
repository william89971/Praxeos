"use client";

import { useSceneColors } from "@/sketches/lib/tokenColors";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, MathUtils, type Mesh, type MeshStandardMaterial, Vector3 } from "three";
import { type CellCoord, cellToWorld } from "../../lib/labyrinthLayout";
import type { MazeData } from "../../lib/labyrinthLayout";

interface Props {
  readonly maze: MazeData;
  readonly priced: boolean;
  readonly current: CellCoord;
}

/**
 * The "planner" pawn. It follows the user's chosen cell, with an
 * intentionally less stable presentation when prices are absent.
 */
export function Pawn({ maze, priced, current }: Props) {
  const colors = useSceneColors();
  const meshRef = useRef<Mesh>(null);
  const matRef = useRef<MeshStandardMaterial>(null);
  const calmColor = useMemo(
    () =>
      new Color().lerpColors(
        colors["--accent-bitcoin"],
        colors["--paper-elevated"],
        0.2,
      ),
    [colors],
  );
  const lostColor = useMemo(
    () =>
      new Color().lerpColors(colors["--accent-action"], colors["--ink-secondary"], 0.3),
    [colors],
  );

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const mat = matRef.current;
    if (!mesh || !mat) return;
    const world = cellToWorld(current.x, current.y);

    if (priced) {
      mat.color.copy(calmColor);
      mat.emissive.copy(calmColor);
      mat.emissiveIntensity = 0.5;

      mesh.position.x = MathUtils.damp(mesh.position.x, world.x, 8, delta);
      mesh.position.z = MathUtils.damp(mesh.position.z, world.z, 8, delta);
      mesh.position.y = 0.4 + Math.sin(state.clock.getElapsedTime() * 5) * 0.025;
    } else {
      mat.color.copy(lostColor);
      mat.emissive.copy(lostColor);
      mat.emissiveIntensity = 0.15 + Math.sin(performance.now() / 280) * 0.1;

      const jitter = deterministicJitter(current, state.clock.getElapsedTime());
      const target = new Vector3(world.x + jitter.x, 0.4, world.z + jitter.z);
      mesh.position.x = MathUtils.damp(mesh.position.x, target.x, 1.4, delta);
      mesh.position.z = MathUtils.damp(mesh.position.z, target.z, 1.4, delta);
      mesh.position.y = 0.4;
    }
  });

  return (
    <mesh ref={meshRef} position={[maze.start.x, 0.4, maze.start.z]}>
      <octahedronGeometry args={[0.22, 0]} />
      <meshStandardMaterial
        ref={matRef}
        color={calmColor}
        emissive={calmColor}
        emissiveIntensity={0.5}
        roughness={0.35}
        toneMapped={false}
      />
    </mesh>
  );
}

function deterministicJitter(cell: CellCoord, t: number): { x: number; z: number } {
  const x = Math.sin(t * 1.7 + cell.x * 12.9898 + cell.y * 78.233) * 0.22;
  const z = Math.cos(t * 1.3 + cell.x * 4.1414 + cell.y * 31.415) * 0.22;
  return { x, z };
}
