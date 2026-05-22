import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { getAllPosts } from "@/lib/blog";
import { SearchFilter } from "./search-filter";

export const metadata: Metadata = {
  title: "Blog — cdpilot | Browser Automation Insights",
  description:
    "Deep dives into browser automation, Chrome DevTools Protocol, AI agent tooling, and zero-dependency engineering. Written by the cdpilot team.",
  metadataBase: new URL("https://cdpilot.ndr.ist"),
  alternates: { canonical: "https://cdpilot.ndr.ist/blog" },
  openGraph: {
    title: "Blog — cdpilot",
    description:
      "Benchmarks, release notes, and engineering stories from the cdpilot team.",
    url: "https://cdpilot.ndr.ist/blog",
    siteName: "cdpilot",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — cdpilot",
    description:
      "Benchmarks, release notes, and engineering stories from the cdpilot team.",
    creator: "@mehmetnadir",
  },
};

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "cdpilot Blog",
  url: "https://cdpilot.ndr.ist/blog",
  description:
    "Engineering blog for cdpilot — zero-dependency browser automation CLI.",
  publisher: {
    "@type": "Organization",
    name: "cdpilot",
    url: "https://cdpilot.ndr.ist",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <Nav />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pb-16 pt-32">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 0%, rgba(34,197,94,0.06) 0%, transparent 60%)",
            }}
          />
          <div className="relative mx-auto max-w-6xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#22c55e]/20 bg-[#22c55e]/5 px-4 py-1.5 text-sm text-[#22c55e]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22c55e]" />
              Engineering &amp; Releases
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              From the{" "}
              <span className="text-gradient-green">Blog</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-[#a1a1aa]">
              Benchmarks, release notes, architecture deep dives, and the story
              behind zero-dependency browser automation.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-6xl">
            <SearchFilter posts={posts} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
