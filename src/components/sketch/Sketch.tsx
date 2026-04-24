"use client";

import { useIsOnScreen } from "@/hooks/useIsOnScreen";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { type ReactNode, useEffect, useRef, useState } from "react";

export type SketchRenderFn = (ctx: {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  dpr: number;
  now: number;
  delta: number;
}) => void;

type Props = {
  /** Called every animation frame when the sketch is active. */
  render: SketchRenderFn;
  /** Called once when the canvas mounts. Use for one-time setup. */
  setup?: (ctx: {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    dpr: number;
  }) => void;
  /** Called on unmount or when the sketch stops. Use for teardown. */
  teardown?: () => void;
  /** Alt text / description (read by screen readers). */
  alt: string;
  /** Static poster shown under prefers-reduced-motion. */
  poster?: ReactNode;
  /** Aspect ratio as W/H. Default 16/9. */
  aspectRatio?: number;
  /** Devicepixelratio cap. Default 2 for battery sanity. */
  maxDpr?: number;
  /** CSS className for the wrapper. */
  className?: string;
  /** Passed as `data-module-slug` on the wrapper for analytics/test targeting. */
  moduleSlug?: string;
  /** Stretch to fill parent instead of using aspectRatio. */
  fill?: boolean;
};

/**
 * Canonical sketch wrapper.
 *
 * Contract:
 *   - SSR safe (no canvas until mount).
 *   - Pauses when off-screen via IntersectionObserver.
 *   - Honors prefers-reduced-motion → renders `poster` instead.
 *   - High-DPI canvas with automatic resize.
 *   - Cleans up on unmount.
 */
export function Sketch({
  render,
  setup,
  teardown,
  alt,
  poster,
  aspectRatio = 16 / 9,
  maxDpr = 2,
  className,
  moduleSlug,
  fill = false,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const onScreen = useIsOnScreen(wrapperRef, { threshold: 0.05 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: render/setup/teardown are invoked inside the raf tick loop; re-running this effect when they change would tear down the canvas unnecessarily.
  useEffect(() => {
    if (!mounted || prefersReducedMotion) return;
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    let rafId = 0;
    let lastTime = performance.now();
    let running = false;
    let destroyed = false;

    const resize = () => {
      if (destroyed) return;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const rect = wrapper.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const tick = (now: number) => {
      if (destroyed || !running) return;
      const delta = now - lastTime;
      lastTime = now;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const rect = wrapper.getBoundingClientRect();
      try {
        render({
          canvas,
          width: Math.max(1, Math.floor(rect.width)),
          height: Math.max(1, Math.floor(rect.height)),
          dpr,
          now,
          delta,
        });
      } catch (error) {
        console.error("[Sketch] render error:", error);
        running = false;
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTime = performance.now();
      rafId = requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    };

    resize();
    try {
      setup?.({
        canvas,
        width: Math.max(1, Math.floor(wrapper.getBoundingClientRect().width)),
        height: Math.max(1, Math.floor(wrapper.getBoundingClientRect().height)),
        dpr: Math.min(window.devicePixelRatio || 1, maxDpr),
      });
    } catch (error) {
      console.error("[Sketch] setup error:", error);
    }

    if (onScreen) start();
    else stop();

    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);

    return () => {
      destroyed = true;
      stop();
      ro.disconnect();
      try {
        teardown?.();
      } catch (error) {
        console.error("[Sketch] teardown error:", error);
      }
    };
  }, [mounted, prefersReducedMotion, onScreen, maxDpr]);

  const style: React.CSSProperties = fill
    ? { width: "100%", height: "100%" }
    : { width: "100%", aspectRatio };

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={style}
      data-module-slug={moduleSlug}
      role="img"
      aria-label={alt}
    >
      {prefersReducedMotion && poster ? (
        poster
      ) : (
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}
