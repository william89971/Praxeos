"use client";

import { PosterFallback } from "@/components/sketch/PosterFallback";

/**
 * Reduced-motion fallback for the Halving Garden 3D scene.
 * Renders the static SVG poster only — no Canvas, no rAF, no GPU spin-up.
 */
export function ReducedMotionPoster() {
  return (
    <PosterFallback
      src="/posters/halving-garden.svg"
      alt="The Halving Garden poster frame: five epochs of Bitcoin's monetary history."
    />
  );
}
