import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock, Calendar, ExternalLink } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { getAllPosts, getPostBySlug, getAdjacentPosts } from "@/lib/blog";
import { remark } from "remark";
import remarkHtml from "remark-html";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function parseMarkdown(content: string): Promise<string> {
  const result = await remark().use(remarkHtml, { sanitize: false }).process(content);
  return result.toString();
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found — cdpilot" };

  const ogImage = `https://cdpilot.ndr.ist/blog/${slug}/opengraph-image`;

  return {
    title: `${post.title} — cdpilot Blog`,
    description: post.description,
    metadataBase: new URL("https://cdpilot.ndr.ist"),
    alternates: {
      canonical: post.canonical_url ?? `https://cdpilot.ndr.ist/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://cdpilot.ndr.ist/blog/${slug}`,
      siteName: "cdpilot",
      type: "article",
      locale: "en_US",
      publishedTime: post.date,
      authors: ["cdpilot team"],
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      creator: "@mehmetnadir",
      images: [ogImage],
    },
  };
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// Extract headings for ToC
function extractHeadings(html: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const regex = /<h([2-3])[^>]*>(.*?)<\/h[2-3]>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]+>/g, "");
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    headings.push({ id, text, level });
  }
  return headings;
}

// Add IDs to headings in HTML
function addHeadingIds(html: string): string {
  return html.replace(/<h([2-3])>(.*?)<\/h[2-3]>/gi, (_match, level, content) => {
    const text = content.replace(/<[^>]+>/g, "");
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return `<h${level} id="${id}">${content}</h${level}>`;
  });
}

export default async function BlogPostPage(props: PageProps) {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const rawHtml = await parseMarkdown(post.content);
  const html = addHeadingIds(rawHtml);
  const headings = extractHeadings(html);
  const { prev, next } = getAdjacentPosts(slug);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: "cdpilot team",
      url: "https://cdpilot.ndr.ist",
    },
    publisher: {
      "@type": "Organization",
      name: "cdpilot",
      url: "https://cdpilot.ndr.ist",
      logo: {
        "@type": "ImageObject",
        url: "https://cdpilot.ndr.ist/favicon.ico",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://cdpilot.ndr.ist/blog/${slug}`,
    },
    image: `https://cdpilot.ndr.ist/blog/${slug}/opengraph-image`,
    keywords: post.tags.join(", "),
    url: `https://cdpilot.ndr.ist/blog/${slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://cdpilot.ndr.ist" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://cdpilot.ndr.ist/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://cdpilot.ndr.ist/blog/${slug}` },
    ],
  };

  const faqJsonLd = post.faq && post.faq.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <Nav />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 pt-28 pb-24">
          <div className="flex gap-10 xl:gap-16">
            {/* Table of Contents (sticky sidebar) */}
            {headings.length > 2 && (
              <aside className="hidden xl:block w-56 shrink-0">
                <div className="sticky top-28">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#52525b]">
                    On this page
                  </p>
                  <nav aria-label="Table of contents">
                    <ul className="space-y-2">
                      {headings.map((h) => (
                        <li key={h.id} style={{ paddingLeft: h.level === 3 ? "0.75rem" : 0 }}>
                          <a
                            href={`#${h.id}`}
                            className="block text-sm text-[#a1a1aa] transition-colors hover:text-[#22c55e] leading-snug"
                          >
                            {h.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </aside>
            )}

            {/* Main article */}
            <article className="min-w-0 flex-1 max-w-3xl">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-[#52525b]">
                <Link href="/" className="hover:text-[#a1a1aa] transition-colors">Home</Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link href="/blog" className="hover:text-[#a1a1aa] transition-colors">Blog</Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-[#a1a1aa] truncate">{post.title}</span>
              </nav>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="rounded-full border border-[#22c55e]/20 bg-[#22c55e]/5 px-2.5 py-0.5 text-xs font-medium text-[#22c55e] hover:bg-[#22c55e]/10 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="mb-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="mb-10 flex flex-wrap items-center gap-4 border-b border-[#27272a] pb-8 text-sm text-[#52525b]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingTime} min read
                </span>
                <span className="flex items-center gap-1.5">
                  By{" "}
                  <span className="text-[#a1a1aa]">cdpilot team</span>
                </span>
              </div>

              {/* Article content */}
              <div
                className="prose-blog"
                dangerouslySetInnerHTML={{ __html: html }}
              />

              {/* FAQ section */}
              {post.faq && post.faq.length > 0 && (
                <section className="mt-14 border-t border-[#27272a] pt-10">
                  <h2 className="mb-6 text-xl font-bold text-white">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-6">
                    {post.faq.map((item, i) => (
                      <div key={i} className="rounded-xl border border-[#27272a] bg-[#141414] p-5">
                        <h3 className="mb-2 font-semibold text-white">{item.q}</h3>
                        <p className="text-sm leading-relaxed text-[#a1a1aa]">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Related tweet */}
              {post.related_tweet_url && (
                <div className="mt-10 rounded-xl border border-[#27272a] bg-[#141414] p-5">
                  <p className="mb-3 text-sm text-[#52525b]">Related discussion</p>
                  <a
                    href={post.related_tweet_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[#22c55e] hover:underline"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    View on X (Twitter)
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {/* Author box */}
              <div className="mt-12 rounded-xl border border-[#27272a] bg-[#141414] p-6 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#22c55e]/10 font-mono text-sm font-bold text-[#22c55e]">
                  cp
                </div>
                <div>
                  <p className="font-semibold text-white">cdpilot team</p>
                  <p className="mt-1 text-sm text-[#a1a1aa]">
                    Building zero-dependency browser automation for developers and AI agents.{" "}
                    <a href="https://github.com/mehmetnadir/cdpilot" className="text-[#22c55e] hover:underline">
                      github.com/mehmetnadir/cdpilot
                    </a>
                  </p>
                </div>
              </div>

              {/* Prev / Next navigation */}
              {(prev || next) && (
                <nav
                  aria-label="Blog post navigation"
                  className="mt-12 grid gap-4 sm:grid-cols-2"
                >
                  {prev ? (
                    <Link
                      href={`/blog/${prev.slug}`}
                      className="group flex flex-col rounded-xl border border-[#27272a] bg-[#141414] p-5 transition-all hover:border-[#22c55e]/30"
                    >
                      <span className="mb-2 flex items-center gap-1 text-xs text-[#52525b]">
                        <ChevronLeft className="h-3.5 w-3.5" />
                        Newer
                      </span>
                      <span className="text-sm font-medium text-[#a1a1aa] group-hover:text-white transition-colors line-clamp-2">
                        {prev.title}
                      </span>
                    </Link>
                  ) : (
                    <div />
                  )}
                  {next ? (
                    <Link
                      href={`/blog/${next.slug}`}
                      className="group flex flex-col items-end rounded-xl border border-[#27272a] bg-[#141414] p-5 text-right transition-all hover:border-[#22c55e]/30"
                    >
                      <span className="mb-2 flex items-center gap-1 text-xs text-[#52525b]">
                        Older
                        <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-sm font-medium text-[#a1a1aa] group-hover:text-white transition-colors line-clamp-2">
                        {next.title}
                      </span>
                    </Link>
                  ) : (
                    <div />
                  )}
                </nav>
              )}
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
