"use client";

import { useFrame, useThree } from "@react-three/fiber";

export function CameraRig() {
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const r = 11;
    camera.position.x = Math.sin(t * 0.05) * r;
    camera.position.y = 4 + Math.sin(t * 0.07) * 0.6;
    camera.position.z = Math.cos(t * 0.05) * r;
    camera.lookAt(0, 0, 0);
  });
  return null;
}
