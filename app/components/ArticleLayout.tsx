'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ArticleMeta {
  title: string;
  date: string;
  readTime: string;
  category: string;
  emoji: string;
}

interface ArticleLayoutProps {
  meta: ArticleMeta;
  children: React.ReactNode;
}

export function ArticleLayout({ meta, children }: ArticleLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 mt-16">
        <article className="prose dark:prose-invert lg:prose-lg mx-auto">
          <div className="text-center mb-12">
            <span className="text-6xl sm:text-7xl mb-6 block">
              {meta.emoji}
            </span>
            <h1 className="text-3xl sm:text-4xl font-semibold mb-4">
              {meta.title}
            </h1>
            <div className="flex flex-wrap justify-center items-center gap-2 text-sm text-muted-foreground">
              <span>{meta.date}</span>
              <span>•</span>
              <span>{meta.readTime}</span>
              <span>•</span>
              <span>{meta.category}</span>
            </div>
          </div>

          <div className="mt-12">{children}</div>
        </article>
      </div>
    </div>
  );
}
