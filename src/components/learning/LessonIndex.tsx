"use client";

import { usePraxeosStore } from "@/hooks/usePraxeosStore";
import type { PraxeologyLesson } from "@/lib/praxeology";
import Link from "next/link";

export function LessonIndex({
  lessons,
}: {
  lessons: readonly PraxeologyLesson[];
}) {
  const { store, hydrated } = usePraxeosStore();
  const completed = new Set(store.completedLessons);
  const nextLesson =
    lessons.find((lesson) => !completed.has(lesson.slug)) ?? lessons[0];
  const completedCount = lessons.filter((lesson) => completed.has(lesson.slug)).length;

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
        {nextLesson ? (
          <Link className="button-primary" href={`/learn/${nextLesson.slug}`}>
            {completedCount > 0 && completedCount < lessons.length
              ? "Resume lessons"
              : "Begin lesson 1"}
          </Link>
        ) : null}
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
