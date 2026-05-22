"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowRight, Tag } from "lucide-react";
import type { BlogPost } from "@/lib/blog";

interface SearchFilterProps {
  posts: BlogPost[];
  initialTag?: string;
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

export function SearchFilter({ posts, initialTag }: SearchFilterProps) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(initialTag ?? null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesTag = !activeTag || p.tags.includes(activeTag);
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesTag && matchesQuery;
    });
  }, [posts, query, activeTag]);

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52525b]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts..."
          className="w-full rounded-xl border border-[#27272a] bg-[#141414] py-3 pl-11 pr-4 text-sm text-[#fafafa] placeholder-[#52525b] transition-colors focus:border-[#22c55e]/40 focus:outline-none"
        />
      </div>

      {/* Tag filters */}
      {allTags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              !activeTag
                ? "border-[#22c55e]/40 bg-[#22c55e]/10 text-[#22c55e]"
                : "border-[#27272a] text-[#a1a1aa] hover:border-[#3f3f46] hover:text-white"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                activeTag === tag
                  ? "border-[#22c55e]/40 bg-[#22c55e]/10 text-[#22c55e]"
                  : "border-[#27272a] text-[#a1a1aa] hover:border-[#3f3f46] hover:text-white"
              }`}
            >
              <Tag className="h-3 w-3" />
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Posts */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[#27272a] bg-[#141414] px-8 py-16 text-center">
          <p className="text-[#52525b]">No posts found. Check back soon.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
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

              <h2 className="mb-2 text-base font-semibold leading-snug text-white transition-colors group-hover:text-[#22c55e]">
                {post.title}
              </h2>

              <p className="mb-4 flex-1 text-sm leading-relaxed text-[#a1a1aa] line-clamp-3">
                {post.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="text-xs text-[#52525b]">
                  <span>{formatDate(post.date)}</span>
                  <span className="mx-1.5">&middot;</span>
                  <span>{post.readingTime} min read</span>
                </div>
                <ArrowRight className="h-4 w-4 text-[#52525b] transition-all group-hover:translate-x-1 group-hover:text-[#22c55e]" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
