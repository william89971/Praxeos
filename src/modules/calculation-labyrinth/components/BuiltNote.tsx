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
        <h2 style={titleStyle}>How the labyrinth was made</h2>
      </header>
      <Sub label="I" title="Maze generation">
        A randomized depth-first carving in <code>lib/labyrinthLayout.ts</code> produces
        a deterministic grid maze; a BFS yields the canonical shortest path. Both are
        seeded so the maze is identical on every load — share a screenshot and the path
        will match.
      </Sub>
      <Sub label="II" title="Two states, one scene">
        The slider boolean flips three behaviours simultaneously: walls go from
        ink-stable to oxblood-flickering; price markers shimmer in a chain or fade to
        noise; the pawn either traces the canonical path or wanders inside a small
        radius near the start. The argument is in the contrast.
      </Sub>
      <Sub label="III" title="Performance & a11y">
        All meshes are simple boxes, octahedra, and a torus knot — no textures, no GLTF,
        no postprocessing. The R3F canvas mounts only on intersection. The toggle is
        keyboard-accessible; the live region announces the mode change. Reduced-motion
        users get an SVG poster instead of the canvas.
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
