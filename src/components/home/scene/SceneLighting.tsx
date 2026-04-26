"use client";

import { Environment } from "@react-three/drei";

export function SceneLighting() {
  return (
    <>
      {/* HDR cubemap for indirect tint and reflections on the metallic core. */}
      <Environment preset="night" environmentIntensity={0.55} />
      <ambientLight intensity={0.18} color="#3a4047" />
      <hemisphereLight intensity={0.22} color="#e9d4a3" groundColor="#0a0a0c" />
      <pointLight
        position={[0, 0, 0]}
        intensity={2.5}
        distance={6}
        decay={1.4}
        color="#e0922c"
      />
      <pointLight
        position={[3, 2.5, 4]}
        intensity={0.9}
        distance={12}
        decay={1.6}
        color="#5fae9b"
      />
    </>
  );
}
