import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs - cdpilot",
  description:
    "Full command reference for cdpilot. 50+ commands for browser automation, debugging, network interception, device emulation, and AI agent integration.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
