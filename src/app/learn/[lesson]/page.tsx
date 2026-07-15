import { SiteChrome } from "@/components/layout/SiteChrome";
import { LessonCompletion } from "@/components/learning/LessonCompletion";
import { LAB_REGISTRY } from "@/labs/registry";
import { PRAXEOLOGY_101, getPraxeologyLesson } from "@/lib/praxeology";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return PRAXEOLOGY_101.map(({ slug }) => ({ lesson: slug }));
}
export async function generateMetadata({
  params,
}: { params: Promise<{ lesson: string }> }): Promise<Metadata> {
  const lesson = getPraxeologyLesson((await params).lesson);
  return lesson ? { title: lesson.title, description: lesson.principle } : {};
}

export default async function LessonPage({
  params,
}: { params: Promise<{ lesson: string }> }) {
  const lesson = getPraxeologyLesson((await params).lesson);
  if (!lesson) notFound();
  const previous = PRAXEOLOGY_101[lesson.order - 2];
  const next = PRAXEOLOGY_101[lesson.order];
  const connectedLabs = LAB_REGISTRY.filter((lab) =>
    lab.lessonSlugs.includes(lesson.slug),
  ).map((lab) => ({
    href: `/labs/${lab.slug}`,
    title: lab.title,
    question: lab.centralQuestion,
  }));
  return (
    <SiteChrome>
      <main className="page-shell">
        <article className="page-section content-header">
          <p className="label-mono">
            Lesson {lesson.order} of {PRAXEOLOGY_101.length} · {lesson.durationMin}{" "}
            minutes
          </p>
          <h1 className="editorial-heading">{lesson.title}</h1>
          <p>{lesson.principle}</p>
        </article>
        <section
          className="page-section journey-copy"
          style={{ paddingBlock: "var(--gutter-block)" }}
        >
          <div className="guide-card">
            <p className="label-mono">Situation</p>
            <h2>{lesson.scenario}</h2>
            <p>{lesson.prompt}</p>
          </div>
          <div className="content-grid">
            {lesson.choices.map((choice) => (
              <article className="content-card" key={choice.label}>
                <h3>{choice.label}</h3>
                <p>{choice.feedback}</p>
              </article>
            ))}
          </div>
          <section>
            <p className="label-mono">Practice activity</p>
            <h2>{lesson.applyPrompt}</h2>
            <p>{lesson.insight}</p>
          </section>
          <aside className="journey-note">
            Working concepts: {lesson.concepts.join(" · ")}. A Lab connection is an
            invitation to inspect consequences, not an answer key.
          </aside>
          <LessonCompletion lessonSlug={lesson.slug} labLinks={connectedLabs} />
          <nav className="stage-actions" aria-label="Lesson navigation">
            {previous ? (
              <Link href={`/learn/${previous.slug}`}>← {previous.shortTitle}</Link>
            ) : (
              <Link href="/learn">← Overview</Link>
            )}
            {next ? (
              <Link href={`/learn/${next.slug}`}>{next.shortTitle} →</Link>
            ) : (
              <Link href="/labs/market-without-a-manager?mode=guided">
                Final synthesis →
              </Link>
            )}
          </nav>
        </section>
      </main>
    </SiteChrome>
  );
}
