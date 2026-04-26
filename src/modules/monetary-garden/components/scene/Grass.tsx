"use client";

import { mulberry32 } from "@/sketches/lib/rng";
import { useSceneColors } from "@/sketches/lib/tokenColors";
import { Instance, Instances } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, MathUtils, type Object3D } from "three";
import { paramsFor } from "../../lib/distortion";
import { useDistortionRefs } from "../../lib/distortionContext";
import { PLOT_HALF } from "../../lib/gardenLayout";

interface Blade {
  readonly x: number;
  readonly z: number;
  readonly r: number;
  readonly s: number;
  /** Per-blade threshold above which it flips to decay color. */
  readonly decayAt: number;
  /** Stable rank in [0, count) used for density gating. */
  readonly rank: number;
}

interface Props {
  readonly deviceClass: "desktop" | "mobile";
}

const DESKTOP_BLADES = 1100;
const MOBILE_BLADES = 460;

export function Grass({ deviceClass }: Props) {
  const count = deviceClass === "mobile" ? MOBILE_BLADES : DESKTOP_BLADES;
  const blades = useMemo(() => generateBlades(count), [count]);
  const colors = useSceneColors();

  const healthy = useMemo(
    () =>
      new Color().lerpColors(
        colors["--accent-capital"],
        colors["--ink-secondary"],
        0.05,
      ),
    [colors],
  );
  const decayed = useMemo(
    () =>
      new Color().lerpColors(colors["--accent-action"], colors["--ink-tertiary"], 0.25),
    [colors],
  );

  return (
    <Instances limit={count} range={count}>
      <planeGeometry args={[0.06, 0.34, 1, 1]} />
      <meshStandardMaterial color={healthy} roughness={0.85} side={2} flatShading />
      {blades.map((b) => (
        <BladeInstance
          key={`${b.x.toFixed(3)}:${b.z.toFixed(3)}`}
          blade={b}
          count={count}
          healthy={healthy}
          decayed={decayed}
        />
      ))}
    </Instances>
  );
}

interface BladeProps {
  readonly blade: Blade;
  readonly count: number;
  readonly healthy: Color;
  readonly decayed: Color;
}

function BladeInstance({ blade, count, healthy, decayed }: BladeProps) {
  // drei's <Instance> exposes a Object3D ref with extra `color` field at runtime.
  const ref = useRef<Object3D | null>(null);
  const tmp = useMemo(() => new Color(), []);
  const { eased } = useDistortionRefs();

  useFrame((_state, delta) => {
    const inst = ref.current;
    if (!inst) return;
    const params = paramsFor(eased.current);

    const shown = Math.round(count * Math.min(1.6, params.grassDensity));
    const visible = blade.rank < shown;
    const isDecayed = blade.decayAt < params.grassDecay;

    const targetY = !visible
      ? 0.0001
      : isDecayed
        ? 0.32
        : 0.85 + params.grassDensity * 0.2 + blade.s * 0.1;
    inst.scale.y = MathUtils.damp(inst.scale.y, targetY, 2.4, delta);

    const colorRef = (inst as Object3D & { color?: Color }).color;
    if (colorRef) {
      tmp.copy(isDecayed ? decayed : healthy);
      colorRef.copy(tmp);
    }
  });

  return (
    <Instance
      ref={ref as unknown as React.Ref<Object3D>}
      position={[blade.x, 0.16, blade.z]}
      rotation={[0, blade.r, 0]}
      scale={[1, blade.s, 1]}
    />
  );
}

function generateBlades(count: number): readonly Blade[] {
  const rng = mulberry32(0x4d_a2_91_8b);
  const out: Blade[] = [];
  for (let i = 0; i < count; i++) {
    const angle = rng() * Math.PI * 2;
    const radius = rng() * (PLOT_HALF - 0.3);
    out.push({
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
      r: rng() * Math.PI,
      s: 0.85 + rng() * 0.4,
      decayAt: rng(),
      rank: i,
    });
  }
  // Shuffle so visibility-cutoff doesn't reveal a coherent ring.
  const rng2 = mulberry32(0x37_2d_a6_b1);
  const shuffled = [...out];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng2() * (i + 1));
    const a = shuffled[i];
    const b = shuffled[j];
    if (!a || !b) continue;
    shuffled[i] = b;
    shuffled[j] = a;
  }
  // Reassign rank to randomized order.
  return shuffled.map((b, idx) => ({ ...b, rank: idx }));
}
