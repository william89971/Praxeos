import type { CSSProperties, ReactNode } from "react";

export function BuiltNote() {
  return (
    <section
      aria-label="Built note"
      style={{
        maxWidth: "var(--measure-prose)",
        marginInline: "auto",
        paddingInline: "var(--gutter-inline)",
        paddingBlock: "calc(var(--gutter-block) * 0.9)",
        display: "grid",
        gap: "1.6rem",
        borderBlockStart: "1px solid var(--rule)",
      }}
    >
      <header>
        <p className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
          A note on the build
        </p>
        <h2 style={titleStyle}>How the engine carries</h2>
      </header>
      <Sub label="I" title="Network of phases">
        Forty-two agents sit on three concentric rings, each agent emitting a pulse with
        its own phase. At zero distortion the per-agent phase locks to a shared clock,
        producing the visible synchrony. As distortion rises, each agent drifts back to
        its own phase — coherence collapses without anyone moving position.
      </Sub>
      <Sub label="II" title="Edge breakage">
        Each edge has a per-frame "broken" check: a per-edge sinusoid threshold-tested
        against a distortion-derived breakage parameter. Broken edges go dark and
        opacity drops; they recover stochastically. The flicker is computed, not
        scripted.
      </Sub>
      <Sub label="III" title="Blender pipeline ready">
        Agent geometry is currently a procedural icosahedron. Drop a Blender export at{" "}
        <code>/public/models/coordination-engine/agent.glb</code> and the
        <code>GltfAsset</code> wrapper in scene/AgentNodes upgrades silently — sketched
        once, see Built note's "Blender pipeline" section on the <code>/built</code>{" "}
        page for the export checklist.
      </Sub>
      <Sub label="IV" title="Performance & a11y">
        The slider is keyboard-accessible (arrows ±0.02, Home/End). Mode toggle is a
        proper <code>aria-pressed</code> button group. The R3F canvas mounts only on
        intersection. Reduced-motion users get a static SVG poster instead.
      </Sub>
    </section>
  );
}

function Sub({
  label,
  title,
  children,
}: {
  readonly label: string;
  readonly title: string;
  readonly children: ReactNode;
}) {
  return (
    <article>
      <p className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
        {label}
      </p>
      <h3 style={subTitleStyle}>{title}</h3>
      <p style={subProseStyle}>{children}</p>
    </article>
  );
}

const titleStyle: CSSProperties = {
  margin: "0.5rem 0 0",
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-3)",
  lineHeight: 1.1,
  color: "var(--ink-primary)",
};
const subTitleStyle: CSSProperties = {
  margin: "0.35rem 0 0.6rem",
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-1)",
  lineHeight: 1.2,
  color: "var(--ink-primary)",
};
const subProseStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-0)",
  lineHeight: 1.65,
  color: "var(--ink-secondary)",
};
