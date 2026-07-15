import { SiteChrome } from "@/components/layout/SiteChrome";
import { NotebookView } from "@/components/notebook/NotebookView";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Notebook",
  description:
    "A private local record of initial reasoning, feedback, revision, sources, and reflection.",
};
export default function NotebookPage() {
  return (
    <SiteChrome>
      <main className="page-shell">
        <header className="page-section content-header content-header--illustrated">
          <div>
            <p className="label-mono">Notebook · local-first</p>
            <h1 className="editorial-heading">Keep the change, not a score.</h1>
            <p>
              Praxeos stores this record in your browser. It has no account, permanent
              transcript, or pseudo-telemetry queue.
            </p>
          </div>
          <figure className="transition-figure">
            <Image
              src="/images/labs/money-time-machine.webp"
              alt="Tactile open journal with branching diagrams and cards for people, time, money, attention, goals, and comparison."
              width={1200}
              height={675}
              sizes="(max-width: 760px) 100vw, 38vw"
            />
          </figure>
        </header>
        <section
          className="page-section"
          style={{ paddingBlock: "var(--gutter-block)" }}
        >
          <NotebookView />
        </section>
      </main>
    </SiteChrome>
  );
}
