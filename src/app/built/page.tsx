import { SiteChrome } from "@/components/layout/SiteChrome";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import productMapOverview from "../../../docs/product/assets/product-map-overview.png";
import flagshipHomepage from "../../../tests/visual/snapshots/desktop-chromium/homepage.png";
import journeyBrief from "../../../tests/visual/snapshots/desktop-chromium/journey-brief.png";

export const metadata: Metadata = {
  title: "How It Was Built",
  description:
    "The decisions, mistakes, architecture, accessibility work, and pending educational validation behind Praxeos.",
};

const sections = [
  [
    "Problem",
    "Economic concepts are often presented as conclusions to memorize. Praxeos is for curious learners who need a concrete situation, a system they can manipulate, and a record of how their reasoning changed.",
  ],
  [
    "William’s decisions",
    "William chose a warm editorial interface, a calculation journey as the flagship offer, local-first persistence, deterministic feedback instead of scores, optional source-grounded Claude guidance, and an honest study gate before v1.0.",
  ],
  [
    "Abandoned approaches",
    "Three early module runtimes, private data proxies, answer-revealing analyzer patterns, static reduced-motion posters, pseudo-telemetry, and unsupported performance claims were removed. Their history remains in Git and informed the new contracts.",
  ],
  [
    "Claude’s contribution",
    "Claude is optional and narrow: one Socratic question grounded in allowlisted source packets. Learner text is untrusted data, never stored in Redis, and never logged intentionally. Missing keys, invalid citations, rate limits, cancellation, and upstream failures fall back deterministically.",
  ],
  [
    "Architecture",
    "Next.js 16 renders the curriculum and case study; pure TypeScript drives rubric rules, lab state, migrations, exports, citation validation, and provider normalization. One versioned browser store holds progress and reasoning. Only POST /api/guide is dynamic.",
  ],
  [
    "Accessibility",
    "The flagship is semantic 2D with large controls, keyboard operation, live change summaries, readable non-visual state, dark theme, print output, and the same complete journey under reduced motion. Four advanced labs keep their controls, tasks, and readable state without canvas.",
  ],
  [
    "Mistakes and tradeoffs",
    "The first product had breadth without a clear first journey and treated visual fallback as educational equivalence. The upgrade prioritizes one complete path. Local-only storage avoids accounts and transcripts but means records do not sync across devices.",
  ],
  [
    "Verified outcomes",
    "Dependency and route verification results are recorded in the pull request and build report. Educational impact is not yet verified. Lighthouse budgets are acceptance targets, not claims, until the recorded runs pass.",
  ],
] as const;

export default function BuiltPage() {
  return (
    <SiteChrome>
      <main className="page-shell">
        <header className="page-section content-header">
          <p className="label-mono">Case study · educational validation pending</p>
          <h1 className="editorial-heading">
            From a promising experiment to one honest learning journey.
          </h1>
          <p>
            This page separates design intent, implemented behavior, measured checks,
            and evidence that still has to be earned.
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
        <section
          className="page-section"
          style={{ paddingBlock: "var(--gutter-block)" }}
        >
          <Image
            src={productMapOverview}
            alt="Praxeos product map showing the current product, target routes, seven-step journey, Guide boundaries, and acceptance gates."
            sizes="(max-width: 768px) 100vw, 1200px"
            loading="eager"
            fetchPriority="high"
            style={{ width: "100%", height: "auto", border: "1px solid var(--rule)" }}
          />
        </section>
        <section
          className="page-section content-grid"
          aria-label="Annotated build screenshots"
        >
          <figure className="content-card">
            <small>Implemented surface · homepage</small>
            <Image
              src={flagshipHomepage}
              alt="Praxeos homepage with a clear eight-minute flagship action, editorial navigation, and three supporting learning paths."
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ width: "100%", height: "auto" }}
            />
            <figcaption>
              One offer sits above the fold: begin the Calculation Labyrinth. Learn,
              daily practice, and Notebook remain visible without competing with it.
            </figcaption>
          </figure>
          <figure className="content-card">
            <small>Implemented surface · journey</small>
            <Image
              src={journeyBrief}
              alt="Calculation Labyrinth brief with seven named stages, a twelve-hundred-dollar budget, twenty volunteer-hours, and a privacy boundary."
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ width: "100%", height: "auto" }}
            />
            <figcaption>
              The first stage makes the scarce means, seven-step path, and local-only
              writing boundary explicit before asking for an interpretation.
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
            Brief → structure → two runs → revision.
          </h2>
          <p>
            Open the Calculation Labyrinth. Identify actor, end, and means; name the
            binding constraint; complete the priced and unpriced plans; compare waste
            and uncertainty; request one grounded question or use fallback; then open
            Notebook to show the initial and revised reasoning together.
          </p>
        </section>
        <section className="page-section content-header">
          <p className="label-mono">Five-person study · Pending</p>
          <h2 className="editorial-heading">v1.0 waits for learners.</h2>
          <p>
            William will recruit five learners. Each participant completes the journey
            with consent, then answers comprehension, confidence, friction, and transfer
            questions. An anonymized results table records completion, observed
            confusion, quotation permission, and the revision it motivated. At least one
            evidence-based revision is required before this draft PR can become a
            release candidate.
          </p>
        </section>
      </main>
    </SiteChrome>
  );
}
