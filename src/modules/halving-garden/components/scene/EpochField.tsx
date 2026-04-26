"use client";

import { Instance, Instances } from "@react-three/drei";
import { useMemo } from "react";
import { Color } from "three";
import {
  type EpochLayout,
  HALL_HALF_WIDTH,
  PAGE_TILT,
  buildEpochMarkers,
} from "../../lib/sceneLayout";
import { useSceneColors } from "../../lib/tokenColors";

interface Props {
  readonly layout: EpochLayout;
  /**
   * Index of the most recently arrived live epoch — its block markers are
   * dimmed slightly so the live ghost-layer reads against them.
   */
  readonly liveEpochIndex: number | null;
  readonly onHover: (info: { epochIndex: number } | null) => void;
  readonly onSelect: (info: { epochIndex: number }) => void;
}

const PAGE_HEIGHT = 0.04;

export function EpochField({ layout, liveEpochIndex, onHover, onSelect }: Props) {
  const colors = useSceneColors();
  const markers = useMemo(
    () => buildEpochMarkers(layout, layout.markerCount),
    [layout],
  );

  const isLive = liveEpochIndex === layout.epoch.index;
  const subsidyTint = useMemo(() => {
    const ink = colors["--ink-primary"];
    const bitcoin = colors["--accent-bitcoin"];
    const t = Math.max(0, Math.min(1, (1 - layout.intensity) * 0.55));
    return new Color().lerpColors(bitcoin, ink, 1 - t);
  }, [colors, layout.intensity]);

  return (
    <group
      position={[0, 0, layout.zCenter]}
      rotation={[PAGE_TILT, 0, 0]}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHover({ epochIndex: layout.epoch.index });
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        onHover(null);
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
        onSelect({ epochIndex: layout.epoch.index });
      }}
    >
      <mesh position={[0, -2.6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[HALL_HALF_WIDTH * 2, layout.zFar - layout.zNear]} />
        <meshStandardMaterial
          color={colors["--paper-sunk"]}
          roughness={0.95}
          metalness={0}
        />
      </mesh>

      <mesh position={[0, -2.55, 0]}>
        <boxGeometry
          args={[
            HALL_HALF_WIDTH * 2 - 0.4,
            PAGE_HEIGHT,
            layout.zFar - layout.zNear - 0.6,
          ]}
        />
        <meshStandardMaterial
          color={colors["--paper-elevated"]}
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      <Instances
        limit={Math.max(layout.markerCount, 1)}
        range={layout.markerCount}
        castShadow={false}
        receiveShadow={false}
      >
        <coneGeometry args={[0.18, 0.55, 6, 1, false]} />
        <meshStandardMaterial
          color={subsidyTint}
          emissive={colors["--accent-bitcoin"]}
          emissiveIntensity={isLive ? 0.18 : 0.32 * layout.intensity + 0.05}
          roughness={0.55}
          metalness={0.05}
          toneMapped={false}
        />
        {markers.map((m) => (
          <Instance
            key={`${layout.epoch.index}:${m.x.toFixed(3)}:${m.z.toFixed(3)}`}
            position={[m.x, m.y, m.z - layout.zCenter]}
            rotation={[0, m.rotation, 0]}
            scale={m.scale}
          />
        ))}
      </Instances>
    </group>
  );
}
