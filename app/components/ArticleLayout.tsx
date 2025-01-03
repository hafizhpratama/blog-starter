"use client";

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
          </div>

          <div className="mt-12">{children}</div>
        </article>
      </div>
    </div>
  );
}
