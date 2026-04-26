"use client";

import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { type PerspectiveCamera, Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { CameraPreset } from "../../lib/cameraPresets";
import { HALL_TOTAL_DEPTH } from "../../lib/sceneLayout";

interface Props {
  readonly preset: CameraPreset;
  readonly mode: "guided" | "explore";
}

const TWEEN_DURATION = 1.2;

export function CameraRig({ preset, mode }: Props) {
  const { camera } = useThree();
  const perspective = camera as PerspectiveCamera;

  const controlsRef = useRef<OrbitControlsImpl>(null);
  const tweenRef = useRef<{
    fromPos: Vector3;
    fromTarget: Vector3;
    toPos: Vector3;
    toTarget: Vector3;
    fromFov: number;
    toFov: number;
    elapsed: number;
  } | null>(null);

  // Trigger tween when preset changes.
  useEffect(() => {
    const controls = controlsRef.current;
    const fromPos = perspective.position.clone();
    const fromTarget = controls?.target.clone() ?? new Vector3(...preset.target);
    tweenRef.current = {
      fromPos,
      fromTarget,
      toPos: new Vector3(...preset.position),
      toTarget: new Vector3(...preset.target),
      fromFov: perspective.fov,
      toFov: preset.fov,
      elapsed: 0,
    };
  }, [perspective, preset]);

  useFrame((_state, delta) => {
    const tween = tweenRef.current;
    if (!tween) return;
    tween.elapsed += delta;
    const t = Math.min(1, tween.elapsed / TWEEN_DURATION);
    const eased = easeInOutCubic(t);

    perspective.position.lerpVectors(tween.fromPos, tween.toPos, eased);

    const controls = controlsRef.current;
    if (controls) {
      controls.target.lerpVectors(tween.fromTarget, tween.toTarget, eased);
      controls.update();
    } else {
      perspective.lookAt(
        new Vector3().lerpVectors(tween.fromTarget, tween.toTarget, eased),
      );
    }

    perspective.fov = tween.fromFov + (tween.toFov - tween.fromFov) * eased;
    perspective.updateProjectionMatrix();

    if (t >= 1) tweenRef.current = null;
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={mode === "explore"}
      enablePan={false}
      enableZoom={mode === "explore"}
      enableRotate={mode === "explore"}
      minDistance={6}
      maxDistance={Math.max(40, HALL_TOTAL_DEPTH * 0.6)}
      minPolarAngle={Math.PI * 0.18}
      maxPolarAngle={Math.PI * 0.5}
      makeDefault
    />
  );
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}
