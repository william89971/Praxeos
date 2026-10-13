"use client";

import { usePraxeosStore } from "@/hooks/usePraxeosStore";
import type { LabSlug } from "@/labs/types";
import { labState, lessonState, recommendNext } from "@/lib/journey";
import type { ActivityRef } from "@/lib/journey";
import { activeLabSession } from "@/lib/learning-store";
import type { PraxeologyLesson } from "@/lib/praxeology";
import Link from "next/link";

export function LessonIndex({
  lessons,
}: {
  lessons: readonly PraxeologyLesson[];
}) {
  const { store, hydrated } = usePraxeosStore();
  const completed = new Set(store.completedLessons);
  const completedCount = lessons.filter((lesson) => completed.has(lesson.slug)).length;
  const next = recommendNext((activity: ActivityRef) => {
    if (activity.kind === "lesson") {
      return lessonState(
        completed.has(activity.slug),
        Boolean(store.lessonRecords[activity.slug]),
      );
    }
    if (activity.kind === "lab") {
      return labState(activeLabSession(store, activity.slug as LabSlug));
    }
    return "not-started";
  });

  return (
    <>
      <section className="page-section learning-progress" aria-label="Lesson progress">
        <div>
          <p className="label-mono">Your local progress</p>
          <strong>
            {hydrated
              ? `${completedCount} of ${lessons.length}`
              : "Opening local record"}
          </strong>
          <span>
            {completedCount === lessons.length
              ? "All lessons recorded"
              : "lessons completed"}
          </span>
        </div>
        <Link className="button-primary" href={next.href}>
          {hydrated ? next.label : "Begin lesson 1"}
        </Link>
      </section>
      <section className="page-section content-grid">
        {lessons.map((lesson) => {
          const isComplete = completed.has(lesson.slug);
          return (
            <Link
              className="content-card lesson-card"
              key={lesson.slug}
              href={`/learn/${lesson.slug}`}
            >
              <small>
                Lesson {lesson.order} · {lesson.durationMin} min
              </small>
              <div>
                <h2>{lesson.title}</h2>
                <p>{lesson.principle}</p>
              </div>
              <span>
                {isComplete ? "Recorded locally · Revisit →" : "Open lesson →"}
              </span>
            </Link>
          );
        })}
      </section>
    </>
  );
}
