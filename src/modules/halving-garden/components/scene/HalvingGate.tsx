"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, MeshStandardMaterial } from "three";
import { HALL_HALF_WIDTH } from "../../lib/sceneLayout";
import { useSceneColors } from "../../lib/tokenColors";

interface Props {
  /** World-space Z of the gate. */
  readonly z: number;
  /** Index of the epoch on the LEFT side (0..3). Used for subtle modulation. */
  readonly leftEpochIndex: number;
  readonly active: boolean;
}

const GATE_HEIGHT = 6.5;
const GATE_WIDTH = 0.16;
const GATE_DEPTH = 0.08;

export function HalvingGate({ z, leftEpochIndex, active }: Props) {
  const colors = useSceneColors();
  const groupRef = useRef<Group>(null);
  const matRef = useRef<MeshStandardMaterial>(null);

  useFrame((_state, delta) => {
    const group = groupRef.current;
    const mat = matRef.current;
    if (!group || !mat) return;

    const target = active ? 1.4 : 0.65 + leftEpochIndex * 0.05;
    const current = mat.emissiveIntensity;
    mat.emissiveIntensity = current + (target - current) * Math.min(1, delta * 4);
  });

  return (
    <group ref={groupRef} position={[0, -1, z]}>
      <mesh position={[-HALL_HALF_WIDTH * 0.85, GATE_HEIGHT * 0.5 - 1.6, 0]}>
        <boxGeometry args={[GATE_WIDTH, GATE_HEIGHT, GATE_DEPTH]} />
        <meshStandardMaterial
          ref={matRef}
          color={colors["--accent-bitcoin"]}
          emissive={colors["--accent-bitcoin"]}
          emissiveIntensity={0.7}
          roughness={0.4}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[HALL_HALF_WIDTH * 0.85, GATE_HEIGHT * 0.5 - 1.6, 0]}>
        <boxGeometry args={[GATE_WIDTH, GATE_HEIGHT, GATE_DEPTH]} />
        <meshStandardMaterial
          color={colors["--accent-bitcoin"]}
          emissive={colors["--accent-bitcoin"]}
          emissiveIntensity={0.7}
          roughness={0.4}
          toneMapped={false}
        />
      </mesh>

      {/* Threshold lintel — a slim horizontal mark across the floor */}
      <mesh position={[0, -2.55, 0]}>
        <boxGeometry args={[HALL_HALF_WIDTH * 1.7, 0.06, 0.16]} />
        <meshStandardMaterial
          color={colors["--rule-strong"]}
          emissive={colors["--accent-bitcoin"]}
          emissiveIntensity={0.18}
          roughness={0.7}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
