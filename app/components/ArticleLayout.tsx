"use client";

import { Facebook, Linkedin, Twitter } from "lucide-react";

interface ArticleMeta {
  title: string;
  description?: string;
  date: string;
  readTime: string;
  category: string;
  emoji: string;
  slug: string;
}

interface ArticleLayoutProps {
  meta: ArticleMeta;
  children: React.ReactNode;
}

function parseDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date.toISOString();
  }

  // Try to parse "Month Year" format
  const parts = dateStr.split(" ");
  if (parts.length === 2) {
    const monthYear = new Date(`${parts[0]} 1, ${parts[1]}`);
    if (!isNaN(monthYear.getTime())) {
      return monthYear.toISOString();
    }
  }

  return new Date().toISOString();
}

export function ArticleLayout({ meta, children }: ArticleLayoutProps) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const articleUrl = `${baseUrl}/articles/${meta.slug}`;
  const isoDate = parseDate(meta.date);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(meta.title)}&url=${encodeURIComponent(articleUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto mt-8 max-w-3xl px-4 py-8 sm:px-6">
        <article
          className="prose mx-auto dark:prose-invert lg:prose-lg"
          itemScope
          itemType="https://schema.org/BlogPosting"
        >
          {/* Hidden metadata for search engines */}
          <meta itemProp="datePublished" content={isoDate} />
          <meta itemProp="dateModified" content={isoDate} />
          <meta itemProp="author" content="Hafizh Pratama" />
          {meta.description && (
            <meta itemProp="description" content={meta.description} />
          )}

          <header className="mb-12 text-center">
            <span
              className="mb-6 block text-6xl sm:text-7xl"
              role="img"
              aria-label="Article emoji"
            >
              {meta.emoji}
            </span>
            <h1
              itemProp="headline"
              className="mb-4 text-3xl font-bold sm:text-4xl"
            >
              {meta.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
              <time dateTime={isoDate} itemProp="datePublished">
                {meta.date}
              </time>
              <span aria-hidden="true">•</span>
              <span>{meta.readTime}</span>
              <span aria-hidden="true">•</span>
              <span itemProp="articleSection">{meta.category}</span>
            </div>

            {/* Social Share Buttons */}
            <nav
              aria-label="Share this article"
              className="mt-6 flex items-center justify-center gap-4"
            >
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                aria-label="Share on X (Twitter)"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                aria-label="Share on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </nav>
          </header>

          <div itemProp="articleBody" className="mt-12">
            {children}
          </div>

          <footer className="mt-12 border-t pt-8">
            <div
              itemProp="author"
              itemScope
              itemType="https://schema.org/Person"
              className="text-center text-sm text-muted-foreground"
            >
              <p>
                Written by{" "}
                <span itemProp="name" className="font-semibold text-foreground">
                  Hafizh Pratama
                </span>
              </p>
              <p itemProp="jobTitle">Software Engineer</p>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}
