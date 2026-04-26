"use client";

import { useSceneColors } from "@/sketches/lib/tokenColors";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Color, MathUtils, type Mesh, type MeshStandardMaterial, Vector3 } from "three";
import type { MazeData } from "../../lib/labyrinthLayout";

interface Props {
  readonly maze: MazeData;
  readonly priced: boolean;
}

const STEP_TIME = 0.6;

/**
 * The "planner" pawn. With prices, it follows the canonical shortest
 * path smoothly. Without prices, it wanders, retreats, and gets stuck
 * — a visible argument that planning needs prices to compute paths.
 */
export function Pawn({ maze, priced }: Props) {
  const colors = useSceneColors();
  const meshRef = useRef<Mesh>(null);
  const matRef = useRef<MeshStandardMaterial>(null);

  const stepRef = useRef(0);
  const elapsedRef = useRef(0);
  const wanderTargetRef = useRef<Vector3 | null>(null);

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-running on `priced` flip is the point — start positions reset.
  useEffect(() => {
    stepRef.current = 0;
    elapsedRef.current = 0;
    wanderTargetRef.current = null;
    const mesh = meshRef.current;
    if (mesh) {
      mesh.position.set(maze.start.x, 0.4, maze.start.z);
    }
  }, [maze, priced]);

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    const mat = matRef.current;
    if (!mesh || !mat) return;

    if (priced) {
      mat.color.copy(calmColor);
      mat.emissive.copy(calmColor);
      mat.emissiveIntensity = 0.5;

      elapsedRef.current += delta;
      const stepIndex = Math.min(stepRef.current, maze.path.length - 2);
      const from = maze.path[stepIndex];
      const to = maze.path[stepIndex + 1] ?? from;
      if (!from || !to) return;
      const t = Math.min(1, elapsedRef.current / STEP_TIME);
      mesh.position.x = from.x + (to.x - from.x) * easeInOut(t);
      mesh.position.z = from.z + (to.z - from.z) * easeInOut(t);
      mesh.position.y = 0.4 + Math.sin(t * Math.PI) * 0.06;

      if (t >= 1) {
        elapsedRef.current = 0;
        stepRef.current += 1;
        if (stepRef.current >= maze.path.length - 1) {
          // Loop: small pause then restart.
          stepRef.current = 0;
        }
      }
    } else {
      mat.color.copy(lostColor);
      mat.emissive.copy(lostColor);
      mat.emissiveIntensity = 0.15 + Math.sin(performance.now() / 280) * 0.1;

      // Wander randomly within a small radius around start.
      if (
        !wanderTargetRef.current ||
        mesh.position.distanceTo(wanderTargetRef.current) < 0.1
      ) {
        const r = 1.4;
        wanderTargetRef.current = new Vector3(
          maze.start.x + (Math.random() - 0.5) * r,
          0.4,
          maze.start.z + (Math.random() - 0.5) * r,
        );
      }
      const target = wanderTargetRef.current;
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

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}
