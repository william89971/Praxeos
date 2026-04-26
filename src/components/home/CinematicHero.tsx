"use client";

import { Teleology } from "@/sketches/teleology/Teleology";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { CSSProperties } from "react";
import { GrainOverlay } from "./GrainOverlay";
import { SignalField } from "./SignalField";

/**
 * The cinematic homepage hero.
 *
 * Creates a "moment of belief" — the instant a visitor understands
 * this is not a normal site. A living manuscript: ink-on-paper agents
 * drift beneath a field of faint signal particles, while large serif
 * typography anchors the composition.
 */
export function CinematicHero() {
  const reduced = useReducedMotion();

  return (
    <section style={frameStyle} aria-label="Praxeos">
      {/* Layer 0 — Teleology: purposeful agents on paper */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.5,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <Teleology fill agentCount={80} attractorCount={6} />
      </div>

      {/* Layer 1 — faint signal particles for depth */}
      <SignalField count={36} opacity={0.28} />

      {/* Layer 2 — bleed typography behind everything */}
      <div aria-hidden="true" style={bleedTitleStyle}>
        <span style={bleedTextStyle}>PRAXEOS</span>
      </div>

      {/* Layer 3 — top corner labels */}
      <div style={topLabelsStyle}>
        <span className="label-mono" style={cornerLabelStyle}>
          Praxeos · Fascicle I
        </span>
        <span className="label-mono" style={cornerLabelMutedStyle}>
          Homo agit.
        </span>
      </div>

      {/* Layer 4 — foreground copy */}
      <motion.div
        {...(reduced
          ? {}
          : { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 } })}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        // biome-ignore lint/suspicious/noExplicitAny: framer-motion MotionStyle vs CSSProperties incompatibility
        style={foregroundStyle as any}
      >
        <p style={eyebrowStyle} className="label-mono">
          A library of explorable explanations
        </p>
        <h1 style={titleStyle}>
          <span style={{ display: "block" }}>PRAXEOS</span>
        </h1>
        <p style={hookStyle}>
          Watch how an economy changes when the signal is distorted.
        </p>
        <p style={leadStyle}>
          Interactive investigations of human action, sound money, and economic
          calculation — built as an open-source cultural artifact.
        </p>
        <div style={ctaRowStyle}>
          <Link href="#paths" style={primaryCtaStyle}>
            <span>Start exploring</span>
            <span aria-hidden="true" style={primaryCtaArrowStyle}>
              →
            </span>
          </Link>
          <Link href="/manifesto" style={ghostCtaStyle}>
            Read the manifesto
          </Link>
        </div>
      </motion.div>

      {/* Bottom-corner scroll cue */}
      <motion.div
        {...(reduced ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 } })}
        transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        // biome-ignore lint/suspicious/noExplicitAny: framer-motion MotionStyle vs CSSProperties incompatibility
        style={scrollCueStyle as any}
      >
        <span className="label-mono" style={scrollCueLabelStyle}>
          Scroll
        </span>
        <span aria-hidden="true" style={scrollCueLineStyle} />
      </motion.div>

      <GrainOverlay opacity={0.14} />
    </section>
  );
}

/* ───── styles ─────────────────────────────────────────────────────── */

const frameStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  minHeight: "100dvh",
  background: "var(--paper)",
  overflow: "hidden",
  color: "var(--ink-primary)",
  isolation: "isolate",
};

const bleedTitleStyle: CSSProperties = {
  position: "absolute",
  insetBlockStart: "8%",
  insetInlineStart: "-2vw",
  zIndex: 2,
  pointerEvents: "none",
  mixBlendMode: "multiply",
  whiteSpace: "nowrap",
};

const bleedTextStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontWeight: 420,
  fontSize: "clamp(120px, 22vw, 400px)",
  fontVariationSettings: '"opsz" 144',
  lineHeight: 0.86,
  letterSpacing: "-0.045em",
  color: "var(--ink-primary)",
  opacity: 0.055,
};

const topLabelsStyle: CSSProperties = {
  position: "absolute",
  insetBlockStart: "1.4rem",
  insetInlineStart: "var(--gutter-inline)",
  insetInlineEnd: "var(--gutter-inline)",
  zIndex: 5,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  pointerEvents: "none",
};

const cornerLabelStyle: CSSProperties = {
  color: "var(--ink-tertiary)",
  letterSpacing: "0.14em",
};

const cornerLabelMutedStyle: CSSProperties = {
  color: "var(--ink-tertiary)",
  letterSpacing: "0.14em",
  fontStyle: "italic",
};

const foregroundStyle: CSSProperties = {
  position: "absolute",
  insetBlockEnd: "clamp(4.5rem, 11vh, 8rem)",
  insetInlineStart: "var(--gutter-inline)",
  zIndex: 6,
  maxWidth: "min(62ch, 92%)",
  pointerEvents: "auto",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  marginBlockEnd: "0.9rem",
  color: "var(--accent-bitcoin)",
  letterSpacing: "0.18em",
  fontSize: "var(--step--1)",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontWeight: 420,
  fontSize: "clamp(3.5rem, 10vw, 8rem)",
  fontVariationSettings: '"opsz" 144',
  lineHeight: 0.92,
  letterSpacing: "-0.035em",
  color: "var(--ink-primary)",
  textWrap: "balance",
};

const hookStyle: CSSProperties = {
  margin: "0.6rem 0 0",
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontSize: "clamp(1.15rem, 2.2vw, 1.6rem)",
  fontVariationSettings: '"opsz" 72',
  lineHeight: 1.3,
  color: "var(--ink-secondary)",
  maxWidth: "44ch",
};

const leadStyle: CSSProperties = {
  margin: "1.2rem 0 0",
  fontFamily: "var(--font-serif)",
  fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
  lineHeight: 1.6,
  color: "var(--ink-secondary)",
  maxWidth: "46ch",
};

const ctaRowStyle: CSSProperties = {
  marginBlockStart: "2rem",
  display: "flex",
  gap: "1rem",
  flexWrap: "wrap",
  alignItems: "center",
};

const primaryCtaStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.6rem",
  padding: "0.82rem 1.5rem",
  borderRadius: "var(--radius-md)",
  background: "var(--ink-primary)",
  color: "var(--paper)",
  fontFamily: "var(--font-sans)",
  fontWeight: 500,
  fontSize: "var(--step-0)",
  letterSpacing: "-0.005em",
  textDecoration: "none",
  transition:
    "opacity var(--dur-micro) var(--ease-organic), transform var(--dur-micro) var(--ease-organic)",
};

const primaryCtaArrowStyle: CSSProperties = {
  fontSize: "1.05em",
  lineHeight: 1,
};

const ghostCtaStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.82rem 1.2rem",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--rule-strong)",
  color: "var(--ink-primary)",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--step-0)",
  textDecoration: "none",
  transition:
    "border-color var(--dur-micro) var(--ease-organic), background var(--dur-micro) var(--ease-organic)",
};

const scrollCueStyle: CSSProperties = {
  position: "absolute",
  insetBlockEnd: "1.4rem",
  insetInlineEnd: "var(--gutter-inline)",
  zIndex: 5,
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  pointerEvents: "none",
};

const scrollCueLabelStyle: CSSProperties = {
  color: "var(--ink-tertiary)",
  letterSpacing: "0.18em",
};

const scrollCueLineStyle: CSSProperties = {
  display: "inline-block",
  width: "1px",
  height: "44px",
  background: "linear-gradient(to bottom, var(--ink-tertiary), transparent)",
  animation: "praxeosScrollLine 2400ms ease-in-out infinite",
};
