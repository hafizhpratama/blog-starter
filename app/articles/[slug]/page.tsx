import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getAllArticles, getArticleBySlug } from "../../lib/mdx";
import { ArticleLayout } from "../../components/ArticleLayout";

const getMetadata = cache(async (slug: string) => {
  const { meta } = await getArticleBySlug(slug);

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      publishedTime: meta.date,
      authors: ["Hafizh Pratama"],
      images: ["https://hafizh.pages.dev/thumbnail.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["https://hafizh.pages.dev/thumbnail.png"],
    },
    keywords: meta.keywords,
    authors: [{ name: "Hafizh Pratama" }],
    creator: "Hafizh Pratama",
    alternates: {
      canonical: `https://hafizh.pages.dev/articles/${slug}`,
    },
  } as Metadata;
});

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

export async function generateMetadata({ params }: ArticlePageProps) {
  return getMetadata(params.slug);
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
