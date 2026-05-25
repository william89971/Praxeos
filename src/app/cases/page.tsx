import { SiteChrome } from "@/components/layout/SiteChrome";
import { ActionAnalyzer } from "@/components/learning/ActionAnalyzer";
import { ActionJournalPanel } from "@/components/learning/ActionJournalPanel";
import { PraxeologyMotionGraphic } from "@/components/learning/PraxeologyMotionGraphic";
import { DisplayTitle } from "@/components/typography/DisplayTitle";
import { DAILY_CASES } from "@/lib/praxeology";
import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Practice Cases",
  description:
    "Short student-friendly practice cases for spotting action, incentives, tradeoffs, and opportunity cost.",
};

export default function CasesPage() {
  return (
    <SiteChrome>
      <header style={headerStyle}>
        <p className="label-mono" style={eyebrowStyle}>
          Practice cases
        </p>
        <DisplayTitle subtitle="Short everyday situations. Read one, write what is going on, then save the part you want to remember.">
          Practice without a lecture.
        </DisplayTitle>
        <Image
          src="/images/learning/everyday-choice-desk.png"
          alt="Illustrated table with a phone, notebook, groceries, and branching arrows for everyday choices."
          width={1672}
          height={941}
          priority
          sizes="(min-width: 900px) 88vw, 100vw"
          style={headerImageStyle}
        />
      </header>

      <section style={lensWrapStyle} aria-labelledby="case-lens-heading">
        <div style={lensGridStyle}>
          <Image
            src="/images/learning/opportunity-cost-path.png"
            alt="Illustrated notebook showing a chosen path and quieter alternatives that were given up."
            width={1672}
            height={941}
            sizes="(min-width: 900px) 44vw, 100vw"
            style={lensImageStyle}
          />
          <div style={lensStackStyle}>
            <div>
              <p className="label-mono" style={lensEyebrowStyle}>
                Case lens
              </p>
              <h2 id="case-lens-heading" style={lensHeadingStyle}>
                Practice spotting the trade.
              </h2>
              <p style={lensTextStyle}>
                A case is not a quiz about being right. It is a quick way to notice what
                someone ranked higher in that moment.
              </p>
            </div>
            <PraxeologyMotionGraphic variant="tradeoff-balance" />
          </div>
        </div>
      </section>

      <section style={bodyStyle}>
        <div style={bodyGridStyle}>
          <div style={caseStackStyle}>
            {DAILY_CASES.map((entry, index) => (
              <article key={entry.slug} id={entry.slug} style={caseStyle}>
                <div style={caseHeaderStyle}>
                  <p className="label-mono" style={caseMetaStyle}>
                    Practice {index + 1} - {entry.domain} - about {entry.durationMin}{" "}
                    min
                  </p>
                  <h2 style={caseTitleStyle}>{entry.title}</h2>
                  <p style={caseQuestionStyle}>{entry.question}</p>
                </div>

                <ActionAnalyzer
                  id={`case-${entry.slug}`}
                  title={entry.title}
                  scenario={entry.scenario}
                  seed={entry.analyzerSeed}
                  insight={entry.insight}
                  sourceNote={entry.applyPrompt}
                  completion={{ type: "case", id: entry.slug }}
                />
              </article>
            ))}
          </div>

          <aside style={asideStyle}>
            <ActionJournalPanel />
          </aside>
        </div>
      </section>
    </SiteChrome>
  );
}

const headerStyle: CSSProperties = {
  maxWidth: "var(--measure-wide)",
  marginInline: "auto",
  paddingInline: "var(--gutter-inline)",
  paddingBlock: "var(--gutter-block)",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  marginBlockEnd: "1rem",
  color: "var(--accent-bitcoin)",
};

const headerImageStyle: CSSProperties = {
  width: "100%",
  height: "auto",
  aspectRatio: "16 / 9",
  objectFit: "cover",
  marginBlockStart: "1.5rem",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
};

const lensWrapStyle: CSSProperties = {
  paddingInline: "var(--gutter-inline)",
  paddingBlock: "0 var(--gutter-block)",
};

const lensGridStyle: CSSProperties = {
  maxWidth: "var(--measure-wide)",
  marginInline: "auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 22rem), 1fr))",
  gap: "1rem",
  alignItems: "stretch",
};

const lensImageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  minHeight: "clamp(16rem, 34vw, 22rem)",
  aspectRatio: "16 / 9",
  objectFit: "cover",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
};

const lensStackStyle: CSSProperties = {
  display: "grid",
  gap: "1rem",
};

const lensEyebrowStyle: CSSProperties = {
  margin: 0,
  color: "var(--accent-bitcoin)",
};

const lensHeadingStyle: CSSProperties = {
  margin: "0.65rem 0 0",
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-3)",
  lineHeight: 1.05,
  textWrap: "balance",
};

const lensTextStyle: CSSProperties = {
  margin: "0.85rem 0 0",
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-1)",
  lineHeight: 1.5,
  color: "var(--ink-secondary)",
};

const bodyStyle: CSSProperties = {
  paddingInline: "var(--gutter-inline)",
  paddingBlock: "0 var(--gutter-block)",
};

const bodyGridStyle: CSSProperties = {
  maxWidth: "var(--measure-wide)",
  marginInline: "auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 24rem), 1fr))",
  gap: "1.25rem",
  alignItems: "start",
};

const caseStackStyle: CSSProperties = {
  display: "grid",
  gap: "2rem",
};

const caseStyle: CSSProperties = {
  display: "grid",
  gap: "1rem",
  scrollMarginBlockStart: "6rem",
  paddingBlockStart: "1.5rem",
  borderBlockStart: "1px solid var(--rule)",
};

const caseHeaderStyle: CSSProperties = {
  maxWidth: "var(--measure-prose)",
};

const caseMetaStyle: CSSProperties = {
  margin: 0,
  marginBlockEnd: "0.65rem",
  color: "var(--ink-tertiary)",
};

const caseTitleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-2)",
  lineHeight: 1.1,
};

const caseQuestionStyle: CSSProperties = {
  margin: "0.65rem 0 0",
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-1)",
  color: "var(--ink-secondary)",
};

const asideStyle: CSSProperties = {
  position: "sticky",
  insetBlockStart: "6rem",
};
