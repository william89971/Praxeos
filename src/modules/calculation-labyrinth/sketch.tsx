"use client";

import dynamic from "next/dynamic";
import { type CSSProperties, useState } from "react";
import { ModeToggle } from "./components/ModeToggle";
import { ReducedMotionPoster } from "./components/ReducedMotionPoster";

const LabyrinthScene = dynamic(
  () => import("./components/LabyrinthScene").then((m) => m.LabyrinthScene),
  { ssr: false, loading: () => <ReducedMotionPoster /> },
);

export default function CalculationLabyrinthSketch() {
  const [priced, setPriced] = useState(true);

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <p style={introStyle}>
        <em>
          Try to plan without prices — and watch the map disappear. Prices are not
          incentives; they are the language of computation.
        </em>
      </p>
      <LabyrinthScene
        priced={priced}
        fallback={<ReducedMotionPoster />}
        overlay={
          <div style={overlayStyle}>
            <ModeToggle priced={priced} onChange={setPriced} />
          </div>
        }
      />
    </div>
  );
}

const introStyle: CSSProperties = {
  margin: 0,
  paddingInline: "var(--gutter-inline)",
  maxWidth: "var(--measure-narrow)",
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-0)",
  lineHeight: 1.5,
  color: "var(--ink-secondary)",
};

const overlayStyle: CSSProperties = {
  position: "absolute",
  insetBlockStart: "1rem",
  insetInlineStart: "1rem",
  pointerEvents: "auto",
};
