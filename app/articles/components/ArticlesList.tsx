"use client";

import { useState } from "react";
import { Search } from "lucide-react";
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

  const filteredArticles = initialArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="mb-8">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 pointer-events-none text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl transition-colors
              bg-accent text-foreground
              placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-lg text-muted-foreground">
              No articles found matching your search
            </p>
          </div>
        ) : (
          filteredArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="block rounded-xl p-6 transition-all hover:scale-102 transform
                bg-card text-card-foreground border border-neutral-200
                shadow-sm hover:shadow-md dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600"
            >
              <div className="mb-4">
                <span className="text-4xl">{article.emoji}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-2">
                <div className="flex items-start space-x-4">
                  <div>
                    <span
                      className="inline-block text-sm px-3 py-1 rounded-full mb-2
                      bg-accent text-accent-foreground"
                    >
                      {article.category}
                    </span>
                    <h3 className="text-xl font-semibold">{article.title}</h3>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div>{article.date}</div>
                  <div>{article.readTime}</div>
                </div>
              </div>
              <p className="text-muted-foreground">{article.description}</p>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
