"use client";

import { useIsOnScreen } from "@/hooks/useIsOnScreen";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Canvas, type CanvasProps } from "@react-three/fiber";
import { type ReactNode, Suspense, useEffect, useRef, useState } from "react";

interface SceneCanvasProps {
  /** Children rendered inside the R3F canvas. */
  readonly children: ReactNode;
  /** Rendered when reduced-motion is on or before the scene mounts. */
  readonly fallback: ReactNode;
  /** Rendered as the surrounding non-canvas chrome (overlays, etc.). */
  readonly overlay?: ReactNode;
  /** Camera initial config. */
  readonly camera?: CanvasProps["camera"];
  /** Frameloop mode. Defaults to "always" for breathing scenes. */
  readonly frameloop?: CanvasProps["frameloop"];
  /** Background CSS color. Defaults to var(--paper-sunk). */
  readonly background?: string;
  /** Container height. */
  readonly height?: string;
  /** A11y label for the canvas region. */
  readonly ariaLabel: string;
}

/**
 * Reusable R3F canvas wrapper for Praxeos modules. Handles SSR-safe
 * mounting (only mounts when on-screen), reduced-motion fallback, DPR
 * clamping, antialias, and a Suspense boundary so glTF / heavy assets
 * load gracefully.
 *
 * Usage:
 *
 *   <SceneCanvas
 *     fallback={<ReducedMotionPoster />}
 *     ariaLabel="Coordination Engine 3D scene"
 *     overlay={<MyOverlay />}
 *     camera={{ position: [0, 6, 12], fov: 38 }}
 *   >
 *     <SceneLighting />
 *     <MyMeshes />
 *   </SceneCanvas>
 */
export function SceneCanvas({
  children,
  fallback,
  overlay,
  camera,
  frameloop = "always",
  background = "var(--paper-sunk)",
  height = "min(92vh, 900px)",
  ariaLabel,
}: SceneCanvasProps) {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const onScreen = useIsOnScreen(containerRef, { threshold: 0.05 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (onScreen) setMounted(true);
  }, [onScreen]);

  if (reducedMotion) {
    return (
      <div style={{ position: "relative", height, background, overflow: "hidden" }}>
        {fallback}
        {overlay}
      </div>
    );
  }

  return (
    <section
      ref={containerRef}
      aria-label={ariaLabel}
      style={{
        position: "relative",
        width: "100%",
        height,
        background,
        borderBlock: "1px solid var(--rule)",
        overflow: "hidden",
      }}
    >
      {mounted ? (
        <Canvas
          shadows={false}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={camera ?? { position: [0, 6, 12], fov: 38, near: 0.1, far: 100 }}
          frameloop={frameloop}
          style={{ width: "100%", height: "100%" }}
        >
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      ) : (
        <div style={{ position: "absolute", inset: 0 }}>{fallback}</div>
      )}
      {overlay}
    </section>
  );
}
