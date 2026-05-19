"use client";

import { useProgressStore } from "@/hooks/useProgressStore";
import type { CSSProperties } from "react";

interface Props {
  readonly slug: string;
  readonly title?: string;
  readonly body: string;
}

export function OnboardingOverlay({
  slug,
  title = "What should I click?",
  body,
}: Props) {
  const { dismissOnboarding, isOnboardingDismissed, moduleProgress } =
    useProgressStore();
  const hidden = isOnboardingDismissed(slug) || moduleProgress(slug).firstInteraction;

  if (hidden) return null;

  return (
    <aside style={panelStyle} aria-label={title}>
      <p className="label-mono" style={labelStyle}>
        {title}
      </p>
      <p style={bodyStyle}>{body}</p>
      <button
        type="button"
        data-interactive
        className="label-mono"
        onClick={() => dismissOnboarding(slug)}
        style={buttonStyle}
      >
        Try it
      </button>
    </aside>
  );
}

const panelStyle: CSSProperties = {
  display: "grid",
  gap: "0.55rem",
  padding: "0.85rem 0.95rem",
  maxWidth: "30ch",
  border: "1px solid var(--accent-bitcoin)",
  borderRadius: "var(--radius-sm)",
  background: "color-mix(in oklab, var(--paper-elevated) 92%, transparent)",
  boxShadow: "0 16px 48px -28px rgb(28 24 20 / 0.5)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
};

const labelStyle: CSSProperties = {
  margin: 0,
  color: "var(--accent-bitcoin)",
};

const bodyStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  lineHeight: 1.45,
  color: "var(--ink-primary)",
};

const buttonStyle: CSSProperties = {
  justifySelf: "start",
  padding: "0.42rem 0.65rem",
  border: "1px solid var(--rule-strong)",
  borderRadius: "var(--radius-sm)",
  background: "var(--paper)",
  color: "var(--ink-primary)",
};
