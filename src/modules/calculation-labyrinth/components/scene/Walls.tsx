"use client";

import { useSceneColors } from "@/sketches/lib/tokenColors";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, type Group, type Mesh, type MeshStandardMaterial } from "three";
import { CELL, GRID, type MazeData, PLOT_HALF } from "../../lib/labyrinthLayout";

interface Props {
  readonly maze: MazeData;
  readonly priced: boolean;
}

interface WallSeg {
  readonly key: string;
  readonly x: number;
  readonly z: number;
  readonly w: number;
  readonly d: number;
}

const WALL_HEIGHT = 0.7;
const WALL_THICK = 0.08;

export function Walls({ maze, priced }: Props) {
  const colors = useSceneColors();
  const groupRef = useRef<Group>(null);
  const segments = useMemo<readonly WallSeg[]>(() => buildSegments(maze), [maze]);

  const litColor = useMemo(
    () =>
      new Color().lerpColors(colors["--ink-secondary"], colors["--ink-primary"], 0.35),
    [colors],
  );
  const blindColor = useMemo(
    () =>
      new Color().lerpColors(colors["--accent-action"], colors["--ink-primary"], 0.55),
    [colors],
  );

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.getElapsedTime();
    for (let i = 0; i < segments.length; i++) {
      const child = g.children[i] as Mesh | undefined;
      if (!child) continue;
      const mat = child.material as MeshStandardMaterial;
      if (priced) {
        mat.color.copy(litColor);
        mat.opacity = 0.95;
      } else {
        mat.color.copy(blindColor);
        // Walls flicker out of view when prices are absent.
        mat.opacity = 0.55 + Math.sin(t * 1.7 + i * 1.31) * 0.25;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {segments.map((seg) => (
        <mesh key={seg.key} position={[seg.x, WALL_HEIGHT * 0.5, seg.z]}>
          <boxGeometry args={[seg.w, WALL_HEIGHT, seg.d]} />
          <meshStandardMaterial
            color={litColor}
            roughness={0.85}
            transparent
            opacity={0.95}
          />
        </mesh>
      ))}

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[PLOT_HALF * 2 + 1.6, PLOT_HALF * 2 + 1.6]} />
        <meshStandardMaterial color={colors["--paper-elevated"]} roughness={0.95} />
      </mesh>
    </group>
  );
}

function buildSegments(maze: MazeData): readonly WallSeg[] {
  const segs: WallSeg[] = [];
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const cell = maze.grid[y]?.[x];
      if (!cell) continue;
      const cx = (x + 0.5) * CELL - PLOT_HALF;
      const cz = (y + 0.5) * CELL - PLOT_HALF;
      // Place each wall once: N walls for each row, W walls for each col,
      // plus the outer S row and outer E column edges.
      if (cell.walls.N) {
        segs.push({
          key: `n-${x}-${y}`,
          x: cx,
          z: cz + CELL / 2,
          w: CELL + WALL_THICK,
          d: WALL_THICK,
        });
      }
      if (cell.walls.W) {
        segs.push({
          key: `w-${x}-${y}`,
          x: cx - CELL / 2,
          z: cz,
          w: WALL_THICK,
          d: CELL + WALL_THICK,
        });
      }
      if (y === 0 && cell.walls.S) {
        segs.push({
          key: `s-${x}-${y}`,
          x: cx,
          z: cz - CELL / 2,
          w: CELL + WALL_THICK,
          d: WALL_THICK,
        });
      }
      if (x === GRID - 1 && cell.walls.E) {
        segs.push({
          key: `e-${x}-${y}`,
          x: cx + CELL / 2,
          z: cz,
          w: WALL_THICK,
          d: CELL + WALL_THICK,
        });
      }
    }
  }
  return segs;
}
