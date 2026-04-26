"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { useDistortionRefs } from "../../lib/distortionContext";

/**
 * Cinematic camera rig.
 *
 * Combines four motions, all subtle:
 *   1. A slow elliptical dolly around the plot
 *   2. A pointer-driven parallax offset (desktop only)
 *   3. A vertical drift that closes in slightly with distortion
 *   4. A slight focus tilt as money quality degrades
 *
 * The aim is the felt-sense of a steadicam follow, not a game camera.
 */
export function CameraRig() {
  const { camera } = useThree();
  const { eased } = useDistortionRefs();
  const pointer = useRef({ x: 0, y: 0 });
  const target = useRef(new Vector3(0, 0, 0));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      pointer.current.x = x;
      pointer.current.y = y;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_state, delta) => {
    const t = performance.now() / 1000;
    const closeness = eased.current * 0.5;

    // Elliptical dolly.
    const sway = Math.sin(t * 0.16) * 0.5 + Math.cos(t * 0.11) * 0.3;
    const driftZ = Math.sin(t * 0.07) * 0.4;

    // Parallax (capped so it never overpowers the dolly).
    const px = pointer.current.x * 0.7;
    const py = pointer.current.y * 0.4;

    const desiredX = sway + px;
    const desiredY = 9 - closeness + py * 0.3;
    const desiredZ = 14 + driftZ;

    // Damp toward the desired position.
    camera.position.x += (desiredX - camera.position.x) * Math.min(1, delta * 2.4);
    camera.position.y += (desiredY - camera.position.y) * Math.min(1, delta * 2.4);
    camera.position.z += (desiredZ - camera.position.z) * Math.min(1, delta * 2.4);

    // Look at a point near the centre that drops slightly with distortion.
    target.current.set(0 + px * 0.2, -0.2 - eased.current * 0.4, 0);
    camera.lookAt(target.current);
  });

  return null;
}
