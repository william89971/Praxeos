import path from "node:path";
import { fileURLToPath } from "node:url";
import createMDX from "@next/mdx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ["remark-gfm", "remark-footnotes"],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: __dirname,
  pageExtensions: ["ts", "tsx", "mdx"],
  experimental: {
    viewTransition: true,
    optimizePackageImports: ["framer-motion"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  async redirects() {
    return [
      { source: "/learn/praxeology-101", destination: "/learn", permanent: true },
      { source: "/cases", destination: "/practice", permanent: true },
      { source: "/modules", destination: "/labs", permanent: true },
      {
        source: "/journey/calculation-labyrinth",
        destination: "/labs/market-without-a-manager?mode=guided&from=redesign",
        permanent: true,
      },
      {
        source: "/labs/monetary-garden",
        destination: "/labs?redesigned=monetary-garden",
        permanent: true,
      },
      {
        source: "/labs/signal-orchard",
        destination: "/labs?redesigned=signal-orchard",
        permanent: true,
      },
      {
        source: "/labs/calculation-labyrinth",
        destination: "/labs?redesigned=calculation-labyrinth",
        permanent: true,
      },
      {
        source: "/labs/coordination-engine",
        destination: "/labs?redesigned=coordination-engine",
        permanent: true,
      },
      {
        source: "/modules/:slug",
        destination: "/labs?redesigned=:slug",
        permanent: true,
      },
      { source: "/glossary", destination: "/sources/glossary", permanent: true },
      { source: "/thinkers", destination: "/sources", permanent: true },
      {
        source: "/thinkers/:slug",
        destination: "/sources/thinkers/:slug",
        permanent: true,
      },
      { source: "/manifesto", destination: "/sources#manifesto", permanent: true },
      {
        source: "/manifesto-print",
        destination: "/sources#manifesto",
        permanent: true,
      },
      { source: "/colophon", destination: "/built", permanent: true },
      { source: "/field-notes", destination: "/built#field-notes", permanent: true },
      {
        source: "/field-notes/:slug",
        destination: "/built#field-notes",
        permanent: true,
      },
    ];
  },
  async headers() {
    const scriptSources = ["'self'", "'unsafe-inline'"];
    if (process.env.NODE_ENV !== "production") scriptSources.push("'unsafe-eval'");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src ${scriptSources.join(" ")}`,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self'",
              "connect-src 'self'",
              "object-src 'none'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default withMDX(nextConfig);
