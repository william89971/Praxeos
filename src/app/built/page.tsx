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
    "The learner problem",
    "A beginner can meet praxeology as a list of conclusions. The intended experience is plainer: one ordinary situation, a response the learner controls, a visible consequence, and a private note of what changed. The path starts at the first lesson, then the Choice Machine, and keeps the market lab easy to find.",
  ],
  [
    "William’s decisions on record",
    "The repository records that William conceived and directed Praxeos. He chose the progression from individual choice to exchange, entrepreneurial discovery, and money across time; made Market Without a Manager the featured demonstration; kept the warm editorial identity; and separated checklist checks from optional guidance. A private motive story is not in the project record, so this page does not invent one.",
  ],
  [
    "Abandoned approaches",
    "The earlier product scattered attention across Monetary Garden, Signal Orchard, Calculation Labyrinth, and Coordination Engine. It also carried static motion fallbacks, answer-shaped analyzer feedback, and unreachable preview code. Those approaches were retired after their useful sources and design lessons were preserved.",
  ],
  [
    "Claude and Codex contribution",
    "Codex assisted with implementation, fixtures, documentation, and verification under William’s product direction. Claude is an optional in-product guide: it can ask about reasoning using a fixed list of cited sources, and it cannot score a conclusion.",
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
      <div className="page-shell">
        <header className="page-section content-header">
          <p className="label-mono">Case study · educational validation pending</p>
          <h1 className="editorial-heading">
            Beginners need to see the structure of a choice.
          </h1>
          <p>
            This page keeps William’s recorded decisions, AI-assisted implementation,
            simulation output, automated checks, and the learner study that has not been
            run. It does not report learning gains.
          </p>
          <div className="editorial-actions">
            <Link href="/learn/what-is-praxeology">Start with the first lesson</Link>
            <Link href="/labs/market-without-a-manager?mode=guided">
              Open the 8–10 minute market demonstration
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
              Before this revision the homepage sent people straight into the market.
              The first action is now the first lesson. The market stays beside it as
              the featured demonstration, with five people and five goods.
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
            <small>1 · Replayable models</small>
            <h2>Seed, assumptions, and actions</h2>
            <p>
              The lab engines replay the same state from the same steps. Market offers
              stay guided so one demonstration can be compared with another.
            </p>
          </article>
          <article className="content-card">
            <small>2 · Local learning record</small>
            <h2>Evidence, assumptions, and revision</h2>
            <p>
              Writing stays in the browser. It is not synced, and it is not placed in a
              share link.
            </p>
          </article>
          <article className="content-card">
            <small>3 · Optional guide</small>
            <h2>A fixed list of sources, one question</h2>
            <p>
              If the guide is missing, offline, or limited, the self-review still works.
              The guide does not grade the learner.
            </p>
          </article>
        </section>

        <section className="page-section content-header">
          <p className="label-mono">Five-person study · Pending</p>
          <h2 className="editorial-heading">v1.0 waits for all four Labs.</h2>
          <p>
            Five real beginners still have to complete and evaluate every lab without
            William explaining the interface. That study has not been run. Hesitation,
            misclicks, terminology, and unclear cause and effect would be recorded
            anonymously. Automated checks can show that the models replay, that old
            records still load, and that share links omit writing. They cannot show that
            a beginner understood praxeology.
          </p>
          <div className="editorial-actions">
            <a href="/images/attribution.json">Inspect image attribution</a>
            <a href="https://github.com/william89971/Praxeos/blob/codex/praxeos-flagship-v1/docs/BUILD_REPORT.md">
              Read the build report
            </a>
          </div>
        </section>
      </div>
    </SiteChrome>
  );
}
