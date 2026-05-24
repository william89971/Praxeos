"use client";

import { useLearningStore } from "@/hooks/useLearningStore";
import {
  PRAXEOLOGY_101,
  PRAXEOLOGY_TOTAL_MINUTES,
  type PraxeologyLesson,
} from "@/lib/praxeology";
import Link from "next/link";
import type { CSSProperties } from "react";

export function LearningPathProgress() {
  const { completedLessonCount, completedLessons, resetProgress } = useLearningStore();
  const progressPct = Math.round((completedLessonCount / PRAXEOLOGY_101.length) * 100);
  const nextLesson =
    PRAXEOLOGY_101.find((lesson) => !completedLessons.has(lesson.slug)) ??
    PRAXEOLOGY_101[0];
  if (!nextLesson) return null;

  return (
    <section aria-labelledby="praxeology-path-heading" style={shellStyle}>
      <div style={introStyle}>
        <p className="label-mono" style={eyebrowStyle}>
          Start here
        </p>
        <h2 id="praxeology-path-heading" style={headingStyle}>
          Learn one choice at a time.
        </h2>
        <p style={copyStyle}>
          Eleven short stops take you from the basic idea to everyday use. No need to
          memorize a system first. Just practice seeing what people want, what they
          choose, and what it costs.
        </p>
        <div style={ctaRowStyle}>
          <Link href={`/learn/praxeology-101#${nextLesson.slug}`} style={primaryStyle}>
            {completedLessonCount > 0
              ? `Keep going: ${nextLesson.shortTitle}`
              : "Start the intro"}
          </Link>
          <span className="label-mono" style={metaStyle}>
            {completedLessonCount}/{PRAXEOLOGY_101.length} done - about{" "}
            {PRAXEOLOGY_TOTAL_MINUTES} min total
          </span>
        </div>
      </div>

      <div style={meterShellStyle} aria-label={`${progressPct}% complete`}>
        <div style={{ ...meterFillStyle, inlineSize: `${progressPct}%` }} />
      </div>

      <div style={lessonGridStyle}>
        {PRAXEOLOGY_101.map((lesson) => (
          <ProgressLesson
            key={lesson.slug}
            lesson={lesson}
            complete={completedLessons.has(lesson.slug)}
            current={lesson.slug === nextLesson.slug}
          />
        ))}
      </div>

      {completedLessonCount > 0 ? (
        <button
          type="button"
          data-interactive
          className="label-mono"
          onClick={resetProgress}
          style={resetStyle}
        >
          Reset lesson progress
        </button>
      ) : null}
    </section>
  );
}

function ProgressLesson({
  lesson,
  complete,
  current,
}: {
  readonly lesson: PraxeologyLesson;
  readonly complete: boolean;
  readonly current: boolean;
}) {
  return (
    <Link
      href={`/learn/praxeology-101#${lesson.slug}`}
      style={{
        ...lessonStyle,
        borderColor: complete
          ? "var(--accent-capital)"
          : current
            ? "var(--accent-action)"
            : "var(--rule)",
        background: complete
          ? "color-mix(in oklab, var(--accent-capital) 10%, var(--paper-elevated))"
          : "var(--paper)",
      }}
    >
      <span className="label-mono" style={lessonMetaStyle}>
        {complete ? "Done" : current ? "Up next" : `Stop ${lesson.order}`}
      </span>
      <strong style={lessonTitleStyle}>{lesson.shortTitle}</strong>
      <span style={lessonCopyStyle}>{lesson.principle}</span>
    </Link>
  );
}

const shellStyle: CSSProperties = {
  display: "grid",
  gap: "1.4rem",
  padding: "1.2rem",
  border: "1px solid color-mix(in oklab, var(--accent-bitcoin) 34%, var(--rule))",
  borderRadius: "var(--radius-sm)",
  background: "color-mix(in oklab, var(--accent-bitcoin) 5%, var(--paper-elevated))",
};

const introStyle: CSSProperties = {
  maxWidth: "72ch",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  marginBlockEnd: "0.55rem",
  color: "var(--accent-bitcoin)",
};

const headingStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-3)",
  lineHeight: 1.05,
};

const copyStyle: CSSProperties = {
  margin: "0.75rem 0 0",
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-0)",
  lineHeight: 1.5,
  color: "var(--ink-secondary)",
};

const ctaRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.9rem",
  flexWrap: "wrap",
  marginBlockStart: "1rem",
};

const primaryStyle: CSSProperties = {
  display: "inline-flex",
  padding: "0.72rem 0.95rem",
  borderRadius: "var(--radius-sm)",
  background: "var(--ink-primary)",
  color: "var(--paper)",
  textDecoration: "none",
  fontWeight: 650,
};

const metaStyle: CSSProperties = {
  color: "var(--ink-tertiary)",
};

const meterShellStyle: CSSProperties = {
  blockSize: "0.55rem",
  borderRadius: "999px",
  background: "var(--paper-sunk)",
  overflow: "hidden",
  border: "1px solid var(--rule)",
};

const meterFillStyle: CSSProperties = {
  blockSize: "100%",
  background: "linear-gradient(90deg, var(--accent-action), var(--accent-capital))",
  transition: "inline-size var(--dur-standard) var(--ease-organic)",
};

const lessonGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))",
  gap: "0.75rem",
};

const lessonStyle: CSSProperties = {
  minHeight: "11rem",
  display: "grid",
  gap: "0.45rem",
  alignContent: "start",
  padding: "0.85rem",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  textDecoration: "none",
};

const lessonMetaStyle: CSSProperties = {
  color: "var(--ink-tertiary)",
};

const lessonTitleStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step-0)",
  color: "var(--ink-primary)",
};

const lessonCopyStyle: CSSProperties = {
  color: "var(--ink-secondary)",
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step--1)",
  lineHeight: 1.4,
};

const resetStyle: CSSProperties = {
  justifySelf: "start",
  color: "var(--ink-tertiary)",
  textDecoration: "underline",
};
