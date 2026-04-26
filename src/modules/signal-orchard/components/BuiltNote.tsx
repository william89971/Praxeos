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
        <h2 style={titleStyle}>How the orchard listens</h2>
      </header>
      <Sub label="I" title="Network of acts">
        Each cypress is a node. Edges are nearest-neighbour links computed once at
        layout time. When an actor "acts," a pure simulation in{" "}
        <code>lib/signals.ts</code> propagates a pulse through the graph in
        breadth-first order, attenuating with each hop. Rendering reads the active pulse
        map per frame; the simulation has zero rendering coupling.
      </Sub>
      <Sub label="II" title="Blender pipeline ready">
        Each cypress is wrapped in a <code>GltfAsset</code> that fetches{" "}
        <code>/models/signal-orchard/cypress.glb</code>; if the file is absent, a
        procedural cone-and-trunk fallback renders. Drop a Blender export into that
        folder to upgrade silently.
      </Sub>
      <Sub label="III" title="Performance">
        The R3F canvas mounts only on intersection and respects reduced-motion. The
        simulation runs inside <code>useFrame</code> from a ref-context — no React
        re-renders during pulse propagation. On mobile, hover affordance is replaced by
        tap-to-act.
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
