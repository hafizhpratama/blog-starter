"use client";

import { Facebook, Linkedin, Twitter } from "lucide-react";

interface ArticleMeta {
  title: string;
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

export function ArticleLayout({ meta, children }: ArticleLayoutProps) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const articleUrl = `${baseUrl}/articles/${meta.slug}`;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(meta.title)}&url=${encodeURIComponent(articleUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto mt-16 max-w-3xl px-4 py-8 sm:px-6">
        <article className="prose mx-auto dark:prose-invert lg:prose-lg">
          <div className="mb-12 text-center">
            <span className="mb-6 block text-6xl sm:text-7xl">
              {meta.emoji}
            </span>
            <h1 className="mb-4 text-3xl font-bold sm:text-4xl">
              {meta.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>{meta.date}</span>
              <span>•</span>
              <span>{meta.readTime}</span>
              <span>•</span>
              <span>{meta.category}</span>
            </div>

            {/* Social Share Buttons */}
            <div className="mt-6 flex items-center justify-center gap-4">
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
            </div>
          </div>

          <div className="mt-12">{children}</div>
        </article>
      </div>
    </div>
  );
}
