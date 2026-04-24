import type { ReactNode } from "react";

/**
 * A reflective question block for the reader.
 * Rendered as an elegant, slightly inset panel with italic prose.
 */
export function ExplorePrompt({
  children,
  label = "A question to sit with",
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <aside
      aria-label={label}
      style={{
        border: "1px solid var(--rule)",
        padding: "1.5rem",
        borderRadius: "var(--radius-md)",
        marginBlock: "2.5rem",
        maxWidth: "var(--measure-prose)",
        background: "var(--paper-elevated)",
      }}
    >
      <p
        className="label-mono"
        style={{
          marginBlock: 0,
          marginBlockEnd: "0.75rem",
          color: "var(--ink-tertiary)",
          fontSize: "var(--step--2)",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: "var(--step-2)",
          lineHeight: 1.45,
          color: "var(--ink-primary)",
          marginBlock: 0,
        }}
      >
        {children}
      </p>
    </aside>
  );
}
