"use client";

import { useState } from "react";
import { Search, Loader2, ChevronDown } from "lucide-react";
import Link from "next/link";

interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  emoji: string;
}

interface ArticlesListProps {
  initialArticles: Article[];
}

export default function ArticlesList({ initialArticles }: ArticlesListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const filteredArticles = initialArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleArticles = filteredArticles.slice(0, visibleCount);
  const hasMoreArticles = visibleCount < filteredArticles.length;
  const remainingCount = filteredArticles.length - visibleCount;

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prevCount) => prevCount + 6);
      setIsLoading(false);
    }, 800);
  };

  return (
    <>
      <div className="mb-8">
        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-4 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl bg-accent py-3 pl-12 pr-4
              text-foreground transition-colors
              placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredArticles.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mb-4 text-4xl">🔍</div>
            <p className="text-lg text-muted-foreground">
              No articles found matching your search
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6">
              {visibleArticles.map((article) => (
                <Link
                  rel="preload"
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="hover:scale-102 block transform rounded-xl border border-neutral-200
                    bg-card p-6 text-card-foreground shadow-sm
                    transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
                >
                  <div className="mb-4">
                    <span className="text-4xl">{article.emoji}</span>
                  </div>
                  <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start space-x-4">
                      <div>
                        <span
                          className="mb-2 inline-block rounded-full bg-accent px-3 py-1
                          text-sm text-accent-foreground"
                        >
                          {article.category}
                        </span>
                        <h3 className="text-xl font-semibold">
                          {article.title}
                        </h3>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>{article.date}</div>
                      <div>{article.readTime}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{article.description}</p>
                </Link>
              ))}
            </div>

            {hasMoreArticles && (
              <div className="relative mt-12 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-full bg-card px-6 py-3
                      text-sm font-medium text-card-foreground shadow-sm
                      ring-1 ring-inset ring-gray-300
                      transition-all hover:bg-accent hover:text-accent-foreground
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      disabled:cursor-not-allowed disabled:opacity-50
                      dark:ring-gray-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        Show {Math.min(remainingCount, 6)} more articles
                        {remainingCount > 6 && ` (${remainingCount} remaining)`}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
