"use client";

import { pathHref, useProgressStore } from "@/hooks/useProgressStore";
import { nextPathStep, pathStepFor } from "@/lib/beginner-path";
import Link from "next/link";
import type { CSSProperties } from "react";

export function NextStepPrompt({ slug }: { readonly slug: string }) {
  const step = pathStepFor(slug);
  const next = nextPathStep(slug);
  const { moduleProgress } = useProgressStore();
  if (!step) return null;

  const progress = moduleProgress(slug);
  const complete = Boolean(progress.challenge);

  return (
    <section aria-label="Next step" style={sectionStyle}>
      <p className="label-mono" style={labelStyle}>
        {complete ? "Path updated" : "Continue the task"}
      </p>
      <p style={copyStyle}>
        {complete
          ? `You completed ${step.shortTitle}. The next system extends the same idea from another angle.`
          : "Finish the interactive task above to save this module in your Beginner Path."}
      </p>
      <div style={rowStyle}>
        {next ? (
          <Link href={pathHref(next.slug)} style={primaryStyle}>
            Next: {next.shortTitle}
          </Link>
        ) : (
          <Link href="/#beginner-path" style={primaryStyle}>
            View completed path
          </Link>
        )}
        <Link href="/#beginner-path" className="label-mono">
          Path overview
        </Link>
      </div>
    </section>
  );
}

const sectionStyle: CSSProperties = {
  maxWidth: "var(--measure-prose)",
  marginInline: "auto",
  paddingInline: "var(--gutter-inline)",
  paddingBlock: "0 var(--gutter-block)",
};

const labelStyle: CSSProperties = {
  margin: 0,
  marginBlockEnd: "0.5rem",
  color: "var(--accent-bitcoin)",
};

const copyStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-1)",
  lineHeight: 1.45,
  color: "var(--ink-primary)",
};

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "1rem",
  marginBlockStart: "1rem",
};

const primaryStyle: CSSProperties = {
  display: "inline-flex",
  padding: "0.68rem 0.9rem",
  borderRadius: "var(--radius-sm)",
  background: "var(--ink-primary)",
  color: "var(--paper)",
  textDecoration: "none",
  fontWeight: 600,
};
