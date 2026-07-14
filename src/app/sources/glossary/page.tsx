import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { GLOSSARY } from "@/content/glossary";

export const metadata: Metadata = { title: "Glossary", description: "Plain-language definitions with thinker and lab connections." };
export default function GlossaryPage() { return <SiteChrome><main className="page-shell"><header className="page-section content-header"><p className="label-mono">Sources · glossary</p><h1 className="editorial-heading">Precise words, open definitions.</h1><p>Definitions are starting points for reading and practice, not substitutes for the primary sources.</p></header><section className="page-section content-grid">{GLOSSARY.map((entry) => <article className="content-card" id={entry.slug} key={entry.slug}><small>{entry.thinkers.join(" · ")}</small><div><h2>{entry.headword}</h2><p>{entry.definition}</p></div><Link href="/sources">Trace sources →</Link></article>)}</section></main></SiteChrome>; }
