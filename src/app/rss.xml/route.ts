import { LAB_REGISTRY } from "@/labs/registry";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://praxeos.vercel.app";

export async function GET(): Promise<Response> {
  const items = LAB_REGISTRY.map((lab) => {
    const link = `${SITE_URL}/labs/${lab.slug}`;
    return `    <item>
      <title>${escapeXml(lab.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(lab.centralQuestion)}</description>
      <dc:creator>William Menjivar</dc:creator>
    </item>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Praxeos</title>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>Interactive lessons, cases, Labs, sources, and reflection for examining human choices.</description>
    <language>en-us</language>
    <copyright>CC BY 4.0 — William Menjivar</copyright>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
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

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
