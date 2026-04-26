"use client";

import { useFrame, useThree } from "@react-three/fiber";

export function CameraRig() {
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.06) * 1.8;
    camera.position.y = 11 + Math.sin(t * 0.05) * 0.4;
    camera.position.z = 12 + Math.cos(t * 0.06) * 1.2;
    camera.lookAt(0, 0, 0);
  });
  return null;
}
