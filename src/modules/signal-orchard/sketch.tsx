"use client";

import dynamic from "next/dynamic";
import { type CSSProperties, useState } from "react";
import { InteractionPanel } from "./components/InteractionPanel";
import { ReducedMotionPoster } from "./components/ReducedMotionPoster";
import type { ActiveAction } from "./lib/signals";

const SignalOrchardScene = dynamic(
  () => import("./components/SignalOrchardScene").then((m) => m.SignalOrchardScene),
  { ssr: false, loading: () => <ReducedMotionPoster /> },
);

export default function SignalOrchardSketch() {
  const [mode, setMode] = useState<"guided" | "explore">("guided");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [actions, setActions] = useState<readonly ActiveAction[]>([]);

  const onSelect = (id: number) => {
    if (mode === "guided") setMode("explore");
    setActions([...actions, { originId: id, startedAt: performance.now() / 1000 }]);
  };

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <p style={introStyle}>
        <em>
          Each cypress is an actor. Each act radiates. Watch coordination emerge as
          private choices become a public chord.
        </em>
      </p>
      <SignalOrchardScene
        mode={mode}
        hoveredId={hoveredId}
        onHover={setHoveredId}
        onSelect={onSelect}
        actionsQueue={actions}
        setActionsQueue={setActions}
        fallback={<ReducedMotionPoster />}
        overlay={
          <div style={overlayWrapperStyle}>
            <InteractionPanel
              mode={mode}
              onModeChange={setMode}
              hoveredId={hoveredId}
              recentActionCount={actions.length}
            />
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

const overlayWrapperStyle: CSSProperties = {
  position: "absolute",
  insetBlockStart: "1rem",
  insetInlineStart: "1rem",
  pointerEvents: "auto",
};
