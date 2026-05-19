"use client";

import { SceneCanvas } from "@/components/sketch/SceneCanvas";
import { useEffect, useRef } from "react";
import { OrchardContext } from "../lib/orchardContext";
import type { ActionKind, ActiveAction } from "../lib/signals";
import { ACTION_TTL_S } from "../lib/signals";
import { CameraRig } from "./scene/CameraRig";
import { Ground } from "./scene/Ground";
import { SceneLighting } from "./scene/SceneLighting";
import { SignalNetwork } from "./scene/SignalNetwork";
import { Trees } from "./scene/Trees";

interface Props {
  readonly fallback: React.ReactNode;
  readonly overlay?: React.ReactNode;
  readonly mode: "guided" | "explore";
  readonly selectedAction: ActionKind;
  readonly hoveredId: number | null;
  readonly onHover: (id: number | null) => void;
  readonly onSelect: (id: number) => void;
  readonly actionsQueue: readonly ActiveAction[];
  readonly setActionsQueue: (next: readonly ActiveAction[]) => void;
}

export function SignalOrchardScene({
  fallback,
  overlay,
  mode,
  selectedAction,
  hoveredId,
  onHover,
  onSelect,
  actionsQueue,
  setActionsQueue,
}: Props) {
  const actionsRef = useRef<readonly ActiveAction[]>(actionsQueue);
  actionsRef.current = actionsQueue;

  // Trim expired actions periodically.
  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = performance.now() / 1000;
      const next = actionsQueue.filter((a) => now - a.startedAt < ACTION_TTL_S);
      if (next.length !== actionsQueue.length) setActionsQueue(next);
    }, 600);
    return () => window.clearInterval(interval);
  }, [actionsQueue, setActionsQueue]);

  // Guided mode auto-fires actions in a slow rotation around the orchard.
  useEffect(() => {
    if (mode !== "guided") return;
    let nodeId = 0;
    const interval = window.setInterval(() => {
      const now = performance.now() / 1000;
      setActionsQueue([
        ...actionsRef.current.filter((a) => now - a.startedAt < ACTION_TTL_S),
        { originId: nodeId, startedAt: now, kind: guidedKind(nodeId) },
      ]);
      nodeId = (nodeId + 7) % 28;
    }, 2200);
    return () => window.clearInterval(interval);
  }, [mode, setActionsQueue]);

  return (
    <SceneCanvas
      ariaLabel="Signal Orchard interactive scene"
      fallback={fallback}
      overlay={overlay}
      moduleSlug="signal-orchard"
      camera={{ position: [10, 8, 10], fov: 38, near: 0.1, far: 80 }}
      frameloop="always"
    >
      <OrchardContext.Provider value={{ actions: actionsRef }}>
        <SceneLighting />
        <Ground />
        <SignalNetwork />
        <Trees
          onSelect={onSelect}
          hoveredId={hoveredId}
          setHoveredId={onHover}
          selectedAction={selectedAction}
        />
        <CameraRig />
      </OrchardContext.Provider>
    </SceneCanvas>
  );
}

function guidedKind(nodeId: number): ActionKind {
  const kinds: readonly ActionKind[] = ["discover", "buy", "wait", "sell"];
  return kinds[nodeId % kinds.length] ?? "buy";
}
