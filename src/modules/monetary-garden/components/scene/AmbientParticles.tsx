"use client";

import { mulberry32 } from "@/sketches/lib/rng";
import { useSceneColors } from "@/sketches/lib/tokenColors";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { BufferAttribute, BufferGeometry, Points, PointsMaterial } from "three";
import { paramsFor } from "../../lib/distortion";
import { useDistortionRefs } from "../../lib/distortionContext";
import { PLOT_HALF } from "../../lib/gardenLayout";

const COUNT = 240;

export function AmbientParticles() {
  const colors = useSceneColors();
  const pointsRef = useRef<Points>(null);
  const { eased } = useDistortionRefs();

  const positions = useMemo(() => {
    const rng = mulberry32(0xb1_3c_e5_2f);
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const angle = rng() * Math.PI * 2;
      const radius = rng() * (PLOT_HALF + 1);
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = 0.6 + rng() * 5;
      arr[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return arr;
  }, []);

  useFrame((_state, delta) => {
    const points = pointsRef.current;
    if (!points) return;
    const geom = points.geometry as BufferGeometry;
    const attr = geom.getAttribute("position") as BufferAttribute | undefined;
    if (!attr) return;
    const arr = attr.array as Float32Array;
    const params = paramsFor(eased.current);

    const drift = delta * (0.12 + params.signalCorruption * 0.45);

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3 + 1;
      let y = arr[ix] ?? 0;
      y += drift * (0.5 + (i % 7) / 7);
      if (y > 6.4) y = 0.4;
      arr[ix] = y;
    }
    attr.needsUpdate = true;

    const mat = points.material as PointsMaterial;
    mat.color.lerpColors(
      colors["--accent-bitcoin"],
      colors["--accent-action"],
      params.signalCorruption,
    );
    mat.opacity = 0.45 - params.signalCorruption * 0.25;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        sizeAttenuation
        color={colors["--accent-bitcoin"]}
        transparent
        opacity={0.45}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}
