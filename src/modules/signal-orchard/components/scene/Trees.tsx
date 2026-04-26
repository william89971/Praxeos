"use client";

import { GltfAsset } from "@/sketches/lib/GltfAsset";
import { useSceneColors } from "@/sketches/lib/tokenColors";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, type Group, MathUtils } from "three";
import { useOrchardRefs } from "../../lib/orchardContext";
import { actorNodes, neighbourLinks } from "../../lib/orchardLayout";
import { buildAdjacency, pulsesAt } from "../../lib/signals";

interface Props {
  readonly onSelect: (id: number) => void;
  readonly hoveredId: number | null;
  readonly setHoveredId: (id: number | null) => void;
}

export function Trees({ onSelect, hoveredId, setHoveredId }: Props) {
  const colors = useSceneColors();
  const nodes = useMemo(() => actorNodes(), []);
  const links = useMemo(() => neighbourLinks(nodes, 3), [nodes]);
  const adjacency = useMemo(() => buildAdjacency(links), [links]);
  const ids = useMemo(() => nodes.map((n) => n.id), [nodes]);
  const groupRef = useRef<Group>(null);
  const { actions } = useOrchardRefs();

  const calmColor = useMemo(
    () =>
      new Color().lerpColors(colors["--accent-capital"], colors["--ink-primary"], 0.18),
    [colors],
  );
  const litColor = useMemo(() => colors["--accent-bitcoin"], [colors]);
  const tmp = useMemo(() => new Color(), []);

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.getElapsedTime();
    const pulses = pulsesAt(t, actions.current, adjacency, ids);

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const child = g.children[i];
      if (!node || !child) continue;
      const pulse = pulses.get(node.id);
      const intensity = pulse?.intensity ?? 0;
      const isHovered = hoveredId === node.id;

      // Sway with seed-based phase.
      child.rotation.z =
        Math.sin(t * 0.7 + node.seed * Math.PI * 2) * 0.04 + intensity * 0.08;

      // Canopy color: lerp toward signal color when intensity > 0.
      const canopy = (child.children[1] ?? null) as {
        material?: { color?: Color; emissive?: Color; emissiveIntensity?: number };
      } | null;
      const mat = canopy?.material;
      if (mat?.color && mat.emissive) {
        tmp.lerpColors(calmColor, litColor, intensity);
        mat.color.copy(tmp);
        mat.emissive.copy(tmp);
        mat.emissiveIntensity = 0.18 + intensity * 0.9 + (isHovered ? 0.18 : 0);
      }

      // Subtle scale bump on intensity.
      const scaleY = MathUtils.damp(child.scale.y, 1 + intensity * 0.18, 6, 0.016);
      child.scale.y = scaleY;
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((n) => (
        <group
          key={n.id}
          position={[n.x, 0, n.z]}
          onPointerOver={(event) => {
            event.stopPropagation();
            setHoveredId(n.id);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={(event) => {
            event.stopPropagation();
            setHoveredId(null);
            document.body.style.cursor = "";
          }}
          onPointerDown={(event) => {
            event.stopPropagation();
            onSelect(n.id);
          }}
        >
          <GltfAsset
            src="/models/signal-orchard/cypress.glb"
            scale={[0.55, n.height * 0.55, 0.55]}
          >
            {/* Procedural cypress fallback — slim spire on a short trunk. */}
            <mesh position={[0, 0.18, 0]}>
              <cylinderGeometry args={[0.07, 0.1, 0.36, 5]} />
              <meshStandardMaterial
                color={colors["--ink-secondary"]}
                roughness={0.85}
              />
            </mesh>
            <mesh position={[0, 0.36 + n.height * 0.55, 0]}>
              <coneGeometry args={[0.42, n.height * 1.4, 7]} />
              <meshStandardMaterial
                color={calmColor}
                emissive={calmColor}
                emissiveIntensity={0.18}
                roughness={0.7}
                flatShading
                toneMapped={false}
              />
            </mesh>
          </GltfAsset>
        </group>
      ))}
    </group>
  );
}
