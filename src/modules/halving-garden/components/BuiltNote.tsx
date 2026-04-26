import type { CSSProperties } from "react";

/**
 * Postlude section explaining how the 3D scene is constructed and why
 * the visual choice maps to Bitcoin's scarcity argument. Renders below
 * the essay, before sources, via ModuleLayout's `postlude` prop.
 */
export function BuiltNote() {
  return (
    <section
      aria-label="Built note"
      style={{
        maxWidth: "var(--measure-prose)",
        marginInline: "auto",
        paddingInline: "var(--gutter-inline)",
        paddingBlock: "var(--gutter-block)",
        display: "grid",
        gap: "1.6rem",
        borderBlockStart: "1px solid var(--rule)",
      }}
    >
      <header>
        <p className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
          A note on the build
        </p>
        <h2
          style={{
            margin: "0.6rem 0 0",
            fontFamily: "var(--font-serif)",
            fontSize: "var(--step-3)",
            lineHeight: 1.1,
            color: "var(--ink-primary)",
          }}
        >
          How the manuscript-garden was made
        </h2>
      </header>

      <Sub label="I" title="How the scene works">
        Five tilted pages run along a single axis, one for each halving era. Each block
        is an instanced glyph placed deterministically from a seed derived from the
        epoch index, so the field is identical on every load. Live arrivals from the
        public mempool feed pulse in over the page they belong to, then settle. Between
        pages stand two slim light-bars — the halving gates — luminous in Bitcoin
        orange.
      </Sub>

      <Sub label="II" title="How epochs are mapped visually">
        Block count per epoch is constant (210,000), so density is roughly equal. The
        change you can <em>see</em> is the per-block reward: glyph scale and emissive
        intensity decay each gate, encoding the halving directly in the silhouette.
        Genesis blocks loom; Saturation blocks are pinpoints. The visual asymmetry
        across the hall is the lesson.
      </Sub>

      <Sub label="III" title="How performance is held">
        All block markers ride a single InstancedMesh per epoch, capped at modest counts
        and downsampled on mobile. The R3F canvas only mounts when the section enters
        the viewport (IntersectionObserver) and unmounts when it leaves. Reduced-motion
        users get a static SVG poster instead — no canvas, no GPU. No textures, no GLTF,
        no HDRI: the scene is geometry and tokens.
      </Sub>

      <Sub label="IV" title="Why this teaches scarcity">
        Charts of Bitcoin issuance are easy to gloss past. A hall whose light dims at
        every threshold is harder to. The rule is that no one votes on the gates — they
        arrive on schedule, and they cut new issuance in half whether or not it suits
        the moment. Walking through the hall is the closest a webpage gets to the felt
        sense of an enforced monetary discipline.
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
  readonly children: React.ReactNode;
}) {
  return (
    <article style={subStyle}>
      <p className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
        {label}
      </p>
      <h3
        style={{
          margin: "0.35rem 0 0.6rem",
          fontFamily: "var(--font-serif)",
          fontSize: "var(--step-1)",
          lineHeight: 1.2,
          color: "var(--ink-primary)",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: 0,
          fontFamily: "var(--font-serif)",
          fontSize: "var(--step-0)",
          lineHeight: 1.65,
          color: "var(--ink-secondary)",
        }}
      >
        {children}
      </p>
    </article>
  );
}

const subStyle: CSSProperties = {
  display: "grid",
};
