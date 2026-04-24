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
      <ManifestoExcerpt />
      <ModulesTeaser />
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
          opacity: 0.62,
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
            maxWidth: "60ch",
            lineHeight: 1.55,
            color: "var(--ink-primary)",
            marginBlock: 0,
          }}
        >
          A library of interactive, generative, philosophically rigorous investigations
          of human action — the action axiom, time preference, subjective value,
          economic calculation, spontaneous order. Conceived as an open-source cultural
          artifact.
        </p>
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

function ManifestoExcerpt() {
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
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)",
          gap: "clamp(2rem, 6vw, 6rem)",
          maxWidth: "var(--measure-wide)",
          marginInline: "auto",
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
            would not be embarrassed to print on acid-free paper. The site is its own
            argument: that these ideas deserve the treatment they receive here.
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

async function ModulesTeaser() {
  const modules = await Promise.all(
    MODULE_REGISTRY.map(async (entry) => {
      const mod = await entry.load();
      return { entry, meta: mod.metadata };
    }),
  );

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
            § II — Fascicle I
          </p>
          <Link
            href="/modules"
            className="label-mono"
            style={{ textDecoration: "none" }}
          >
            All modules →
          </Link>
        </div>

        <h2 style={{ marginBlockStart: 0, marginBlockEnd: "1.5rem" }}>
          Action, Time, and Calculation.
        </h2>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "grid",
            gap: "2rem",
          }}
        >
          {modules.map(({ entry, meta }) => (
            <li
              key={entry.slug}
              style={{
                borderBlockStart: "1px solid var(--rule)",
                paddingBlockStart: "1.5rem",
              }}
            >
              <Link
                href={`/modules/${entry.slug}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                <h3 style={{ margin: 0, marginBlockEnd: "0.4rem" }}>{meta.title}</h3>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: "var(--step-1)",
                    color: "var(--ink-secondary)",
                    margin: 0,
                  }}
                >
                  {meta.subtitle}
                </p>
              </Link>
            </li>
          ))}
        </ul>
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
            § III — The thinkers
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
