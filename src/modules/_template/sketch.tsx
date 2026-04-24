"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Module sketch.
 *
 * Requirements:
 * 1. SSR-safe: all canvas/p5/regl/three code must be guarded by useEffect.
 * 2. Pause when offscreen via IntersectionObserver.
 * 3. Respect prefers-reduced-motion — swap for <PosterFallback /> when true.
 * 4. Clean up on unmount (return a teardown fn from the effect).
 * 5. Seeded RNG only. No Math.random.
 *
 * Replace the placeholder rendering below with your sketch.
 */
export default function Sketch() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setActive(entry.isIntersecting);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Placeholder sketch — replace with real generative content"
      style={{
        width: "100%",
        aspectRatio: "16 / 9",
        background: "var(--paper-elevated)",
        display: "grid",
        placeItems: "center",
        fontFamily: "var(--font-mono)",
        fontSize: "var(--step--1)",
        color: "var(--ink-tertiary)",
      }}
    >
      <span>sketch.tsx · {active ? "active" : "paused"}</span>
    </div>
  );
}
