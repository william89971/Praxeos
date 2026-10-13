"use client";

import type { LessonLabLink } from "@/components/learning/LessonCompletion";
import { usePraxeosStore } from "@/hooks/usePraxeosStore";
import type { LabSlug } from "@/labs/types";
import { labState, lessonState, recommendNext } from "@/lib/journey";
import type { ActivityRef } from "@/lib/journey";
import { LOCAL_RECORD_NOTE } from "@/lib/learning-store";
import { activeLabSession } from "@/lib/learning-store";
import { LESSON_SOURCE_IDS, type PraxeologyLesson } from "@/lib/praxeology";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function LessonStudio({
  lesson,
  labLinks,
}: {
  lesson: PraxeologyLesson;
  labLinks: readonly LessonLabLink[];
}) {
  const { store, update, hydrated } = usePraxeosStore();
  const record = store.lessonRecords[lesson.slug];
  const [draftChoice, setDraftChoice] = useState<string | null>(
    record?.selectedChoice ?? null,
  );
  const [revealed, setRevealed] = useState<"worked-example" | "continued" | null>(
    record?.responseMode === "worked-example" || record?.responseMode === "continued"
      ? record.responseMode
      : null,
  );
  const [reflection, setReflection] = useState(record?.reflection ?? "");
  const [goal, setGoal] = useState("");
  const [means, setMeans] = useState("");
  const [forgone, setForgone] = useState("");
  const [motive, setMotive] = useState("");
  const [notice, setNotice] = useState("");
  const synced = useRef(false);
  useEffect(() => {
    if (!hydrated || synced.current) return;
    synced.current = true;
    if (!record) return;
    setDraftChoice(record.selectedChoice);
    setReflection(record.reflection);
    if (
      record.responseMode === "worked-example" ||
      record.responseMode === "continued"
    ) {
      setRevealed(record.responseMode);
    }
  }, [hydrated, record]);
  const complete = store.completedLessons.includes(lesson.slug);
  const showing =
    record?.responseMode === "answered" ||
    revealed === "worked-example" ||
    revealed === "continued" ||
    record?.responseMode === "worked-example" ||
    record?.responseMode === "continued";
  const selected =
    record?.responseMode === "answered" ? record.selectedChoice : draftChoice;
  const offerComparison = record?.responseMode === "answered" && Boolean(selected);

  const saveRecord = (
    responseMode: "answered" | "worked-example" | "continued" | null,
    selectedChoice: string | null,
    nextReflection = reflection,
  ) => {
    update((current) => ({
      ...current,
      lessonRecords: {
        ...current.lessonRecords,
        [lesson.slug]: {
          lessonSlug: lesson.slug,
          responseMode,
          selectedChoice,
          reflection: nextReflection,
          updatedAt: new Date().toISOString(),
        },
      },
    }));
    setNotice(LOCAL_RECORD_NOTE);
  };

  const choose = (label: string) => {
    setDraftChoice(label);
    setRevealed(null);
    saveRecord("answered", label);
  };

  const reveal = (mode: "worked-example" | "continued") => {
    setRevealed(mode);
    if (record?.responseMode === "answered") return;
    saveRecord(mode, null);
  };

  const saveSketch = () => {
    if (!goal.trim() && !means.trim() && !forgone.trim() && !motive.trim()) return;
    update((current) => ({
      ...current,
      conceptSketches: [
        {
          id: `${lesson.slug}-${Date.now()}`,
          lessonSlug: lesson.slug,
          caseSlug: null,
          goal: goal.trim(),
          means: means.trim(),
          forgone: forgone.trim(),
          motiveNote: motive.trim(),
          updatedAt: new Date().toISOString(),
        },
        ...current.conceptSketches,
      ].slice(0, 24),
    }));
    setNotice(`Sketch saved. ${LOCAL_RECORD_NOTE}`);
  };

  const toggleComplete = () => {
    update((current) => ({
      ...current,
      completedLessons: complete
        ? current.completedLessons.filter((slug) => slug !== lesson.slug)
        : [...new Set([...current.completedLessons, lesson.slug])],
    }));
  };

  const next = recommendNext(
    (activity: ActivityRef) => {
      if (activity.kind === "lesson") {
        return lessonState(
          store.completedLessons.includes(activity.slug),
          Boolean(store.lessonRecords[activity.slug]),
        );
      }
      if (activity.kind === "lab") {
        return labState(activeLabSession(store, activity.slug as LabSlug));
      }
      return "not-started";
    },
    { kind: "lesson", slug: lesson.slug },
  );
  const sourceId = LESSON_SOURCE_IDS[lesson.slug] ?? "mises-human-action-action";

  return (
    <>
      <div className="guide-card role-question">
        <p className="label-mono">Situation</p>
        <h2>{lesson.scenario}</h2>
        <p>{lesson.prompt}</p>
      </div>
      <fieldset className="lesson-choices">
        <legend className="sr-only">Your reading</legend>
        {lesson.choices.map((choice) => (
          <button
            key={choice.label}
            type="button"
            className={
              selected === choice.label ? "button-primary" : "button-secondary"
            }
            onClick={() => choose(choice.label)}
          >
            {choice.label}
          </button>
        ))}
      </fieldset>
      <div className="lesson-pace">
        <button
          type="button"
          className="text-button"
          onClick={() => reveal("worked-example")}
        >
          Show a worked example
        </button>
        <button
          type="button"
          className="text-button"
          onClick={() => reveal("continued")}
        >
          Continue without answering
        </button>
      </div>
      {showing ? (
        <div className="lesson-distinctions">
          {offerComparison ? (
            <p className="role-explanation">
              You answered before these distinctions. Compare them with what you chose.
              This is not a grade.
            </p>
          ) : (
            <p className="role-explanation">
              These distinctions are open so you can keep moving. They are not your
              answer, and they do not complete the lesson.
            </p>
          )}
          {lesson.choices.map((choice) => (
            <article
              key={choice.label}
              className={
                selected === choice.label ? "content-card is-selected" : "content-card"
              }
            >
              <h3>{choice.label}</h3>
              <p>{choice.feedback}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="lesson-waiting">
          Answering is the main action. The other two controls open the distinctions
          without marking the lesson complete.
        </p>
      )}
      <section className="concept-sketch role-action">
        <p className="label-mono">Goal, means, alternative</p>
        <h2>{lesson.applyPrompt}</h2>
        <p>{lesson.insight}</p>
        <label>
          <span>Goal, the end</span>
          <input
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            placeholder={lesson.analyzerSeed.end}
          />
        </label>
        <label>
          <span>Means you can see</span>
          <input
            value={means}
            onChange={(event) => setMeans(event.target.value)}
            placeholder={lesson.analyzerSeed.means}
          />
        </label>
        <label>
          <span>Alternative forgone</span>
          <input
            value={forgone}
            onChange={(event) => setForgone(event.target.value)}
            placeholder={lesson.analyzerSeed.opportunityCost}
          />
        </label>
        <label>
          <span>Inferred motive, separate from what you observed</span>
          <textarea
            value={motive}
            onChange={(event) => setMotive(event.target.value)}
            placeholder="Only if you are inferring a reason. Say that it is an inference."
          />
        </label>
        <button type="button" className="button-secondary" onClick={saveSketch}>
          Save this sketch
        </button>
      </section>
      <label className="lesson-reflection">
        <span>Reflection</span>
        <textarea
          value={reflection}
          onChange={(event) => setReflection(event.target.value)}
          onBlur={() =>
            saveRecord(
              record?.responseMode ?? revealed,
              record?.responseMode === "answered" ? record.selectedChoice : selected,
              reflection,
            )
          }
          placeholder="What would you look at differently next time?"
        />
      </label>
      <p className="role-source">
        {lesson.sourceNote}{" "}
        <Link href={`/sources#${sourceId}`}>Open the source for this claim →</Link>
      </p>
      <aside className="journey-note">
        Working concepts: {lesson.concepts.join(" · ")}. A lab is a place to watch a
        consequence, not an answer key.
      </aside>
      {labLinks.length ? (
        <section className="lesson-completion" aria-labelledby="lesson-lab-heading">
          <div>
            <p className="label-mono">Connected lab</p>
            <h2 id="lesson-lab-heading">See the same distinction move.</h2>
            <div className="lesson-lab-links">
              {labLinks.map((lab) => (
                <Link href={lab.href} key={lab.href}>
                  <strong>{lab.title}</strong>
                  <span>{lab.question}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <div className="lesson-finish">
        <button
          type="button"
          className={complete ? "button-secondary" : "button-primary"}
          onClick={toggleComplete}
          disabled={!hydrated}
        >
          {complete ? "Marked complete · Undo" : "Mark lesson complete"}
        </button>
        <Link className="button-secondary" href={next.href}>
          {next.label} →
        </Link>
      </div>
      <output aria-live="polite">{notice}</output>
      <p className="local-record-note">{LOCAL_RECORD_NOTE}</p>
      <p className="sr-only">
        {record?.responseMode === "answered" ? "Answer recorded" : "No graded answer"}
      </p>
    </>
  );
}
