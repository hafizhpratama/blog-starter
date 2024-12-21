import { Metadata } from 'next';
import { getAllArticles } from '../lib/mdx';
import ArticlesList from './_components/ArticlesList';

export const metadata: Metadata = {
  title: 'Hafizh Pratama | Software Engineer',
  description: 'Technical articles and insights about web development, software engineering, and modern technologies.',
};

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-serif italic mb-12 text-center">
          Articles
        </h2>
        <ArticlesList initialArticles={articles} />
      </div>
    </main>
  );
}
