"use client";

import { usePraxeosStore } from "@/hooks/usePraxeosStore";
import Link from "next/link";

export interface LessonLabLink {
  href: string;
  title: string;
  question: string;
}

export function LessonCompletion({
  lessonSlug,
  labLinks,
}: {
  lessonSlug: string;
  labLinks: readonly LessonLabLink[];
}) {
  const { store, update, hydrated } = usePraxeosStore();
  const complete = store.completedLessons.includes(lessonSlug);

  const toggle = () => {
    update((current) => ({
      ...current,
      completedLessons: complete
        ? current.completedLessons.filter((slug) => slug !== lessonSlug)
        : [...new Set([...current.completedLessons, lessonSlug])],
    }));
  };

  return (
    <section className="lesson-completion" aria-labelledby="lesson-lab-heading">
      <div>
        <p className="label-mono">Connect the distinction</p>
        <h2 id="lesson-lab-heading">See it move in a Lab.</h2>
        <div className="lesson-lab-links">
          {labLinks.map((lab) => (
            <Link href={lab.href} key={lab.href}>
              <strong>{lab.title}</strong>
              <span>{lab.question}</span>
            </Link>
          ))}
        </div>
      </div>
      <button
        type="button"
        className={complete ? "button-secondary" : "button-primary"}
        onClick={toggle}
        disabled={!hydrated}
      >
        {complete ? "Marked complete · Undo" : "Mark lesson complete"}
      </button>
      <output aria-live="polite">
        {complete ? "Completion is stored only in this browser." : ""}
      </output>
    </section>
  );
}
