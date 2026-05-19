"use client";

import { useSceneColors } from "@/sketches/lib/tokenColors";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, type Group, type Mesh, type MeshStandardMaterial } from "three";
import { useCoordinationRefs } from "../../lib/coordinationContext";
import { type CoordPulse, paramsForState } from "../../lib/distortion";
import { agentNodes } from "../../lib/networkLayout";

interface Props {
  readonly pulse: CoordPulse | undefined;
  readonly onNodePulse: ((id: number) => void) | undefined;
}

export function AgentNodes({ pulse, onNodePulse }: Props) {
  const nodes = useMemo(() => agentNodes(), []);
  const colors = useSceneColors();
  const groupRef = useRef<Group>(null);
  const { eased } = useCoordinationRefs();
  const pulseElapsedRef = useRef(99);
  const pulseNonceRef = useRef<number | undefined>(undefined);

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
  const demandColor = useMemo(
    () => new Color().lerpColors(colors["--accent-action"], colors["--paper"], 0.18),
    [colors],
  );
  const supplyColor = useMemo(
    () => new Color().lerpColors(colors["--accent-bitcoin"], colors["--paper"], 0.1),
    [colors],
  );
  const tmp = useMemo(() => new Color(), []);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    if (pulseNonceRef.current !== pulse?.nonce) {
      pulseNonceRef.current = pulse?.nonce;
      pulseElapsedRef.current = 0;
    }
    pulseElapsedRef.current += delta;
    const t = state.clock.getElapsedTime();
    const params = paramsForState(eased.current);
    const pulseForce = Math.max(0, 1 - pulseElapsedRef.current / 1.35);
    const pulseColor = pulse?.kind === "supply" ? supplyColor : demandColor;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const child = g.children[i] as Mesh | undefined;
      if (!node || !child) continue;
      const mat = child.material as MeshStandardMaterial;

      // Synchronized pulse at low distortion; phase-dispersed at high.
      const sharedPhase = t * 1.4;
      const ownPhase = t * 1.4 + node.phase * Math.PI * 2;
      const phase = sharedPhase + (ownPhase - sharedPhase) * (1 - params.coherence);
      const rhythm = 0.4 + Math.sin(phase) * 0.4;
      const originBoost = node.id === pulse?.nodeId ? pulseForce : 0;

      tmp.lerpColors(calmColor, corruptedColor, params.corruption);
      tmp.lerp(pulseColor, originBoost * 0.85);
      mat.color.copy(tmp);
      mat.emissive.copy(tmp);
      mat.emissiveIntensity = rhythm * params.intensity + originBoost * 1.3 + 0.05;

      const scale = 1 + (rhythm - 0.5) * 0.18 + originBoost * 0.45;
      child.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((n) => (
        <mesh
          key={`a-${n.id}`}
          position={[n.x, n.y, n.z]}
          onPointerDown={(event) => {
            event.stopPropagation();
            onNodePulse?.(n.id);
          }}
        >
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
