"use client";

/**
 * GLTF asset loader with a procedural placeholder fallback.
 *
 * Usage:
 *
 *   <GltfAsset src="/models/signal-orchard/cypress.glb">
 *     <ProceduralCypress />
 *   </GltfAsset>
 *
 * If the .glb exists at the given path, drei's `useGLTF` will fetch and
 * cache it; otherwise the children (procedural fallback) render. This
 * lets the codebase ship before any Blender export exists, then upgrade
 * silently as assets are dropped into `/public/models/`.
 *
 * Blender export checklist:
 *   • File → Export → glTF 2.0 (.glb / .gltf)
 *   • Format: glTF Binary (.glb), single file with embedded textures
 *   • Geometry: include normals, tangents (if PBR materials)
 *   • Materials: export, principled BSDF only (avoid node groups)
 *   • Apply transforms before export; +Y up; 1 unit = 1 metre
 *   • Compress with `gltf-pipeline -i in.glb -o out.glb -d` (Draco optional)
 *   • Drop the file at `/public/models/<slug>/<asset>.glb`
 */

import { useGLTF } from "@react-three/drei";
import { type ReactNode, Suspense, useEffect, useState } from "react";
import type { Group } from "three";

interface Props {
  /** Path under /public, e.g. "/models/signal-orchard/cypress.glb". */
  readonly src: string;
  /** Procedural fallback rendered if the asset is missing. */
  readonly children: ReactNode;
  /** Position [x,y,z] applied to the loaded scene. */
  readonly position?: readonly [number, number, number];
  /** Scale, uniform or per-axis. */
  readonly scale?: number | readonly [number, number, number];
  /** Rotation in radians [x,y,z]. */
  readonly rotation?: readonly [number, number, number];
}

/**
 * Module-level cache of HEAD-probe results. Each unique path is fetched
 * once per page load — important because ~40 trees may share the same
 * .glb path; without dedup the dev console would fill with 404s.
 */
const probeCache = new Map<string, Promise<boolean>>();

function probe(src: string): Promise<boolean> {
  const cached = probeCache.get(src);
  if (cached) return cached;
  const next = (async () => {
    try {
      const head = await fetch(src, { method: "HEAD" });
      return head.ok;
    } catch {
      return false;
    }
  })();
  probeCache.set(src, next);
  return next;
}

export function GltfAsset({
  src,
  children,
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
}: Props) {
  const [exists, setExists] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    probe(src).then((ok) => {
      if (!cancelled) setExists(ok);
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (exists === null || exists === false) {
    return (
      <group position={position} scale={scale} rotation={rotation}>
        {children}
      </group>
    );
  }

  return (
    <Suspense fallback={<group position={position}>{children}</group>}>
      <GltfReal src={src} position={position} scale={scale} rotation={rotation} />
    </Suspense>
  );
}

function GltfReal({
  src,
  position,
  scale,
  rotation,
}: {
  readonly src: string;
  readonly position: readonly [number, number, number];
  readonly scale: number | readonly [number, number, number];
  readonly rotation: readonly [number, number, number];
}) {
  const gltf = useGLTF(src) as unknown as { scene: Group };
  return (
    <primitive
      object={gltf.scene.clone()}
      position={position}
      scale={scale}
      rotation={rotation}
    />
  );
}
