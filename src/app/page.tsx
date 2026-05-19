import { BeginnerPathRail } from "@/components/experience/BeginnerPathRail";
import { CinematicHero } from "@/components/home/CinematicHero";
import { GuidedPrompt } from "@/components/home/GuidedPrompt";
import { Lineage } from "@/components/home/Lineage";
import { ScrollSection } from "@/components/home/ScrollSection";
import { Vignette } from "@/components/home/Vignette";
import { ModuleCard } from "@/components/interactive/ModuleCard";
import type { ModulePreviewVariant } from "@/components/interactive/ModulePreview";
import { ThinkerFooterSection } from "@/components/layout/ThinkerFooterSection";
import { WebsiteJsonLd } from "@/components/seo/JsonLd";
import { pathStepFor } from "@/lib/beginner-path";
import { complexityToLabel, conceptToAccent } from "@/lib/formatters";
import { MODULE_REGISTRY } from "@/modules/registry";
import Link from "next/link";

const FEATURED_SLUGS = [
  "monetary-garden",
  "signal-orchard",
  "calculation-labyrinth",
  "coordination-engine",
] as const;

const MARKETING_COPY: Record<string, { description: string; prompt: string | null }> = {
  "monetary-garden": {
    description:
      "Watch credit expansion, savings backing, and correction reshape an economy from bloom to revealed malinvestment.",
    prompt: "Try the garden first.",
  },
  "signal-orchard": {
    description:
      "See how human choices become social coordination. Click any cypress to broadcast an action and watch the orchard reorganize.",
    prompt: "Start here if you are new.",
  },
  "calculation-labyrinth": {
    description:
      "Try to plan without prices — and watch the map disappear. Mises's 1920 argument made literal as a 3D maze.",
    prompt: null,
  },
  "coordination-engine": {
    description:
      "Follow the signal layer that lets millions act together. Reliability, latency, shocks, and node pulses show synchrony becoming coordination or missed plans.",
    prompt: "Follow the signal.",
  },
};

export default function HomePage() {
  return (
    <>
      <WebsiteJsonLd />
      <Vignette intensity={0.05} />
      <CinematicHero />
      <WhatIsSection />
      <BeginnerPathRail />
      <SourceCredibilityStrip />
      <StartHereSection />
      <ChoosePathSection />
      <Lineage />
      <ThinkerFooterSection />
      <FooterNote />
    </>
  );
}

function SourceCredibilityStrip() {
  return (
    <section
      aria-label="Source credibility"
      style={{
        borderBlockStart: "1px solid var(--rule)",
        paddingInline: "var(--gutter-inline)",
        paddingBlock: "1.1rem",
        background: "var(--paper-elevated)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--measure-wide)",
          marginInline: "auto",
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <p className="label-mono" style={{ margin: 0, color: "var(--ink-tertiary)" }}>
          Built from Mises, Hayek, Rothbard, Kirzner, and Lachmann.
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/thinkers" className="label-mono">
            Meet the thinkers
          </Link>
          <Link href="/glossary" className="label-mono">
            Beginner glossary
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------- */
/*  § I — What this is                                                       */
/* ------------------------------------------------------------------------- */

function WhatIsSection() {
  return (
    <ScrollSection
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
    </ScrollSection>
  );
}

/* ------------------------------------------------------------------------- */
/*  § II — Start here                                                        */
/* ------------------------------------------------------------------------- */

function StartHereSection() {
  return (
    <ScrollSection
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
            If you are new to Austrian economics, follow the{" "}
            <Link href="#beginner-path">Beginner Path</Link>. It starts with{" "}
            <Link href="/modules/signal-orchard?path=beginner">The Signal Orchard</Link>
            , where the basic lesson is immediate: private actions can become public
            coordination without a central mind.
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
            If you already know the action axiom and want to jump to the strongest
            argument first, go to{" "}
            <Link href="/modules/calculation-labyrinth">The Calculation Labyrinth</Link>
            . It is Mises&apos;s 1920 proof that socialist planning cannot compute —
            rendered as a maze you can switch between with-prices and without.
          </p>

          <div style={{ marginTop: "1.2rem" }}>
            <GuidedPrompt>Beginner Path is the recommended route.</GuidedPrompt>
          </div>
        </div>
      </div>
    </ScrollSection>
  );
}

/* ------------------------------------------------------------------------- */
/*  § III — Choose your path                                                 */
/* ------------------------------------------------------------------------- */

async function ChoosePathSection() {
  const modules = await Promise.all(
    MODULE_REGISTRY.map(async (entry) => {
      const mod = await entry.load();
      return { entry, meta: mod.metadata };
    }),
  );

  const featured = FEATURED_SLUGS.map((slug) => {
    const found = modules.find((m) => m.entry.slug === slug);
    if (!found) {
      throw new Error(`Featured module "${slug}" not found in MODULE_REGISTRY`);
    }
    return found;
  });

  return (
    <ScrollSection
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
          {featured.map(({ entry, meta }) => {
            const copy = MARKETING_COPY[entry.slug];
            const pathStep = pathStepFor(entry.slug);
            const metaStr = `${meta.readingTimeMin}-min read`;
            return (
              <div key={entry.slug} style={{ display: "grid", gap: "0.6rem" }}>
                <ModuleCard
                  href={`/modules/${entry.slug}`}
                  title={meta.title}
                  description={copy?.description ?? meta.subtitle}
                  accent={conceptToAccent(meta.concept)}
                  variant={entry.slug as ModulePreviewVariant}
                  difficulty={complexityToLabel(meta.complexity)}
                  meta={metaStr}
                  badge={pathStep?.badge}
                  actionLabel={pathStep?.actionLabel}
                  sourceLabel={pathStep?.sourceThinker}
                />
                {copy?.prompt ? (
                  <GuidedPrompt style={{ paddingInlineStart: "0.4rem" }}>
                    {copy.prompt}
                  </GuidedPrompt>
                ) : null}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
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
    </ScrollSection>
  );
}

/* ------------------------------------------------------------------------- */
/*  Footer                                                                   */
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
        <div>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "var(--step-1)",
              color: "var(--ink-primary)",
              marginBlock: 0,
              marginBlockEnd: "0.5rem",
            }}
          >
            Homo agit.
          </p>
          <p
            className="label-mono"
            style={{ color: "var(--ink-tertiary)", maxWidth: "60ch" }}
          >
            Written and built by William Menjivar. Code MIT. Content CC BY 4.0.
          </p>
        </div>

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
