"use client";

import { useIsOnScreen } from "@/hooks/useIsOnScreen";
import {
  dprRangeForQuality,
  usePageVisibility,
  useSceneQuality,
  webglPowerPreference,
} from "@/hooks/useSceneQuality";
import { trackInteraction } from "@/lib/telemetry";
import { useSceneColors } from "@/sketches/lib/tokenColors";
import { Canvas, useFrame } from "@react-three/fiber";
import { type ReactNode, Suspense, useEffect, useRef, useState } from "react";
import { ACESFilmicToneMapping } from "three";
import {
  DEFAULT_GARDEN_STATE,
  type GardenState,
  easeGardenState,
  paramsForState,
} from "../lib/distortion";
import { DistortionContext, useDistortionRefs } from "../lib/distortionContext";
import { AmbientParticles } from "./scene/AmbientParticles";
import { CameraRig } from "./scene/CameraRig";
import { DeadZones } from "./scene/DeadZones";
import { Grass } from "./scene/Grass";
import { Ground } from "./scene/Ground";
import { Paths } from "./scene/Paths";
import { ProductionNodes } from "./scene/ProductionNodes";
import { SceneLighting } from "./scene/SceneLighting";
import { SignalBeam } from "./scene/SignalBeam";
import { Trees } from "./scene/Trees";
import { Water } from "./scene/Water";

interface Props {
  /** Control state. Eased copy lives in a ref for frame updates. */
  readonly state: GardenState;
  /** Poster shown before the canvas is mounted. */
  readonly fallback: ReactNode;
}

const MOBILE = 720;

export function MonetaryGardenScene({ state, fallback }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onScreen = useIsOnScreen(containerRef, { threshold: 0.05 });
  const quality = useSceneQuality();
  const pageVisible = usePageVisibility();
  const deviceClass = useDeviceClass();
  const sceneClass =
    quality === "high" && deviceClass === "desktop" ? "desktop" : "mobile";
  const trackedMountRef = useRef(false);
  const trackedFallbackRef = useRef(false);

  const targetRef = useRef<GardenState>(state);
  const easedRef = useRef<GardenState>(DEFAULT_GARDEN_STATE);

  useEffect(() => {
    targetRef.current = state;
  }, [state]);

  useEffect(() => {
    if (quality !== "poster" || trackedFallbackRef.current) return;
    trackedFallbackRef.current = true;
    trackInteraction("canvas_fallback", {
      moduleSlug: "monetary-garden",
      payload: { quality },
    });
  }, [quality]);

  useEffect(() => {
    if (!onScreen || quality === "poster" || trackedMountRef.current) return;
    trackedMountRef.current = true;
    trackInteraction("webgl_mounted", {
      moduleSlug: "monetary-garden",
      payload: { quality },
    });
  }, [onScreen, quality]);

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0 }}>
      {onScreen && quality !== "poster" ? (
        <DistortionContext.Provider value={{ target: targetRef, eased: easedRef }}>
          <Canvas
            shadows={sceneClass === "desktop" ? "soft" : false}
            dpr={dprRangeForQuality(quality)}
            gl={{
              antialias: quality !== "low",
              alpha: true,
              powerPreference: webglPowerPreference(quality),
              toneMapping: ACESFilmicToneMapping,
              toneMappingExposure: 1.05,
            }}
            camera={{ position: [0, 9, 14], fov: 38, near: 0.1, far: 80 }}
            frameloop={pageVisible ? "always" : "never"}
            style={{ width: "100%", height: "100%" }}
          >
            <Suspense fallback={null}>
              <SceneBackground />
              <SceneFog />
              <SceneLighting deviceClass={sceneClass} />
              <Easer />

              <Ground />
              <Water />
              <Grass deviceClass={sceneClass} />
              <Trees deviceClass={sceneClass} />
              <ProductionNodes />
              <Paths />
              <DeadZones />
              <SignalBeam />
              {sceneClass === "desktop" ? <AmbientParticles /> : null}

              <CameraRig />
            </Suspense>
          </Canvas>
        </DistortionContext.Provider>
      ) : (
        <div style={{ position: "absolute", inset: 0 }}>{fallback}</div>
      )}
    </div>
  );
}

function Easer() {
  const refs = useDistortionRefs();
  useFrame(() => {
    refs.eased.current = easeGardenState(refs.eased.current, refs.target.current, 0.12);
  });
  return null;
}

function SceneBackground() {
  const colors = useSceneColors();
  return <color attach="background" args={[colors["--paper-sunk"]]} />;
}

/**
 * Atmospheric fog that thickens with distortion. The far plane recedes
 * as the system loses coherence, so dead zones at the periphery dissolve
 * into mist rather than ending abruptly.
 */
function SceneFog() {
  const colors = useSceneColors();
  const { eased } = useDistortionRefs();
  const ref = useRef<{
    near: number;
    far: number;
    color: { set: (c: unknown) => void };
  } | null>(null);

  useFrame(() => {
    const fog = ref.current;
    if (!fog) return;
    const params = paramsForState(eased.current);
    fog.near = 14 - params.signalCorruption * 4;
    fog.far = 56 - params.signalCorruption * 18;
    fog.color.set(colors["--paper-sunk"]);
  });

  return <fog ref={ref} attach="fog" args={[colors["--paper-sunk"], 14, 56]} />;
}

function useDeviceClass(): "desktop" | "mobile" {
  const [cls, setCls] = useState<"desktop" | "mobile">("desktop");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(`(max-width: ${MOBILE}px)`);
    const update = () => setCls(mql.matches ? "mobile" : "desktop");
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return cls;
}
