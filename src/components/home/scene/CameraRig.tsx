"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";

export function CameraRig() {
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const target = useRef(new Vector3(0, 0, 0));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_state, delta) => {
    const t = performance.now() / 1000;
    // Slow elliptical orbit at fixed radius.
    const r = 6.2;
    const a = t * 0.045;
    const desiredX = Math.sin(a) * r + pointer.current.x * 0.4;
    const desiredY = 0.3 + Math.sin(t * 0.07) * 0.25 - pointer.current.y * 0.25;
    const desiredZ = Math.cos(a) * r;

    camera.position.x += (desiredX - camera.position.x) * Math.min(1, delta * 2.4);
    camera.position.y += (desiredY - camera.position.y) * Math.min(1, delta * 2.4);
    camera.position.z += (desiredZ - camera.position.z) * Math.min(1, delta * 2.4);

    target.current.set(pointer.current.x * 0.18, -pointer.current.y * 0.12, 0);
    camera.lookAt(target.current);
  });

  return null;
}
