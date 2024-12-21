import { ArticleLayout } from '@/app/components/ArticleLayout';
import { getAllArticles, getArticleBySlug } from '@/app/lib/mdx';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { meta } = await getArticleBySlug(params.slug);

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'article',
      publishedTime: meta.date,
      authors: ['Hafizh Pratama'],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  try {
    const { meta, content } = await getArticleBySlug(params.slug);

    return <ArticleLayout meta={meta}>{content}</ArticleLayout>;
  } catch (error) {
    notFound();
  }
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}
