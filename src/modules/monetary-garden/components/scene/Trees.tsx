"use client";

import { GltfAsset } from "@/sketches/lib/GltfAsset";
import { useSceneColors } from "@/sketches/lib/tokenColors";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, type Group, MathUtils } from "three";
import { paramsFor } from "../../lib/distortion";
import { useDistortionRefs } from "../../lib/distortionContext";
import { type TreePos, treePositions } from "../../lib/gardenLayout";

interface Props {
  readonly deviceClass: "desktop" | "mobile";
}

export function Trees({ deviceClass }: Props) {
  const trees = useMemo(() => treePositions(deviceClass), [deviceClass]);
  const groupRef = useRef<Group>(null);
  const { eased } = useDistortionRefs();
  const colors = useSceneColors();

  const healthyCanopy = useMemo(
    () =>
      new Color().lerpColors(colors["--accent-capital"], colors["--ink-primary"], 0.18),
    [colors],
  );
  const wiltedCanopy = useMemo(
    () =>
      new Color().lerpColors(
        colors["--accent-action"],
        colors["--ink-secondary"],
        0.45,
      ),
    [colors],
  );
  const trunkColor = useMemo(
    () =>
      new Color().lerpColors(colors["--ink-secondary"], colors["--ink-primary"], 0.4),
    [colors],
  );

  const tmp = useMemo(() => new Color(), []);

  useFrame((_state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const params = paramsFor(eased.current);
    for (let i = 0; i < trees.length; i++) {
      const child = group.children[i];
      const tree = trees[i];
      if (!child || !tree) continue;
      const collapsed =
        params.treeCollapse > 0 && tree.collapseAt < 0.65 + params.treeCollapse * 0.4;
      const targetTilt = collapsed
        ? 1.1
        : params.signalCorruption * 0.32 * (tree.seed - 0.5);
      child.rotation.z = MathUtils.damp(child.rotation.z, targetTilt, 1.6, delta);
      const targetScaleY = collapsed
        ? 0.45 + tree.seed * 0.15
        : 0.85 + params.treeHealth * 0.4 + tree.seed * 0.1;
      child.scale.y = MathUtils.damp(child.scale.y, targetScaleY, 1.6, delta);
    }
  });

  return (
    <group ref={groupRef}>
      {trees.map((tree) => (
        <Tree
          key={`${tree.x.toFixed(3)}:${tree.z.toFixed(3)}`}
          tree={tree}
          healthyCanopy={healthyCanopy}
          wiltedCanopy={wiltedCanopy}
          trunkColor={trunkColor}
          tmp={tmp}
        />
      ))}
    </group>
  );
}

function Tree({
  tree,
  healthyCanopy,
  wiltedCanopy,
  trunkColor,
  tmp,
}: {
  readonly tree: TreePos;
  readonly healthyCanopy: Color;
  readonly wiltedCanopy: Color;
  readonly trunkColor: Color;
  readonly tmp: Color;
}) {
  const heightSeed = 0.85 + tree.seed * 0.5;
  const trunkH = 0.7 * heightSeed;
  const canopyH = 1.4 * heightSeed;
  const canopyR = 0.55 + tree.seed * 0.25;

  const variant = tree.variant;
  const canopySegments = variant === 0 ? 6 : variant === 1 ? 7 : 5;

  const canopyMatRef = useRef<{ color: Color }>(null);
  const { eased } = useDistortionRefs();

  useFrame(() => {
    const mat = canopyMatRef.current;
    if (!mat) return;
    const params = paramsFor(eased.current);
    tmp.lerpColors(healthyCanopy, wiltedCanopy, 1 - params.treeHealth);
    mat.color.copy(tmp);
  });

  return (
    <group position={[tree.x, 0, tree.z]}>
      <GltfAsset
        src={`/models/monetary-garden/tree-${tree.variant}.glb`}
        scale={[0.85 + tree.seed * 0.4, heightSeed, 0.85 + tree.seed * 0.4]}
      >
        <mesh position={[0, trunkH * 0.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.06, 0.09, trunkH, 6]} />
          <meshStandardMaterial color={trunkColor} roughness={0.92} metalness={0.02} />
        </mesh>
        <mesh position={[0, trunkH + canopyH * 0.45, 0]} castShadow>
          <coneGeometry args={[canopyR, canopyH, canopySegments]} />
          <meshStandardMaterial
            ref={canopyMatRef}
            color={healthyCanopy}
            roughness={0.62}
            metalness={0}
            flatShading
          />
        </mesh>
      </GltfAsset>
    </group>
  );
}
