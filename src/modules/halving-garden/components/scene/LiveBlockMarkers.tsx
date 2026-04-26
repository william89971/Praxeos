"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Color, type Mesh, type MeshStandardMaterial } from "three";
import { liveBlockToWorld } from "../../lib/sceneLayout";
import { useSceneColors } from "../../lib/tokenColors";
import type { Block } from "../../lib/types";

interface Props {
  readonly blocks: readonly Block[];
  readonly newest: Block | null;
}

const PULSE_DURATION_S = 6;

interface MarkerEntry {
  readonly block: Block;
  readonly bornAt: number;
}

export function LiveBlockMarkers({ blocks, newest }: Props) {
  const colors = useSceneColors();
  const ledger = useRef<Map<number, MarkerEntry>>(new Map());

  useEffect(() => {
    const map = ledger.current;
    const now = performance.now() / 1000;
    for (const block of blocks) {
      if (!map.has(block.height)) {
        map.set(block.height, { block, bornAt: now });
      }
    }
    // Trim entries older than 30s — they've settled into the field.
    const cutoff = now - 30;
    for (const [height, entry] of map) {
      if (entry.bornAt < cutoff) map.delete(height);
    }
  }, [blocks]);

  const newestHeight = newest?.height ?? null;

  return (
    <group>
      {Array.from(ledger.current.values()).map((entry) => (
        <PulseMarker
          key={entry.block.height}
          block={entry.block}
          bornAt={entry.bornAt}
          isNewest={entry.block.height === newestHeight}
          orange={colors["--accent-bitcoin"]}
          ink={colors["--ink-primary"]}
        />
      ))}
    </group>
  );
}

interface PulseProps {
  readonly block: Block;
  readonly bornAt: number;
  readonly isNewest: boolean;
  readonly orange: Color;
  readonly ink: Color;
}

function PulseMarker({ block, bornAt, isNewest, orange, ink }: PulseProps) {
  const meshRef = useRef<Mesh>(null);
  const matRef = useRef<MeshStandardMaterial>(null);

  const { x, y, z, scale } = useMemo(() => liveBlockToWorld(block), [block]);
  const finalColor = useMemo(
    () => new Color().lerpColors(orange, ink, 0.35),
    [orange, ink],
  );

  useFrame(() => {
    const mat = matRef.current;
    const mesh = meshRef.current;
    if (!mat || !mesh) return;
    const t = Math.min(1, (performance.now() / 1000 - bornAt) / PULSE_DURATION_S);
    const pulse = isNewest ? 0.4 + Math.sin(performance.now() / 220) * 0.15 : 0;
    mat.emissiveIntensity = (1 - t) * 1.6 + pulse;
    mat.color.lerpColors(orange, finalColor, t);
    const breath = 1 + (1 - t) * 0.45 + pulse * 0.2;
    mesh.scale.setScalar(scale * breath);
  });

  return (
    <mesh ref={meshRef} position={[x, y + 0.4, z]}>
      <sphereGeometry args={[1, 14, 14]} />
      <meshStandardMaterial
        ref={matRef}
        color={orange}
        emissive={orange}
        emissiveIntensity={1.6}
        roughness={0.35}
        toneMapped={false}
      />
    </mesh>
  );
}
