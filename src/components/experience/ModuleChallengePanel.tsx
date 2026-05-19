"use client";

import { ResultSummaryCard } from "@/components/module-system/ResultSummaryCard";
import { pathHref, useProgressStore } from "@/hooks/useProgressStore";
import { nextPathStep, pathStepFor } from "@/lib/beginner-path";
import type { ChallengeGoal, SummaryRow } from "@/lib/module-runtime";
import { trackInteraction } from "@/lib/telemetry";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";

interface Props {
  readonly slug: string;
  readonly goals: readonly ChallengeGoal[];
  readonly currentHint: string;
  readonly insight: string;
  readonly summaryRows: readonly SummaryRow[];
  readonly sourceLabel: string;
}

export function ModuleChallengePanel({
  slug,
  goals,
  currentHint,
  insight,
  summaryRows,
  sourceLabel,
}: Props) {
  const { markVisited, markFirstInteraction, markChallenge, markInsight } =
    useProgressStore();
  const [copied, setCopied] = useState(false);
  const trackedFirstInteractionRef = useRef(false);
  const trackedSummaryRef = useRef(false);
  const step = pathStepFor(slug);
  const nextStep = nextPathStep(slug);
  const completedCount = goals.filter((goal) => goal.completed).length;
  const allComplete = goals.length > 0 && completedCount === goals.length;

  useEffect(() => {
    markVisited(slug);
  }, [slug, markVisited]);

  useEffect(() => {
    if (completedCount > 0) {
      markFirstInteraction(slug);
      if (!trackedFirstInteractionRef.current) {
        trackedFirstInteractionRef.current = true;
        trackInteraction("first_interaction", {
          moduleSlug: slug,
          payload: { completedGoals: completedCount },
        });
      }
    }
    if (allComplete) markChallenge(slug);
  }, [slug, completedCount, allComplete, markFirstInteraction, markChallenge]);

  useEffect(() => {
    if (!allComplete || trackedSummaryRef.current) return;
    trackedSummaryRef.current = true;
    trackInteraction("result_summary_viewed", {
      moduleSlug: slug,
      payload: { completedGoals: completedCount },
    });
  }, [slug, allComplete, completedCount]);

  const shareText = useMemo(
    () =>
      [
        `${step?.title ?? "Praxeos"} insight`,
        insight,
        "Praxeos - interactive Austrian economics",
      ].join("\n"),
    [insight, step?.title],
  );

  const copyInsight = async () => {
    try {
      await navigator.clipboard?.writeText(shareText);
      setCopied(true);
    } catch {
      setCopied(true);
    }
    markInsight(slug, shareText);
    trackInteraction("insight_copied", {
      moduleSlug: slug,
      payload: { insightLength: shareText.length },
    });
  };

  return (
    <aside style={panelStyle} aria-live="polite">
      <div style={topRowStyle}>
        <div>
          <p className="label-mono" style={eyebrowStyle}>
            Your task
          </p>
          <h3 style={titleStyle}>{step?.task ?? "Explore the system."}</h3>
        </div>
        <span className="label-mono" style={countStyle}>
          {completedCount}/{goals.length}
        </span>
      </div>

      <ol style={goalListStyle}>
        {goals.map((goal) => (
          <li key={goal.id} style={goalStyle(goal.completed)}>
            <span aria-hidden="true" style={dotStyle(goal.completed)} />
            <span>{goal.label}</span>
          </li>
        ))}
      </ol>

      {allComplete ? (
        <ResultSummaryCard insight={insight} rows={summaryRows}>
          <div style={actionRowStyle}>
            <button
              type="button"
              data-interactive
              className="label-mono"
              onClick={copyInsight}
              style={buttonStyle}
            >
              {copied ? "Insight saved" : "Copy insight card"}
            </button>
            {nextStep ? (
              <Link href={pathHref(nextStep.slug)} className="label-mono">
                Next: {nextStep.shortTitle}
              </Link>
            ) : (
              <Link href="/#beginner-path" className="label-mono">
                View completed path
              </Link>
            )}
          </div>
        </ResultSummaryCard>
      ) : (
        <p style={hintStyle}>{currentHint}</p>
      )}

      <details style={sourceStyle}>
        <summary className="label-mono">Source thread</summary>
        <p style={{ margin: "0.5rem 0 0" }}>
          {sourceLabel}. The full citations and essay are below.
        </p>
      </details>
    </aside>
  );
}

const panelStyle: CSSProperties = {
  display: "grid",
  gap: "0.7rem",
  padding: "0.95rem 1.1rem",
  border: "1px solid color-mix(in oklab, var(--accent-bitcoin) 58%, var(--rule))",
  borderRadius: "var(--radius-sm)",
  background: "color-mix(in oklab, var(--paper-elevated) 90%, transparent)",
  boxShadow: "0 12px 40px -28px rgb(28 24 20 / 0.4)",
};

const topRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "0.85rem",
  alignItems: "start",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  marginBlockEnd: "0.25rem",
  color: "var(--accent-bitcoin)",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-0)",
  lineHeight: 1.25,
  color: "var(--ink-primary)",
};

const countStyle: CSSProperties = {
  color: "var(--ink-tertiary)",
  whiteSpace: "nowrap",
};

const goalListStyle: CSSProperties = {
  display: "grid",
  gap: "0.45rem",
  padding: 0,
  margin: 0,
  listStyle: "none",
};

function goalStyle(done: boolean): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "0.75rem 1fr",
    gap: "0.55rem",
    alignItems: "baseline",
    fontFamily: "var(--font-serif)",
    fontSize: "var(--step--1)",
    lineHeight: 1.35,
    color: done ? "var(--ink-primary)" : "var(--ink-secondary)",
  };
}

function dotStyle(done: boolean): CSSProperties {
  return {
    width: "0.55rem",
    height: "0.55rem",
    borderRadius: "999px",
    border: `1px solid ${done ? "var(--accent-capital)" : "var(--rule-strong)"}`,
    background: done ? "var(--accent-capital)" : "transparent",
    boxShadow: done ? "0 0 0 4px var(--accent-capital-wash)" : "none",
  };
}

const hintStyle: CSSProperties = {
  margin: 0,
  padding: "0.65rem 0.75rem",
  borderRadius: "var(--radius-sm)",
  background: "var(--paper-sunk)",
  color: "var(--ink-secondary)",
  fontFamily: "var(--font-serif)",
  lineHeight: 1.45,
};

const actionRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.75rem",
  flexWrap: "wrap",
};

const buttonStyle: CSSProperties = {
  padding: "0.48rem 0.7rem",
  border: "1px solid var(--ink-secondary)",
  borderRadius: "var(--radius-sm)",
  background: "var(--ink-primary)",
  color: "var(--paper)",
};

const sourceStyle: CSSProperties = {
  color: "var(--ink-tertiary)",
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step--1)",
};
