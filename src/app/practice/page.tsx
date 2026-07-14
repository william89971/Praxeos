import { SiteChrome } from "@/components/layout/SiteChrome";
import { DAILY_CASES } from "@/lib/praxeology";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice",
  description:
    "Short cases for practicing actor, end, means, constraint, and opportunity-cost reasoning.",
};
export default function PracticePage() {
  return (
    <SiteChrome>
      <main className="page-shell">
        <header className="page-section content-header">
          <p className="label-mono">Practice · case library</p>
          <h1 className="editorial-heading">One ordinary choice at a time.</h1>
          <p>
            There is no answer key hidden behind these cases. Describe an
            interpretation, test it against the details, and make room for another
            defensible reading.
          </p>
        </header>
        <section className="page-section content-grid">
          {DAILY_CASES.map((item) => (
            <article className="content-card" id={item.slug} key={item.slug}>
              <small>
                {item.domain} · {item.durationMin} min
              </small>
              <div>
                <h2>{item.title}</h2>
                <p>{item.scenario}</p>
              </div>
              <details>
                <summary>{item.question}</summary>
                <p>{item.applyPrompt}</p>
              </details>
            </article>
          ))}
        </section>
      </main>
    </SiteChrome>
  );
}
