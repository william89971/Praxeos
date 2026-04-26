"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { ACESFilmicToneMapping } from "three";
import { AmbientParticles } from "./scene/AmbientParticles";
import { CameraRig } from "./scene/CameraRig";
import { MonetaryPlanet } from "./scene/MonetaryPlanet";
import { OrbitalLines } from "./scene/OrbitalLines";
import { SceneLighting } from "./scene/SceneLighting";

const MOBILE = 720;

export function HomeHeroScene() {
  const isMobile = useIsMobile();

  return (
    <Canvas
      shadows={false}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
      camera={{ position: [0, 0.3, 6.2], fov: 38, near: 0.1, far: 60 }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <SceneLighting />
        <MonetaryPlanet />
        <OrbitalLines />
        <AmbientParticles count={isMobile ? 220 : 600} radius={7} />
        <CameraRig />
      </Suspense>
    </Canvas>
  );
}

function useIsMobile(): boolean {
  const [m, setM] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(`(max-width: ${MOBILE}px)`);
    const update = () => setM(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return m;
}
