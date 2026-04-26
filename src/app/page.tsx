import { ModuleCard } from "@/components/interactive/ModuleCard";
import { WebsiteJsonLd } from "@/components/seo/JsonLd";
import { MODULE_REGISTRY } from "@/modules/registry";
import { Teleology } from "@/sketches/teleology/Teleology";
import { THINKER_SLUGS } from "@/types/module";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <WebsiteJsonLd />
      <HeroSection />
      <WhatIsSection />
      <StartHereSection />
      <ChoosePathSection />
      <ThinkersPreview />
      <FooterNote />
    </>
  );
}

/* ------------------------------------------------------------------------- */

function HeroSection() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingInline: "var(--gutter-inline)",
        paddingBlock: "var(--gutter-block)",
        overflow: "hidden",
      }}
    >
      {/* Ambient sketch — behind everything */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.55,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <Teleology fill agentCount={92} attractorCount={7} />
      </div>

      {/* Top meta-line */}
      <header
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <span className="label-mono">Praxeos · Fascicle I</span>
        <span className="label-mono" style={{ fontStyle: "italic" }}>
          Homo agit.
        </span>
      </header>

      {/* Title block */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "100%" }}>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--step-8)",
            fontVariationSettings: '"opsz" 144',
            fontWeight: 420,
            lineHeight: 0.92,
            letterSpacing: "-0.035em",
            marginBlock: 0,
            marginBlockEnd: "0.32em",
            color: "var(--ink-primary)",
            textWrap: "balance",
          }}
        >
          PRAXEOS
        </h1>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "var(--step-3)",
            fontVariationSettings: '"opsz" 72',
            color: "var(--ink-secondary)",
            maxWidth: "52ch",
            marginBlockEnd: "1.5em",
            lineHeight: 1.25,
          }}
        >
          Explorable explanations for Austrian economics.
        </p>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--step-1)",
            maxWidth: "56ch",
            lineHeight: 1.55,
            color: "var(--ink-primary)",
            marginBlock: 0,
            marginBlockEnd: "2rem",
          }}
        >
          Interactive investigations of human action, sound money, and economic
          calculation — built as an open-source cultural artifact.
        </p>
        <Link
          href="#paths"
          className="hover-cta"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.7rem 1.4rem",
            borderRadius: "var(--radius-md)",
            background: "var(--ink-primary)",
            color: "var(--paper)",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--step-0)",
            fontWeight: 500,
            letterSpacing: "-0.01em",
            textDecoration: "none",
          }}
        >
          Start exploring
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* Scroll cue */}
      <footer
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "end",
          justifyContent: "space-between",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        <p
          className="label-mono"
          style={{ maxWidth: "48ch", color: "var(--ink-tertiary)" }}
        >
          Scroll for the library. Read below.
        </p>
        <ScrollMark />
      </footer>
    </section>
  );
}

/** Hand-drawn descending mark. */
function ScrollMark() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="56"
      viewBox="0 0 20 56"
      fill="none"
      style={{
        color: "var(--ink-tertiary)",
        alignSelf: "end",
        animation: "scrollMarkPulse 2800ms var(--ease-organic) infinite",
      }}
    >
      <path
        d="M10 2 L10 42"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M4 38 L10 50 L16 38"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <style>{`
        @keyframes scrollMarkPulse {
          0%, 100% { transform: translateY(0); opacity: 0.8; }
          50% { transform: translateY(4px); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          svg[aria-hidden="true"] { animation: none !important; }
        }
      `}</style>
    </svg>
  );
}

/* ------------------------------------------------------------------------- */

function WhatIsSection() {
  return (
    <section
      style={{
        borderBlockStart: "1px solid var(--rule)",
        paddingInline: "var(--gutter-inline)",
        paddingBlock: "calc(var(--gutter-block) * 1.5)",
        background: "var(--paper)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--measure-wide)",
          marginInline: "auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)",
          gap: "clamp(2rem, 6vw, 6rem)",
        }}
      >
        <div>
          <p className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
            § I — What this is
          </p>
        </div>
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--step-2)",
            lineHeight: 1.45,
            maxWidth: "var(--measure-prose)",
          }}
        >
          <p style={{ marginBlockStart: 0 }}>
            Austrian economics contains some of the most beautiful ideas in the social
            sciences — ideas that ordinarily arrive in the form of dry prose,
            ideological posturing, and ugly PDFs.
          </p>
          <p>
            Praxeos is a small protest against that. Each module pairs a generative or
            interactive piece with a primary-source-backed essay, at a craft level we
            would not be embarrassed to print on acid-free paper.
          </p>
          <p
            style={{
              marginBlockEnd: 0,
              fontSize: "var(--step-1)",
              color: "var(--ink-secondary)",
            }}
          >
            <Link href="/manifesto">Read the manifesto →</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------- */

function StartHereSection() {
  return (
    <section
      style={{
        borderBlockStart: "1px solid var(--rule)",
        paddingInline: "var(--gutter-inline)",
        paddingBlock: "calc(var(--gutter-block) * 1.2)",
        background: "var(--paper-elevated)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--measure-wide)",
          marginInline: "auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)",
          gap: "clamp(2rem, 6vw, 6rem)",
        }}
      >
        <div>
          <p className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
            § II — Start here
          </p>
        </div>
        <div style={{ maxWidth: "var(--measure-prose)" }}>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "var(--step-2)",
              lineHeight: 1.45,
              marginBlockStart: 0,
            }}
          >
            If you are new to Austrian economics, begin with{" "}
            <Link href="/modules/signal-orchard">The Signal Orchard</Link>. It is the
            most accessible module — no prior knowledge assumed — and its argument (that
            coordination is the residue of human action) is intuitive before it is
            technical.
          </p>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "var(--step-1)",
              lineHeight: 1.5,
              color: "var(--ink-secondary)",
              marginBlockEnd: 0,
            }}
          >
            If you already know the action axiom and want to see the strongest argument
            first, go to{" "}
            <Link href="/modules/calculation-labyrinth">The Calculation Labyrinth</Link>
            . It is Mises's 1920 proof that socialist planning cannot compute — rendered
            as a maze you can switch between with-prices and without.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------- */

async function ChoosePathSection() {
  const modules = await Promise.all(
    MODULE_REGISTRY.map(async (entry) => {
      const mod = await entry.load();
      return { entry, meta: mod.metadata };
    }),
  );

  const pathModules = [
    {
      title: "The Monetary Garden",
      slug: "monetary-garden",
      accent: "bitcoin" as const,
      variant: "monetary-garden" as const,
      difficulty: "Advanced" as const,
      description:
        "Watch an economy bloom or decay as the money signal changes. One slider drives an entire ecosystem from steady to broken.",
    },
    {
      title: "The Signal Orchard",
      slug: "signal-orchard",
      accent: "capital" as const,
      variant: "signal-orchard" as const,
      difficulty: "Intermediate" as const,
      description:
        "See how human choices become social coordination. Click any cypress to broadcast an action and watch the orchard reorganize.",
    },
    {
      title: "The Calculation Labyrinth",
      slug: "calculation-labyrinth",
      accent: "action" as const,
      variant: "calculation-labyrinth" as const,
      difficulty: "Advanced" as const,
      description:
        "Try to plan without prices — and watch the map disappear. Mises's 1920 argument made literal as a 3D maze.",
    },
    {
      title: "The Coordination Engine",
      slug: "coordination-engine",
      accent: "bitcoin" as const,
      variant: "coordination-engine" as const,
      difficulty: "Advanced" as const,
      description:
        "Follow the signal layer that lets millions act together. A network of agents whose synchrony breaks as money quality falls.",
    },
  ];

  return (
    <section
      id="paths"
      style={{
        borderBlockStart: "1px solid var(--rule)",
        paddingInline: "var(--gutter-inline)",
        paddingBlock: "calc(var(--gutter-block) * 1.2)",
        background: "var(--paper)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--measure-wide)",
          marginInline: "auto",
        }}
      >
        <p
          className="label-mono"
          style={{ color: "var(--ink-tertiary)", marginBottom: "1rem" }}
        >
          § III — Choose your path
        </p>
        <h2 style={{ marginBlockStart: 0, marginBlockEnd: "1rem" }}>Four doors.</h2>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--step-1)",
            lineHeight: 1.5,
            color: "var(--ink-secondary)",
            maxWidth: "52ch",
            marginBlockEnd: "2.5rem",
          }}
        >
          Each path leads to a single idea, rendered as an interactive piece you can
          touch, explore, and share. No prior knowledge assumed.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
            gap: "1.5rem",
          }}
        >
          {pathModules.map((path) => {
            const mod = modules.find((m) => m.entry.slug === path.slug);
            const meta = mod ? `${mod.meta.readingTimeMin}-min read` : undefined;
            return (
              <ModuleCard
                key={path.slug}
                href={`/modules/${path.slug}`}
                title={path.title}
                description={path.description}
                accent={path.accent}
                variant={path.variant}
                difficulty={path.difficulty}
                {...(meta ? { meta } : {})}
              />
            );
          })}
        </div>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <Link
            href="/modules"
            className="label-mono hover-border"
            style={{
              textDecoration: "none",
              color: "var(--ink-tertiary)",
              display: "inline-block",
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid transparent",
            }}
          >
            View all modules →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------- */

function ThinkersPreview() {
  return (
    <section
      style={{
        borderBlockStart: "1px solid var(--rule)",
        paddingInline: "var(--gutter-inline)",
        paddingBlock: "calc(var(--gutter-block) * 1.2)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--measure-wide)",
          marginInline: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBlockEnd: "2rem",
          }}
        >
          <p className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
            § IV — The thinkers
          </p>
          <Link
            href="/thinkers"
            className="label-mono"
            style={{ textDecoration: "none" }}
          >
            Index →
          </Link>
        </div>

        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--step-2)",
            lineHeight: 1.4,
            maxWidth: "var(--measure-prose)",
            marginBlockStart: 0,
            marginBlockEnd: "2.5rem",
          }}
        >
          The ideas rendered here belong to them.
        </p>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(16ch, 1fr))",
            gap: "1rem 2rem",
            fontFamily: "var(--font-serif)",
            fontSize: "var(--step-1)",
          }}
        >
          {THINKER_SLUGS.map((slug) => (
            <li key={slug}>
              <Link
                href={`/thinkers/${slug}`}
                className="hover-ink"
                style={{
                  textDecoration: "none",
                  color: "var(--ink-primary)",
                  display: "block",
                  paddingBlock: "0.5rem",
                  borderBlockStart: "1px solid var(--rule)",
                }}
              >
                {formatThinker(slug)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------- */

function FooterNote() {
  return (
    <section
      style={{
        borderBlockStart: "1px solid var(--rule)",
        paddingInline: "var(--gutter-inline)",
        paddingBlock: "var(--gutter-block)",
        background: "var(--paper-elevated)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--measure-wide)",
          marginInline: "auto",
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <p
          className="label-mono"
          style={{ color: "var(--ink-tertiary)", maxWidth: "60ch" }}
        >
          Written and built by William Menjivar. Code MIT. Content CC BY 4.0.
        </p>
        <nav
          aria-label="Footer"
          style={{
            display: "flex",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <Link href="/manifesto" className="label-mono">
            Manifesto
          </Link>
          <Link href="/built" className="label-mono">
            Built
          </Link>
          <Link href="/colophon" className="label-mono">
            Colophon
          </Link>
          <Link href="/rss.xml" className="label-mono">
            RSS
          </Link>
          <a
            href="https://github.com/william89971/praxeos"
            className="label-mono"
            rel="noopener"
          >
            GitHub
          </a>
        </nav>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------- */

function formatThinker(slug: string): string {
  const map: Record<string, string> = {
    menger: "Carl Menger",
    "bohm-bawerk": "Eugen von Böhm-Bawerk",
    mises: "Ludwig von Mises",
    hayek: "F. A. Hayek",
    rothbard: "Murray Rothbard",
    kirzner: "Israel Kirzner",
    lachmann: "Ludwig Lachmann",
    hoppe: "Hans-Hermann Hoppe",
    salerno: "Joseph Salerno",
    ammous: "Saifedean Ammous",
  };
  return map[slug] ?? slug;
}
