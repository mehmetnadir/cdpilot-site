import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ChevronLeft,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { commands, categories, getCommandBySlug } from "@/data/commands";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return commands.map((cmd) => ({ slug: cmd.name }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const cmd = getCommandBySlug(slug);
  if (!cmd) return { title: "Not Found - cdpilot" };
  return {
    title: `${cmd.name} - cdpilot docs`,
    description: cmd.description,
  };
}

export default async function CommandPage(props: PageProps) {
  const { slug } = await props.params;
  const cmd = getCommandBySlug(slug);
  if (!cmd) notFound();

  const category = categories.find((c) => c.id === cmd.category);
  const catCommands = commands.filter((c) => c.category === cmd.category);
  const currentIndex = catCommands.findIndex((c) => c.name === cmd.name);
  const prev = currentIndex > 0 ? catCommands[currentIndex - 1] : null;
  const next =
    currentIndex < catCommands.length - 1
      ? catCommands[currentIndex + 1]
      : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-[#27272a] bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/docs"
            className="flex items-center gap-2 text-[#a1a1aa] transition-colors hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="text-sm">Back to Docs</span>
          </Link>
          <div className="mx-2 hidden h-5 w-px bg-[#27272a] sm:block" />
          <span className="hidden text-xs text-[#52525b] sm:block">
            {category?.name}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {/* Title */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-[#22c55e]/10 px-2.5 py-0.5 text-xs font-medium text-[#22c55e]">
              {category?.name}
            </span>
          </div>
          <h1 className="font-mono text-3xl font-bold text-[#22c55e] sm:text-4xl">
            {cmd.name}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#a1a1aa]">
            {cmd.description}
          </p>
        </div>

        {/* Usage */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#52525b]">
            Usage
          </h2>
          <div className="rounded-lg border border-[#27272a] bg-[#141414] px-4 py-3">
            <code className="font-mono text-sm text-[#4ade80]">
              $ {cmd.usage}
            </code>
          </div>
        </section>

        {/* Arguments */}
        {cmd.args && cmd.args.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#52525b]">
              Arguments
            </h2>
            <div className="overflow-x-auto rounded-lg border border-[#27272a]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#27272a] bg-[#141414]">
                    <th className="px-4 py-2.5 text-left font-medium text-[#a1a1aa]">
                      Name
                    </th>
                    <th className="px-4 py-2.5 text-left font-medium text-[#a1a1aa]">
                      Required
                    </th>
                    <th className="px-4 py-2.5 text-left font-medium text-[#a1a1aa]">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cmd.args.map((arg) => (
                    <tr
                      key={arg.name}
                      className="border-b border-[#27272a]/50 last:border-0"
                    >
                      <td className="px-4 py-2.5">
                        <code className="font-mono text-xs text-[#22c55e]">
                          {arg.name}
                        </code>
                      </td>
                      <td className="px-4 py-2.5">
                        {arg.required ? (
                          <span className="rounded bg-[#22c55e]/10 px-1.5 py-0.5 text-xs text-[#22c55e]">
                            required
                          </span>
                        ) : (
                          <span className="rounded bg-[#27272a] px-1.5 py-0.5 text-xs text-[#52525b]">
                            optional
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-[#a1a1aa]">
                        {arg.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Examples */}
        {cmd.examples.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#52525b]">
              Examples
            </h2>
            <div className="space-y-3">
              {cmd.examples.map((ex, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-[#27272a] bg-[#141414]"
                >
                  <div className="border-b border-[#27272a]/50 px-4 py-2">
                    <p className="text-xs text-[#a1a1aa]">{ex.description}</p>
                  </div>
                  <div className="px-4 py-3">
                    <code className="font-mono text-sm text-[#4ade80]">
                      $ {ex.code}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Prev / Next navigation */}
        <div className="mt-12 flex items-center justify-between border-t border-[#27272a] pt-6">
          {prev ? (
            <Link
              href={`/docs/${prev.name}`}
              className="flex items-center gap-2 text-sm text-[#a1a1aa] transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-mono text-[#22c55e]">{prev.name}</span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/docs/${next.name}`}
              className="flex items-center gap-2 text-sm text-[#a1a1aa] transition-colors hover:text-white"
            >
              <span className="font-mono text-[#22c55e]">{next.name}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </main>
    </div>
  );
}
