import { SiteChrome } from "@/components/layout/SiteChrome";
import { LessonIndex } from "@/components/learning/LessonIndex";
import { PRAXEOLOGY_101, PRAXEOLOGY_TOTAL_MINUTES } from "@/lib/praxeology";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Eleven focused lessons in purposeful action, value, scarcity, and coordination.",
};

export default function LearnPage() {
  return (
    <SiteChrome>
      <main className="page-shell">
        <header className="page-section content-header content-header--illustrated">
          <div>
            <p className="label-mono">
              Learn · 11 lessons · {PRAXEOLOGY_TOTAL_MINUTES} minutes
            </p>
            <h1 className="editorial-heading">A language for examining choices.</h1>
            <p>
              Start with ordinary action. Each focused route adds one distinction, one
              practical activity, and a named Lab connection. Progress is saved only in
              your browser.
            </p>
          </div>
          <figure className="transition-figure">
            <Image
              src="/images/editorial/home-hero.webp"
              alt="Tactile illustrated desk with a notebook branching into everyday choices among time, study, health, relationships, and groceries."
              width={1600}
              height={900}
              sizes="(max-width: 760px) 100vw, 38vw"
            />
          </figure>
        </header>
        <LessonIndex lessons={PRAXEOLOGY_101} />
      </main>
    </SiteChrome>
  );
}
