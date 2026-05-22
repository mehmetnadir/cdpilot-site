import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";

export const alt = "cdpilot Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? "cdpilot Blog";
  const tags = post?.tags ?? [];
  const readingTime = post?.readingTime ?? 0;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #22c55e, #4ade80)",
          }}
        />

        {/* cdpilot logo */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: "#22c55e",
            marginBottom: 24,
            letterSpacing: "0.05em",
            display: "flex",
          }}
        >
          cdpilot
        </div>

        {/* Post title */}
        <div
          style={{
            fontSize: title.length > 60 ? 52 : 64,
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1.1,
            marginBottom: 40,
            display: "flex",
            flexWrap: "wrap",
            maxWidth: "900px",
          }}
        >
          {title}
        </div>

        {/* Meta row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 22,
            color: "#71717a",
            gap: "16px",
          }}
        >
          <span>cdpilot.ndr.ist/blog</span>
          {readingTime > 0 && (
            <>
              <span>•</span>
              <span>{readingTime} min read</span>
            </>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div
            style={{
              position: "absolute",
              bottom: 48,
              right: 48,
              display: "flex",
              gap: "10px",
            }}
          >
            {tags.slice(0, 3).map((tag) => (
              <div
                key={tag}
                style={{
                  background: "rgba(34,197,94,0.1)",
                  color: "#22c55e",
                  padding: "6px 14px",
                  borderRadius: "100px",
                  fontSize: 18,
                  fontWeight: 700,
                  border: "1px solid rgba(34,197,94,0.3)",
                  display: "flex",
                }}
              >
                #{tag}
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
