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
      <div className="page-shell">
        <header className="page-section content-header content-header--illustrated">
          <div>
            <p className="label-mono">
              Learn · 11 lessons · {PRAXEOLOGY_TOTAL_MINUTES} minutes
            </p>
            <h1 className="editorial-heading">A language for examining choices.</h1>
            <p>
              Praxeology studies purposeful action: who is acting, what end they seek,
              what means they use, and what they give up. Start with lesson 1. Each
              lesson adds one distinction. Progress is saved in this browser only. It is
              not copied to your other devices, and clearing site data deletes it.
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
      </div>
    </SiteChrome>
  );
}
