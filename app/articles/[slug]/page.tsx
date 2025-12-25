import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getAllArticles, getArticleBySlug } from "../../lib/mdx";
import { ArticleLayout } from "../../components/ArticleLayout";
import { generateOGImageUrl } from "@/lib/utils";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

function parseDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date.toISOString();
  }
  const parts = dateStr.split(" ");
  if (parts.length === 2) {
    const monthYear = new Date(`${parts[0]} 1, ${parts[1]}`);
    if (!isNaN(monthYear.getTime())) {
      return monthYear.toISOString();
    }
  }
  return new Date().toISOString();
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { meta } = await getArticleBySlug(params.slug);

  const ogImageUrl = generateOGImageUrl({
    title: meta.title,
    theme: (process.env.NEXT_PUBLIC_THEME as "light" | "dark") || "light",
  });

  return {
    title: meta.title,
    description: meta.description,
    icons: {
      icon: "/favicon.ico",
    },
    alternates: {
      canonical: `${BASE_URL}/articles/${params.slug}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      publishedTime: meta.date,
      authors: ["Hafizh Pratama"],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [ogImageUrl],
    },
  };
}

const getArticleData = cache(async (slug: string) => {
  try {
    return await getArticleBySlug(slug);
  } catch {
    return null;
  }
});

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleData(params.slug);

  if (!article) {
    notFound();
  }

  const { meta, content } = article;

  const ogImageUrl = generateOGImageUrl({
    title: meta.title,
    theme: (process.env.NEXT_PUBLIC_THEME as "light" | "dark") || "light",
  });

  const publishedDate = parseDate(meta.date);
  const readTimeMinutes = parseInt(meta.readTime) || 5;

  // Article structured data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    image: ogImageUrl,
    datePublished: publishedDate,
    dateModified: publishedDate,
    author: {
      "@type": "Person",
      name: "Hafizh Pratama",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Hafizh Pratama",
      url: BASE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/articles/${meta.slug}`,
    },
    keywords: (meta.keywords || []).join(", "),
    articleSection: meta.category,
    wordCount: readTimeMinutes * 200,
  };

  // Breadcrumb structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Articles",
        item: `${BASE_URL}/articles`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: meta.title,
        item: `${BASE_URL}/articles/${meta.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {meta.faqs && meta.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: meta.faqs.map((faq: { question: string; answer: string }) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      )}
      <ArticleLayout meta={meta}>{content}</ArticleLayout>
    </>
  );
}

const getAllArticleSlugs = cache(async () => {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
});

export async function generateStaticParams() {
  return getAllArticleSlugs();
}
