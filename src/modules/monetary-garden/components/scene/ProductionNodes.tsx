"use client";

import { useSceneColors } from "@/sketches/lib/tokenColors";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, type Group, type Mesh, type MeshStandardMaterial } from "three";
import { paramsFor } from "../../lib/distortion";
import { useDistortionRefs } from "../../lib/distortionContext";
import { type NodePos, nodePositions } from "../../lib/gardenLayout";

export function ProductionNodes() {
  const nodes = useMemo(() => nodePositions(), []);
  const colors = useSceneColors();
  const groupRef = useRef<Group>(null);
  const { eased } = useDistortionRefs();

  const calmColor = useMemo(
    () =>
      new Color().lerpColors(
        colors["--accent-bitcoin"],
        colors["--paper-elevated"],
        0.4,
      ),
    [colors],
  );
  const corruptedColor = useMemo(
    () =>
      new Color().lerpColors(colors["--accent-action"], colors["--ink-secondary"], 0.2),
    [colors],
  );

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    const params = paramsFor(eased.current);
    const t = state.clock.getElapsedTime();

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const child = group.children[i] as Mesh | undefined;
      if (!node || !child) continue;
      const mat = child.material as MeshStandardMaterial;

      // Calm pulse: slow sine. Distorted: chaotic frequency mix.
      const calmPulse = 0.6 + Math.sin(t * 1.2 + node.phase * Math.PI * 2) * 0.4;
      const chaotic =
        0.4 +
        Math.sin(t * 4.1 + node.phase * 9.2) * 0.3 +
        Math.cos(t * 7.3 + node.phase * 4.8) * 0.3;
      const intensity = calmPulse + (chaotic - calmPulse) * params.nodeChaos;
      mat.emissiveIntensity = Math.max(0, intensity);

      // Drift in/out of color as corruption rises.
      mat.color.lerpColors(calmColor, corruptedColor, params.signalCorruption);
      mat.emissive.copy(mat.color);

      // Pulse scale subtly with the same envelope.
      const scale = 1 + (intensity - 0.5) * 0.15;
      child.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node) => (
        <NodeMesh
          key={`${node.x.toFixed(3)}:${node.z.toFixed(3)}`}
          node={node}
          color={calmColor}
        />
      ))}
    </group>
  );
}

function NodeMesh({ node, color }: { readonly node: NodePos; readonly color: Color }) {
  return (
    <mesh position={[node.x, 0.45, node.z]}>
      <octahedronGeometry args={[0.32, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.7}
        roughness={0.35}
        metalness={0.05}
        toneMapped={false}
        flatShading
      />
    </mesh>
  );
}
