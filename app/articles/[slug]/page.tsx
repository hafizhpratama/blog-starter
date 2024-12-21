import { ArticleLayout } from '@/app/components/ArticleLayout';
import { getAllArticles, getArticleBySlug } from '@/app/lib/mdx';
import { notFound } from 'next/navigation';

interface ArticlePageProps {
  params: {
    slug: string;
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
