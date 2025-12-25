import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rules for all crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/_next/", "/api/"],
      },
      // Googlebot - full access
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/_next/"],
      },
      // Googlebot-Image - allow OG images
      {
        userAgent: "Googlebot-Image",
        allow: ["/", "/api/og"],
        disallow: ["/_next/static/"],
      },
      // AI Crawlers - Allow access for citation and discoverability
      {
        userAgent: "GPTBot",
        allow: ["/", "/articles/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/_next/", "/api/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/", "/articles/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/_next/", "/api/"],
      },
      {
        userAgent: "Claude-Web",
        allow: ["/", "/articles/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/_next/", "/api/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: ["/", "/articles/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/_next/", "/api/"],
      },
      {
        userAgent: "Google-Extended",
        allow: ["/", "/articles/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/_next/", "/api/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/_next/"],
      },
      {
        userAgent: "Slurp",
        allow: "/",
        disallow: ["/_next/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
