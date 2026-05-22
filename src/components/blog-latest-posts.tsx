import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { getAllPosts } from "@/lib/blog";

export function BlogLatestPosts() {
  const posts = getAllPosts().slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="border-t border-[#27272a] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#22c55e]/20 bg-[#22c55e]/5 px-3 py-1 text-xs text-[#22c55e]">
              Engineering &amp; Releases
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Latest from the{" "}
              <span className="text-gradient-green">Blog</span>
            </h2>
            <p className="mt-2 text-[#a1a1aa]">
              Technical deep-dives, benchmarks, and product updates.
            </p>
          </div>
          <Link
            href="/blog"
            className="group hidden items-center gap-2 text-sm font-medium text-[#a1a1aa] transition-colors hover:text-[#22c55e] md:flex"
          >
            All posts
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Post cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-xl border border-[#27272a] bg-[#141414] p-6 transition-all hover:border-[#22c55e]/30 hover:bg-[#1a1a1a]"
            >
              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#22c55e]/20 bg-[#22c55e]/5 px-2 py-0.5 text-[10px] font-medium text-[#22c55e]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <h3 className="mb-2 text-base font-semibold leading-snug text-white transition-colors group-hover:text-[#22c55e]">
                {post.title}
              </h3>

              <p className="mb-4 flex-1 text-sm leading-relaxed text-[#a1a1aa] line-clamp-3">
                {post.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-[#52525b]">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readingTime} min
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-[#52525b] transition-all group-hover:translate-x-1 group-hover:text-[#22c55e]" />
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 md:hidden">
          <Link
            href="/blog"
            className="flex items-center justify-center gap-2 rounded-xl border border-[#27272a] py-3 text-sm font-medium text-[#a1a1aa] transition-colors hover:border-[#3f3f46] hover:text-white"
          >
            View all posts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
