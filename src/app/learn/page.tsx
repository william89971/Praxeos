import { SiteChrome } from "@/components/layout/SiteChrome";
import { PRAXEOLOGY_101, PRAXEOLOGY_TOTAL_MINUTES } from "@/lib/praxeology";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Eleven focused lessons in purposeful action, value, scarcity, and coordination.",
};

export default function LearnPage() {
  return (
    <SiteChrome>
      <main className="page-shell">
        <header className="page-section content-header">
          <p className="label-mono">
            Learn · 11 lessons · {PRAXEOLOGY_TOTAL_MINUTES} minutes
          </p>
          <h1 className="editorial-heading">A language for examining choices.</h1>
          <p>
            Start with ordinary action. Each focused route adds one distinction, one
            practical activity, and a connection to a lab. Progress is saved only in
            your browser.
          </p>
        </header>
        <section className="page-section content-grid">
          {PRAXEOLOGY_101.map((lesson) => (
            <Link
              className="content-card"
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
              <span>Open lesson →</span>
            </Link>
          ))}
        </section>
      </main>
    </SiteChrome>
  );
}
