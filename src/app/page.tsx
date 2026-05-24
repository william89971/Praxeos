import { SiteChrome } from "@/components/layout/SiteChrome";
import { ActionAnalyzer } from "@/components/learning/ActionAnalyzer";
import { ActionJournalPanel } from "@/components/learning/ActionJournalPanel";
import { LearningPathProgress } from "@/components/learning/LearningPathProgress";
import { WebsiteJsonLd } from "@/components/seo/JsonLd";
import { DAILY_CASES, PRAXEOLOGY_101 } from "@/lib/praxeology";
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
            Praxeology Gym
          </p>
          <h1 style={heroHeadingStyle}>Learn to see human action clearly.</h1>
          <p style={heroTextStyle}>
            Praxeos is becoming a practical training ground for praxeology: the
            discipline of understanding purposeful action through actors, ends, means,
            tradeoffs, and incentives.
          </p>
          <div style={heroCtaStyle}>
            <Link href="/learn/praxeology-101" style={primaryCtaStyle}>
              Start Praxeology 101
            </Link>
            <Link href="/cases" style={secondaryCtaStyle}>
              Practice daily cases
            </Link>
          </div>
        </div>

        <ActionAnalyzer
          id="homepage-action-microscope"
          title="The action microscope"
          scenario={firstLesson.scenario}
          seed={firstLesson.analyzerSeed}
          insight={firstLesson.insight}
          sourceNote="This is the basic move: describe action before judging it."
        />
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
                  Today's case
                </p>
                <h2 style={todayHeadingStyle}>{todayCase.title}</h2>
                <p style={todayCopyStyle}>{todayCase.scenario}</p>
                <Link href={`/cases#${todayCase.slug}`} style={caseLinkStyle}>
                  Solve the case
                </Link>
              </section>
            ) : null}
            <ActionJournalPanel />
          </div>
        </div>
      </div>
    </section>
  );
}

function MethodSection() {
  const steps = [
    {
      title: "Actor",
      copy: "Who is choosing? Praxeology starts with the acting person, not an abstract aggregate.",
    },
    {
      title: "End",
      copy: "What improvement is being sought? Action means the actor wants reality to be otherwise.",
    },
    {
      title: "Means",
      copy: "What is being used? Money, time, attention, rules, tools, and relationships can all be means.",
    },
    {
      title: "Cost",
      copy: "What is given up? The real cost is the best alternative displaced by the action.",
    },
  ] as const;

  return (
    <section style={methodStyle}>
      <div style={wideInnerStyle}>
        <div style={methodHeaderStyle}>
          <p className="label-mono" style={eyebrowStyle}>
            The method
          </p>
          <h2 style={methodHeadingStyle}>Praxeology is not history first.</h2>
          <p style={methodCopyStyle}>
            History asks what happened. Psychology asks what mental process produced it.
            Statistics asks what patterns appear in data. Praxeology asks what must be
            true when a person acts purposefully.
          </p>
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

const methodStyle: CSSProperties = {
  paddingInline: "var(--gutter-inline)",
  paddingBlock: "var(--gutter-block)",
  borderBlockStart: "1px solid var(--rule)",
  background: "var(--paper)",
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
