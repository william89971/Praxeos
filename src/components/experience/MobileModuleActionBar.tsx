"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

interface Props {
  readonly nextHref?: string | undefined;
  readonly nextLabel?: string | undefined;
  readonly controlsHref?: string | undefined;
}

export function MobileModuleActionBar({
  nextHref,
  nextLabel = "Next",
  controlsHref = "#module-controls",
}: Props) {
  return (
    <nav className="only-mobile" aria-label="Module quick actions" style={barStyle}>
      <a href="#module-task" className="label-mono" style={linkStyle}>
        Task
      </a>
      <a href={controlsHref} className="label-mono" style={linkStyle}>
        Controls
      </a>
      <a href="#module-essay" className="label-mono" style={linkStyle}>
        Essay
      </a>
      {nextHref ? (
        <Link href={nextHref} className="label-mono" style={primaryStyle}>
          {nextLabel}
        </Link>
      ) : (
        <a href="#sources-heading" className="label-mono" style={primaryStyle}>
          Sources
        </a>
      )}
    </nav>
  );
}

const barStyle: CSSProperties = {
  position: "fixed",
  insetInline: "0.75rem",
  insetBlockEnd: "0.75rem",
  zIndex: 70,
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "0.35rem",
  padding: "0.4rem",
  border: "1px solid var(--rule-strong)",
  borderRadius: "var(--radius-md)",
  background: "color-mix(in oklab, var(--paper-elevated) 94%, transparent)",
  boxShadow: "0 18px 48px -24px rgb(28 24 20 / 0.48)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
};

const linkStyle: CSSProperties = {
  minHeight: "2.65rem",
  display: "grid",
  placeItems: "center",
  borderRadius: "var(--radius-sm)",
  color: "var(--ink-secondary)",
  textDecoration: "none",
};

const primaryStyle: CSSProperties = {
  ...linkStyle,
  background: "var(--ink-primary)",
  color: "var(--paper)",
};
