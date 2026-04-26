"use client";

import { mulberry32 } from "@/sketches/lib/rng";
import { useSceneColors } from "@/sketches/lib/tokenColors";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { BufferAttribute, BufferGeometry, Points } from "three";
import { HALL_HALF_WIDTH, HALL_TOTAL_DEPTH } from "../../lib/sceneLayout";

interface Props {
  readonly count?: number;
}

export function AmbientParticles({ count = 360 }: Props) {
  const colors = useSceneColors();
  const pointsRef = useRef<Points>(null);

  const positions = useMemo(() => {
    const rng = mulberry32(0xa17f33);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rng() - 0.5) * HALL_HALF_WIDTH * 2.4;
      arr[i * 3 + 1] = -1.6 + rng() * 5.2;
      arr[i * 3 + 2] = rng() * HALL_TOTAL_DEPTH;
    }
    return arr;
  }, [count]);

  useFrame((_state, delta) => {
    const points = pointsRef.current;
    if (!points) return;
    const geom = points.geometry as BufferGeometry;
    const attr = geom.getAttribute("position") as BufferAttribute | undefined;
    if (!attr) return;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const ix = i * 3 + 1;
      arr[ix] = (arr[ix] ?? 0) + delta * 0.04 * ((i % 7) - 3) * 0.1;
      const y = arr[ix] ?? 0;
      if (y > 4.2) arr[ix] = -1.6;
      if (y < -1.8) arr[ix] = 4;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        sizeAttenuation
        color={colors["--ink-tertiary"]}
        transparent
        opacity={0.45}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}
