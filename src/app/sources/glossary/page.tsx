import { SiteChrome } from "@/components/layout/SiteChrome";
import { GlossaryIndex } from "@/components/learning/GlossaryIndex";
import { GLOSSARY } from "@/content/glossary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glossary",
  description: "Plain-language definitions with thinker and lab connections.",
};
export default function GlossaryPage() {
  return (
    <SiteChrome>
      <div className="page-shell">
        <header className="page-section content-header">
          <p className="label-mono">Sources · glossary</p>
          <h1 className="editorial-heading">Precise words, open definitions.</h1>
          <p>
            Definitions are starting points for reading and practice, not substitutes
            for the primary sources.
          </p>
        </header>
        <GlossaryIndex entries={GLOSSARY} />
      </div>
    </SiteChrome>
  );
}
