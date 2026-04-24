import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { Crosshair } from "@/components/cursor/Crosshair";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

const fraunces = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-full-italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-fraunces",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  preload: true,
});

const inter = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: "Arial",
  preload: true,
});

const jetbrainsMono = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
      weight: "100 800",
      style: "normal",
    },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://praxeos.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Praxeos — Explorable explanations for Austrian economics",
    template: "%s — Praxeos",
  },
  description:
    "A library of interactive, generative, philosophically rigorous explorable explanations of Austrian economics and praxeology. An open-source cultural artifact.",
  keywords: [
    "Austrian economics",
    "praxeology",
    "Ludwig von Mises",
    "Friedrich Hayek",
    "Murray Rothbard",
    "Bitcoin",
    "sound money",
    "explorable explanations",
    "economic calculation",
    "time preference",
  ],
  authors: [{ name: "William Menjivar" }],
  creator: "William Menjivar",
  publisher: "Praxeos",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Praxeos",
    locale: "en_US",
    url: siteUrl,
    title: "Praxeos — Explorable explanations for Austrian economics",
    description:
      "A library of interactive, generative, philosophically rigorous explorable explanations of Austrian economics and praxeology.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Praxeos — Explorable explanations for Austrian economics",
    description:
      "A library of interactive, generative, philosophically rigorous explorable explanations of Austrian economics and praxeology.",
  },
  alternates: {
    canonical: siteUrl,
    types: {
      "application/rss+xml": `${siteUrl}/rss.xml`,
    },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F0E6" },
    { media: "(prefers-color-scheme: dark)", color: "#14110D" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider>
          <Crosshair />
          <main id="main">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
