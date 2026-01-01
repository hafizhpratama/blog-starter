/**
 * AI Article Generator Configuration
 * God-tier SEO-optimized content automation
 */

export const CONFIG = {
  // OpenRouter API Configuration
  // Optimized for free tier (50 requests/day limit)
  // Models selected for GOD-LEVEL article writing & storytelling
  openRouter: {
    baseUrl: "https://openrouter.ai/api/v1",
    // Model fallback chain - 10 models for maximum availability
    // Ordered by writing quality, with less popular models as deep fallbacks
    models: [
      "google/gemini-2.0-flash-exp:free",             // Primary: 1M context, excellent writing
      "meta-llama/llama-3.3-70b-instruct:free",       // Fallback 1: 70B, great narratives
      "google/gemma-3-27b-it:free",                   // Fallback 2: 131K, multilingual
      "mistralai/mistral-small-3.1-24b-instruct:free", // Fallback 3: Balanced, stable
      "deepseek/deepseek-r1-0528:free",               // Fallback 4: Reasoning + writing
      "openai/gpt-oss-120b:free",                     // Fallback 5: 120B MoE model
      "qwen/qwen3-coder:free",                        // Fallback 6: 262K context (can write too)
      "z-ai/glm-4.5-air:free",                        // Fallback 7: Less popular, often available
      "tngtech/deepseek-r1t-chimera:free",            // Fallback 8: Merged model, creative
      "google/gemma-3-12b-it:free",                   // Fallback 9: Smaller but fast
    ],
    maxTokens: 8000,
    temperature: 0.75, // Slightly higher for more creative output
    // Wait time in seconds when ALL models are rate limited
    rateLimitWaitSeconds: 90,
  },

  // Quota Management (for free tier optimization)
  quota: {
    dailyLimit: 50,              // OpenRouter free tier limit
    reservedPerArticle: 15,      // Reserve enough for retries
    maxRetriesPerCall: 1,        // Reduced from 2 to conserve quota
    maxGlobalRetries: 1,         // Reduced from 2 to conserve quota
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
