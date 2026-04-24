"use client";

import { useEffect, useRef } from "react";

/**
 * Custom desktop cursor. A 16px crosshair with a 4px trailing dot.
 * Strokes swap to oxblood on [data-interactive="true"] elements.
 * Hidden on touch devices and during text selection.
 */
export function Crosshair() {
  const hairRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const hair = hairRef.current;
    const dot = dotRef.current;
    if (!hair || !dot) return;

    // Hide native cursor only if ours is active
    document.documentElement.classList.add("has-custom-cursor");

    let hx = -100;
    let hy = -100;
    let dx = -100;
    let dy = -100;
    let rafId = 0;

    const onMove = (e: PointerEvent) => {
      hx = e.clientX;
      hy = e.clientY;

      const target = e.target as HTMLElement | null;
      const interactive = target?.closest(
        "[data-interactive], a, button, input, select, textarea, [role='button']",
      );
      hair.dataset.interactive = interactive ? "true" : "false";
    };

    const onSelectionChange = () => {
      const hasSelection = (window.getSelection()?.toString().length ?? 0) > 0;
      hair.style.opacity = hasSelection ? "0" : "1";
      dot.style.opacity = hasSelection ? "0" : "1";
    };

    const tick = () => {
      // Instant crosshair
      hair.style.transform = `translate3d(${hx - 8}px, ${hy - 8}px, 0)`;
      // Lazy dot: chase with ease
      const lag = prefersReducedMotion ? 1 : 0.18;
      dx += (hx - dx) * lag;
      dy += (hy - dy) * lag;
      dot.style.transform = `translate3d(${dx - 2}px, ${dy - 2}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("selectionchange", onSelectionChange);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("selectionchange", onSelectionChange);
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={hairRef}
        aria-hidden="true"
        className="praxeos-cursor-hair"
        data-interactive="false"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          role="presentation"
        >
          <line x1="8" y1="0" x2="8" y2="5" stroke="currentColor" strokeWidth="1" />
          <line x1="8" y1="11" x2="8" y2="16" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="8" x2="5" y2="8" stroke="currentColor" strokeWidth="1" />
          <line x1="11" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div ref={dotRef} aria-hidden="true" className="praxeos-cursor-dot" />
      <style>{`
        html.has-custom-cursor,
        html.has-custom-cursor * {
          cursor: none !important;
        }
        .praxeos-cursor-hair,
        .praxeos-cursor-dot {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 9999;
          will-change: transform;
          color: var(--ink-primary);
          transition: color var(--dur-micro) var(--ease-organic),
                      opacity var(--dur-micro) var(--ease-organic);
        }
        .praxeos-cursor-hair[data-interactive="true"] {
          color: var(--accent-action);
          transform-origin: center;
        }
        .praxeos-cursor-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: currentColor;
        }
      `}</style>
    </>
  );
}
