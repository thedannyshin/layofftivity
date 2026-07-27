import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { organizations } from "@/lib/data";

const BASE_URL = "";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/home", changefreq: "daily", priority: "0.9" },
          { path: "/organizations", changefreq: "weekly", priority: "0.9" },
          { path: "/cohort", changefreq: "daily", priority: "0.8" },
          { path: "/match", changefreq: "weekly", priority: "0.8" },
          { path: "/profile", changefreq: "weekly", priority: "0.7" },
          { path: "/profile/friends", changefreq: "weekly", priority: "0.5" },
          { path: "/profile/history", changefreq: "weekly", priority: "0.5" },
          { path: "/profile/reflections", changefreq: "weekly", priority: "0.5" },
          { path: "/profile/badges", changefreq: "monthly", priority: "0.5" },
          { path: "/volunteer-day", changefreq: "weekly", priority: "0.6" },
          { path: "/reflection", changefreq: "weekly", priority: "0.5" },
          { path: "/continue-together", changefreq: "weekly", priority: "0.5" },
          { path: "/cohort-chat", changefreq: "daily", priority: "0.4" },
          { path: "/invite", changefreq: "monthly", priority: "0.6" },
          ...organizations.map((o) => ({
            path: `/organizations/${o.id}`,
            changefreq: "weekly" as const,
            priority: "0.7",
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});