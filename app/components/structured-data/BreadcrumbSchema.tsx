import { SCHEMA_CONTEXT, BreadcrumbItem } from "./types";

interface BreadcrumbSchemaProps {
  baseUrl: string;
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ baseUrl, items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": SCHEMA_CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function generateArticleBreadcrumbs(
  baseUrl: string,
  articleTitle: string,
  articleSlug: string
): BreadcrumbItem[] {
  return [
    { name: "Home", url: "/" },
    { name: "Articles", url: "/articles" },
    { name: articleTitle, url: `/articles/${articleSlug}` },
  ];
}
