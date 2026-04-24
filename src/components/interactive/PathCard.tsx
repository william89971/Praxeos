"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/**
 * A card for the "Choose your path" homepage section.
 * Links to a module with a title, description, and subtle hover lift.
 */
export function PathCard({
  href,
  title,
  description,
  accent = "action",
  meta,
}: {
  href: string;
  title: string;
  description: ReactNode;
  accent?: "bitcoin" | "action" | "capital";
  meta?: string | undefined;
}) {
  const accentVar =
    accent === "bitcoin"
      ? "var(--accent-bitcoin)"
      : accent === "capital"
        ? "var(--accent-capital)"
        : "var(--accent-action)";

  return (
    <Link
      href={href}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        padding: "1.5rem",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--rule)",
        background: "var(--paper)",
        textDecoration: "none",
        transition:
          "box-shadow var(--dur-micro) var(--ease-organic), transform var(--dur-micro) var(--ease-organic), border-color var(--dur-micro) var(--ease-organic)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--rule-strong)";
        e.currentTarget.style.boxShadow = "var(--shadow-lift)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--rule)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          width: "2.5rem",
          height: "3px",
          background: accentVar,
          borderRadius: "2px",
        }}
      />
      <h3
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "var(--step-2)",
          fontWeight: 500,
          color: "var(--ink-primary)",
          margin: 0,
          lineHeight: 1.15,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "var(--step-0)",
          lineHeight: 1.55,
          color: "var(--ink-secondary)",
          margin: 0,
          flex: 1,
        }}
      >
        {description}
      </p>
      {meta ? (
        <p
          className="label-mono"
          style={{
            margin: 0,
            color: "var(--ink-tertiary)",
            fontSize: "var(--step--2)",
          }}
        >
          {meta}
        </p>
      ) : null}
      <span
        className="label"
        style={{
          color: accentVar,
          fontWeight: 500,
          marginTop: "0.5rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
        }}
      >
        Explore
        <span aria-hidden="true" style={{ fontSize: "1.1em", lineHeight: 1 }}>
          →
        </span>
      </span>
    </Link>
  );
}
