import type { CSSProperties, ReactNode } from "react";

/**
 * Postlude — how the module was built. Renders below the Legend, before
 * sources. Four short subsections matching the Halving Garden register.
 */
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

      <Sub label="I" title="Rendering approach">
        Every visible element is geometry — no textures, no GLTF, no postprocessing. A
        React Three Fiber canvas mounts only when the section enters the viewport and
        unmounts when it leaves. Materials read their colors from CSS custom properties
        at hook time and re-tint on theme switch, so the scene matches the rest of the
        site without baking palettes into shaders.
      </Sub>

      <Sub label="II" title="State mapping">
        A single distortion value drives the entire world. <code>paramsFor(d)</code> in{" "}
        <code>lib/distortion.ts</code> is a pure function that returns water level,
        grass density, tree health, node chaos, path clarity, dead-zone area, and signal
        corruption. The slider sets a target; a per-frame easing pass smooths the
        displayed value so the scene breathes rather than jumps.
      </Sub>

      <Sub label="III" title="Performance choices">
        Grass uses an InstancedMesh with hidden-overflow gating — blades beyond the
        density target are simply marked invisible rather than reconstructed. Dead zones
        use cheap radial planes scaled per frame. Paths are tube geometries rebuilt only
        when the topology changes; they reorient, but they do not regenerate. On mobile
        the tree count halves, ambient particles disable, and device-pixel-ratio caps at
        2.
      </Sub>

      <Sub label="IV" title="Accessibility">
        The slider exposes <code>aria-valuemin</code>/<code>max</code>/<code>now</code>/
        <code>text</code> and accepts arrow keys for fine adjustment, Home/End for the
        ends. The explanation panel announces band changes through a polite live region
        without firing on every tick. Users with <code>prefers-reduced-motion</code>{" "}
        never see the canvas at all — they get a static SVG poster.
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
