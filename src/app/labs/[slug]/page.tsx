import { MODULE_REGISTRY, findModule } from "@/modules/registry";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export function generateStaticParams() {
  return MODULE_REGISTRY.map(({ slug }) => ({ slug }));
}
export default async function LabPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const entry = findModule((await params).slug);
  if (!entry) notFound();
  const loaded = await entry.load();
  const Lab = loaded.default;
  return (
    <Suspense fallback={<output>Loading the interactive lab…</output>}>
      <Lab />
    </Suspense>
  );
}
