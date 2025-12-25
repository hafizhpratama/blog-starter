import { MetadataRoute } from "next";
import { getAllArticles } from "./lib/mdx";

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles();

  const articleUrls = articles.map((article) => {
    const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(article.title)}&theme=light`;

    return {
      url: `${SITE_URL}/articles/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: [ogImageUrl],
    };
  });

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      images: [`${SITE_URL}/thumbnail.png`],
    },
    {
      url: `${SITE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/games`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/games/rock-paper-scissors`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/games/slot-machine`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    ...articleUrls,
  ];
}
