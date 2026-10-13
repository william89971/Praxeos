import { SiteChrome } from "@/components/layout/SiteChrome";
import { PracticeCases } from "@/components/learning/PracticeCases";
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
      <div className="page-shell">
        <header className="page-section content-header">
          <p className="label-mono">Practice · case library</p>
          <h1 className="editorial-heading">One ordinary choice at a time.</h1>
          <p>
            Answer in your own words if you want. You can also open a worked example or
            continue without answering. Neither one grades you or marks the case
            finished.
          </p>
        </header>
        <PracticeCases cases={DAILY_CASES} />
      </div>
    </SiteChrome>
  );
}
