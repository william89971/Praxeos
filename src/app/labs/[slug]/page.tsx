import { LAB_REGISTRY, findLab } from "@/labs/registry";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export function generateStaticParams() {
  return LAB_REGISTRY.map(({ slug }) => ({ slug }));
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const entry = findLab((await params).slug);
  if (!entry) notFound();
  const loaded = await entry.load();
  const Lab = loaded.default;
  return (
    <Suspense
      fallback={<output className="lab-loading-state">Restoring the Lab…</output>}
    >
      <Lab />
    </Suspense>
  );
}
