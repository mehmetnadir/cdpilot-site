import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "cdpilot — A lightweight Playwright alternative for AI agents | Raw CDP, MCP",
  description:
    "A lightweight, zero-dependency Playwright alternative built on raw CDP — one Python file, no node_modules. 70+ commands, progressive anti-bot friction ladder, three-tier stealth mode, CAPTCHA + press-and-hold solvers, video understanding, per-host cookie persistence, named proxy pools, TLS fingerprint probe, MCP server for AI agents. Structured a11y-tree snapshots — no vision model needed. No Puppeteer. No Playwright. No Selenium.",
  keywords: [
    "browser automation",
    "CDP",
    "Chrome DevTools Protocol",
    "CLI",
    "MCP",
    "AI agent",
    "web scraping",
    "stealth",
    "anti-bot",
    "captcha solver",
    "cloudflare bypass",
    "datadome",
    "adaptive escalation",
    "friction ladder",
    "progressive resilience",
    "press and hold",
    "perimeterx",
    "proxy rotation",
    "TLS fingerprint",
    "cookie management",
    "video understanding",
    "screencast",
    "shadow DOM",
    "testing",
    "e2e testing",
    "assertions",
    "playwright alternative",
    "puppeteer alternative",
    "zero dependency",
    "accessibility",
    "web testing",
    "browser testing",
    "Claude Code",
    "model context protocol",
  ],
  metadataBase: new URL("https://cdpilot.ndr.ist"),
  alternates: {
    canonical: "https://cdpilot.ndr.ist",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "cdpilot — Zero-dependency browser automation via raw CDP",
    description:
      "A lightweight Playwright alternative. Raw CDP, 70+ commands, progressive anti-bot friction ladder, three-tier stealth, CAPTCHA + press-and-hold solvers, proxy pools, MCP server. No Puppeteer/Playwright/Selenium.",
    url: "https://cdpilot.ndr.ist",
    siteName: "cdpilot",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "cdpilot — Zero-dependency browser automation via raw CDP",
    description:
      "A lightweight Playwright alternative. 70+ commands, progressive anti-bot friction ladder, three-tier stealth, CAPTCHA + press-and-hold solvers, proxy pools, MCP server. Structured a11y snapshots, no vision model needed. Zero dependencies. No Puppeteer/Playwright/Selenium.",
    creator: "@mehmetnadir",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "cdpilot",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "macOS, Linux, Windows",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              description: "A lightweight Playwright alternative — zero-dependency browser automation CLI built on raw CDP. 70+ commands, progressive anti-bot friction ladder, three-tier stealth mode, CAPTCHA + press-and-hold solvers, video understanding via screencast, per-host cookie persistence, named proxy pools, TLS fingerprint probe, and MCP server for AI agents. Structured a11y-tree snapshots the agent can act on directly — no vision model needed.",
              url: "https://cdpilot.ndr.ist",
              downloadUrl: "https://www.npmjs.com/package/cdpilot",
              softwareVersion: "0.9.2",
              author: { "@type": "Person", name: "Nadir Arslan", url: "https://github.com/mehmetnadir" },
              license: "https://opensource.org/licenses/MIT",
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
