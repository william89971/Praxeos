import type { ReactNode } from "react";

/**
 * Tufte-style side note. Positioned in the right gutter on large screens,
 * inline on narrow viewports. Pass `side="left"` for asymmetric drift.
 */
export function Marginalia({
  children,
  side = "right",
  label,
}: {
  children: ReactNode;
  side?: "left" | "right";
  label?: string;
}) {
  return (
    <aside
      className="marginalia"
      data-side={side}
      style={{
        float: "right",
        clear: "right",
        width: "16rem",
        marginInlineStart: "1.5rem",
        marginInlineEnd: "-18rem",
        fontSize: "var(--step--1)",
        fontFamily: "var(--font-serif)",
        color: "var(--ink-secondary)",
        lineHeight: 1.5,
        fontStyle: "italic",
      }}
    >
      {label ? (
        <span
          className="label-mono"
          style={{
            display: "block",
            marginBottom: "0.25rem",
            fontStyle: "normal",
            color: "var(--ink-tertiary)",
          }}
        >
          {label}
        </span>
      ) : null}
      {children}
      <style>{`
        @media (max-width: 1279px) {
          .marginalia {
            float: none !important;
            width: auto !important;
            margin: 1em 0 !important;
            padding-inline-start: 1em;
            border-inline-start: 2px solid var(--rule);
          }
        }
      `}</style>
    </aside>
  );
}
