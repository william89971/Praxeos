"use client";

import Link from "next/link";
import { type ReactNode, useState } from "react";
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
 * Immersive portal card with an animated Canvas 2D preview, accent
 * rule, title, description, and a metadata row. Used on the homepage's
 * "Four doors" section.
 *
 * On hover the card lifts, the preview intensifies, and a subtle
 * ambient glow emerges — the feeling of peering into a system.
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
  const [hovered, setHovered] = useState(false);
  const accentVar = `var(--accent-${accent})`;

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        padding: "1.6rem 1.6rem 1.7rem",
        gap: "1.2rem",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--rule)",
        background: "var(--paper)",
        textDecoration: "none",
        transition:
          "box-shadow var(--dur-micro) var(--ease-organic), transform var(--dur-micro) var(--ease-organic), border-color var(--dur-micro) var(--ease-organic)",
        transform: hovered ? "translateY(-3px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow: hovered
          ? `0 1px 0 var(--rule), 0 12px 32px -10px rgb(28 24 20 / 0.12), 0 0 0 1px ${accentVar}20`
          : "0 1px 0 var(--rule)",
        borderColor: hovered ? "var(--rule-strong)" : "var(--rule)",
      }}
    >
      <div style={{ display: "grid", gap: "1rem" }}>
        <div
          style={{
            position: "relative",
            background: "var(--paper-elevated)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--rule)",
            padding: "0.6rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <ModulePreview variant={variant} active={hovered} />
          {/* Subtle accent wash on hover */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: hovered ? `${accentVar}10` : "transparent",
              transition: "background var(--dur-micro) var(--ease-organic)",
              pointerEvents: "none",
              borderRadius: "inherit",
            }}
          />
        </div>
        <div
          style={{
            height: "3px",
            background: accentVar,
            borderRadius: "2px",
            transition: "width var(--dur-micro) var(--ease-organic)",
            width: hovered ? "3.5rem" : "2.5rem",
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
            transition: "color var(--dur-micro) var(--ease-organic)",
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
            transition: "transform var(--dur-micro) var(--ease-organic)",
            transform: hovered ? "translateX(2px)" : "translateX(0)",
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
