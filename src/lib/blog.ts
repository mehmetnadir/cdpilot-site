import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface FaqItem {
  q: string;
  a: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  track?: string;
  related_tweet_url?: string;
  canonical_url?: string;
  faq?: FaqItem[];
  draft: boolean;
  readingTime: number; // minutes
  content: string;
  htmlContent?: string;
}

function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function ensureBlogDir(): boolean {
  try {
    return fs.existsSync(BLOG_DIR);
  } catch {
    return false;
  }
}

export function getAllPosts(): BlogPost[] {
  if (!ensureBlogDir()) return [];

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const posts: BlogPost[] = files
    .map((filename) => {
      const slug = filename.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
      const { data, content } = matter(raw);

      if (data.draft === true) return null;

      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "2026-01-01",
        description: data.description ?? "",
        tags: Array.isArray(data.tags) ? data.tags : [],
        track: data.track,
        related_tweet_url: data.related_tweet_url,
        canonical_url: data.canonical_url ?? `https://cdpilot.ndr.ist/blog/${slug}`,
        faq: Array.isArray(data.faq) ? data.faq : undefined,
        draft: data.draft === true,
        readingTime: calculateReadingTime(content),
        content,
      } as BlogPost;
    })
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return posts;
}

export function getPostBySlug(slug: string): BlogPost | null {
  if (!ensureBlogDir()) return null;

  for (const ext of [".md", ".mdx"]) {
    const filePath = path.join(BLOG_DIR, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "2026-01-01",
        description: data.description ?? "",
        tags: Array.isArray(data.tags) ? data.tags : [],
        track: data.track,
        related_tweet_url: data.related_tweet_url,
        canonical_url: data.canonical_url ?? `https://cdpilot.ndr.ist/blog/${slug}`,
        faq: Array.isArray(data.faq) ? data.faq : undefined,
        draft: data.draft === true,
        readingTime: calculateReadingTime(content),
        content,
      };
    }
  }
  return null;
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

export function getAdjacentPosts(
  slug: string
): { prev: BlogPost | null; next: BlogPost | null } {
  const posts = getAllPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  return {
    prev: idx > 0 ? posts[idx - 1] : null,
    next: idx < posts.length - 1 ? posts[idx + 1] : null,
  };
}
