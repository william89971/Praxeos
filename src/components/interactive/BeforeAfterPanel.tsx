"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Compare two economic states or ideas with a draggable divider.
 * Touch-friendly and keyboard-accessible.
 */
export function BeforeAfterPanel({
  beforeLabel,
  afterLabel,
  before,
  after,
  defaultSplit = 50,
}: {
  beforeLabel: string;
  afterLabel: string;
  before: React.ReactNode;
  after: React.ReactNode;
  defaultSplit?: number;
}) {
  const [split, setSplit] = useState(defaultSplit);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLFieldSetElement>(null);

  const updateSplit = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.min(100, Math.max(0, (x / rect.width) * 100));
    setSplit(pct);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    (e.target as Element).setPointerCapture?.(e.pointerId);
    updateSplit(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    updateSplit(e.clientX);
  };

  const onPointerUp = () => {
    setDragging(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setSplit((s) => Math.max(0, s - 5));
    if (e.key === "ArrowRight") setSplit((s) => Math.min(100, s + 5));
    if (e.key === "Home") setSplit(0);
    if (e.key === "End") setSplit(100);
  };

  return (
    <fieldset
      ref={containerRef}
      aria-label={`Comparison: ${beforeLabel} and ${afterLabel}`}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "var(--measure-prose)",
        marginBlock: "2.5rem",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--rule)",
        overflow: "hidden",
        background: "var(--paper-elevated)",
        cursor: dragging ? "grabbing" : "default",
        userSelect: "none",
        touchAction: "none",
      }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0.75rem 1rem",
          borderBlockEnd: "1px solid var(--rule)",
        }}
      >
        <span
          className="label-mono"
          style={{ color: "var(--ink-tertiary)", fontSize: "var(--step--2)" }}
        >
          {beforeLabel}
        </span>
        <span
          className="label-mono"
          style={{ color: "var(--ink-tertiary)", fontSize: "var(--step--2)" }}
        >
          {afterLabel}
        </span>
      </div>

      {/* Panels */}
      <div style={{ position: "relative", height: "12rem", overflow: "hidden" }}>
        {/* After (full background) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "1.25rem",
            opacity: 0.45,
          }}
        >
          {after}
        </div>

        {/* Before (clipped) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${split}%`,
            overflow: "hidden",
            background: "var(--paper)",
            borderInlineEnd: "1px solid var(--rule)",
            padding: "1.25rem",
          }}
        >
          {before}
        </div>

        {/* Divider handle */}
        <button
          type="button"
          aria-label="Drag to compare"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(split)}
          role="slider"
          onPointerDown={onPointerDown}
          onKeyDown={onKeyDown}
          style={{
            position: "absolute",
            left: `${split}%`,
            top: 0,
            bottom: 0,
            width: "24px",
            transform: "translateX(-50%)",
            background: "transparent",
            border: "none",
            cursor: "grab",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "3px",
              height: "3rem",
              background: "var(--accent-action)",
              borderRadius: "2px",
              boxShadow: "0 0 0 4px var(--paper)",
            }}
          />
        </button>
      </div>

      {/* Hint */}
      <p
        className="label-mono"
        style={{
          textAlign: "center",
          padding: "0.5rem",
          margin: 0,
          color: "var(--ink-tertiary)",
          fontSize: "var(--step--2)",
          borderBlockStart: "1px solid var(--rule)",
        }}
      >
        Drag the divider, or use arrow keys
      </p>
    </fieldset>
  );
}
