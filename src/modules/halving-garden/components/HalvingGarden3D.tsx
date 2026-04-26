"use client";

import { useIsOnScreen } from "@/hooks/useIsOnScreen";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { type CameraPreset, type FocusKind, presetFor } from "../lib/cameraPresets";
import { EPOCHS } from "../lib/epochs";
import { HALL_TOTAL_DEPTH, gateZ, getEpochLayouts } from "../lib/sceneLayout";
import { useSceneColors } from "../lib/tokenColors";
import type { Block } from "../lib/types";
import { AmbientParticles } from "./scene/AmbientParticles";
import { CameraRig } from "./scene/CameraRig";
import { EpochField } from "./scene/EpochField";
import { HalvingGate } from "./scene/HalvingGate";
import { LiveBlockMarkers } from "./scene/LiveBlockMarkers";
import { SceneLighting } from "./scene/SceneLighting";

type Mode = "guided" | "explore";

interface Props {
  readonly mode: Mode;
  readonly focus: FocusKind;
  readonly blocks: readonly Block[];
  readonly newest: Block | null;
  readonly onHoverEpoch: (info: { epochIndex: number } | null) => void;
  readonly onSelectEpoch: (info: { epochIndex: number }) => void;
  readonly liveEpochIndex: number | null;
}

const MOBILE_BREAKPOINT = 720;

export function HalvingGarden3D(props: Props) {
  const { mode, focus, blocks, newest, onHoverEpoch, onSelectEpoch, liveEpochIndex } =
    props;
  const containerRef = useRef<HTMLDivElement>(null);
  const onScreen = useIsOnScreen(containerRef, { threshold: 0.05 });

  const deviceClass = useDeviceClass();
  const layouts = useMemo(() => getEpochLayouts(deviceClass), [deviceClass]);
  const preset: CameraPreset = useMemo(() => presetFor(focus), [focus]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        background: "var(--paper-sunk)",
      }}
    >
      {onScreen ? (
        <Canvas
          shadows={false}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{
            position: preset.position,
            fov: preset.fov,
            near: 0.1,
            far: HALL_TOTAL_DEPTH * 1.4,
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <Suspense fallback={null}>
            <SceneBackground />
            <SceneLighting />

            {layouts.map((layout) => (
              <EpochField
                key={layout.epoch.index}
                layout={layout}
                liveEpochIndex={liveEpochIndex}
                onHover={onHoverEpoch}
                onSelect={onSelectEpoch}
              />
            ))}

            {EPOCHS.map((epoch) => {
              const z = gateZ(epoch.index);
              if (z === null) return null;
              const isActive =
                focus.kind === "boundary" && focus.leftEpochIndex === epoch.index;
              return (
                <HalvingGate
                  key={`gate-${epoch.startHeight}`}
                  z={z}
                  leftEpochIndex={epoch.index}
                  active={isActive}
                />
              );
            })}

            {deviceClass === "desktop" ? <AmbientParticles /> : null}

            <LiveBlockMarkers blocks={blocks} newest={newest} />

            <CameraRig preset={preset} mode={mode} />
          </Suspense>
        </Canvas>
      ) : null}
    </div>
  );
}

function SceneBackground() {
  const colors = useSceneColors();
  return <color attach="background" args={[colors["--paper-sunk"]]} />;
}

function useDeviceClass(): "desktop" | "mobile" {
  const [klass, setKlass] = useState<"desktop" | "mobile">("desktop");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const update = () => setKlass(mql.matches ? "mobile" : "desktop");
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return klass;
}
