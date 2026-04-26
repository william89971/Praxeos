"use client";

import type { CSSProperties } from "react";
import type { TourStep } from "../lib/cameraPresets";

interface Props {
  readonly steps: readonly TourStep[];
  readonly activeIndex: number;
  readonly onSelect: (index: number) => void;
  readonly onNext: () => void;
}

/**
 * Bottom-aligned guided stepper. Each step is a tick on a thin rule; the
 * active step is filled. A "Next stop" button advances. Reads as the
 * margin of a manuscript, not a SaaS wizard.
 */
export function GuidedTimeline({ steps, activeIndex, onSelect, onNext }: Props) {
  const active = steps[activeIndex] ?? steps[0];
  if (!active) return null;

  return (
    <section
      aria-label="Guided tour"
      style={{
        display: "grid",
        gap: "0.7rem",
      }}
    >
      <div
        style={{
          color: "var(--ink-primary)",
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)",
          lineHeight: 1.18,
          fontStyle: "italic",
        }}
      >
        {active.title}
      </div>
      <p
        style={{
          margin: 0,
          color: "var(--ink-secondary)",
          fontFamily: "var(--font-serif)",
          fontSize: "var(--step--1)",
          lineHeight: 1.55,
          maxWidth: "var(--measure-narrow)",
        }}
      >
        {active.body}
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        {steps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            data-interactive
            className="label-mono"
            aria-current={index === activeIndex ? "step" : undefined}
            onClick={() => onSelect(index)}
            style={tickStyle(index === activeIndex)}
            title={step.label}
          >
            {step.label}
          </button>
        ))}
        <button
          type="button"
          data-interactive
          className="label-mono"
          onClick={onNext}
          style={nextButtonStyle}
        >
          Next stop →
        </button>
      </div>
    </section>
  );
}

function tickStyle(active: boolean): CSSProperties {
  return {
    padding: "0.32rem 0.6rem",
    border: `1px solid ${active ? "var(--ink-secondary)" : "var(--rule)"}`,
    borderRadius: "999px",
    background: active ? "var(--accent-bitcoin-wash)" : "transparent",
    color: active ? "var(--ink-primary)" : "var(--ink-tertiary)",
    transition: "background var(--dur-micro) var(--ease-organic)",
  };
}

const nextButtonStyle: CSSProperties = {
  marginInlineStart: "auto",
  padding: "0.42rem 0.85rem",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  background: "transparent",
  color: "var(--ink-secondary)",
};
