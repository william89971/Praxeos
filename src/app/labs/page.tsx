import { RedesignNoticeFromUrl } from "@/components/labs/RedesignNotice";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { LAB_REGISTRY } from "@/labs/registry";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Labs",
  description:
    "Four deterministic learning environments for exploring choice, exchange, discovery, and money across time.",
};

export default function LabsPage() {
  return (
    <SiteChrome>
      <main className="page-shell">
        <header className="page-section content-header labs-index-header">
          <p className="label-mono">Four Labs · one learning progression</p>
          <h1 className="editorial-heading">
            Begin with a choice. Follow it into a system.
          </h1>
          <p>
            Each Lab begins with one guided decision, reveals the consequence before the
            concept, and then opens into exploration. No score. No hidden semantic
            grade.
          </p>
        </header>
        <RedesignNoticeFromUrl />
        <ol className="page-section lab-progression">
          {LAB_REGISTRY.map((lab) => (
            <li
              key={lab.slug}
              className={`lab-progression__item lab-progression__item--${lab.accent}`}
            >
              <div className="lab-progression__number" aria-hidden="true">
                {String(lab.position).padStart(2, "0")}
              </div>
              <div className="lab-progression__copy">
                <figure className="lab-progression__art lab-progression__art--desktop">
                  <picture>
                    <source
                      media="(max-width: 760px)"
                      srcSet="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
                    />
                    <Image
                      src={lab.visualAsset}
                      width={1200}
                      height={675}
                      sizes="62vw"
                      alt={lab.visualAlt}
                    />
                  </picture>
                </figure>
                <details className="lab-progression__art-toggle">
                  <summary>View editorial cover</summary>
                  <div
                    className="lab-progression__art lab-progression__art--mobile"
                    style={{ backgroundImage: `url("${lab.visualAsset}")` }}
                    role="img"
                    aria-label={lab.visualAlt}
                  />
                </details>
                <p className="label-mono">
                  {lab.flagship ? "Flagship journey" : `Lab ${lab.position}`} ·{" "}
                  {lab.duration}
                </p>
                <h2>{lab.title}</h2>
                <p className="lab-progression__question">{lab.centralQuestion}</p>
                <p>{lab.familiarSituation}</p>
              </div>
              <Link href={`/labs/${lab.slug}`} prefetch={false}>
                {lab.flagship ? "Begin guided journey" : "Enter Lab"}{" "}
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ol>
        <aside className="page-section viewpoint-statement">
          <p className="label-mono">How to read the Labs</p>
          <p>
            Praxeos uses simplified deterministic models to make choices and
            consequences inspectable. A simulation observation is not a universal fact,
            an assumption is not evidence, a source claim needs a locator, an Austrian
            interpretation is one argument, and credible counterarguments belong beside
            it.
          </p>
        </aside>
      </main>
    </SiteChrome>
  );
}
