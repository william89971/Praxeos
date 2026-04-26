"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  type Group,
  type LineBasicMaterial,
  type Vector3,
} from "three";

interface OrbitConfig {
  readonly radius: number;
  readonly tilt: readonly [number, number, number];
  readonly speed: number;
  readonly color: string;
  readonly opacity: number;
}

const ORBITS: readonly OrbitConfig[] = [
  { radius: 2.1, tilt: [0.32, 0.0, 0.0], speed: 0.18, color: "#e0922c", opacity: 0.55 },
  {
    radius: 2.6,
    tilt: [-0.18, 0.4, 0.12],
    speed: -0.12,
    color: "#5fae9b",
    opacity: 0.4,
  },
  {
    radius: 3.2,
    tilt: [0.05, -0.55, 0.22],
    speed: 0.07,
    color: "#c79768",
    opacity: 0.28,
  },
];

const SEGMENTS = 256;

export function OrbitalLines() {
  const groupRef = useRef<Group>(null);

  const geometries = useMemo(() => {
    return ORBITS.map(() => {
      const geom = new BufferGeometry();
      const positions = new Float32Array((SEGMENTS + 1) * 3);
      for (let i = 0; i <= SEGMENTS; i++) {
        const a = (i / SEGMENTS) * Math.PI * 2;
        positions[i * 3] = Math.cos(a);
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = Math.sin(a);
      }
      geom.setAttribute("position", new Float32BufferAttribute(positions, 3));
      return geom;
    });
  }, []);

  const colors = useMemo(() => ORBITS.map((o) => new Color(o.color)), []);

  useFrame((_state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    for (let i = 0; i < ORBITS.length; i++) {
      const orbit = ORBITS[i];
      const child = g.children[i];
      if (!orbit || !child) continue;
      child.rotation.y += delta * orbit.speed;
    }
  });

  // biome-ignore lint/suspicious/noExplicitAny: R3F primitive element typing limitation
  const LinePrimitive = "line" as any;

  return (
    <group ref={groupRef}>
      {ORBITS.map((orbit, i) => (
        <group
          key={`orbit-${orbit.radius}`}
          rotation={[orbit.tilt[0], orbit.tilt[1], orbit.tilt[2]]}
        >
          <LinePrimitive
            scale={orbit.radius}
            // biome-ignore lint/suspicious/noExplicitAny: R3F primitive prop typing limitation
            geometry={geometries[i] as any}
          >
            <lineBasicMaterial
              color={colors[i] as Color}
              transparent
              opacity={orbit.opacity}
              blending={AdditiveBlending}
              toneMapped={false}
            />
          </LinePrimitive>
          <SatelliteBead radius={orbit.radius} color={orbit.color} />
        </group>
      ))}
    </group>
  );
}

/** A small bright bead that travels along each orbital ring. */
function SatelliteBead({
  radius,
  color,
}: { readonly radius: number; readonly color: string }) {
  const ref = useRef<{ position: Vector3 } | null>(null);
  useFrame((state) => {
    const node = ref.current;
    if (!node) return;
    const t = state.clock.getElapsedTime() * (radius * 0.08 + 0.18);
    node.position.x = Math.cos(t) * radius;
    node.position.z = Math.sin(t) * radius;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.045, 12, 12]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
type _Unused = LineBasicMaterial;
