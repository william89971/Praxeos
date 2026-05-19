"use client";

import { pathHref, useProgressStore } from "@/hooks/useProgressStore";
import {
  BEGINNER_PATH,
  BEGINNER_TOTAL_MINUTES,
  type BeginnerPathStep,
  pathStepFor,
} from "@/lib/beginner-path";
import Link from "next/link";
import type { CSSProperties } from "react";

export function BeginnerPathRail() {
  const { progress, completedCount, completedSlugs, nextStep, resetProgress } =
    useProgressStore();
  const progressPct = Math.round((completedCount / BEGINNER_PATH.length) * 100);
  const hasProgress = completedCount > 0;
  const lastStep = progress.lastModuleSlug
    ? pathStepFor(progress.lastModuleSlug)
    : null;

  return (
    <section
      id="beginner-path"
      aria-labelledby="beginner-path-heading"
      style={sectionStyle}
    >
      <div style={innerStyle}>
        <div style={introStyle}>
          <p className="label-mono" style={eyebrowStyle}>
            Beginner Path
          </p>
          <h2 id="beginner-path-heading" style={headingStyle}>
            Complete four simulations. Leave with a mental model.
          </h2>
          <p style={copyStyle}>
            A guided route through the core ideas: action as signal, money as
            coordination layer, prices as calculation, and synchrony as social order.
          </p>
          <div style={ctaRowStyle}>
            <Link href={pathHref(nextStep.slug)} style={primaryCtaStyle}>
              {hasProgress ? `Continue ${nextStep.shortTitle}` : "Begin Beginner Path"}
            </Link>
            <span className="label-mono" style={progressLabelStyle}>
              {completedCount} / {BEGINNER_PATH.length} complete ·{" "}
              {BEGINNER_TOTAL_MINUTES} min · no prior knowledge
            </span>
          </div>
          {lastStep ? (
            <p style={memoryStyle}>
              You last worked in <strong>{lastStep.shortTitle}</strong>. Continue the
              path whenever you return.
            </p>
          ) : null}
        </div>

        <div style={mapStyle} aria-label={`${progressPct}% complete`}>
          <div
            style={
              {
                ...pathLineStyle,
                ["--path-progress" as string]: `${progressPct}%`,
              } satisfies CSSProperties
            }
            aria-hidden="true"
          />
          {BEGINNER_PATH.map((step) => (
            <PathStepCard
              key={step.slug}
              step={step}
              complete={completedSlugs.has(step.slug)}
              current={step.slug === nextStep.slug}
            />
          ))}
        </div>

        {hasProgress ? (
          <button
            type="button"
            className="label-mono"
            onClick={resetProgress}
            style={resetStyle}
          >
            Reset path progress
          </button>
        ) : null}
      </div>
    </section>
  );
}

function PathStepCard({
  step,
  complete,
  current,
}: {
  readonly step: BeginnerPathStep;
  readonly complete: boolean;
  readonly current: boolean;
}) {
  const accent = `var(--accent-${step.accent})`;
  return (
    <Link
      href={pathHref(step.slug)}
      style={{
        ...stepStyle,
        borderColor: complete || current ? accent : "var(--rule)",
        background: complete
          ? `color-mix(in oklab, ${accent} 12%, var(--paper-elevated))`
          : current
            ? "var(--paper-elevated)"
            : "var(--paper)",
      }}
    >
      <span className="label-mono" style={{ color: accent }}>
        {complete ? "Complete" : current ? "Next" : `Step ${step.order}`}
      </span>
      <strong style={stepTitleStyle}>{step.shortTitle}</strong>
      <span style={stepIdeaStyle}>{step.idea}</span>
      <span className="label-mono" style={stepMetaStyle}>
        {step.estimatedMinutes} min · {step.sourceThinker}
      </span>
    </Link>
  );
}

const sectionStyle: CSSProperties = {
  borderBlockStart: "1px solid var(--rule)",
  paddingInline: "var(--gutter-inline)",
  paddingBlock: "calc(var(--gutter-block) * 1.2)",
  background: "var(--paper-sunk)",
};

const innerStyle: CSSProperties = {
  maxWidth: "var(--measure-wide)",
  marginInline: "auto",
  display: "grid",
  gap: "2rem",
};

const introStyle: CSSProperties = {
  maxWidth: "70ch",
};

const eyebrowStyle: CSSProperties = {
  color: "var(--accent-bitcoin)",
  marginBlock: 0,
  marginBlockEnd: "0.75rem",
};

const headingStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontSize: "clamp(2rem, 4vw, 4.2rem)",
  fontWeight: 460,
  lineHeight: 1,
  color: "var(--ink-primary)",
};

const copyStyle: CSSProperties = {
  margin: "1rem 0 0",
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-1)",
  lineHeight: 1.5,
  color: "var(--ink-secondary)",
};

const ctaRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "1rem",
  marginBlockStart: "1.4rem",
};

const primaryCtaStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "0.75rem 1.05rem",
  borderRadius: "var(--radius-sm)",
  background: "var(--ink-primary)",
  color: "var(--paper)",
  textDecoration: "none",
  fontWeight: 600,
};

const progressLabelStyle: CSSProperties = {
  color: "var(--ink-tertiary)",
};

const mapStyle: CSSProperties = {
  position: "relative",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))",
  gap: "1rem",
};

const memoryStyle: CSSProperties = {
  margin: "1rem 0 0",
  padding: "0.75rem 0.9rem",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  background: "var(--paper)",
  color: "var(--ink-secondary)",
  fontFamily: "var(--font-serif)",
};

const pathLineStyle: CSSProperties = {
  position: "absolute",
  insetInline: "8%",
  insetBlockStart: "1.45rem",
  height: "2px",
  background:
    "linear-gradient(90deg, var(--accent-bitcoin) 0 var(--path-progress), var(--rule) var(--path-progress) 100%)",
  pointerEvents: "none",
};

const stepStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "grid",
  gap: "0.45rem",
  minHeight: "12rem",
  padding: "1rem",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  textDecoration: "none",
  boxShadow: "0 1px 0 var(--rule)",
};

const stepTitleStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-1)",
  color: "var(--ink-primary)",
  lineHeight: 1.15,
};

const stepIdeaStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  color: "var(--ink-secondary)",
  lineHeight: 1.45,
};

const stepMetaStyle: CSSProperties = {
  alignSelf: "end",
  color: "var(--ink-tertiary)",
};

const resetStyle: CSSProperties = {
  justifySelf: "start",
  color: "var(--ink-tertiary)",
  textDecoration: "underline",
};
