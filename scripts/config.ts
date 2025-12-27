/**
 * AI Article Generator Configuration
 * God-tier SEO-optimized content automation
 */

export const CONFIG = {
  // OpenRouter API Configuration
  openRouter: {
    baseUrl: "https://openrouter.ai/api/v1",
    model: "deepseek/deepseek-r1-0528:free", // DeepSeek V3 FREE tier
    maxTokens: 8000,
    temperature: 0.7,
  },

  // Content Generation Settings
  content: {
    articlesPerRun: 2,
    minWordCount: 2500, // Long-form for SEO
    maxWordCount: 4000,
    language: "English",
    includeCodeExamples: true,
    includeFAQ: true, // Rich snippets
    faqCount: 5,
  },

  // SEO Configuration
  seo: {
    keywordsPerArticle: 8,
    metaDescriptionLength: 155,
    titleMaxLength: 60,
  },

  // Topic Categories with weights (higher = more frequent)
  categories: [
    { name: "Artificial Intelligence", weight: 30, emoji: "🤖" },
    { name: "Cryptocurrency", weight: 25, emoji: "₿" },
    { name: "Technology", weight: 20, emoji: "💻" },
    { name: "Finance", weight: 15, emoji: "📈" },
    { name: "Web3", weight: 10, emoji: "🌐" },
  ],

  // Author Information
  author: {
    name: "Hafizh Pratama",
    email: "hafizhpratama99@gmail.com",
  },

  // File Paths
  paths: {
    articlesDir: "content/articles",
  },
} as const;

export type Category = (typeof CONFIG.categories)[number];
