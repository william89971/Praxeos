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
        <h2 style={titleStyle}>How the garden was made</h2>
      </header>

      <Sub label="I" title="Architecture">
        Three.js via React Three Fiber, with a small set of <code>drei</code> helpers:
        <code>Float</code> for the breathing motion of production nodes and the signal
        beam, <code>Instances</code> for the grass field, and procedural geometry for
        the garden itself. The whole scene is composed under a shared monetary-state ref
        so per-frame animation never re-renders React.
      </Sub>

      <Sub label="II" title="Rendering choices">
        ACES Filmic tone mapping, soft percentage-closer shadows from local lights, and
        a scene fog that thickens as signals degrade so dead zones at the periphery
        dissolve rather than terminate. Water uses <code>MeshPhysicalMaterial</code>{" "}
        with transmission and a clearcoat; production nodes are PBR with elevated
        metalness; trees are matte. No post-processing — the bloom is honest emissive
        plus tone-mapped exposure.
      </Sub>

      <Sub label="III" title="State mapping">
        Credit expansion, savings backing, and correction phase drive the world.{" "}
        <code>paramsForState(state)</code> in <code>lib/distortion.ts</code> is a pure
        function returning derived params: water level, grass density, tree health, node
        chaos, path clarity, dead-zone area, signal corruption, and so on. Control
        changes set a target; a per-frame easing pass smooths the displayed value so the
        scene breathes rather than jumps.
      </Sub>

      <Sub label="IV" title="Performance">
        DPR is capped at 2. Shadows enable on desktop only. Grass is one instanced mesh
        with hidden-overflow density gating — blades beyond the target count are not
        reconstructed, only marked invisible. The R3F canvas mounts only when the
        section enters the viewport (<code>IntersectionObserver</code>) and unmounts
        when it leaves. Reduced-motion users never see the canvas at all — they get the
        static SVG poster instead.
      </Sub>

      <Sub label="V" title="Interaction design">
        Two sliders and one correction action expose the lesson directly: credit can
        outrun saving, but correction reveals the unsupported structure. Inputs expose
        <code>aria-valuemin</code>/<code>max</code>/<code>now</code>/<code>text</code>{" "}
        and accept arrow keys for fine adjustment, Home/End for the ends. The cinematic
        camera responds gently to pointer position on desktop — it is parallax, not
        control.
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
