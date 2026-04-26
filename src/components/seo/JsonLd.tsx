import type { ModuleMetadata, Source } from "@/types/module";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://praxeos.org";

/**
 * Escape HTML-sensitive characters inside JSON-LD strings so that a
 * `</script>` or HTML entity in metadata cannot break out of the
 * script tag.
 */
function escapeJsonLdString(str: string): string {
  return str.replace(/&/g, "\\u0026").replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
}

/** Recursively escape all string values in a JSON-LD object. */
function escapeJsonLdValue<T>(value: T): T {
  if (typeof value === "string") {
    return escapeJsonLdString(value) as T;
  }
  if (Array.isArray(value)) {
    return value.map(escapeJsonLdValue) as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = escapeJsonLdValue(v);
    }
    return out as T;
  }
  return value;
}

/**
 * Article-schema JSON-LD for a module page. Rendered server-side as a
 * <script type="application/ld+json"> so crawlers can parse without JS.
 */
export function ModuleJsonLd({
  metadata,
  sources,
}: {
  metadata: ModuleMetadata;
  sources: readonly Source[];
}) {
  const url = `${SITE_URL}/modules/${metadata.slug}`;
  const ogImage = `${url}/opengraph-image`;

  const schema = escapeJsonLdValue({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: metadata.title,
    description: metadata.subtitle,
    image: ogImage,
    datePublished: metadata.publishedAt,
    dateModified: metadata.updatedAt ?? metadata.publishedAt,
    author: {
      "@type": "Person",
      name: "William Menjivar",
      url: `${SITE_URL}/colophon`,
    },
    publisher: {
      "@type": "Organization",
      name: "Praxeos",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    wordCount: metadata.readingTimeMin * 180,
    timeRequired: `PT${metadata.readingTimeMin}M`,
    keywords: [
      metadata.concept,
      "Austrian economics",
      "praxeology",
      ...metadata.thinkers,
    ].join(", "),
    citation: sources.map((s) => ({
      "@type": "CreativeWork",
      author: s.author,
      name: s.title,
      datePublished: s.year.toString(),
      publisher: s.publisher,
      url: s.url,
    })),
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
  });

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD body is produced from a typed object and HTML-escaped.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Article-schema for the manifesto.
 */
export function ManifestoJsonLd() {
  const url = `${SITE_URL}/manifesto`;
  const schema = escapeJsonLdValue({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Ends and Means — The Praxeos Manifesto",
    description:
      "A manifesto on explorable explanations, the Austrian tradition, and the craft of teaching ideas seriously.",
    image: `${url}/opengraph-image`,
    datePublished: "2026-04-23",
    author: {
      "@type": "Person",
      name: "William Menjivar",
      url: `${SITE_URL}/colophon`,
    },
    publisher: {
      "@type": "Organization",
      name: "Praxeos",
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
  });

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: typed source object, HTML-escaped.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * WebSite-schema for the homepage. Includes a SearchAction so Google can
 * offer in-result search once /glossary is wired.
 */
export function WebsiteJsonLd() {
  const schema = escapeJsonLdValue({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Praxeos",
    url: SITE_URL,
    description: "Explorable explanations for Austrian economics and praxeology.",
    publisher: {
      "@type": "Person",
      name: "William Menjivar",
    },
    inLanguage: "en",
    license: "https://creativecommons.org/licenses/by/4.0/",
  });
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: typed source object, HTML-escaped.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
