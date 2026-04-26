"use client";

/**
 * Subtle edge vignette that deepens the corners and draws the eye
 * toward the center. Pure CSS — no JS overhead.
 */
export function Vignette({ intensity = 0.06 }: { readonly intensity?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
        background: `radial-gradient(ellipse at center, transparent 0%, transparent 55%, rgba(28,24,20,${intensity}) 100%)`,
        mixBlendMode: "multiply",
      }}
    />
  );
}
