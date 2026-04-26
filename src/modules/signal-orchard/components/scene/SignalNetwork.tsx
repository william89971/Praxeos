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
import { useOrchardRefs } from "../../lib/orchardContext";
import { actorNodes, neighbourLinks } from "../../lib/orchardLayout";
import { buildAdjacency, pulsesAt } from "../../lib/signals";

export function SignalNetwork() {
  const nodes = useMemo(() => actorNodes(), []);
  const links = useMemo(() => neighbourLinks(nodes, 3), [nodes]);
  const adjacency = useMemo(() => buildAdjacency(links), [links]);
  const ids = useMemo(() => nodes.map((n) => n.id), [nodes]);
  const colors = useSceneColors();
  const groupRef = useRef<Group>(null);
  const { actions } = useOrchardRefs();

  const baseColor = useMemo(
    () => new Color().lerpColors(colors["--ink-tertiary"], colors["--paper"], 0.05),
    [colors],
  );
  const liveColor = useMemo(() => colors["--accent-bitcoin"], [colors]);

  const tubes = useMemo(() => {
    return links.map((link) => {
      const a = nodes[link.from];
      const b = nodes[link.to];
      if (!a || !b) return null;
      const ax = new Vector3(a.x, 0.45, a.z);
      const bx = new Vector3(b.x, 0.45, b.z);
      const mid = new Vector3((a.x + b.x) / 2, 0.6, (a.z + b.z) / 2);
      const curve = new CatmullRomCurve3([ax, mid, bx], false, "centripetal");
      return new TubeGeometry(curve, 18, 0.018, 4, false);
    });
  }, [nodes, links]);

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.getElapsedTime();
    const pulses = pulsesAt(t, actions.current, adjacency, ids);
    const tmp = new Color();

    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const child = g.children[i] as Mesh | undefined;
      if (!link || !child) continue;
      const a = pulses.get(link.from)?.intensity ?? 0;
      const b = pulses.get(link.to)?.intensity ?? 0;
      const intensity = Math.max(a, b);
      const mat = child.material as MeshStandardMaterial;
      tmp.lerpColors(baseColor, liveColor, intensity);
      mat.color.copy(tmp);
      mat.emissive.copy(tmp);
      mat.emissiveIntensity = 0.06 + intensity * 1.2;
      mat.opacity = 0.25 + intensity * 0.7;
    }
  });

  return (
    <group ref={groupRef}>
      {tubes.map((geom, i) => {
        const link = links[i];
        if (!geom || !link) return null;
        return (
          <mesh key={`link-${link.from}-${link.to}`} geometry={geom}>
            <meshStandardMaterial
              color={baseColor}
              emissive={baseColor}
              emissiveIntensity={0.06}
              roughness={0.4}
              transparent
              opacity={0.3}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}
