import { CinematicHero } from "@/components/home/CinematicHero";
import { GuidedPrompt } from "@/components/home/GuidedPrompt";
import { Lineage } from "@/components/home/Lineage";
import { ScrollSection } from "@/components/home/ScrollSection";
import { Vignette } from "@/components/home/Vignette";
import { ModuleCard } from "@/components/interactive/ModuleCard";
import { WebsiteJsonLd } from "@/components/seo/JsonLd";
import { MODULE_REGISTRY } from "@/modules/registry";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <WebsiteJsonLd />
      <Vignette intensity={0.05} />
      <CinematicHero />
      <WhatIsSection />
      <StartHereSection />
      <ChoosePathSection />
      <Lineage />
      <FooterNote />
    </>
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
            . It is Mises&apos;s 1920 proof that socialist planning cannot compute —
            rendered as a maze you can switch between with-prices and without.
          </p>

          <div style={{ marginTop: "1.2rem" }}>
            <GuidedPrompt>Start here if you are new.</GuidedPrompt>
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

  const pathModules = [
    {
      title: "The Monetary Garden",
      slug: "monetary-garden",
      accent: "bitcoin" as const,
      variant: "monetary-garden" as const,
      difficulty: "Advanced" as const,
      description:
        "Watch an economy bloom or decay as the money signal changes. One slider drives an entire ecosystem from steady to broken.",
      prompt: "Try the garden first.",
    },
    {
      title: "The Signal Orchard",
      slug: "signal-orchard",
      accent: "capital" as const,
      variant: "signal-orchard" as const,
      difficulty: "Intermediate" as const,
      description:
        "See how human choices become social coordination. Click any cypress to broadcast an action and watch the orchard reorganize.",
      prompt: "Start here if you are new.",
    },
    {
      title: "The Calculation Labyrinth",
      slug: "calculation-labyrinth",
      accent: "action" as const,
      variant: "calculation-labyrinth" as const,
      difficulty: "Advanced" as const,
      description:
        "Try to plan without prices — and watch the map disappear. Mises's 1920 argument made literal as a 3D maze.",
      prompt: null,
    },
    {
      title: "The Coordination Engine",
      slug: "coordination-engine",
      accent: "bitcoin" as const,
      variant: "coordination-engine" as const,
      difficulty: "Advanced" as const,
      description:
        "Follow the signal layer that lets millions act together. A network of agents whose synchrony breaks as money quality falls.",
      prompt: "Follow the signal.",
    },
  ];

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
          {pathModules.map((path) => {
            const mod = modules.find((m) => m.entry.slug === path.slug);
            const meta = mod ? `${mod.meta.readingTimeMin}-min read` : undefined;
            return (
              <div key={path.slug} style={{ display: "grid", gap: "0.6rem" }}>
                <ModuleCard
                  href={`/modules/${path.slug}`}
                  title={path.title}
                  description={path.description}
                  accent={path.accent}
                  variant={path.variant}
                  difficulty={path.difficulty}
                  {...(meta ? { meta } : {})}
                />
                {path.prompt ? (
                  <GuidedPrompt style={{ paddingInlineStart: "0.4rem" }}>
                    {path.prompt}
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
