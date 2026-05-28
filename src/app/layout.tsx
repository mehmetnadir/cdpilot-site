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
  title: "cdpilot — Browser automation in 50KB | Raw CDP, stealth, MCP for AI agents",
  description:
    "Zero-dependency browser automation CLI built on raw CDP. 60+ commands, stealth + adaptive escalation, CAPTCHA solvers (2captcha / anti-captcha / capmonster), per-host cookie persistence, named proxy pools, TLS fingerprint probe, MCP server for AI agents. 500x fewer tokens than screenshot-based tools. No Puppeteer. No Playwright. No Selenium.",
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
    "proxy rotation",
    "TLS fingerprint",
    "cookie management",
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
    title: "cdpilot — Raw CDP browser automation in 50KB",
    description:
      "Zero-dependency CLI. Raw CDP, 60+ commands, stealth + adaptive escalation, CAPTCHA solvers, proxy pools, TLS probe, MCP server. No Puppeteer/Playwright/Selenium.",
    url: "https://cdpilot.ndr.ist",
    siteName: "cdpilot",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "cdpilot — Raw CDP browser automation in 50KB",
    description:
      "60+ commands, stealth + adaptive, CAPTCHA solvers, proxy pools, TLS probe, MCP server. 500x fewer tokens. Zero dependencies. No Puppeteer/Playwright/Selenium.",
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
              description: "Zero-dependency browser automation CLI built on raw CDP. 60+ commands, stealth + adaptive escalation, CAPTCHA solvers, per-host cookie persistence, named proxy pools, TLS fingerprint probe, and MCP server for AI agents. 500x fewer tokens than screenshot-based approaches.",
              url: "https://cdpilot.ndr.ist",
              downloadUrl: "https://www.npmjs.com/package/cdpilot",
              softwareVersion: "0.8.0",
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
