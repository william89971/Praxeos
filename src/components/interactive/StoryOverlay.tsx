"use client";

import { useEffect, useState } from "react";

export type StoryStep = {
  title: string;
  body: string;
  condition?: () => boolean;
};

/**
 * A guided step-by-step overlay for simulations.
 * Steps advance automatically when conditions are met, or manually via buttons.
 */
export function StoryOverlay({
  steps,
  onComplete,
  active = true,
}: {
  steps: StoryStep[];
  onComplete?: () => void;
  active?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!active || dismissed) return;
    const timer = setInterval(() => {
      const step = steps[index];
      if (!step) return;
      if (step.condition?.() ?? true) {
        if (index < steps.length - 1) {
          setIndex((i) => i + 1);
        } else {
          onComplete?.();
        }
      }
    }, 2000);
    return () => clearInterval(timer);
  }, [active, dismissed, index, steps, onComplete]);

  if (!active || dismissed) return null;

  const step = steps[index];
  if (!step) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "1rem",
        left: "1rem",
        right: "1rem",
        zIndex: 10,
        background: "var(--paper)",
        border: "1px solid var(--rule-strong)",
        borderRadius: "var(--radius-md)",
        padding: "1.25rem",
        boxShadow: "var(--shadow-lift)",
        maxWidth: "42ch",
        marginInline: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
        }}
      >
        <p
          className="label-mono"
          style={{
            color: "var(--ink-tertiary)",
            fontSize: "var(--step--2)",
            margin: 0,
          }}
        >
          Step {index + 1} of {steps.length}
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="label-mono"
          style={{
            background: "none",
            border: "none",
            color: "var(--ink-tertiary)",
            cursor: "pointer",
            fontSize: "var(--step--2)",
            padding: 0,
          }}
          aria-label="Dismiss story"
        >
          Dismiss
        </button>
      </div>
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 500,
          fontSize: "var(--step-1)",
          margin: 0,
          marginBottom: "0.35rem",
          color: "var(--ink-primary)",
        }}
      >
        {step.title}
      </p>
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "var(--step-0)",
          lineHeight: 1.5,
          color: "var(--ink-secondary)",
          margin: 0,
        }}
      >
        {step.body}
      </p>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginTop: "1rem",
        }}
      >
        {steps.map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: steps array is fixed-order and immutable
            key={i}
            style={{
              height: "3px",
              flex: 1,
              borderRadius: "2px",
              background: i <= index ? "var(--accent-action)" : "var(--rule)",
              transition: "background var(--dur-micro) var(--ease-organic)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
