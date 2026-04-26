"use client";

import { useSceneColors } from "@/sketches/lib/tokenColors";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, type Group, MathUtils, type Mesh, type MeshBasicMaterial } from "three";
import { paramsFor } from "../../lib/distortion";
import { useDistortionRefs } from "../../lib/distortionContext";
import { type DeadZonePos, deadZonePositions } from "../../lib/gardenLayout";

export function DeadZones() {
  const zones = useMemo(() => deadZonePositions(), []);
  const colors = useSceneColors();
  const groupRef = useRef<Group>(null);
  const { eased } = useDistortionRefs();

  const zoneColor = useMemo(
    () =>
      new Color().lerpColors(colors["--accent-action"], colors["--ink-primary"], 0.55),
    [colors],
  );

  useFrame((_state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const params = paramsFor(eased.current);

    for (let i = 0; i < zones.length; i++) {
      const zone = zones[i];
      const child = group.children[i] as Mesh | undefined;
      if (!zone || !child) continue;
      const mat = child.material as MeshBasicMaterial;

      const targetScale =
        eased.current >= zone.activates
          ? params.deadZoneArea * (0.85 + (i % 3) * 0.18)
          : 0;
      const next = MathUtils.damp(child.scale.x, targetScale, 1.6, delta);
      child.scale.setScalar(Math.max(next, 0.0001));
      mat.opacity = MathUtils.clamp(targetScale * 0.85, 0, 0.85);
    }
  });

  return (
    <group ref={groupRef}>
      {zones.map((zone) => (
        <DeadZoneMesh
          key={`${zone.x.toFixed(3)}:${zone.z.toFixed(3)}`}
          zone={zone}
          color={zoneColor}
        />
      ))}
    </group>
  );
}

function DeadZoneMesh({
  zone,
  color,
}: { readonly zone: DeadZonePos; readonly color: Color }) {
  return (
    <mesh position={[zone.x, 0.012, zone.z]} rotation={[-Math.PI / 2, 0, 0]} scale={0}>
      <ringGeometry args={[0, zone.radius, 36]} />
      <meshBasicMaterial color={color} transparent opacity={0} toneMapped={false} />
    </mesh>
  );
}
