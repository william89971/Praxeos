import { MODULE_REGISTRY } from "@/modules/registry";
import { THINKER_SLUGS } from "@/types/module";
import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://praxeos.org";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const modules = await Promise.all(
    MODULE_REGISTRY.map(async (entry) => {
      const mod = await entry.load();
      const lastModified = new Date(mod.metadata.updatedAt ?? mod.metadata.publishedAt);
      return {
        url: `${SITE_URL}/modules/${entry.slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.9,
      };
    }),
  );

  const thinkers = THINKER_SLUGS.map((slug) => ({
    url: `${SITE_URL}/thinkers/${slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  const now = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/manifesto`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/modules`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/thinkers`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/colophon`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...modules,
    ...thinkers,
  ];
}
