import { SiteChrome } from "@/components/layout/SiteChrome";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import productMapOverview from "../../../docs/product/assets/product-map-overview.png";
import flagshipHomepage from "../../../tests/visual/snapshots/desktop-chromium/homepage.png";

export const metadata: Metadata = {
  title: "How It Was Built",
  description:
    "The product decisions, architecture, accessibility work, mistakes, verification, and pending learner study behind Praxeos.",
};

const sections = [
  [
    "Problem and intended learners",
    "Economic ideas are often presented as conclusions to memorize. Praxeos is for curious beginners who need an ordinary situation, one visible decision at a time, an inspectable consequence, and a private record of how their interpretation changed.",
  ],
  [
    "William’s decisions",
    "William chose the progression from individual choice to exchange, entrepreneurial discovery, and money across time; made Market Without a Manager the flagship; kept the warm editorial identity; and drew a hard boundary between transparent deterministic checks and optional semantic guidance.",
  ],
  [
    "Abandoned approaches",
    "The earlier product scattered attention across Monetary Garden, Signal Orchard, Calculation Labyrinth, and Coordination Engine. It also carried static motion fallbacks, answer-shaped analyzer feedback, and unreachable preview code. Those approaches were retired after their useful sources and design lessons were preserved.",
  ],
  [
    "Claude and Codex contribution",
    "Codex assisted with implementation, fixtures, documentation, and verification under William’s product direction. Claude is an optional in-product Guide: it can question reasoning with allowlisted, cited sources, but it cannot score a conclusion or become an ideological authority.",
  ],
  [
    "Architecture",
    "Next.js renders the learning system. Four pure TypeScript engines create replayable state from a seed, assumptions, and action log. One versioned local browser store holds lessons and Lab records. Only the bounded Guide endpoint is dynamic; no account or transcript database is required.",
  ],
  [
    "Accessibility",
    "Every Lab uses semantic HTML and SVG, large controls, visible focus, structured state, live change summaries, and the same complete interaction under reduced motion. Mobile focuses the current action and turns secondary evidence into a readable sequence.",
  ],
  [
    "Mistakes and tradeoffs",
    "Breadth originally arrived before a clear first action. Visual fallback was mistaken for educational equivalence, and keyword-shaped feedback risked pretending to understand prose. Local-only records improve privacy and simplicity but do not sync across devices.",
  ],
  [
    "What is actually verified",
    "Automated results and remaining blockers are recorded in the build report. Technical checks can verify deterministic engines, privacy boundaries, keyboard flows, rendering, and performance. They cannot verify semantic understanding or educational impact.",
  ],
] as const;

export default function BuiltPage() {
  return (
    <SiteChrome>
      <main className="page-shell">
        <header className="page-section content-header">
          <p className="label-mono">Case study · educational validation pending</p>
          <h1 className="editorial-heading">
            Four learning Labs, one evidence boundary.
          </h1>
          <p>
            This page separates William’s decisions, AI-assisted implementation,
            simulation output, automated checks, internal review, and evidence that
            still has to come from real learners.
          </p>
          <div className="editorial-actions">
            <Link href="/labs/market-without-a-manager?mode=guided">
              Run the 90-second demo path
            </Link>
            <a
              href="https://www.figma.com/design/ZiEe4IeEPtGfkMeXLwE1Zk"
              target="_blank"
              rel="noreferrer"
            >
              Open product-map draft
            </a>
          </div>
        </header>

        <section className="page-section built-visual">
          <Image
            src={productMapOverview}
            alt="Praxeos product map showing the four-Lab progression, shared seven-part experience, non-semantic deterministic boundary, optional cited Claude Guide, and release gates."
            sizes="(max-width: 768px) 100vw, 1200px"
            style={{ width: "100%", height: "auto" }}
          />
          <p>
            The code-native overview is the repository fallback for the editable product
            map. It keeps the four-Lab sequence and the study gate visible even when
            Figma access is unavailable.
          </p>
        </section>

        <section className="page-section content-grid" aria-label="Build visuals">
          <figure className="content-card">
            <small>Implemented surface · homepage</small>
            <Image
              src={flagshipHomepage}
              alt="Praxeos homepage with the flagship Market Without a Manager action and the wider learning paths."
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ width: "100%", height: "auto" }}
            />
            <figcaption>
              One action starts the flagship. Learn, Practice, Labs, Notebook, and
              Sources remain visible without competing with it.
            </figcaption>
          </figure>
          <figure className="content-card">
            <small>Implemented surface · flagship environment</small>
            <Image
              src="/images/labs/market-without-a-manager.webp"
              alt="Cut-paper market with five participants exchanging goods around a shared record."
              width={1200}
              height={675}
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ width: "100%", height: "auto" }}
            />
            <figcaption>
              The visual sets the situation; the accessible SVG and event record carry
              the actual offers, trades, information limits, and prices.
            </figcaption>
          </figure>
        </section>

        <section className="page-section content-grid">
          {sections.map(([title, body]) => (
            <article className="content-card" key={title}>
              <small>Case-study note</small>
              <div>
                <h2>{title}</h2>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="page-section content-header">
          <p className="label-mono">90-second demonstration</p>
          <h2 className="editorial-heading">
            Meet the people → attempt barter → introduce money → inspect one trade.
          </h2>
          <p>
            Open Market Without a Manager. Meet five participants, inspect their ranked
            priorities, attempt the first barter offer, introduce money, and compare the
            completed-trade price with the still-unmet wants. Then show the structured
            market record and the assumption labels. The complete 8–10 minute journey
            continues through incomplete information, shortage, a price ceiling,
            interpretation, revision, Notebook, and Explore mode.
          </p>
        </section>

        <section className="page-section content-grid" aria-label="System architecture">
          <article className="content-card">
            <small>1 · deterministic core</small>
            <h2>Seed + assumptions + actions</h2>
            <p>Pure engines replay the same state and expose every change.</p>
          </article>
          <article className="content-card">
            <small>2 · local learning record</small>
            <h2>Evidence + assumptions + revision</h2>
            <p>Learner prose stays in the browser and never enters share URLs.</p>
          </article>
          <article className="content-card">
            <small>3 · optional semantic layer</small>
            <h2>Allowlisted packets + one question</h2>
            <p>
              Invalid, unavailable, offline, or limited Guide calls fall back safely.
            </p>
          </article>
        </section>

        <section className="page-section content-header">
          <p className="label-mono">Five-person study · Pending</p>
          <h2 className="editorial-heading">v1.0 waits for all four Labs.</h2>
          <p>
            Five real beginners must complete and evaluate every finished Lab without
            William explaining the interface. Hesitation, misclicks, terminology, and
            unclear cause-and-effect will be recorded anonymously. At least one
            evidence-based product revision and a final verification run are required
            before this draft PR can become a release candidate.
          </p>
          <div className="editorial-actions">
            <a href="/images/attribution.json">Inspect image attribution</a>
            <a href="https://github.com/william89971/Praxeos/blob/codex/praxeos-flagship-v1/docs/BUILD_REPORT.md">
              Read the build report
            </a>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
