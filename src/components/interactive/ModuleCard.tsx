"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ModulePreview, type ModulePreviewVariant } from "./ModulePreview";

interface Props {
  readonly href: string;
  readonly title: string;
  readonly description: ReactNode;
  readonly accent: "bitcoin" | "action" | "capital";
  readonly variant: ModulePreviewVariant;
  readonly meta?: string;
  readonly difficulty: "Beginner" | "Intermediate" | "Advanced";
}

/**
 * Premium module card with a small Canvas 2D animated preview, accent
 * rule, title, description, and a metadata row. Used on the homepage's
 * "Four doors" section.
 */
export function ModuleCard({
  href,
  title,
  description,
  accent,
  variant,
  meta,
  difficulty,
}: Props) {
  const accentVar = `var(--accent-${accent})`;

  return (
    <Link
      href={href}
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        padding: "1.4rem 1.4rem 1.5rem",
        gap: "1.1rem",
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
      <div style={{ display: "grid", gap: "0.85rem" }}>
        <div
          style={{
            position: "relative",
            background: "var(--paper-elevated)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--rule)",
            padding: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ModulePreview variant={variant} />
        </div>
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
      </div>
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "var(--step-0)",
          lineHeight: 1.55,
          color: "var(--ink-secondary)",
          margin: 0,
        }}
      >
        {description}
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <p
          className="label-mono"
          style={{
            margin: 0,
            color: "var(--ink-tertiary)",
            fontSize: "var(--step--2)",
          }}
        >
          {difficulty}
          {meta ? ` · ${meta}` : ""}
        </p>
        <span
          className="label"
          style={{
            color: accentVar,
            fontWeight: 500,
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
      </div>
    </Link>
  );
}
