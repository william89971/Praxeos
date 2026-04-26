"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useDistortionRefs } from "../../lib/distortionContext";

/**
 * Subtle idle dolly so the scene breathes. Reduced-motion users never see
 * this — they get the SVG poster instead.
 */
export function CameraRig() {
  const { camera } = useThree();
  const { eased } = useDistortionRefs();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const sway = Math.sin(t * 0.18) * 0.4 + Math.cos(t * 0.12) * 0.2;
    const closeness = eased.current * 0.6;
    camera.position.x = sway;
    camera.position.y = 9 - closeness;
    camera.position.z = 14 + Math.sin(t * 0.07) * 0.5;
    camera.lookAt(0, 0, 0);
  });

  return null;
}
