"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, Mesh, MeshStandardMaterial, ShaderMaterial } from "three";

/**
 * The "monetary signal sphere" at the centre of the homepage hero.
 *
 * Composition:
 *   • An icosahedral inner core with subtle emissive amber.
 *   • A wireframe outer shell that rotates against the core for parallax.
 *   • A custom fresnel shader rim glow that brightens at grazing angles.
 *
 * No textures, no GLTF — pure geometry tinted by drei's HDR environment.
 */
export function MonetaryPlanet() {
  const groupRef = useRef<Group>(null);
  const wireRef = useRef<Mesh>(null);
  const coreMatRef = useRef<MeshStandardMaterial>(null);
  const rimMatRef = useRef<ShaderMaterial>(null);

  const rimUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorIn: { value: [0.95, 0.65, 0.2] }, // muted gold
      uColorOut: { value: [0.18, 0.62, 0.55] }, // teal signal
      uPower: { value: 2.4 },
      uIntensity: { value: 1.4 },
    }),
    [],
  );

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const group = groupRef.current;
    if (group) {
      group.rotation.y += delta * 0.06;
      group.rotation.x = Math.sin(t * 0.18) * 0.05;
    }
    const wire = wireRef.current;
    if (wire) {
      wire.rotation.y -= delta * 0.04;
      wire.rotation.z += delta * 0.018;
    }
    const core = coreMatRef.current;
    if (core) {
      core.emissiveIntensity = 0.55 + Math.sin(t * 0.6) * 0.07;
    }
    const rim = rimMatRef.current;
    if (rim) {
      const u = rim.uniforms.uTime;
      if (u) u.value = t;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Inner core */}
      <mesh>
        <icosahedronGeometry args={[1.45, 4]} />
        <meshStandardMaterial
          ref={coreMatRef}
          color="#1d1815"
          emissive="#e0922c"
          emissiveIntensity={0.55}
          roughness={0.42}
          metalness={0.6}
          flatShading
          toneMapped={false}
        />
      </mesh>

      {/* Fresnel rim — slightly larger sphere, transparent custom shader */}
      <mesh scale={1.06}>
        <sphereGeometry args={[1.45, 64, 64]} />
        <shaderMaterial
          ref={rimMatRef}
          uniforms={rimUniforms}
          transparent
          depthWrite={false}
          vertexShader={rimVertexShader}
          fragmentShader={rimFragmentShader}
        />
      </mesh>

      {/* Outer wireframe shell */}
      <mesh ref={wireRef} scale={1.18}>
        <icosahedronGeometry args={[1.45, 1]} />
        <meshBasicMaterial
          color="#3d6f63"
          wireframe
          transparent
          opacity={0.32}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

const rimVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const rimFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorIn;
  uniform vec3 uColorOut;
  uniform float uPower;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), uPower);
    float pulse = 0.85 + 0.15 * sin(uTime * 1.2);
    vec3 col = mix(uColorIn, uColorOut, fresnel);
    gl_FragColor = vec4(col, fresnel * uIntensity * pulse);
  }
`;
