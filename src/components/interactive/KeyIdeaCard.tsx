import type { ReactNode } from "react";

/**
 * Highlights one important takeaway in a module.
 * Uses an accent left border and subtle background wash.
 */
export function KeyIdeaCard({
  children,
  accent = "action",
}: {
  children: ReactNode;
  accent?: "bitcoin" | "action" | "capital";
}) {
  const accentVar =
    accent === "bitcoin"
      ? "var(--accent-bitcoin)"
      : accent === "capital"
        ? "var(--accent-capital)"
        : "var(--accent-action)";

  const washVar =
    accent === "bitcoin"
      ? "var(--accent-bitcoin-wash)"
      : accent === "capital"
        ? "var(--accent-capital-wash)"
        : "var(--accent-action-wash)";

  return (
    <aside
      aria-label="Key idea"
      style={{
        borderInlineStart: `3px solid ${accentVar}`,
        background: washVar,
        padding: "1.25rem 1.5rem",
        borderRadius: "0 var(--radius-md) var(--radius-md) 0",
        marginBlock: "2rem",
        maxWidth: "var(--measure-prose)",
      }}
    >
      <p
        className="label-mono"
        style={{
          marginBlock: 0,
          marginBlockEnd: "0.5rem",
          color: accentVar,
          fontSize: "var(--step--2)",
          letterSpacing: "0.06em",
        }}
      >
        Key idea
      </p>
      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "var(--step-1)",
          lineHeight: 1.55,
          color: "var(--ink-primary)",
        }}
      >
        {children}
      </div>
    </aside>
  );
}
