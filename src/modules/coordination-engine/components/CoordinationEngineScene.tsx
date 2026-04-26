"use client";

import { SceneCanvas } from "@/components/sketch/SceneCanvas";
import { useFrame } from "@react-three/fiber";
import { type ReactNode, useEffect, useRef } from "react";
import { CoordinationContext, useCoordinationRefs } from "../lib/coordinationContext";
import { AgentNodes } from "./scene/AgentNodes";
import { CameraRig } from "./scene/CameraRig";
import { SceneLighting } from "./scene/SceneLighting";
import { SignalEdges } from "./scene/SignalEdges";

interface Props {
  readonly distortion: number;
  readonly fallback: ReactNode;
  readonly overlay?: ReactNode;
}

export function CoordinationEngineScene({ distortion, fallback, overlay }: Props) {
  const targetRef = useRef(distortion);
  const easedRef = useRef(distortion);

  useEffect(() => {
    targetRef.current = distortion;
  }, [distortion]);

  return (
    <SceneCanvas
      ariaLabel="Coordination Engine 3D scene"
      fallback={fallback}
      overlay={overlay}
      camera={{ position: [11, 4, 11], fov: 38, near: 0.1, far: 80 }}
    >
      <CoordinationContext.Provider value={{ target: targetRef, eased: easedRef }}>
        <SceneLighting />
        <Easer />
        <SignalEdges />
        <AgentNodes />
        <CameraRig />
      </CoordinationContext.Provider>
    </SceneCanvas>
  );
}

function Easer() {
  const refs = useCoordinationRefs();
  useFrame(() => {
    refs.eased.current += (refs.target.current - refs.eased.current) * 0.12;
  });
  return null;
}
