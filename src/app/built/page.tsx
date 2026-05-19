import { SiteChrome } from "@/components/layout/SiteChrome";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How this was built",
  description:
    "Architecture, engineering decisions, and design philosophy behind Praxeos.",
};

export default function BuiltPage() {
  return (
    <SiteChrome>
      <article
        style={{
          maxWidth: "var(--measure-wide)",
          marginInline: "auto",
          paddingInline: "var(--gutter-inline)",
          paddingBlock: "var(--gutter-block)",
        }}
      >
        <p
          className="label-mono"
          style={{ marginBottom: "1rem", color: "var(--ink-tertiary)" }}
        >
          Praxeos · Engineering
        </p>
        <h1 style={{ marginBottom: "1rem" }}>How this was built.</h1>
        <p
          className="italic"
          style={{
            fontSize: "var(--step-1)",
            color: "var(--ink-secondary)",
            marginBottom: "3rem",
            maxWidth: "52ch",
          }}
        >
          A calm, precise account of the architecture, the decisions that mattered, and
          the constraints that shaped them.
        </p>

        <Section
          id="philosophy"
          label="§ I — Philosophy"
          title="The medium is the argument."
        >
          <p>
            Praxeos is not a blog with extra CSS. It is an explorable explanation — a
            format in which the reader learns by manipulating a system, not by reading a
            proof. The site is its own argument: that Austrian economics deserves the
            same craft attention as any other intellectual tradition.
          </p>
          <p>
            Every module pairs a <strong>real-time simulation</strong> with a
            primary-source-backed essay. The simulation is not decoration; it is the
            argument made visible. The essay is not captioning; it is the scholarly
            grounding without which the simulation is mere entertainment.
          </p>
        </Section>

        <Section
          id="architecture"
          label="§ II — Architecture"
          title="A system designed for correctness and beauty."
        >
          <ArchitectureDiagram />

          <h4>Next.js 15 App Router</h4>
          <p>
            The App Router gives us server components by default. This means the HTML
            that reaches the reader is pre-rendered, searchable, and fast. Client
            components are pushed to the leaves — only where interactivity is genuinely
            needed: sketches, the theme toggle, and the custom cursor.
          </p>

          <h4>Pure interaction state</h4>
          <p>
            The active modules keep their teaching logic in pure helpers before it ever
            reaches WebGL: monetary metrics, signal propagation, labyrinth movement
            costs, and coordination coherence. Zero rendering coupling. This means:
          </p>
          <ul>
            <li>
              The same state model drives the scene, the controls, query hydration, and
              unit tests.
            </li>
            <li>Every invariant is testable in Vitest without a browser.</li>
            <li>Seeded modules stay deterministic: same seed, identical layout.</li>
          </ul>

          <h4>3D stages with poster fallbacks</h4>
          <p>
            The four live modules use React Three Fiber where the interactive thesis
            benefits from spatial structure. A shared scene shell handles DPR capping,
            IntersectionObserver mounting, and <code>prefers-reduced-motion</code>{" "}
            fallbacks. Reduced-motion users get the poster frame and no canvas mount.
          </p>
        </Section>

        <Section
          id="interaction"
          label="§ III — Interaction System"
          title="Every interaction teaches something."
        >
          <p>
            The interaction design follows a simple rule:{" "}
            <em>
              if the reader does nothing, the system still teaches; if the reader acts,
              the system teaches more.
            </em>
          </p>

          <h4>Monetary Garden controls</h4>
          <p>
            Credit expansion and savings backing are separate controls. The correction
            action reveals the difference between growth funded by real saving and
            growth funded by an edited money signal.
          </p>

          <h4>Actor-first signaling</h4>
          <p>
            The Signal Orchard starts with action: buy, sell, wait, or discover.
            Clicking an actor emits a local pulse, updates neighbors, and records the
            action in a concise log.
          </p>

          <h4>Calculation as exercise</h4>
          <p>
            The Calculation Labyrinth makes the reader move the planner. With prices,
            legal exits carry comparable costs; without prices, the markers disappear
            and the waste counter records wrong turns and backtracking.
          </p>

          <h4>Coordination as synchrony</h4>
          <p>
            The Coordination Engine focuses on reliability, latency, and shocks. Node
            pulses show how demand and supply signals become coherent throughput or
            missed plans.
          </p>
        </Section>

        <Section
          id="performance"
          label="§ IV — Performance"
          title="Fast by design, not by optimisation."
        >
          <MetricsGrid />

          <h4>Static generation</h4>
          <p>
            Every module page, thinker page, and content page is statically generated at
            build time. The only dynamic routes are the API proxies (mempool.space
            blocks, FRED M2 data, tile redirects) — and those are Edge functions with
            aggressive caching.
          </p>

          <h4>Lazy loading</h4>
          <p>
            Sketches are loaded with <code>next/dynamic</code> and{" "}
            <code>ssr: false</code>. The homepage Teleology sketch loads only after the
            rest of the page has painted. Module sketches load on route navigation. The
            JS bundle for a module route stays under 200 KB gzipped.
          </p>

          <h4>Shareable state</h4>
          <p>
            Each active module hydrates from query params. A reader can share a garden
            with a specific credit/savings mix, an orchard action mode, a labyrinth
            challenge, or a coordination reliability/latency state.
          </p>
        </Section>

        <Section
          id="testing"
          label="§ V — Testing"
          title="Correctness is not optional."
        >
          <p>The interaction layer has four focused invariant groups in Vitest:</p>
          <ol>
            <li>
              <strong>Monetary metrics</strong> respond correctly to credit, savings,
              and correction.
            </li>
            <li>
              <strong>Signal propagation</strong> preserves action kind, origin, and
              neighbor updates.
            </li>
            <li>
              <strong>Labyrinth movement</strong> distinguishes legal moves, wrong
              turns, and waste.
            </li>
            <li>
              <strong>Coordination parameters</strong> connect reliability and latency
              to coherence, throughput, failed links, and missed plans.
            </li>
          </ol>
          <p>
            E2E tests run in Playwright with visual regression snapshots. The site must
            pass Lighthouse 100/100/100/100 on desktop before any PR merges.
          </p>
        </Section>

        <Section
          id="blender-pipeline"
          label="§ VI — Blender Pipeline"
          title="From .blend to the browser."
        >
          <p>
            The 3D modules — Monetary Garden, Signal Orchard, Calculation Labyrinth,
            Coordination Engine — are designed to receive Blender exports without code
            changes. Each scene element is wrapped in a <code>GltfAsset</code> component
            (<code>src/sketches/lib/GltfAsset.tsx</code>) that fetches a{" "}
            <code>.glb</code> from <code>/public/models/&lt;module-slug&gt;/</code> and
            falls back to procedural geometry when the file is absent. Drop a Blender
            export into the right folder and the next page load uses it.
          </p>

          <h4>Folder convention</h4>
          <pre
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--step--2)",
              background: "var(--paper-elevated)",
              padding: "1rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--rule)",
              overflowX: "auto",
              lineHeight: 1.55,
              color: "var(--ink-secondary)",
            }}
          >{`/public/models/
  monetary-garden/
    tree-0.glb       tree-1.glb       tree-2.glb
    production-node.glb
  signal-orchard/
    cypress.glb
  calculation-labyrinth/
    planner.glb      goal.glb
  coordination-engine/
    agent.glb`}</pre>

          <h4>Blender export checklist</h4>
          <ul>
            <li>
              <strong>Format:</strong> File → Export → glTF 2.0 (.glb / .gltf), choose{" "}
              <em>glTF Binary (.glb)</em> with embedded textures.
            </li>
            <li>
              <strong>Geometry:</strong> apply transforms before export (Object → Apply
              → All Transforms); include normals and tangents.
            </li>
            <li>
              <strong>Materials:</strong> Principled BSDF only — node groups do not
              survive the export. Use baseline colour, roughness, and metalness; the
              scene provides local procedural lighting.
            </li>
            <li>
              <strong>Scale:</strong> 1 Blender unit = 1 metre. Most Praxeos elements
              expect ~0.5 m to 2 m on the longest axis.
            </li>
            <li>
              <strong>Up axis:</strong> +Y up, +Z forward (the glTF default).
            </li>
            <li>
              <strong>Compression:</strong>{" "}
              <code>npx gltf-pipeline -i in.glb -o out.glb -d</code> for Draco. drei's{" "}
              <code>useGLTF</code> auto-resolves Draco and KTX2 transcoders.
            </li>
            <li>
              <strong>Drop in:</strong> place the file at the path expected by the scene
              component (e.g. <code>/public/models/monetary-garden/tree-0.glb</code>);
              no code change required.
            </li>
          </ul>

          <h4>Why the procedural fallback exists</h4>
          <p>
            The fallback is not a placeholder for "later" — it is the canonical first
            paint, designed to look intentional. The Blender pipeline is an asset
            upgrade path, not a dependency: if the .glb is missing, slow, or corrupted,
            the procedural geometry takes over and the module remains shippable. This
            decouples the design pipeline from the engineering pipeline.
          </p>
        </Section>

        <Section
          id="design"
          label="§ VII — Design System"
          title="Editorial brutalism with organic soul."
        >
          <p>
            The design system is documented in three files: <code>tokens.css</code>{" "}
            (colors, space, motion), <code>typography.css</code> (Fraunces, Inter,
            JetBrains Mono), and <code>AESTHETIC.md</code> (the philosophy). Key
            non-negotiables:
          </p>
          <ul>
            <li>
              No pure black or pure white — paper is warm cream; ink is warm near-black.
            </li>
            <li>
              No off-the-shelf icon sets — all icons are hand-drawn at 1.5px stroke.
            </li>
            <li>
              No default CSS ease — every transition uses <code>--ease-organic</code>.
            </li>
            <li>Typography is the protagonist — decoration is secondary or absent.</li>
          </ul>
        </Section>

        <hr />

        <p
          className="label-mono"
          style={{
            textAlign: "center",
            marginTop: "3rem",
            color: "var(--ink-tertiary)",
          }}
        >
          <Link href="/colophon" style={{ textDecoration: "none" }}>
            Colophon →
          </Link>
        </p>
      </article>
    </SiteChrome>
  );
}

/* -------------------------------------------------------------------------- */

function Section({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} style={{ marginBottom: "3.5rem" }}>
      <p
        className="label-mono"
        style={{
          color: "var(--ink-tertiary)",
          marginBottom: "0.75rem",
          fontSize: "var(--step--2)",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </p>
      <h3 style={{ marginTop: 0, marginBottom: "1.25rem" }}>{title}</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)",
          gap: "clamp(1.5rem, 4vw, 4rem)",
        }}
      >
        <div aria-hidden="true" />
        <div style={{ maxWidth: "var(--measure-prose)" }}>{children}</div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function ArchitectureDiagram() {
  return (
    <div
      style={{
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-md)",
        padding: "1.5rem",
        background: "var(--paper-elevated)",
        marginBlock: "2rem",
        fontFamily: "var(--font-mono)",
        fontSize: "var(--step--2)",
        lineHeight: 1.6,
        color: "var(--ink-secondary)",
        overflowX: "auto",
      }}
      aria-label="System architecture diagram"
    >
      <pre style={{ margin: 0 }}>
        {`┌─────────────────────────────────────────────────────────────┐
│  Reader (Browser)                                           │
│  ─────────────────                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Static HTML │  │ R3F canvas  │  │ Query state         │  │
│  │ App Router  │  │ if allowed  │  │ share + hydrate     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└────────────────────┬────────────────────┬───────────────────┘
                     │                    │
        ┌────────────┘                    └────────────┐
        │                                              │
        ▼                                              ▼
┌──────────────────┐                       ┌──────────────────┐
│ Pure state logic │                       │ Reduced motion   │
│ metrics / costs  │                       │ poster fallback  │
│ pulses / params  │                       │ no canvas mount  │
└──────────────────┘                       └──────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│ Monetary Garden · Signal Orchard · Calculation Labyrinth    │
│ Coordination Engine                                         │
└─────────────────────────────────────────────────────────────┘`}
      </pre>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function MetricsGrid() {
  const metrics = [
    { label: "Homepage JS", value: "≤ 100 KB", note: "gzipped, sketch lazy-loaded" },
    { label: "Module JS", value: "≤ 200 KB", note: "gzipped, engine + canvas" },
    { label: "Lighthouse", value: "100/100/100/100", note: "desktop target" },
    { label: "LCP", value: "< 1.8 s", note: "4G mobile, poster frame" },
    { label: "Type coverage", value: "Strict", note: "noUncheckedIndexedAccess" },
    { label: "Test layers", value: "4", note: "unit, e2e, visual, type" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(14ch, 1fr))",
        gap: "1rem",
        marginBlock: "2rem",
      }}
    >
      {metrics.map((m) => (
        <div
          key={m.label}
          style={{
            border: "1px solid var(--rule)",
            borderRadius: "var(--radius-md)",
            padding: "1rem",
            background: "var(--paper-elevated)",
          }}
        >
          <p
            className="label-mono"
            style={{
              margin: 0,
              marginBottom: "0.5rem",
              color: "var(--ink-tertiary)",
              fontSize: "var(--step--2)",
            }}
          >
            {m.label}
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-mono)",
              fontSize: "var(--step-1)",
              color: "var(--ink-primary)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {m.value}
          </p>
          <p
            style={{
              margin: 0,
              marginTop: "0.35rem",
              fontFamily: "var(--font-serif)",
              fontSize: "var(--step--2)",
              color: "var(--ink-tertiary)",
              fontStyle: "italic",
            }}
          >
            {m.note}
          </p>
        </div>
      ))}
    </div>
  );
}
