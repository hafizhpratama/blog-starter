export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ArticleMeta {
  title: string;
  description: string;
  date: string;
  dateModified?: string;
  readTime: string;
  category: string;
  emoji: string;
  slug: string;
  keywords: string[];
  faqs?: FAQItem[];
}

export interface SchemaAuthor {
  name: string;
  url: string;
}

export const SCHEMA_CONTEXT = "https://schema.org" as const;

export const AUTHOR = {
  name: "Hafizh Pratama",
  jobTitle: "Software Engineer",
  email: "hafizhpratama99@email.com",
} as const;

export const IMAGE_DIMENSIONS = {
  og: { width: 1200, height: 630 },
  logo: { width: 400, height: 400 },
} as const;
