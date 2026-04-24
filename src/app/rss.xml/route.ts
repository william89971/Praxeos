import { MODULE_REGISTRY } from "@/modules/registry";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://praxeos.org";

export async function GET(): Promise<Response> {
  const modules = await Promise.all(
    MODULE_REGISTRY.map(async (entry) => {
      const mod = await entry.load();
      return { slug: entry.slug, meta: mod.metadata };
    }),
  );

  // Sort newest-first by publishedAt.
  modules.sort(
    (a, b) =>
      new Date(b.meta.publishedAt).getTime() - new Date(a.meta.publishedAt).getTime(),
  );

  const items = modules
    .map((m) => {
      const link = `${SITE_URL}/modules/${m.slug}`;
      const ogImage = `${link}/opengraph-image`;
      const pubDate = new Date(m.meta.publishedAt).toUTCString();
      return `    <item>
      <title>${escapeXml(m.meta.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(m.meta.subtitle)}</description>
      <dc:creator>William Menjivar</dc:creator>
      <enclosure url="${ogImage}" type="image/png"/>
    </item>`;
    })
    .join("\n");

  const lastBuildDate = new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Praxeos</title>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>Explorable explanations for Austrian economics and praxeology.</description>
    <language>en-us</language>
    <copyright>CC BY 4.0 — William Menjivar</copyright>
    <managingEditor>squilliam89971@gmail.com (William Menjivar)</managingEditor>
    <webMaster>squilliam89971@gmail.com (William Menjivar)</webMaster>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <generator>Praxeos (Next.js)</generator>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

function escapeXml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
