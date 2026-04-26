"use client";

import { useIsOnScreen } from "@/hooks/useIsOnScreen";
import { useSceneColors } from "@/sketches/lib/tokenColors";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
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
  /** 0..1 distortion (slider value). The eased value lives in a ref. */
  readonly distortion: number;
}

const MOBILE = 720;

export function MonetaryGardenScene({ distortion }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onScreen = useIsOnScreen(containerRef, { threshold: 0.05 });
  const deviceClass = useDeviceClass();

  const targetRef = useRef(distortion);
  const easedRef = useRef(distortion);

  useEffect(() => {
    targetRef.current = distortion;
  }, [distortion]);

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0 }}>
      {onScreen ? (
        <DistortionContext.Provider value={{ target: targetRef, eased: easedRef }}>
          <Canvas
            shadows={false}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            camera={{ position: [0, 9, 14], fov: 38, near: 0.1, far: 80 }}
            style={{ width: "100%", height: "100%" }}
          >
            <Suspense fallback={null}>
              <SceneBackground />
              <SceneLighting />
              <Easer />

              <Ground />
              <Water />
              <Grass deviceClass={deviceClass} />
              <Trees deviceClass={deviceClass} />
              <ProductionNodes />
              <Paths />
              <DeadZones />
              <SignalBeam />
              {deviceClass === "desktop" ? <AmbientParticles /> : null}

              <CameraRig />
            </Suspense>
          </Canvas>
        </DistortionContext.Provider>
      ) : null}
    </div>
  );
}

function Easer() {
  const refs = useDistortionRefs();
  useFrame(() => {
    const next = refs.eased.current + (refs.target.current - refs.eased.current) * 0.12;
    refs.eased.current = next;
  });
  return null;
}

function SceneBackground() {
  const colors = useSceneColors();
  return <color attach="background" args={[colors["--paper-sunk"]]} />;
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
