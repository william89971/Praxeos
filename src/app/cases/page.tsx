import { SiteChrome } from "@/components/layout/SiteChrome";
import { ActionAnalyzer } from "@/components/learning/ActionAnalyzer";
import { ActionJournalPanel } from "@/components/learning/ActionJournalPanel";
import { DisplayTitle } from "@/components/typography/DisplayTitle";
import { DAILY_CASES } from "@/lib/praxeology";
import type { Metadata } from "next";
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
      </header>

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
