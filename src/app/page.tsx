import { SiteChrome } from "@/components/layout/SiteChrome";
import { ActionAnalyzer } from "@/components/learning/ActionAnalyzer";
import { ActionJournalPanel } from "@/components/learning/ActionJournalPanel";
import { LearningPathProgress } from "@/components/learning/LearningPathProgress";
import { PraxeologyMotionGraphic } from "@/components/learning/PraxeologyMotionGraphic";
import { WebsiteJsonLd } from "@/components/seo/JsonLd";
import { DAILY_CASES, PRAXEOLOGY_101 } from "@/lib/praxeology";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

const firstLesson = PRAXEOLOGY_101[0];
const todayCase = DAILY_CASES[0];

export default function HomePage() {
  return (
    <SiteChrome>
      <WebsiteJsonLd />
      <HeroSection />
      <DashboardSection />
      <VisualSection />
      <MethodSection />
    </SiteChrome>
  );
}

function HeroSection() {
  if (!firstLesson) return null;

  return (
    <section style={heroStyle}>
      <div style={heroInnerStyle}>
        <div style={heroCopyStyle}>
          <p className="label-mono" style={eyebrowStyle}>
            Praxeology study room
          </p>
          <h1 style={heroHeadingStyle}>Learn praxeology with real-life choices.</h1>
          <p style={heroTextStyle}>
            Praxeology is a big word for a simple habit: look at what someone did, ask
            what they wanted, and notice what they gave up. Praxeos turns that into
            short lessons, practice cases, and a notebook you can keep.
          </p>
          <div style={heroCtaStyle}>
            <Link href="/learn/praxeology-101" style={primaryCtaStyle}>
              Start the intro
            </Link>
            <Link href="/cases" style={secondaryCtaStyle}>
              Try a daily case
            </Link>
          </div>
        </div>

        <div style={heroPracticeStyle}>
          <Image
            src="/images/learning/everyday-choice-desk.png"
            alt="Illustrated study desk with a notebook, phone, groceries, and branching arrows for everyday choices."
            width={1672}
            height={941}
            priority
            sizes="(min-width: 900px) 46vw, 100vw"
            style={heroImageStyle}
          />

          <ActionAnalyzer
            id="homepage-action-microscope"
            title="A tiny practice round"
            scenario={firstLesson.scenario}
            seed={firstLesson.analyzerSeed}
            insight={firstLesson.insight}
            sourceNote="That is the whole starting move: describe the choice before judging it."
          />
        </div>
      </div>
    </section>
  );
}

function DashboardSection() {
  return (
    <section style={dashboardStyle}>
      <div style={wideInnerStyle}>
        <div style={dashboardGridStyle}>
          <LearningPathProgress />
          <div style={sideColumnStyle}>
            {todayCase ? (
              <section style={todayStyle}>
                <p className="label-mono" style={todayEyebrowStyle}>
                  Try this today
                </p>
                <h2 style={todayHeadingStyle}>{todayCase.title}</h2>
                <p style={todayCopyStyle}>{todayCase.scenario}</p>
                <Link href={`/cases#${todayCase.slug}`} style={caseLinkStyle}>
                  Work through it
                </Link>
              </section>
            ) : null}
            <Image
              src="/images/learning/reflection-journal-desk.png"
              alt="Illustrated notebook and note cards organizing observations about time, money, attention, goals, and tradeoffs."
              width={1672}
              height={941}
              sizes="(min-width: 900px) 38vw, 100vw"
              style={journalImageStyle}
            />
            <ActionJournalPanel />
          </div>
        </div>
      </div>
    </section>
  );
}

function VisualSection() {
  return (
    <section style={visualStyle} aria-labelledby="visual-lens-heading">
      <div style={wideInnerStyle}>
        <div style={visualHeaderStyle}>
          <p className="label-mono" style={eyebrowStyle}>
            Choice lens
          </p>
          <h2 id="visual-lens-heading" style={visualHeadingStyle}>
            Every action points at a priority.
          </h2>
          <p style={visualCopyStyle}>
            Praxeology gets practical when you can see both sides of a choice: what the
            person picked, and what had to wait.
          </p>
        </div>

        <div style={visualGridStyle}>
          <Image
            src="/images/learning/opportunity-cost-path.png"
            alt="Illustrated notebook with a vivid chosen path and quieter forgone paths for opportunity cost."
            width={1672}
            height={941}
            sizes="(min-width: 900px) 48vw, 100vw"
            style={visualImageStyle}
          />
          <PraxeologyMotionGraphic variant="tradeoff-balance" />
        </div>
      </div>
    </section>
  );
}

function MethodSection() {
  const steps = [
    {
      title: "Actor",
      copy: "Who is making the choice? Start with the person in the situation.",
    },
    {
      title: "End",
      copy: "What are they trying to get, avoid, fix, or feel?",
    },
    {
      title: "Means",
      copy: "What are they using to get there: time, money, attention, tools, or rules?",
    },
    {
      title: "Cost",
      copy: "What did they give up? Every choice pushes something else aside.",
    },
  ] as const;

  return (
    <section style={methodStyle}>
      <div style={wideInnerStyle}>
        <div style={methodHeaderGridStyle}>
          <div style={methodHeaderStyle}>
            <p className="label-mono" style={eyebrowStyle}>
              The basic move
            </p>
            <h2 style={methodHeadingStyle}>No need to sound academic.</h2>
            <p style={methodCopyStyle}>
              You do not have to start with famous thinkers or old debates. Start with
              one ordinary choice. Name the person, the goal, the tool, and the
              tradeoff. That is enough to begin.
            </p>
          </div>
          <PraxeologyMotionGraphic variant="action-map" />
        </div>

        <div style={methodGridStyle}>
          {steps.map((step) => (
            <article key={step.title} style={methodCardStyle}>
              <h3 style={methodCardHeadingStyle}>{step.title}</h3>
              <p style={methodCardCopyStyle}>{step.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const heroStyle: CSSProperties = {
  paddingInline: "var(--gutter-inline)",
  paddingBlock: "calc(var(--gutter-block) * 1.05)",
  background: "var(--paper)",
};

const heroInnerStyle: CSSProperties = {
  maxWidth: "var(--measure-wide)",
  marginInline: "auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 24rem), 1fr))",
  gap: "clamp(2rem, 5vw, 4rem)",
  alignItems: "start",
};

const heroCopyStyle: CSSProperties = {
  display: "grid",
  gap: "1rem",
  paddingBlockStart: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: "var(--accent-action)",
};

const heroHeadingStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontSize: "clamp(3rem, 8vw, 7rem)",
  fontWeight: 520,
  lineHeight: 0.95,
  textWrap: "balance",
};

const heroTextStyle: CSSProperties = {
  margin: 0,
  maxWidth: "56ch",
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-1)",
  lineHeight: 1.5,
  color: "var(--ink-secondary)",
};

const heroCtaStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.85rem",
  alignItems: "center",
};

const heroPracticeStyle: CSSProperties = {
  display: "grid",
  gap: "1rem",
};

const heroImageStyle: CSSProperties = {
  width: "100%",
  height: "auto",
  aspectRatio: "16 / 9",
  objectFit: "cover",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  boxShadow: "0 1rem 3rem color-mix(in srgb, var(--ink-primary) 10%, transparent)",
};

const primaryCtaStyle: CSSProperties = {
  display: "inline-flex",
  padding: "0.8rem 1rem",
  borderRadius: "var(--radius-sm)",
  background: "var(--ink-primary)",
  color: "var(--paper)",
  textDecoration: "none",
  fontWeight: 650,
};

const secondaryCtaStyle: CSSProperties = {
  display: "inline-flex",
  padding: "0.8rem 1rem",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--rule-strong)",
  color: "var(--ink-primary)",
  textDecoration: "none",
};

const dashboardStyle: CSSProperties = {
  paddingInline: "var(--gutter-inline)",
  paddingBlock: "var(--gutter-block)",
  borderBlockStart: "1px solid var(--rule)",
  background: "var(--paper-sunk)",
};

const wideInnerStyle: CSSProperties = {
  maxWidth: "var(--measure-wide)",
  marginInline: "auto",
};

const dashboardGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 24rem), 1fr))",
  gap: "1.25rem",
  alignItems: "start",
};

const sideColumnStyle: CSSProperties = {
  display: "grid",
  gap: "1rem",
};

const todayStyle: CSSProperties = {
  display: "grid",
  gap: "0.7rem",
  padding: "1rem",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  background: "var(--paper-elevated)",
};

const journalImageStyle: CSSProperties = {
  width: "100%",
  height: "auto",
  aspectRatio: "16 / 9",
  objectFit: "cover",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
};

const todayEyebrowStyle: CSSProperties = {
  margin: 0,
  color: "var(--accent-bitcoin)",
};

const todayHeadingStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-1)",
};

const todayCopyStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  lineHeight: 1.5,
  color: "var(--ink-secondary)",
};

const caseLinkStyle: CSSProperties = {
  justifySelf: "start",
  color: "var(--accent-action)",
  textDecoration: "none",
  fontWeight: 650,
};

const visualStyle: CSSProperties = {
  paddingInline: "var(--gutter-inline)",
  paddingBlock: "var(--gutter-block)",
  borderBlockStart: "1px solid var(--rule)",
  background: "var(--paper)",
};

const visualHeaderStyle: CSSProperties = {
  maxWidth: "70ch",
};

const visualHeadingStyle: CSSProperties = {
  margin: "0.6rem 0 0",
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-4)",
  lineHeight: 1.02,
  textWrap: "balance",
};

const visualCopyStyle: CSSProperties = {
  margin: "1rem 0 0",
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-1)",
  lineHeight: 1.5,
  color: "var(--ink-secondary)",
};

const visualGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 22rem), 1fr))",
  gap: "1rem",
  marginBlockStart: "1.5rem",
  alignItems: "stretch",
};

const visualImageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  minHeight: "clamp(16rem, 34vw, 22rem)",
  aspectRatio: "16 / 9",
  objectFit: "cover",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
};

const methodStyle: CSSProperties = {
  paddingInline: "var(--gutter-inline)",
  paddingBlock: "var(--gutter-block)",
  borderBlockStart: "1px solid var(--rule)",
  background: "var(--paper)",
};

const methodHeaderGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 22rem), 1fr))",
  gap: "1.25rem",
  alignItems: "stretch",
};

const methodHeaderStyle: CSSProperties = {
  maxWidth: "72ch",
};

const methodHeadingStyle: CSSProperties = {
  margin: "0.6rem 0 0",
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-3)",
  lineHeight: 1.05,
};

const methodCopyStyle: CSSProperties = {
  margin: "1rem 0 0",
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-1)",
  lineHeight: 1.5,
  color: "var(--ink-secondary)",
};

const methodGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))",
  gap: "1rem",
  marginBlockStart: "2rem",
};

const methodCardStyle: CSSProperties = {
  paddingBlockStart: "1rem",
  borderBlockStart: "1px solid var(--rule)",
};

const methodCardHeadingStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-1)",
};

const methodCardCopyStyle: CSSProperties = {
  margin: "0.55rem 0 0",
  fontFamily: "var(--font-serif)",
  lineHeight: 1.5,
  color: "var(--ink-secondary)",
};
