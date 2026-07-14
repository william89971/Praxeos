import type { Metadata } from "next";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { NotebookView } from "@/components/notebook/NotebookView";

export const metadata: Metadata = { title: "Notebook", description: "A private local record of initial reasoning, feedback, revision, sources, and reflection." };
export default function NotebookPage() { return <SiteChrome><main className="page-shell"><header className="page-section content-header"><p className="label-mono">Notebook · local-first</p><h1 className="editorial-heading">Keep the change, not a score.</h1><p>Praxeos stores this record in your browser. It has no account, permanent transcript, or pseudo-telemetry queue.</p></header><section className="page-section" style={{ paddingBlock: "var(--gutter-block)" }}><NotebookView /></section></main></SiteChrome>; }
