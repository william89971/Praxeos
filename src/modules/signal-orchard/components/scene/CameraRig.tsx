"use client";

import { useFrame, useThree } from "@react-three/fiber";

/**
 * Slow orbital breathing — the camera circles the orchard at a low pitch.
 */
export function CameraRig() {
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const r = 13.5;
    camera.position.x = Math.sin(t * 0.07) * r;
    camera.position.y = 7 + Math.sin(t * 0.05) * 0.5;
    camera.position.z = Math.cos(t * 0.07) * r;
    camera.lookAt(0, 0.4, 0);
  });
  return null;
}
