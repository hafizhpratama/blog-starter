/**
 * AI Article Generator Configuration
 * God-tier SEO-optimized content automation
 */

export const CONFIG = {
  // OpenRouter API Configuration
  openRouter: {
    baseUrl: "https://openrouter.ai/api/v1",
    // Model fallback chain - tries each model in order until one succeeds
    models: [
      "deepseek/deepseek-r1-0528:free",           // Primary: DeepSeek R1 FREE (best quality)
      "meta-llama/llama-3.3-70b-instruct:free",   // Fallback 1: Llama 3.3 70B FREE
      "google/gemini-2.0-flash-exp:free",         // Fallback 2: Gemini 2.0 Flash FREE
      "qwen/qwen-2.5-72b-instruct:free",          // Fallback 3: Qwen 2.5 72B FREE
      "mistralai/mistral-small-3.1-24b-instruct:free", // Fallback 4: Mistral Small FREE
    ],
    maxTokens: 8000,
    temperature: 0.7,
    // Wait time in seconds when ALL models are rate limited
    rateLimitWaitSeconds: 120,
  },

  // Content Generation Settings
  content: {
    articlesPerRun: 1, // Set to 1 for reliable free-tier generation (rate limits)
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
