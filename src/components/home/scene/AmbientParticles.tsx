"use client";

import { mulberry32 } from "@/sketches/lib/rng";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  type BufferAttribute,
  type BufferGeometry,
  type Points,
} from "three";

interface Props {
  readonly count?: number;
  readonly radius?: number;
}

export function AmbientParticles({ count = 600, radius = 7 }: Props) {
  const pointsRef = useRef<Points>(null);

  const positions = useMemo(() => {
    const rng = mulberry32(0x4f_2c_8d_71);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spherical shell distribution.
      const phi = Math.acos(2 * rng() - 1);
      const theta = rng() * Math.PI * 2;
      const r = radius * (0.55 + rng() * 0.55);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count, radius]);

  useFrame((_state, delta) => {
    const p = pointsRef.current;
    if (!p) return;
    p.rotation.y += delta * 0.012;
    p.rotation.x += delta * 0.006;

    // Gentle vertical drift.
    const geom = p.geometry as BufferGeometry;
    const attr = geom.getAttribute("position") as BufferAttribute | undefined;
    if (!attr) return;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const ix = i * 3 + 1;
      arr[ix] = (arr[ix] ?? 0) + delta * 0.04 * (((i % 7) - 3) / 3);
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
        size={0.022}
        sizeAttenuation
        color="#e9d4a3"
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
