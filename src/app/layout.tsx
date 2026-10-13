import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { Crosshair } from "@/components/cursor/Crosshair";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

const fraunces = localFont({
  src: "../../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2",
  variable: "--font-fraunces",
  display: "swap",
  weight: "100 900",
});

const inter = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

const jetbrains = localFont({
  src: "../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-jetbrains",
  display: "swap",
  weight: "100 800",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://praxeos.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Praxeos - See the structure inside every choice",
    template: "%s - Praxeos",
  },
  description:
    "An interactive learning laboratory for understanding human choices and economic systems through cases, simulations, source-grounded Claude guidance, and reflection.",
  keywords: [
    "Austrian economics",
    "praxeology",
    "Ludwig von Mises",
    "Friedrich Hayek",
    "Murray Rothbard",
    "Bitcoin",
    "sound money",
    "human action",
    "opportunity cost",
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
    title: "Praxeos - See the structure inside every choice",
    description:
      "Learn praxeology by examining actors, ends, means, and alternatives, then watching those distinctions in four labs.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Praxeos - See the structure inside every choice",
    description:
      "Start with the structure of a choice, then watch a market of five people and five goods.",
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
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider>
          <Crosshair />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
