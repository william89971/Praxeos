"use client";

import { useSceneColors } from "@/sketches/lib/tokenColors";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  CatmullRomCurve3,
  Color,
  type Group,
  type Mesh,
  type MeshStandardMaterial,
  TubeGeometry,
  Vector3,
} from "three";
import { useCoordinationRefs } from "../../lib/coordinationContext";
import { type CoordPulse, paramsForState } from "../../lib/distortion";
import { agentNodes, edges } from "../../lib/networkLayout";

interface Props {
  readonly pulse: CoordPulse | undefined;
}

export function SignalEdges({ pulse }: Props) {
  const nodes = useMemo(() => agentNodes(), []);
  const links = useMemo(() => edges(nodes), [nodes]);
  const colors = useSceneColors();
  const groupRef = useRef<Group>(null);
  const { eased } = useCoordinationRefs();
  const pulseElapsedRef = useRef(99);
  const pulseNonceRef = useRef<number | undefined>(undefined);

  const calmColor = useMemo(
    () =>
      new Color().lerpColors(colors["--accent-bitcoin"], colors["--ink-primary"], 0.32),
    [colors],
  );
  const corruptedColor = useMemo(
    () =>
      new Color().lerpColors(colors["--accent-action"], colors["--ink-tertiary"], 0.35),
    [colors],
  );
  const demandColor = useMemo(
    () => new Color().lerpColors(colors["--accent-action"], colors["--paper"], 0.12),
    [colors],
  );
  const supplyColor = useMemo(
    () => new Color().lerpColors(colors["--accent-bitcoin"], colors["--paper"], 0.08),
    [colors],
  );

  const tubes = useMemo(() => {
    return links.map((edge) => {
      const a = nodes[edge.from];
      const b = nodes[edge.to];
      if (!a || !b) return null;
      const ax = new Vector3(a.x, a.y, a.z);
      const bx = new Vector3(b.x, b.y, b.z);
      // Curve up slightly between rings, otherwise nearly flat.
      const mid = new Vector3((a.x + b.x) / 2, (a.y + b.y) / 2 + 0.3, (a.z + b.z) / 2);
      const curve = new CatmullRomCurve3([ax, mid, bx], false, "centripetal");
      return new TubeGeometry(curve, 22, 0.022, 4, false);
    });
  }, [nodes, links]);

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
    const pulseForce = Math.max(0, 1 - pulseElapsedRef.current / 1.55);
    const pulseColor = pulse?.kind === "supply" ? supplyColor : demandColor;

    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const child = g.children[i] as Mesh | undefined;
      if (!link || !child) continue;
      const mat = child.material as MeshStandardMaterial;

      tmp.lerpColors(calmColor, corruptedColor, params.corruption);
      const linkedToPulse =
        pulse !== undefined && (link.from === pulse.nodeId || link.to === pulse.nodeId);
      tmp.lerp(pulseColor, linkedToPulse ? pulseForce * 0.9 : 0);
      mat.color.copy(tmp);
      mat.emissive.copy(tmp);

      // Pulse traveling along edge with phase modulated by distortion.
      const phase = t * 1.6 + link.seed * Math.PI * 2;
      const edgePulse = 0.5 + Math.sin(phase) * 0.5;

      // Stochastic breakage: at high distortion, randomly drop edges out.
      const breakWindow = Math.sin(t * 0.7 + link.seed * 9.13) * 0.5 + 0.5;
      const broken = breakWindow < params.breakage;

      mat.emissiveIntensity = broken
        ? 0.04
        : 0.18 + edgePulse * 0.9 * params.intensity + (linkedToPulse ? pulseForce : 0);
      mat.opacity = broken
        ? 0.12
        : 0.45 + 0.5 * params.throughput + (linkedToPulse ? pulseForce * 0.22 : 0);
    }
  });

  return (
    <group ref={groupRef}>
      {tubes.map((geom, i) => {
        const link = links[i];
        if (!geom || !link) return null;
        return (
          <mesh key={`e-${link.from}-${link.to}`} geometry={geom}>
            <meshStandardMaterial
              color={calmColor}
              emissive={calmColor}
              emissiveIntensity={0.5}
              roughness={0.32}
              transparent
              opacity={0.6}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}
