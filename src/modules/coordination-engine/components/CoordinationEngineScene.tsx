"use client";

import { SceneCanvas } from "@/components/sketch/SceneCanvas";
import { useFrame } from "@react-three/fiber";
import { type ReactNode, useEffect, useRef } from "react";
import { CoordinationContext, useCoordinationRefs } from "../lib/coordinationContext";
import {
  type CoordPulse,
  type CoordState,
  DEFAULT_COORD_STATE,
  easeCoordState,
} from "../lib/distortion";
import { AgentNodes } from "./scene/AgentNodes";
import { CameraRig } from "./scene/CameraRig";
import { SceneLighting } from "./scene/SceneLighting";
import { SignalEdges } from "./scene/SignalEdges";

interface Props {
  readonly state: CoordState;
  readonly pulse: CoordPulse | undefined;
  readonly onNodePulse: ((id: number) => void) | undefined;
  readonly fallback: ReactNode;
  readonly overlay?: ReactNode;
}

export function CoordinationEngineScene({
  state,
  pulse,
  onNodePulse,
  fallback,
  overlay,
}: Props) {
  const targetRef = useRef<CoordState>(state);
  const easedRef = useRef<CoordState>(DEFAULT_COORD_STATE);

  useEffect(() => {
    targetRef.current = state;
  }, [state]);

  return (
    <SceneCanvas
      ariaLabel="Coordination Engine 3D scene"
      fallback={fallback}
      overlay={overlay}
      height="100%"
      moduleSlug="coordination-engine"
      camera={{ position: [11, 4, 11], fov: 38, near: 0.1, far: 80 }}
      frameloop="always"
    >
      <CoordinationContext.Provider value={{ target: targetRef, eased: easedRef }}>
        <SceneLighting />
        <Easer />
        <SignalEdges pulse={pulse} />
        <AgentNodes pulse={pulse} onNodePulse={onNodePulse} />
        <CameraRig />
      </CoordinationContext.Provider>
    </SceneCanvas>
  );
}

function Easer() {
  const refs = useCoordinationRefs();
  useFrame(() => {
    refs.eased.current = easeCoordState(refs.eased.current, refs.target.current, 0.12);
  });
  return null;
}
