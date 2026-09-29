import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { examples } from "@/data/examples";
import { ExternalLink, Terminal, Code2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Runnable Examples & Real Outputs — cdpilot",
  description:
    "Explore real, runnable examples of cdpilot features: connect to your own browser, Chrome for Testing, iframes, press-and-hold clicks, missed-click exit codes, the WebMCP bridge, Web Bot Auth and the Claude Code plugin.",
  alternates: {
    canonical: "https://cdpilot.ndr.ist/examples",
  },
  openGraph: {
    title: "Runnable Examples & Real Outputs — cdpilot",
    description:
      "cdpilot's new features, each shown by our own runnable example and its real output.",
    url: "https://cdpilot.ndr.ist/examples",
    siteName: "cdpilot",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Runnable Examples & Real Outputs — cdpilot",
    description:
      "cdpilot's new features, each shown by our own runnable example and its real output.",
    creator: "@mehmetnadir",
  },
};

export default function ExamplesPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 pt-28 pb-24">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-[#52525b]">
            <Link href="/" className="hover:text-[#a1a1aa] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#a1a1aa]">Examples</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Runnable <span className="text-gradient-green">Examples</span> &amp; Real Output
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[#a1a1aa]">
              Each new cdpilot feature is shown by our own runnable example and its real output.
              Nothing typed by hand: the commands we ran, the transcript they printed, and a screenshot cdpilot took.
            </p>
          </div>

          <div className="mt-14 space-y-16">
            {examples.map((ex) => (
              <section
                key={ex.id}
                id={ex.id}
                className="rounded-2xl border border-[#27272a] bg-[#141414]/80 p-6 sm:p-8"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white sm:text-3xl">
                      {ex.title}
                    </h2>
                    <p className="mt-2 text-[#a1a1aa]">{ex.description}</p>
                  </div>
                  <a
                    href={ex.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 self-start rounded-lg border border-[#27272a] bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-[#22c55e] transition-colors hover:border-[#22c55e]/40 hover:bg-[#22c55e]/10 sm:self-auto"
                  >
                    View on GitHub
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#71717a]">
                        <Code2 className="h-3.5 w-3.5 text-[#22c55e]" />
                        <span>Exact Commands</span>
                      </div>
                      <pre className="overflow-x-auto rounded-lg border border-[#27272a] bg-[#09090b] p-4 font-mono text-xs text-[#e4e4e7]">
                        <code>{ex.commands}</code>
                      </pre>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#71717a]">
                        <Terminal className="h-3.5 w-3.5 text-[#22c55e]" />
                        <span>Real Transcript Excerpt</span>
                      </div>
                      <pre className="overflow-x-auto rounded-lg border border-[#27272a] bg-[#09090b] p-4 font-mono text-xs text-[#a1a1aa]">
                        <code>{ex.transcriptExcerpt}</code>
                      </pre>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#71717a]">
                      <span>Captured Output Screenshot</span>
                    </div>
                    <div className="relative overflow-hidden rounded-lg border border-[#27272a] bg-[#09090b]">
                      <Image
                        src={ex.screenshot}
                        alt={`${ex.title} output screenshot`}
                        width={800}
                        height={500}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
