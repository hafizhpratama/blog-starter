import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getAllArticles, getArticleBySlug } from "../../lib/mdx";
import { ArticleLayout } from "../../components/ArticleLayout";
import { generateOGImageUrl } from "@/lib/utils";

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { meta } = await getArticleBySlug(params.slug);

  const ogImageUrl = await generateOGImageUrl({
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
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/articles/${params.slug}`,
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

  return <ArticleLayout meta={meta}>{content}</ArticleLayout>;
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
