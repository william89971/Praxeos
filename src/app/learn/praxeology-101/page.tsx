import { SiteChrome } from "@/components/layout/SiteChrome";
import { ActionAnalyzer } from "@/components/learning/ActionAnalyzer";
import { ActionJournalPanel } from "@/components/learning/ActionJournalPanel";
import { JudgmentCheck } from "@/components/learning/JudgmentCheck";
import { LearningPathProgress } from "@/components/learning/LearningPathProgress";
import { PraxeologyMotionGraphic } from "@/components/learning/PraxeologyMotionGraphic";
import { DisplayTitle } from "@/components/typography/DisplayTitle";
import { PRAXEOLOGY_101 } from "@/lib/praxeology";
import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Start Here",
  description:
    "A beginner-friendly path for learning praxeology through everyday choices.",
};

export default function Praxeology101Page() {
  return (
    <SiteChrome>
      <header style={headerStyle}>
        <p className="label-mono" style={eyebrowStyle}>
          Start here
        </p>
        <DisplayTitle subtitle="Praxeology can sound intimidating. Here it just means practicing how to read choices: who acted, what they wanted, what they used, and what they gave up.">
          Choices make more sense when you slow them down.
        </DisplayTitle>
        <Image
          src="/images/learning/action-cards-flow.png"
          alt="Illustrated index cards showing a person, a goal, tools, and a balanced tradeoff."
          width={1672}
          height={941}
          priority
          sizes="(min-width: 900px) 88vw, 100vw"
          style={headerImageStyle}
        />
      </header>

      <section style={lensWrapStyle} aria-labelledby="lesson-lens-heading">
        <div style={lensGridStyle}>
          <div style={lensCopyStyle}>
            <p className="label-mono" style={lensEyebrowStyle}>
              The lens
            </p>
            <h2 id="lesson-lens-heading" style={lensHeadingStyle}>
              Read the action before you argue about it.
            </h2>
            <p style={lensTextStyle}>
              Each lesson comes back to the same pattern: someone acts, aims at an end,
              uses means, and accepts a tradeoff.
            </p>
          </div>
          <PraxeologyMotionGraphic variant="action-map" />
        </div>
      </section>

      <section style={progressWrapStyle}>
        <div style={progressGridStyle}>
          <LearningPathProgress />
          <ActionJournalPanel />
        </div>
      </section>

      <section aria-label="Start Here lessons" style={lessonsStyle}>
        <div style={lessonStackStyle}>
          {PRAXEOLOGY_101.map((lesson) => (
            <article key={lesson.slug} id={lesson.slug} style={lessonStyle}>
              <div style={lessonHeaderStyle}>
                <p className="label-mono" style={lessonMetaStyle}>
                  Stop {lesson.order} - about {lesson.durationMin} min
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

const lensCopyStyle: CSSProperties = {
  display: "grid",
  alignContent: "center",
  paddingBlock: "1rem",
};

const lensEyebrowStyle: CSSProperties = {
  margin: 0,
  color: "var(--accent-capital)",
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
