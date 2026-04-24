"use client";

import { hashSeed, mulberry32 } from "@/sketches/lib/rng";
import { Fragment, useMemo, useState } from "react";

/**
 * Inline mini-interactive for the essay: Böhm-Bawerk's three stages of a
 * roundabout production structure as nested woodcuts.
 *
 *   Primary      →     Intermediate     →     Final
 *   (a short line)      (a small branching        (a full tree with
 *                        tree)                    ground + roots)
 *
 * Hover one stage to emphasise its contribution; others fade. On touch
 * devices, tapping cycles selection.
 *
 * Self-contained — does not depend on the main forest L-system.
 */

type Stage = "primary" | "intermediate" | "final";

const STAGES: ReadonlyArray<{
  id: Stage;
  label: string;
  caption: string;
  iterations: number;
  trunk: number;
}> = [
  {
    id: "primary",
    label: "Primary",
    caption: "Raw means: labour, land, unworked materials.",
    iterations: 1,
    trunk: 0.55,
  },
  {
    id: "intermediate",
    label: "Intermediate",
    caption: "Tools, capital goods — made to make.",
    iterations: 3,
    trunk: 0.7,
  },
  {
    id: "final",
    label: "Final",
    caption: "Consumer goods, at last. Paid for by prior abstention.",
    iterations: 5,
    trunk: 1,
  },
];

export function RoundaboutnessDiagram({ seed = "roundabout-v1" }: { seed?: string }) {
  const [focused, setFocused] = useState<Stage | null>(null);

  const trees = useMemo(
    () => STAGES.map((s) => generateStage(s.id, s.iterations, s.trunk, seed)),
    [seed],
  );

  return (
    <figure
      style={{
        margin: "2.5em 0",
        padding: "1.25rem 1.25rem 1rem",
        border: "1px solid var(--rule)",
        background: "var(--paper-elevated)",
        borderRadius: "var(--radius-sm)",
      }}
      aria-labelledby="roundabout-caption"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr auto 1fr",
          alignItems: "end",
          gap: "0.25rem",
          marginBlockEnd: "1rem",
        }}
      >
        {STAGES.map((stage, i) => (
          <Fragment key={stage.id}>
            <StageFrame
              label={stage.label}
              caption={stage.caption}
              segments={trees[i] ?? []}
              active={focused === null || focused === stage.id}
              onFocus={() => setFocused(stage.id)}
              onBlur={() => setFocused(null)}
            />
            {i < STAGES.length - 1 ? (
              <Arrow faded={focused !== null && focused !== stage.id} />
            ) : null}
          </Fragment>
        ))}
      </div>
      <figcaption
        id="roundabout-caption"
        className="label-mono"
        style={{
          color: "var(--ink-tertiary)",
          textAlign: "center",
          fontStyle: "italic",
          paddingBlockStart: "0.75rem",
          borderBlockStart: "1px solid var(--rule)",
        }}
      >
        A production structure — primary inputs → intermediate capital goods → final
        consumer goods. Each stage requires saving enough to sustain the previous one.
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------------ */

type Segment = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
};

const FRAME_W = 260;
const FRAME_H = 150;

function StageFrame({
  label,
  caption,
  segments,
  active,
  onFocus,
  onBlur,
}: {
  label: string;
  caption: string;
  segments: readonly Segment[];
  active: boolean;
  onFocus: () => void;
  onBlur: () => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onFocus}
      onMouseLeave={onBlur}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onFocus}
      data-interactive
      aria-label={`${label} — ${caption}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: "0.4rem",
        padding: 0,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        opacity: active ? 1 : 0.28,
        transition: "opacity var(--dur-std) var(--ease-organic)",
      }}
    >
      <svg
        viewBox={`0 0 ${FRAME_W} ${FRAME_H}`}
        role="img"
        aria-hidden="true"
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <title>{`${label} stage — woodcut`}</title>
        {/* ground line */}
        <line
          x1="6"
          x2={FRAME_W - 6}
          y1={FRAME_H - 18}
          y2={FRAME_H - 18}
          stroke="var(--ink-tertiary)"
          strokeOpacity="0.55"
          strokeWidth="0.75"
        />
        {segments.map((s) => (
          <line
            key={`${s.x1.toFixed(2)}-${s.y1.toFixed(2)}-${s.x2.toFixed(2)}-${s.y2.toFixed(2)}`}
            x1={s.x1}
            y1={s.y1}
            x2={s.x2}
            y2={s.y2}
            stroke="var(--ink-primary)"
            strokeWidth={s.width}
            strokeOpacity={0.88}
            strokeLinecap="round"
          />
        ))}
      </svg>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          gap: "0.2rem",
          paddingInline: "0.25rem",
          textAlign: "left",
        }}
      >
        <span
          className="label-mono"
          style={{ color: "var(--ink-primary)", fontWeight: 500 }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "var(--step--1)",
            color: "var(--ink-secondary)",
            lineHeight: 1.35,
          }}
        >
          {caption}
        </span>
      </div>
    </button>
  );
}

function Arrow({ faded }: { faded: boolean }) {
  return (
    <svg
      viewBox="0 0 36 60"
      aria-hidden="true"
      style={{
        width: 32,
        height: "3.5rem",
        alignSelf: "center",
        color: "var(--ink-tertiary)",
        opacity: faded ? 0.22 : 0.62,
        transition: "opacity var(--dur-std) var(--ease-organic)",
      }}
    >
      <title>arrow</title>
      <line
        x1="4"
        y1="30"
        x2="28"
        y2="30"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <polyline
        points="22,24 30,30 22,36"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------------ */
/* Self-contained L-system branching for each frame                          */
/* ------------------------------------------------------------------------ */

function generateStage(
  id: Stage,
  iterations: number,
  trunkScale: number,
  seed: string,
): Segment[] {
  const rng = mulberry32(hashSeed(`${seed}::${id}`));
  const segs: Segment[] = [];
  const rootX = FRAME_W / 2;
  const groundY = FRAME_H - 18;
  const trunkLen = (FRAME_H - 30) * trunkScale;

  branch(
    segs,
    rng,
    rootX,
    groundY,
    -Math.PI / 2,
    trunkLen,
    1.8 + trunkScale * 1.4,
    iterations,
    id,
  );

  // primary and intermediate get a short subterranean line for continuity
  if (id !== "primary") {
    branch(
      segs,
      rng,
      rootX,
      groundY,
      Math.PI / 2,
      trunkLen * 0.35,
      1.2,
      Math.max(1, iterations - 2),
      id,
    );
  }

  return segs;
}

function branch(
  segs: Segment[],
  rng: () => number,
  x: number,
  y: number,
  angle: number,
  length: number,
  width: number,
  iters: number,
  stage: Stage,
) {
  if (iters <= 0 || length < 3 || width < 0.3) return;

  const wobble = (rng() - 0.5) * 0.08;
  const x2 = x + Math.cos(angle + wobble) * length;
  const y2 = y + Math.sin(angle + wobble) * length;

  segs.push({ x1: x, y1: y, x2, y2, width });

  const branches = stage === "final" && rng() < 0.25 ? 3 : 2;
  const spreadBase = stage === "primary" ? 0.15 : 0.55;
  for (let i = 0; i < branches; i++) {
    const spread = spreadBase + (rng() - 0.5) * 0.2;
    const sign = i === 0 ? -1 : i === 1 ? 1 : (rng() - 0.5) * 2;
    const childAngle = angle + sign * spread;
    const childLength = length * (0.7 + rng() * 0.12);
    const childWidth = width * 0.7;
    branch(segs, rng, x2, y2, childAngle, childLength, childWidth, iters - 1, stage);
  }
}
