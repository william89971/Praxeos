"use client";

import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { CSSProperties } from "react";
import { GrainOverlay } from "./GrainOverlay";

const HomeHeroScene = dynamic(
  () => import("./HomeHeroScene").then((m) => m.HomeHeroScene),
  { ssr: false, loading: () => <SceneFallback /> },
);

/**
 * The cinematic homepage hero. Composes a full-viewport WebGL scene with
 * three layers of typography and corner editorial chrome.
 */
export function HomeHero() {
  const reduced = useReducedMotion();

  return (
    <section style={frameStyle} aria-label="Praxeos">
      {/* Layer 0 — the deep background field with thin grid lines */}
      <div aria-hidden="true" style={gridStyle} />
      <div aria-hidden="true" style={radialGlowStyle} />

      {/* Layer 1 — bleed PRAXEOS typography behind the planet */}
      <div aria-hidden="true" style={bleedTitleStyle}>
        <span style={bleedTextStyle}>PRAXEOS</span>
      </div>

      {/* Layer 2 — the WebGL scene */}
      <div style={canvasWrapperStyle}>
        {reduced ? <SceneFallback /> : <HomeHeroScene />}
      </div>

      {/* Layer 3 — top corner labels */}
      <div style={topLabelsStyle}>
        <span className="label-mono" style={cornerLabelStyle}>
          Praxeos · Fascicle I · 2026
        </span>
        <span className="label-mono" style={cornerLabelMutedStyle}>
          Homo agit.
        </span>
      </div>

      {/* Layer 4 — foreground copy */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 32 }}
        animate={reduced ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={foregroundStyle as Record<string, string | number>}
      >
        <p style={eyebrowStyle} className="label-mono">
          A library of explorable explanations
        </p>
        <h1 style={subtitleStyle}>
          A library for the
          <br />
          <em style={italicEmphasisStyle}>economic imagination.</em>
        </h1>
        <p style={leadStyle}>
          Four interactive pieces about money, action, calculation, and coordination —
          built as a small monument to clarity.
        </p>
        <div style={ctaRowStyle}>
          <Link href="#paths" style={primaryCtaStyle}>
            <span>Enter the library</span>
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
      <div style={scrollCueStyle}>
        <span className="label-mono" style={scrollCueLabelStyle}>
          Scroll
        </span>
        <span aria-hidden="true" style={scrollCueLineStyle} />
      </div>

      <GrainOverlay opacity={0.22} />
    </section>
  );
}

function SceneFallback() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse at center, #2a1a08 0%, #0a0a0c 60%, #0a0a0c 100%)",
      }}
    />
  );
}

/* ───── styles ─────────────────────────────────────────────────────── */

const frameStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  minHeight: "100dvh",
  background: "#0a0a0c",
  overflow: "hidden",
  color: "#f0eada",
  isolation: "isolate",
};

const gridStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage:
    "linear-gradient(to right, rgba(240, 234, 218, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(240, 234, 218, 0.04) 1px, transparent 1px)",
  backgroundSize: "80px 80px",
  pointerEvents: "none",
  zIndex: 0,
};

const radialGlowStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(ellipse 60% 70% at 50% 55%, rgba(224, 146, 44, 0.18) 0%, rgba(95, 174, 155, 0.05) 40%, transparent 75%)",
  pointerEvents: "none",
  zIndex: 1,
};

const bleedTitleStyle: CSSProperties = {
  position: "absolute",
  insetBlockStart: "10%",
  insetInlineStart: "-3vw",
  zIndex: 2,
  pointerEvents: "none",
  mixBlendMode: "screen",
  whiteSpace: "nowrap",
};

const bleedTextStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontWeight: 460,
  fontSize: "clamp(140px, 24vw, 460px)",
  fontVariationSettings: '"opsz" 144',
  lineHeight: 0.86,
  letterSpacing: "-0.045em",
  color: "rgba(240, 234, 218, 0.07)",
};

const canvasWrapperStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: 3,
};

const topLabelsStyle: CSSProperties = {
  position: "absolute",
  insetBlockStart: "1.4rem",
  insetInlineStart: "1.4rem",
  insetInlineEnd: "1.4rem",
  zIndex: 5,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  pointerEvents: "none",
};

const cornerLabelStyle: CSSProperties = {
  color: "rgba(240, 234, 218, 0.7)",
  letterSpacing: "0.18em",
};

const cornerLabelMutedStyle: CSSProperties = {
  color: "rgba(240, 234, 218, 0.4)",
  letterSpacing: "0.18em",
  fontStyle: "italic",
};

const foregroundStyle: CSSProperties = {
  position: "absolute",
  insetBlockEnd: "clamp(5rem, 12vh, 9rem)",
  insetInlineStart: "clamp(1.4rem, 4vw, 4rem)",
  zIndex: 6,
  maxWidth: "min(58ch, 100%)",
  pointerEvents: "auto",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  marginBlockEnd: "1rem",
  color: "rgba(224, 146, 44, 0.85)",
  letterSpacing: "0.22em",
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontWeight: 420,
  fontSize: "clamp(2.2rem, 5.4vw, 4.4rem)",
  fontVariationSettings: '"opsz" 96',
  lineHeight: 1.04,
  letterSpacing: "-0.025em",
  color: "#f3ecda",
};

const italicEmphasisStyle: CSSProperties = {
  fontStyle: "italic",
  color: "#e0c69a",
};

const leadStyle: CSSProperties = {
  margin: "1.4rem 0 0",
  fontFamily: "var(--font-serif)",
  fontSize: "clamp(1rem, 1.4vw, 1.18rem)",
  lineHeight: 1.55,
  color: "rgba(240, 234, 218, 0.78)",
  maxWidth: "44ch",
};

const ctaRowStyle: CSSProperties = {
  marginBlockStart: "2.2rem",
  display: "flex",
  gap: "1rem",
  flexWrap: "wrap",
  alignItems: "center",
};

const primaryCtaStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.6rem",
  padding: "0.82rem 1.4rem",
  borderRadius: "999px",
  background: "rgba(224, 146, 44, 0.92)",
  color: "#0a0a0c",
  fontFamily: "var(--font-sans)",
  fontWeight: 500,
  fontSize: "var(--step-0)",
  letterSpacing: "-0.005em",
  textDecoration: "none",
  boxShadow:
    "0 0 0 1px rgba(224, 146, 44, 0.3), 0 16px 36px -8px rgba(224, 146, 44, 0.35)",
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
  borderRadius: "999px",
  border: "1px solid rgba(240, 234, 218, 0.22)",
  color: "#f3ecda",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--step-0)",
  textDecoration: "none",
};

const scrollCueStyle: CSSProperties = {
  position: "absolute",
  insetBlockEnd: "1.4rem",
  insetInlineEnd: "1.4rem",
  zIndex: 5,
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  pointerEvents: "none",
};

const scrollCueLabelStyle: CSSProperties = {
  color: "rgba(240, 234, 218, 0.55)",
  letterSpacing: "0.18em",
};

const scrollCueLineStyle: CSSProperties = {
  display: "inline-block",
  width: "1px",
  height: "44px",
  background:
    "linear-gradient(to bottom, rgba(240, 234, 218, 0.55), rgba(240, 234, 218, 0))",
  animation: "praxeosScrollLine 2400ms ease-in-out infinite",
};
