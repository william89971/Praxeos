"use client";

import Link from "next/link";

export type NavModule = {
  slug: string;
  title: string;
  subtitle: string;
};

/**
 * Enhanced previous/next module navigation.
 * Displays module title and subtitle for context.
 */
export function ModuleNavigator({
  prev,
  next,
}: {
  prev: NavModule | null;
  next: NavModule | null;
}) {
  return (
    <nav
      aria-label="Module navigation"
      style={{
        maxWidth: "var(--measure-wide)",
        marginInline: "auto",
        paddingInline: "var(--gutter-inline)",
        paddingBlock: "var(--gutter-block)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1.5rem",
        borderBlockStart: "1px solid var(--rule)",
      }}
    >
      {prev ? (
        <Link
          href={`/modules/${prev.slug}`}
          style={{
            textDecoration: "none",
            display: "flex",
            flexDirection: "column",
            gap: "0.35rem",
            padding: "1rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid transparent",
            transition:
              "border-color var(--dur-micro) var(--ease-organic), background var(--dur-micro) var(--ease-organic)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--rule)";
            e.currentTarget.style.background = "var(--paper-elevated)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "transparent";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <span
            className="label-mono"
            style={{ color: "var(--ink-tertiary)", fontSize: "var(--step--2)" }}
          >
            ← Previous
          </span>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "var(--step-1)",
              color: "var(--ink-primary)",
              fontWeight: 500,
            }}
          >
            {prev.title}
          </span>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "var(--step--1)",
              color: "var(--ink-secondary)",
              lineHeight: 1.4,
            }}
          >
            {prev.subtitle}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/modules/${next.slug}`}
          style={{
            textDecoration: "none",
            display: "flex",
            flexDirection: "column",
            gap: "0.35rem",
            padding: "1rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid transparent",
            textAlign: "end",
            alignItems: "flex-end",
            transition:
              "border-color var(--dur-micro) var(--ease-organic), background var(--dur-micro) var(--ease-organic)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--rule)";
            e.currentTarget.style.background = "var(--paper-elevated)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "transparent";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <span
            className="label-mono"
            style={{ color: "var(--ink-tertiary)", fontSize: "var(--step--2)" }}
          >
            Next →
          </span>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "var(--step-1)",
              color: "var(--ink-primary)",
              fontWeight: 500,
            }}
          >
            {next.title}
          </span>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "var(--step--1)",
              color: "var(--ink-secondary)",
              lineHeight: 1.4,
            }}
          >
            {next.subtitle}
          </span>
        </Link>
      ) : (
        <div style={{ textAlign: "end" }}>
          <Link
            href="/modules"
            className="label"
            style={{
              textDecoration: "none",
              display: "inline-block",
              padding: "1rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid transparent",
              transition:
                "border-color var(--dur-micro) var(--ease-organic), background var(--dur-micro) var(--ease-organic)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--rule)";
              e.currentTarget.style.background = "var(--paper-elevated)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <span
              className="label-mono"
              style={{ color: "var(--ink-tertiary)", fontSize: "var(--step--2)" }}
            >
              All modules ↑
            </span>
          </Link>
        </div>
      )}
    </nav>
  );
}
