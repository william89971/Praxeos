import type { ReactNode } from "react";

/**
 * Inline citation reference. Renders a superscript number and (optionally)
 * attaches a title tooltip with the source. The full source apparatus
 * is rendered separately via <SourcesList>.
 */
export function Citation({
  n,
  children,
}: {
  n: number;
  children?: ReactNode;
}) {
  return (
    <sup
      data-citation={n}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.72em",
        color: "var(--ink-tertiary)",
        marginInlineStart: "1px",
        cursor: "help",
      }}
      title={typeof children === "string" ? children : undefined}
    >
      [{n}]
    </sup>
  );
}
