# cdpilot-site

Marketing site and blog for [cdpilot](https://cdpilot.ndr.ist) — zero-dependency browser automation CLI.

**Stack:** Next.js 16 App Router · TypeScript · Tailwind CSS v4 · Geist font

## Getting Started

```bash
npm run dev    # dev server at http://localhost:3000
npm run build  # production build
npm run start  # serve production build
```

## Blog Publishing

Blog posts live in `content/blog/` as Markdown files.

### Create a new post

```bash
# Create content/blog/my-post-slug.md with this frontmatter:
```

```yaml
---
title: "Post Title"
slug: "my-post-slug"
date: "2026-05-18"
description: "Max 160 chars — unique per post."
tags: ["browser-automation", "cdpilot"]
track: "Foundations"              # optional section label
related_tweet_url: "https://x.com/cdpilot/status/..."  # optional
faq:
  - q: "Frequently asked question?"
    a: "Clear, factual answer."
draft: false
---

Post content in Markdown...
```

### Frontmatter reference

| Field | Required | Notes |
|-------|----------|-------|
| `title` | Yes | Used in `<h1>`, OG title, JSON-LD |
| `slug` | Yes | Must match filename (without .md) |
| `date` | Yes | ISO 8601: `2026-05-18` |
| `description` | Yes | Max 160 chars, used in meta description |
| `tags` | Yes | Array of strings, used for filtering |
| `draft` | Yes | `true` hides from listing and sitemap |
| `track` | No | Section grouping label |
| `related_tweet_url` | No | Shows X link at bottom of post |
| `faq` | No | Array of `{q, a}` — generates FAQ JSON-LD |

### Blog routes

| URL | Description |
|-----|-------------|
| `/blog` | Index with search + tag filter |
| `/blog/[slug]` | Individual post page |
| `/blog/rss.xml` | RSS 2.0 feed |
| `/blog/[slug]/opengraph-image` | Dynamic OG image (1200x630) |

### SEO / GEO checklist per post

- [ ] `description` under 160 characters
- [ ] At least one `faq` entry (AI search engines prioritize FAQ content)
- [ ] `date` reflects publication date (affects freshness signals)
- [ ] Internal links in body (at least 3 links to other cdpilot pages)
- [ ] External authoritative citations (MDN, RFC, official docs)
- [ ] `draft: false` when ready to publish

## Deployment

The site deploys to Server 21 at `cdpilot.ndr.ist` (port 3400).

```bash
npm run build
# then restart the PM2 process on the server
```
