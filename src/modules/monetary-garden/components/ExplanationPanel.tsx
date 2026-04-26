"use client";

import { type CSSProperties, useEffect, useState } from "react";
import { type Band, bandFor } from "../lib/explanations";

interface Props {
  readonly distortion: number;
}

/**
 * Live editorial copy keyed to the distortion band. Crossfades between
 * bands; aria-live announces only the headline change (debounced by band).
 */
export function ExplanationPanel({ distortion }: Props) {
  const targetBand = bandFor(distortion);
  const [activeBand, setActiveBand] = useState<Band>(targetBand);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (targetBand.index === activeBand.index) return;
    setOpacity(0);
    const fadeOut = window.setTimeout(() => {
      setActiveBand(targetBand);
      setOpacity(1);
    }, 220);
    return () => window.clearTimeout(fadeOut);
  }, [targetBand, activeBand.index]);

  return (
    <aside style={panelStyle} aria-live="polite">
      <div className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
        State · {activeBand.label}
      </div>
      <p
        style={{
          ...headlineStyle,
          opacity,
          transition: "opacity 220ms var(--ease-organic)",
        }}
      >
        {activeBand.headline}
      </p>
      <p
        style={{
          ...sublineStyle,
          opacity: opacity * 0.92,
          transition: "opacity 220ms var(--ease-organic)",
        }}
      >
        {activeBand.subline}
      </p>
    </aside>
  );
}

const panelStyle: CSSProperties = {
  display: "grid",
  gap: "0.55rem",
  padding: "0.95rem 1.1rem",
  background: "color-mix(in oklab, var(--paper-elevated) 82%, transparent)",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  maxWidth: "min(48ch, 100%)",
};

const headlineStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)",
  lineHeight: 1.25,
  color: "var(--ink-primary)",
};

const sublineStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step--1)",
  lineHeight: 1.55,
  color: "var(--ink-secondary)",
};
