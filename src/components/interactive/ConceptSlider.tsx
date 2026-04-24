"use client";

import { useState } from "react";

export type SliderStep = {
  value: number;
  label: string;
  description: string;
};

/**
 * An interactive slider that lets users change a variable
 * and see an explanation update in real time.
 */
export function ConceptSlider({
  steps,
  defaultIndex = 0,
  title,
  accent = "action",
}: {
  steps: SliderStep[];
  defaultIndex?: number;
  title?: string;
  accent?: "bitcoin" | "action" | "capital";
}) {
  const [index, setIndex] = useState(defaultIndex);
  const current = steps[index] ?? steps[0];

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
    <div
      style={{
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-md)",
        padding: "1.5rem",
        background: "var(--paper-elevated)",
        maxWidth: "var(--measure-prose)",
        marginBlock: "2.5rem",
      }}
    >
      {title ? (
        <p
          className="label-mono"
          style={{
            marginBlock: 0,
            marginBlockEnd: "1rem",
            color: "var(--ink-tertiary)",
            fontSize: "var(--step--2)",
            letterSpacing: "0.06em",
          }}
        >
          {title}
        </p>
      ) : null}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBlockEnd: "1.25rem",
        }}
      >
        <input
          type="range"
          min={0}
          max={steps.length - 1}
          step={1}
          value={index}
          onChange={(e) => setIndex(Number(e.target.value))}
          aria-label={title ?? "Concept slider"}
          style={{
            flex: 1,
            accentColor: accentVar,
            cursor: "pointer",
          }}
        />
        <span
          className="label"
          style={{
            minWidth: "10ch",
            textAlign: "end",
            color: accentVar,
            fontWeight: 600,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {current?.label ?? ""}
        </span>
      </div>

      <div
        style={{
          background: washVar,
          borderRadius: "var(--radius-sm)",
          padding: "1rem 1.25rem",
          borderInlineStart: `3px solid ${accentVar}`,
          transition: "opacity var(--dur-micro) var(--ease-organic)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--step-0)",
            lineHeight: 1.6,
            color: "var(--ink-primary)",
            margin: 0,
          }}
        >
          {current?.description ?? ""}
        </p>
      </div>
    </div>
  );
}
