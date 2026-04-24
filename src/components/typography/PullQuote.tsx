import type { ReactNode } from "react";

/**
 * A pull quote, set in italic Fraunces with an oxblood rule.
 * Leads to an attribution line if `cite` is provided.
 */
export function PullQuote({
  children,
  cite,
}: {
  children: ReactNode;
  cite?: string;
}) {
  return (
    <blockquote className="pull">
      {children}
      {cite ? (
        <footer
          style={{
            marginTop: "0.5em",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--step--1)",
            fontStyle: "normal",
            color: "var(--ink-tertiary)",
            letterSpacing: "-0.01em",
          }}
        >
          — {cite}
        </footer>
      ) : null}
    </blockquote>
  );
}
