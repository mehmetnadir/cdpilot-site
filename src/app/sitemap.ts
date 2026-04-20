import { commands } from "@/data/commands";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cdpilot.ndr.ist";

  const commandPages = commands.map((cmd) => ({
    url: `${baseUrl}/docs/${cmd.name}`,
    lastModified: new Date("2026-04-05"),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-04-05"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date("2026-04-05"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...commandPages,
  ];
}
