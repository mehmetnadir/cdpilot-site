import { describe, expect, it } from "vitest";
import { getAllPosts, getPostBySlug } from "./blog";

describe("blog loader", () => {
  it("getAllPosts returns at least one published post", () => {
    const posts = getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
  });

  it("posts have required frontmatter fields", () => {
    const posts = getAllPosts();
    for (const p of posts) {
      expect(p.slug).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(typeof p.readingTime).toBe("number");
      expect(p.readingTime).toBeGreaterThan(0);
      expect(p.draft).toBe(false);
    }
  });

  it("posts are sorted newest first", () => {
    const posts = getAllPosts();
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].date >= posts[i].date).toBe(true);
    }
  });

  it("getPostBySlug returns null for unknown slug", () => {
    const p = getPostBySlug("definitely-not-a-real-post-xyz");
    expect(p).toBeNull();
  });

  it("getPostBySlug returns hydrated content for known slug", () => {
    const all = getAllPosts();
    if (all.length === 0) return;
    const first = getPostBySlug(all[0].slug);
    expect(first).not.toBeNull();
    expect(first!.content.length).toBeGreaterThan(0);
  });
});
