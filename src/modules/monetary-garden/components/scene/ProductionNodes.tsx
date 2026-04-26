"use client";

import { GltfAsset } from "@/sketches/lib/GltfAsset";
import { useSceneColors } from "@/sketches/lib/tokenColors";
import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, type Mesh, type MeshStandardMaterial } from "three";
import { paramsFor } from "../../lib/distortion";
import { useDistortionRefs } from "../../lib/distortionContext";
import { type NodePos, nodePositions } from "../../lib/gardenLayout";

export function ProductionNodes() {
  const nodes = useMemo(() => nodePositions(), []);
  const colors = useSceneColors();

  const calmColor = useMemo(
    () =>
      new Color().lerpColors(
        colors["--accent-bitcoin"],
        colors["--paper-elevated"],
        0.32,
      ),
    [colors],
  );
  const corruptedColor = useMemo(
    () =>
      new Color().lerpColors(colors["--accent-action"], colors["--ink-secondary"], 0.2),
    [colors],
  );

  return (
    <group>
      {nodes.map((node) => (
        <Float
          key={`pn-${node.x.toFixed(3)}-${node.z.toFixed(3)}`}
          speed={1.4 + node.phase * 0.6}
          rotationIntensity={0.35}
          floatIntensity={0.45}
          position={[node.x, 0.55, node.z]}
        >
          <NodeMesh node={node} calm={calmColor} corrupted={corruptedColor} />
        </Float>
      ))}
    </group>
  );
}

function NodeMesh({
  node,
  calm,
  corrupted,
}: {
  readonly node: NodePos;
  readonly calm: Color;
  readonly corrupted: Color;
}) {
  const meshRef = useRef<Mesh>(null);
  const matRef = useRef<MeshStandardMaterial>(null);
  const { eased } = useDistortionRefs();

  useFrame((state) => {
    const mesh = meshRef.current;
    const mat = matRef.current;
    if (!mesh || !mat) return;
    const params = paramsFor(eased.current);
    const t = state.clock.getElapsedTime();

    const calmPulse = 0.6 + Math.sin(t * 1.2 + node.phase * Math.PI * 2) * 0.4;
    const chaotic =
      0.4 +
      Math.sin(t * 4.1 + node.phase * 9.2) * 0.3 +
      Math.cos(t * 7.3 + node.phase * 4.8) * 0.3;
    const intensity = calmPulse + (chaotic - calmPulse) * params.nodeChaos;

    mat.color.lerpColors(calm, corrupted, params.signalCorruption);
    mat.emissive.copy(mat.color);
    mat.emissiveIntensity = Math.max(0, intensity);

    const scale = 1 + (intensity - 0.5) * 0.18;
    mesh.scale.setScalar(scale);
  });

  return (
    <GltfAsset src="/models/monetary-garden/production-node.glb" scale={0.32}>
      <mesh ref={meshRef} castShadow>
        <octahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial
          ref={matRef}
          color={calm}
          emissive={calm}
          emissiveIntensity={0.7}
          roughness={0.22}
          metalness={0.45}
          toneMapped={false}
          flatShading
        />
      </mesh>
    </GltfAsset>
  );
}
