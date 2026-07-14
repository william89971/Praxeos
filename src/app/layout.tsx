import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { Crosshair } from "@/components/cursor/Crosshair";
import { MotionProvider } from "@/components/motion/MotionProvider";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

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
      "Learn through a flagship calculation journey, deterministic feedback, interactive labs, sources, and reflection.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Praxeos - See the structure inside every choice",
    description:
      "Begin an eight-minute journey through actors, ends, means, scarcity, prices, and revision.",
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
    <html lang="en" suppressHydrationWarning>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider>
          <MotionProvider>
            <Crosshair />
            <main id="main">{children}</main>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
