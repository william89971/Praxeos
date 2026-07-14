import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { MODULE_REGISTRY } from "@/modules/registry";

export const metadata: Metadata = { title: "Labs", description: "Four deterministic laboratories for exploring economic coordination." };
export default function LabsPage() { return <SiteChrome><main className="page-shell"><header className="page-section content-header"><p className="label-mono">Advanced Labs · four deterministic systems</p><h1 className="editorial-heading">What changes when the signal changes?</h1><p>Every lab begins with a guided interaction, then opens into exploration. Each includes a readable state summary, verified sources, reflection, and a complete reduced-motion path.</p></header><section className="page-section content-grid">{MODULE_REGISTRY.map((lab) => <Link className="content-card" href={`/labs/${lab.slug}`} key={lab.slug}><small>Lab {lab.moduleNumber} · Fascicle {lab.fascicle}</small><div><h2>{lab.title}</h2><p>{lab.subtitle}</p></div><span>Enter lab →</span></Link>)}</section></main></SiteChrome>; }
