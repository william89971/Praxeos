"use client";

import { GltfAsset } from "@/sketches/lib/GltfAsset";
import { useSceneColors } from "@/sketches/lib/tokenColors";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  Color,
  type Group,
  MathUtils,
  type Mesh,
  type MeshStandardMaterial,
} from "three";
import { useOrchardRefs } from "../../lib/orchardContext";
import { actorNodes, neighbourLinks } from "../../lib/orchardLayout";
import type { ActionKind } from "../../lib/signals";
import { buildAdjacency, pulsesAt } from "../../lib/signals";

interface Props {
  readonly onSelect: (id: number) => void;
  readonly hoveredId: number | null;
  readonly setHoveredId: (id: number | null) => void;
  readonly selectedAction: ActionKind;
}

export function Trees({ onSelect, hoveredId, setHoveredId, selectedAction }: Props) {
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
  const actionColors = useMemo(
    () => ({
      buy: colors["--accent-bitcoin"],
      sell: colors["--accent-action"],
      wait: colors["--ink-secondary"],
      discover: colors["--accent-capital"],
    }),
    [colors],
  );
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

      // Canopy color: lerp toward the dominant action signal when intensity > 0.
      const canopy = child.getObjectByName(`signal-canopy-${node.id}`) as
        | Mesh
        | undefined;
      const mat = canopy?.material as MeshStandardMaterial | undefined;
      if (mat) {
        tmp.lerpColors(
          calmColor,
          actionColors[pulse?.kind ?? selectedAction],
          intensity,
        );
        mat.color.copy(tmp);
        mat.emissive.copy(tmp);
        mat.emissiveIntensity =
          0.18 + intensity * 0.9 + (isHovered ? 0.22 : 0) + (pulse?.origin ? 0.25 : 0);
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
          {hoveredId === n.id ? (
            <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.5, 0.62, 24]} />
              <meshBasicMaterial
                color={actionColors[selectedAction]}
                transparent
                opacity={0.45}
                toneMapped={false}
              />
            </mesh>
          ) : null}
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
            <mesh
              name={`signal-canopy-${n.id}`}
              position={[0, 0.36 + n.height * 0.55, 0]}
            >
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
