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

          <h4>Pure-function simulation engine</h4>
          <p>
            The Calculation Problem module runs a real-time economic simulation. The
            engine is a single pure function: <code>step(state, params) → state</code>.
            Zero rendering coupling. This means:
          </p>
          <ul>
            <li>
              The same engine drives the canvas, the unit tests, and the "Be the
              Planner" mode.
            </li>
            <li>Every invariant is testable in Vitest without a browser.</li>
            <li>The simulation is deterministic: same seed, identical trajectory.</li>
          </ul>

          <h4>Canvas 2D, not WebGL</h4>
          <p>
            The sketches use Canvas 2D with a thin React wrapper (<code>Sketch</code>
            component) that handles resize, DPR capping, IntersectionObserver pausing,
            and <code>prefers-reduced-motion</code> fallbacks. No Three.js, no D3, no p5
            runtime overhead. The Halving Garden uses regl for tile rendering because it
            needs WebGL performance; everything else stays on 2D for simplicity.
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

          <h4>The Complexity Slider</h4>
          <p>
            In the Calculation Problem module, a single slider controls the number of
            goods in the economy. As the reader drags it, both panels re-initialise with
            the same seed — identical agents, identical technology — but diverge because
            one has prices and one does not. The visual divergence is the Misesian
            argument in real time.
          </p>

          <h4>The "Be the Planner" Arc</h4>
          <p>
            A three-act guided experience walks the reader through planner mode. Act 1
            (8 goods): the reader can still coordinate manually. Act 2 (48 goods): the
            decision queue lengthens. Act 3 (160 goods): coordination collapses. The arc
            is state-driven, not video — every run is a live simulation.
          </p>

          <h4>Dynamic Explanation</h4>
          <p>
            As the simulation runs, a text panel updates based on the current state:
            market satisfaction, planned waste, price convergence, and the gap between
            the two modes. The explanation is not static; it responds to what the reader
            is seeing.
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

          <h4>Tile pyramid</h4>
          <p>
            The Halving Garden renders ~10–14 GB of pre-baked WebP tiles on Vercel Blob,
            not on the client. The client only fetches visible tiles and ghosts in live
            blocks via a mempool.space WebSocket. This is the same architecture as
            Google Maps, applied to Bitcoin block history.
          </p>
        </Section>

        <Section
          id="testing"
          label="§ V — Testing"
          title="Correctness is not optional."
        >
          <p>The simulation engine has four invariant tests in Vitest:</p>
          <ol>
            <li>
              <strong>Market prices converge</strong> under fixed shocks — the
              tatonnement process reaches equilibrium.
            </li>
            <li>
              <strong>Socialist waste grows superlinearly</strong> with the number of
              goods — the Misesian prediction is encoded as a testable invariant.
            </li>
            <li>
              <strong>Both modes conserve total resources</strong> — no goods are
              created or destroyed; waste is accounted for explicitly.
            </li>
            <li>
              <strong>Same seed produces identical trajectory</strong> — determinism is
              a feature, not a bug.
            </li>
          </ol>
          <p>
            E2E tests run in Playwright with visual regression snapshots. The site must
            pass Lighthouse 100/100/100/100 on desktop before any PR merges.
          </p>
        </Section>

        <Section
          id="design"
          label="§ VI — Design System"
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
│  │ Static HTML │  │ Canvas 2D   │  │ WebSocket (live)    │  │
│  │ (App Router)│  │ simulation  │  │ blocks / metrics    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└────────────────────┬────────────────────┬───────────────────┘
                     │                    │
        ┌────────────┘                    └────────────┐
        │                                              │
        ▼                                              ▼
┌──────────────┐                            ┌──────────────────┐
│ Vercel Edge  │                            │ Vercel Blob      │
│ /api/blocks  │                            │ WebP tile pyramid│
│ /api/m2      │                            │ (immutable CDN)  │
│ /api/tile/*  │                            └──────────────────┘
└──────┬───────┘
       │
   ┌───┴───┐
   ▼       ▼
mempool  FRED
.space    API`}
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
