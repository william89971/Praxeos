import { SiteChrome } from "@/components/layout/SiteChrome";
import { ModuleJsonLd } from "@/components/seo/JsonLd";
import { MODULE_REGISTRY, findModule } from "@/modules/registry";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type RouteParams = { slug: string };

export async function generateStaticParams(): Promise<RouteParams[]> {
  return MODULE_REGISTRY.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = findModule(slug);
  if (!entry) return {};
  const mod = await entry.load();
  return {
    title: mod.metadata.title,
    description: mod.metadata.subtitle,
    openGraph: {
      title: mod.metadata.title,
      description: mod.metadata.subtitle,
      type: "article",
      publishedTime: mod.metadata.publishedAt,
      modifiedTime: mod.metadata.updatedAt ?? mod.metadata.publishedAt,
      authors: ["William Menjivar"],
    },
  };
}

export default async function ModuleRoute({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const entry = findModule(slug);
  if (!entry) notFound();

  const {
    default: ModuleComponent,
    metadata: moduleMetadata,
    sources,
  } = await entry.load();
  return (
    <SiteChrome>
      <ModuleJsonLd metadata={moduleMetadata} sources={sources} />
      <ModuleComponent />
    </SiteChrome>
  );
}
