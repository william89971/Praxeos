import { SiteChrome } from "@/components/layout/SiteChrome";
import { ActionAnalyzer } from "@/components/learning/ActionAnalyzer";
import { ActionJournalPanel } from "@/components/learning/ActionJournalPanel";
import { JudgmentCheck } from "@/components/learning/JudgmentCheck";
import { LearningPathProgress } from "@/components/learning/LearningPathProgress";
import { DisplayTitle } from "@/components/typography/DisplayTitle";
import { PRAXEOLOGY_101 } from "@/lib/praxeology";
import type { Metadata } from "next";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Praxeology 101",
  description:
    "A practical beginner path for learning praxeology as the logic of purposeful human action.",
};

export default function Praxeology101Page() {
  return (
    <SiteChrome>
      <header style={headerStyle}>
        <p className="label-mono" style={eyebrowStyle}>
          Praxeology 101
        </p>
        <DisplayTitle subtitle="A practical course in seeing actors, ends, means, tradeoffs, opportunity costs, and incentives in ordinary life.">
          The logic of action.
        </DisplayTitle>
      </header>

      <section style={progressWrapStyle}>
        <div style={progressGridStyle}>
          <LearningPathProgress />
          <ActionJournalPanel />
        </div>
      </section>

      <section aria-label="Praxeology 101 lessons" style={lessonsStyle}>
        <div style={lessonStackStyle}>
          {PRAXEOLOGY_101.map((lesson) => (
            <article key={lesson.slug} id={lesson.slug} style={lessonStyle}>
              <div style={lessonHeaderStyle}>
                <p className="label-mono" style={lessonMetaStyle}>
                  Lesson {lesson.order} - {lesson.durationMin} min
                </p>
                <h2 style={lessonTitleStyle}>{lesson.title}</h2>
                <p style={principleStyle}>{lesson.principle}</p>
              </div>

              <JudgmentCheck
                id={`judgment-${lesson.slug}`}
                question={lesson.prompt}
                choices={lesson.choices}
              />

              <ActionAnalyzer
                id={`lesson-${lesson.slug}`}
                title={lesson.title}
                scenario={lesson.scenario}
                seed={lesson.analyzerSeed}
                insight={lesson.insight}
                sourceNote={lesson.sourceNote}
                completion={{ type: "lesson", id: lesson.slug }}
              />

              <section style={applyStyle}>
                <p className="label-mono" style={applyLabelStyle}>
                  Use this today
                </p>
                <p style={applyCopyStyle}>{lesson.applyPrompt}</p>
              </section>
            </article>
          ))}
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
  color: "var(--accent-action)",
};

const progressWrapStyle: CSSProperties = {
  paddingInline: "var(--gutter-inline)",
  paddingBlock: "0 var(--gutter-block)",
};

const progressGridStyle: CSSProperties = {
  maxWidth: "var(--measure-wide)",
  marginInline: "auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 24rem), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const lessonsStyle: CSSProperties = {
  paddingInline: "var(--gutter-inline)",
  paddingBlock: "0 var(--gutter-block)",
};

const lessonStackStyle: CSSProperties = {
  maxWidth: "var(--measure-wide)",
  marginInline: "auto",
  display: "grid",
  gap: "2.25rem",
};

const lessonStyle: CSSProperties = {
  display: "grid",
  gap: "1rem",
  scrollMarginBlockStart: "6rem",
  paddingBlockStart: "2rem",
  borderBlockStart: "1px solid var(--rule)",
};

const lessonHeaderStyle: CSSProperties = {
  maxWidth: "var(--measure-prose)",
};

const lessonMetaStyle: CSSProperties = {
  margin: 0,
  marginBlockEnd: "0.7rem",
  color: "var(--ink-tertiary)",
};

const lessonTitleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-3)",
  lineHeight: 1.05,
};

const principleStyle: CSSProperties = {
  margin: "0.85rem 0 0",
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-1)",
  lineHeight: 1.5,
  color: "var(--ink-secondary)",
};

const applyStyle: CSSProperties = {
  maxWidth: "var(--measure-prose)",
  padding: "0.9rem 1rem",
  borderInlineStart: "3px solid var(--accent-action)",
  background: "var(--paper-sunk)",
};

const applyLabelStyle: CSSProperties = {
  margin: 0,
  marginBlockEnd: "0.45rem",
  color: "var(--accent-action)",
};

const applyCopyStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-1)",
  lineHeight: 1.45,
};
