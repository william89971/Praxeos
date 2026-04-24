"use client";

import type { ReactNode } from "react";

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

/**
 * A quiet floating quotation that fades in once the arc reaches its
 * breaking point (Act III). Dismissible; sits over the canvas top-right.
 */
export function MisesOverlay({ visible, onDismiss }: Props) {
  if (!visible) return null;
  return (
    <aside
      role="note"
      aria-label="Quote from Mises, 1920"
      style={{
        position: "absolute",
        top: 16,
        right: 16,
        maxWidth: "28ch",
        padding: "0.9rem 1rem",
        background: "var(--paper)",
        border: "1px solid var(--rule-strong)",
        borderRadius: "var(--radius-sm)",
        boxShadow: "var(--shadow-lift)",
        zIndex: 4,
        animation: "mises-fade var(--dur-hero) var(--ease-organic)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: "var(--step-0)",
          color: "var(--ink-primary)",
          margin: 0,
          lineHeight: 1.45,
        }}
      >
        Where there is no market, there is no price system; and where there is no price
        system, there can be no economic calculation.
      </p>
      <footer
        className="label-mono"
        style={{
          marginBlockStart: "0.6rem",
          color: "var(--ink-tertiary)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span>— Mises, 1920</span>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss quote"
          data-interactive
          style={{
            border: "none",
            background: "none",
            color: "var(--ink-tertiary)",
            cursor: "pointer",
            fontFamily: "var(--font-mono)",
            padding: "0.15rem 0.4rem",
          }}
        >
          ✕
        </button>
      </footer>
      <style>{`
        @keyframes mises-fade {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          aside[role="note"] { animation: none !important; }
        }
      `}</style>
    </aside>
  );
}

/** Guard used by the sketch: appears only in planner mode at high G. */
export function shouldShowMisesOverlay(
  viewMode: "comparison" | "planner",
  G: number,
  dismissed: boolean,
): boolean {
  if (dismissed) return false;
  if (viewMode !== "planner") return false;
  return G >= 100;
}

export type { ReactNode };
