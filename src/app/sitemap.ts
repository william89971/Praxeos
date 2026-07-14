import { LAB_REGISTRY } from "@/labs/registry";
import { PRAXEOLOGY_101 } from "@/lib/praxeology";
import { THINKER_SLUGS } from "@/types/module";
import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://praxeos.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = [
    ["", "monthly", 1],
    ["/learn", "monthly", 0.95],
    ["/practice", "daily", 0.9],
    ["/labs/market-without-a-manager", "monthly", 1],
    ["/labs", "monthly", 0.9],
    ["/notebook", "monthly", 0.8],
    ["/sources", "monthly", 0.85],
    ["/sources/glossary", "monthly", 0.8],
    ["/built", "monthly", 0.7],
  ] as const;

  const routes: MetadataRoute.Sitemap = staticRoutes.map(
    ([route, changeFrequency, priority]) => ({
      url: `${SITE_URL}${route}`,
      lastModified: now,
      changeFrequency,
      priority,
    }),
  );

  routes.push(
    ...PRAXEOLOGY_101.map((lesson) => ({
      url: `${SITE_URL}/learn/${lesson.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...LAB_REGISTRY.map((lab) => ({
      url: `${SITE_URL}/labs/${lab.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...THINKER_SLUGS.map((slug) => ({
      url: `${SITE_URL}/sources/thinkers/${slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.65,
    })),
  );

  return routes;
}
