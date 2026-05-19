"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

interface Props {
  /** Two-character module number, e.g. "01". */
  readonly moduleNumber: string;
  /** Right-corner edition mark, e.g. "Fascicle I · 2026 Edition". */
  readonly edition: string;
  /** Big bleed headline rendered behind the scene, e.g. "MONETARY GARDEN". */
  readonly bigTitle: string;
  /** Eyebrow above the bleed headline. */
  readonly eyebrow: string;
  /** Italic editorial blurb anchored in the lower-left corner. */
  readonly quote: string;
  /** Small-caps attribution line under the quote. */
  readonly attribution: string;
  /** "DIRECTIONS:" card content — usually a state panel or instructions list. */
  readonly directionsSlot: ReactNode;
  /** Optional challenge/task card for the guided learning path. */
  readonly taskSlot?: ReactNode;
  /** Bottom control area — usually a slider. */
  readonly controlSlot: ReactNode;
  /** Optional first-click helper rendered over the scene. */
  readonly onboardingSlot?: ReactNode;
  /** Optional mobile-only quick action bar. */
  readonly mobileActionBar?: ReactNode;
  /** The 3D scene itself (a Canvas root). */
  readonly scene: ReactNode;
  /** Anchor for the "Scroll to continue" CTA. Defaults to the next sibling. */
  readonly scrollAnchor?: string;
}

/**
 * The cinematic module hero — a full-height stage that wraps the 3D scene
 * with the editorial-poster chrome borrowed from Monolith Studio (calm,
 * sculptural, corner-labelled) and Tim Quirino (massive bleeding title,
 * DIRECTIONS card, scroll-to-continue CTA).
 *
 * Composition:
 *   • The scene fills the frame (z = 0).
 *   • A large bleed headline sits behind it (z = 1) and crops off the right.
 *   • Editorial chrome (corner labels, quote, directions, CTA) sits on top
 *     (z = 3) with `pointer-events: none` so the scene remains interactive
 *     anywhere a chrome element is not.
 */
export function ModuleHeroChrome({
  moduleNumber,
  edition,
  bigTitle,
  eyebrow,
  quote,
  attribution,
  directionsSlot,
  taskSlot,
  controlSlot,
  onboardingSlot,
  mobileActionBar,
  scene,
  scrollAnchor = "#module-essay",
}: Props) {
  const isMobile = useHeroIsMobile();

  if (isMobile) {
    return (
      <>
        <section style={mobileFrameStyle} aria-label="Module interactive">
          <div style={mobileTopRowStyle}>
            <span className="label-mono" style={cornerLabelStyle}>
              Module {moduleNumber}
            </span>
            <span className="label-mono" style={cornerLabelStyle}>
              {edition}
            </span>
          </div>

          <div id="module-scene" style={mobileSceneStyle}>
            {scene}
          </div>

          <div style={mobilePanelStackStyle}>
            {onboardingSlot ? <div>{onboardingSlot}</div> : null}
            {taskSlot ? (
              <aside id="module-task" style={mobileTaskStyle}>
                {taskSlot}
              </aside>
            ) : null}
            <aside id="module-directions" style={mobileDirectionsStyle}>
              {directionsSlot}
            </aside>
            {controlSlot ? (
              <div id="module-controls" style={mobileControlStyle}>
                {controlSlot}
              </div>
            ) : null}
            <a href={scrollAnchor} style={mobileScrollCtaStyle}>
              <span className="label-mono">Continue reading</span>
              <span aria-hidden="true" style={ctaArrowStyle}>
                ↓
              </span>
            </a>
          </div>
        </section>
        {mobileActionBar}
      </>
    );
  }

  return (
    <>
      <section style={frameStyle} aria-label="Module hero">
        {/* Big bleed title */}
        <div style={bleedWrapperStyle} aria-hidden="true">
          <span className="label-mono" style={bleedEyebrowStyle}>
            {eyebrow}
          </span>
          <span style={bleedTitleStyle}>{bigTitle}</span>
        </div>

        {/* The scene */}
        <div id="module-scene" style={sceneWrapperStyle}>
          {scene}
        </div>

        {onboardingSlot ? <div style={onboardingStyle}>{onboardingSlot}</div> : null}

        {/* Corner — top-left: module number */}
        <div style={topLeftLabelStyle}>
          <span className="label-mono" style={cornerLabelStyle}>
            Module {moduleNumber}
          </span>
        </div>

        {/* Corner — top-right: edition + scroll cue */}
        <div style={topRightLabelStyle}>
          <span className="label-mono" style={cornerLabelStyle}>
            {edition}
          </span>
        </div>

        {/* Right side: task + directions stack */}
        <aside style={directionsCardStyle}>
          {taskSlot ? (
            <div id="module-task" style={taskSlotStyle}>
              {taskSlot}
            </div>
          ) : null}
          <div id="module-directions">{directionsSlot}</div>
        </aside>

        {/* Bottom-left: editorial quote */}
        <blockquote style={quoteStyle}>
          <p style={quoteTextStyle}>{quote}</p>
          <footer className="label-mono" style={attributionStyle}>
            {attribution}
          </footer>
        </blockquote>

        {/* Bottom-center: control + scroll CTA */}
        <div style={controlSlot ? bottomBarStyle : bottomBarCenterStyle}>
          {controlSlot ? (
            <div id="module-controls" style={controlBoxStyle}>
              {controlSlot}
            </div>
          ) : null}
          <a href={scrollAnchor} style={scrollCtaStyle} aria-label="Scroll to continue">
            <span className="label-mono">Continue reading</span>
            <span aria-hidden="true" style={ctaArrowStyle}>
              ↓
            </span>
          </a>
        </div>

        {/* Subtle vignette to focus attention on the scene */}
        <div style={vignetteStyle} aria-hidden="true" />
      </section>
      {mobileActionBar}
    </>
  );
}

function useHeroIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return mobile;
}

/* ───── styles ─────────────────────────────────────────────────────── */

const frameStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  height: "min(100vh, 1080px)",
  minHeight: "560px",
  background: "var(--paper-sunk)",
  borderBlock: "1px solid var(--rule)",
  overflow: "hidden",
  isolation: "isolate",
};

const mobileFrameStyle: CSSProperties = {
  width: "100%",
  background: "var(--paper-sunk)",
  borderBlock: "1px solid var(--rule)",
  overflow: "hidden",
};

const mobileTopRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "1rem",
  padding: "0.9rem var(--gutter-inline)",
  borderBlockEnd: "1px solid var(--rule)",
  background: "color-mix(in oklab, var(--paper-elevated) 78%, transparent)",
};

const mobileSceneStyle: CSSProperties = {
  position: "relative",
  height: "min(58vh, 520px)",
  minHeight: "360px",
  overflow: "hidden",
};

const mobilePanelStackStyle: CSSProperties = {
  display: "grid",
  gap: "0.85rem",
  padding: "1rem var(--gutter-inline) 1.25rem",
  background: "var(--paper)",
  borderBlockStart: "1px solid var(--rule)",
};

const mobileDirectionsStyle: CSSProperties = {
  scrollMarginBlockStart: "5rem",
};

const mobileTaskStyle: CSSProperties = {
  scrollMarginBlockStart: "5rem",
};

const mobileControlStyle: CSSProperties = {
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  background: "var(--paper-elevated)",
};

const mobileScrollCtaStyle: CSSProperties = {
  display: "inline-flex",
  justifySelf: "center",
  alignItems: "center",
  gap: "0.55rem",
  padding: "0.6rem 1rem",
  border: "1px solid var(--rule)",
  borderRadius: "999px",
  background: "var(--paper-elevated)",
  color: "var(--ink-primary)",
  textDecoration: "none",
  whiteSpace: "nowrap",
};

const sceneWrapperStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: 0,
};

const bleedWrapperStyle: CSSProperties = {
  position: "absolute",
  insetBlockStart: "clamp(2.6rem, 5vh, 5rem)",
  insetInlineStart: "-1vw",
  display: "flex",
  flexDirection: "column",
  gap: "0.6rem",
  zIndex: 1,
  pointerEvents: "none",
  whiteSpace: "nowrap",
  mixBlendMode: "multiply",
};

const bleedEyebrowStyle: CSSProperties = {
  paddingInlineStart: "clamp(1rem, 2.5vw, 2rem)",
  color: "color-mix(in oklab, var(--ink-secondary) 75%, transparent)",
  letterSpacing: 0,
};

const bleedTitleStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 460,
  fontSize: "clamp(72px, 16vw, 280px)",
  fontVariationSettings: '"opsz" 144',
  lineHeight: 0.86,
  letterSpacing: 0,
  color: "color-mix(in oklab, var(--ink-primary) 78%, transparent)",
  textTransform: "uppercase",
};

const cornerLabelStyle: CSSProperties = {
  color: "var(--ink-secondary)",
  letterSpacing: 0,
};

const topLeftLabelStyle: CSSProperties = {
  position: "absolute",
  insetBlockStart: "1rem",
  insetInlineStart: "1.2rem",
  zIndex: 3,
  pointerEvents: "none",
};

const topRightLabelStyle: CSSProperties = {
  position: "absolute",
  insetBlockStart: "1rem",
  insetInlineEnd: "1.2rem",
  zIndex: 3,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "0.35rem",
  pointerEvents: "none",
};

const directionsCardStyle: CSSProperties = {
  position: "absolute",
  insetBlockStart: "clamp(4rem, 8vh, 7rem)",
  insetInlineEnd: "clamp(1.2rem, 2.5vw, 2.4rem)",
  zIndex: 3,
  display: "grid",
  gap: "0.75rem",
  maxWidth: "min(42ch, calc(100% - 2rem))",
  maxHeight: "calc(100% - 11rem)",
  overflowY: "auto",
  pointerEvents: "auto",
  scrollbarWidth: "thin",
};

const taskSlotStyle: CSSProperties = {
  scrollMarginBlockStart: "5rem",
};

const onboardingStyle: CSSProperties = {
  position: "absolute",
  insetBlockStart: "clamp(5rem, 13vh, 8rem)",
  insetInlineStart: "clamp(1.2rem, 2.5vw, 2.4rem)",
  zIndex: 3,
  pointerEvents: "auto",
};

const quoteStyle: CSSProperties = {
  position: "absolute",
  insetBlockEnd: "clamp(7rem, 14vh, 10rem)",
  insetInlineStart: "clamp(1.2rem, 2.5vw, 2.4rem)",
  zIndex: 3,
  maxWidth: "min(40ch, calc(100% - 2rem))",
  margin: 0,
  pointerEvents: "none",
};

const quoteTextStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)",
  lineHeight: 1.45,
  color: "var(--ink-primary)",
};

const attributionStyle: CSSProperties = {
  display: "block",
  marginBlockStart: "0.6rem",
  color: "var(--ink-tertiary)",
  letterSpacing: 0,
};

const bottomBarStyle: CSSProperties = {
  position: "absolute",
  insetBlockEnd: "1rem",
  insetInlineStart: "1.2rem",
  insetInlineEnd: "1.2rem",
  zIndex: 3,
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "end",
  gap: "1.5rem",
  pointerEvents: "none",
};

const bottomBarCenterStyle: CSSProperties = {
  position: "absolute",
  insetBlockEnd: "1.5rem",
  insetInlineStart: 0,
  insetInlineEnd: 0,
  zIndex: 3,
  display: "flex",
  justifyContent: "center",
  pointerEvents: "none",
};

const controlBoxStyle: CSSProperties = {
  pointerEvents: "auto",
  maxWidth: "min(58ch, 100%)",
};

const scrollCtaStyle: CSSProperties = {
  pointerEvents: "auto",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.55rem",
  padding: "0.55rem 0.95rem",
  border: "1px solid var(--rule)",
  borderRadius: "999px",
  background: "color-mix(in oklab, var(--paper-elevated) 86%, transparent)",
  color: "var(--ink-primary)",
  textDecoration: "none",
  whiteSpace: "nowrap",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
};

const ctaArrowStyle: CSSProperties = {
  color: "var(--accent-bitcoin)",
  animation: "moduleScrollNudge 2200ms var(--ease-organic) infinite",
  display: "inline-block",
};

const vignetteStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: 2,
  pointerEvents: "none",
  background:
    "radial-gradient(ellipse at center, transparent 50%, color-mix(in oklab, var(--paper-sunk) 60%, black 40%) 115%)",
  mixBlendMode: "multiply",
  opacity: 0.55,
};
