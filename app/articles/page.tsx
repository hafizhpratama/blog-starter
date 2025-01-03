import { getAllArticles } from "../lib/mdx";
import { defaultMetadata } from "../metadata";
import ArticlesList from "./components/ArticlesList";

export const metadata = defaultMetadata;

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  return (
    <main className="px-4 pb-16 pt-24 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-center font-serif text-3xl italic sm:text-4xl">
          Articles
        </h2>
        <ArticlesList initialArticles={articles} />
      </div>
    </main>
  );
}
