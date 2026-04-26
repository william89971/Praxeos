"use client";

import { useSceneColors } from "@/sketches/lib/tokenColors";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, type Group, type Mesh, type MeshStandardMaterial } from "three";
import { useCoordinationRefs } from "../../lib/coordinationContext";
import { paramsFor } from "../../lib/distortion";
import { agentNodes } from "../../lib/networkLayout";

export function AgentNodes() {
  const nodes = useMemo(() => agentNodes(), []);
  const colors = useSceneColors();
  const groupRef = useRef<Group>(null);
  const { eased } = useCoordinationRefs();

  const calmColor = useMemo(
    () =>
      new Color().lerpColors(
        colors["--accent-bitcoin"],
        colors["--paper-elevated"],
        0.3,
      ),
    [colors],
  );
  const corruptedColor = useMemo(
    () =>
      new Color().lerpColors(
        colors["--accent-action"],
        colors["--ink-secondary"],
        0.18,
      ),
    [colors],
  );
  const tmp = useMemo(() => new Color(), []);

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.getElapsedTime();
    const params = paramsFor(eased.current);

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const child = g.children[i] as Mesh | undefined;
      if (!node || !child) continue;
      const mat = child.material as MeshStandardMaterial;

      // Synchronized pulse at low distortion; phase-dispersed at high.
      const sharedPhase = t * 1.4;
      const ownPhase = t * 1.4 + node.phase * Math.PI * 2;
      const phase = sharedPhase + (ownPhase - sharedPhase) * (1 - params.coherence);
      const pulse = 0.4 + Math.sin(phase) * 0.4;

      tmp.lerpColors(calmColor, corruptedColor, params.corruption);
      mat.color.copy(tmp);
      mat.emissive.copy(tmp);
      mat.emissiveIntensity = pulse * params.intensity + 0.05;

      const scale = 1 + (pulse - 0.5) * 0.18;
      child.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((n) => (
        <mesh key={`a-${n.id}`} position={[n.x, n.y, n.z]}>
          <icosahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial
            color={calmColor}
            emissive={calmColor}
            emissiveIntensity={0.6}
            roughness={0.32}
            metalness={0.05}
            toneMapped={false}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}
