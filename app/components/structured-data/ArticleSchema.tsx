import { SCHEMA_CONTEXT, IMAGE_DIMENSIONS } from "./types";

interface ArticleSchemaProps {
  baseUrl: string;
  article: {
    title: string;
    description: string;
    slug: string;
    date: string;
    dateModified?: string;
    readTime: string;
    category: string;
    keywords: string[];
  };
  author: {
    name: string;
    url: string;
  };
  ogImageUrl: string;
}

function parseDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date.toISOString();
  }

  // Try to parse "Month Year" format (e.g., "September 2025")
  const parts = dateStr.split(" ");
  if (parts.length === 2) {
    const monthYear = new Date(`${parts[0]} 1, ${parts[1]}`);
    if (!isNaN(monthYear.getTime())) {
      return monthYear.toISOString();
    }
  }

  return new Date().toISOString();
}

export function ArticleSchema({
  baseUrl,
  article,
  author,
  ogImageUrl,
}: ArticleSchemaProps) {
  const readTimeMinutes = parseInt(article.readTime) || 5;
  const wordCount = readTimeMinutes * 200;
  const publishedDate = parseDate(article.date);
  const modifiedDate = article.dateModified
    ? parseDate(article.dateModified)
    : publishedDate;

  const schema = {
    "@context": SCHEMA_CONTEXT,
    "@type": "BlogPosting",
    "@id": `${baseUrl}/articles/${article.slug}/#article`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/articles/${article.slug}`,
    },
    headline: article.title,
    description: article.description,
    image: {
      "@type": "ImageObject",
      url: ogImageUrl,
      width: IMAGE_DIMENSIONS.og.width,
      height: IMAGE_DIMENSIONS.og.height,
    },
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: {
      "@type": "Person",
      "@id": `${baseUrl}/#person`,
      name: author.name,
      url: author.url,
    },
    publisher: {
      "@type": "Person",
      "@id": `${baseUrl}/#person`,
      name: author.name,
      url: author.url,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/profile.jpeg`,
        width: IMAGE_DIMENSIONS.logo.width,
        height: IMAGE_DIMENSIONS.logo.height,
      },
    },
    keywords: article.keywords.join(", "),
    articleSection: article.category,
    wordCount,
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
