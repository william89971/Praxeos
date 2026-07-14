import { SiteChrome } from "@/components/layout/SiteChrome";
import type { LabRegistryEntry } from "@/labs/types";
import Link from "next/link";

export function LabFoundation({ lab }: { lab: LabRegistryEntry }) {
  return (
    <SiteChrome>
      <main className="page-shell">
        <header className="page-section lab-cover">
          <div>
            <p className="label-mono">
              Lab {lab.position} of 4 · {lab.duration}
            </p>
            <h1 className="editorial-heading">{lab.title}</h1>
            <p className="lab-cover__question">{lab.centralQuestion}</p>
            <p>{lab.familiarSituation}</p>
          </div>
          <div className={`lab-cover__proof lab-cover__proof--${lab.accent}`}>
            <span aria-hidden="true">{String(lab.position).padStart(2, "0")}</span>
            <p className="label-mono">Deterministic · 2D · local-first</p>
          </div>
        </header>
        <section className="page-section lab-foundation-note">
          <p className="label-mono">Foundation ready</p>
          <h2>The guided simulation is being assembled on the shared Lab runtime.</h2>
          <p>
            This route is active so the registry, persistence, sharing, source
            allowlist, and accessibility shell remain verifiable while the deterministic
            engine is added in the next phase.
          </p>
          <Link className="button-secondary" href="/labs">
            Return to the four-Lab progression
          </Link>
        </section>
      </main>
    </SiteChrome>
  );
}
