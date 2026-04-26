"use client";

import Link from "next/link";

/**
 * Error boundary for module routes.
 * Catches render errors (e.g., WebGL context loss) and offers a graceful
 * fallback instead of the generic Next.js error overlay.
 */
export default function ModuleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        maxWidth: "var(--measure-wide)",
        marginInline: "auto",
        paddingInline: "var(--gutter-inline)",
        paddingBlock: "var(--gutter-block)",
        textAlign: "center",
      }}
    >
      <p
        className="label-mono"
        style={{ color: "var(--ink-tertiary)", marginBottom: "1rem" }}
      >
        Praxeos · Error
      </p>
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "var(--step-5)",
          fontWeight: 420,
          marginBlockEnd: "1rem",
        }}
      >
        Something went wrong.
      </h1>
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "var(--step-1)",
          color: "var(--ink-secondary)",
          maxWidth: "var(--measure-prose)",
          marginInline: "auto",
          marginBlockEnd: "2rem",
        }}
      >
        The interactive piece failed to load. This can happen if WebGL is disabled or if
        the browser is low on memory.
      </p>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={reset}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "var(--radius-md)",
            background: "var(--ink-primary)",
            color: "var(--paper)",
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        <Link
          href="/modules"
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--rule-strong)",
            color: "var(--ink-primary)",
            fontFamily: "var(--font-sans)",
            textDecoration: "none",
          }}
        >
          Back to modules
        </Link>
      </div>
      {process.env.NODE_ENV === "development" ? (
        <pre
          style={{
            marginTop: "2rem",
            textAlign: "left",
            fontSize: "var(--step--2)",
            color: "var(--ink-tertiary)",
            overflow: "auto",
            maxWidth: "100%",
          }}
        >
          {error.message}
        </pre>
      ) : null}
    </div>
  );
}
