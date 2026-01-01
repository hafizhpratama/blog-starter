/**
 * Fully Automated AI Article Generator
 *
 * Every run:
 * 1. Picks random categories based on weights
 * 2. AI generates fresh unique topics (checks existing articles)
 * 3. Multi-step content generation for quality
 * 4. Saves articles with proper metadata
 *
 * Uses DeepSeek R1 FREE via OpenRouter
 *
 * Usage:
 *   npx ts-node scripts/generate-articles.ts
 *   npm run generate:articles
 */

import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { CONFIG, Category } from './config';
import { PROMPTS } from './prompts';

// Types
interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface ArticleMetadata {
  title: string;
  description: string;
  slug: string;
  keywords: string[];
  readTime: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface GeneratedTopic {
  title: string;
  targetKeyword: string;
  searchIntent: string;
  difficulty: string;
  category: string;
}

// Rate limiting for free tier
const RATE_LIMIT_DELAY = 2000; // Reduced from 3000ms for efficiency

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Track which model is currently working best
let currentModelIndex = 0;

// Quota tracking for free tier (50 requests/day)
let apiCallCount = 0;
const QUOTA_WARNING_THRESHOLD = 40; // Warn when approaching limit

function trackApiCall(): void {
  apiCallCount++;
  if (apiCallCount >= QUOTA_WARNING_THRESHOLD) {
    console.log(`    ⚠️ Quota usage: ${apiCallCount}/${CONFIG.quota.dailyLimit} requests`);
  }
}

function canMakeApiCall(): boolean {
  return apiCallCount < CONFIG.quota.dailyLimit - 5; // Keep 5 as emergency buffer
}

// OpenRouter API call with model fallback chain and rate limit recovery
// Optimized for free tier quota conservation
async function callOpenRouter(
  prompt: string,
  maxTokens: number = CONFIG.openRouter.maxTokens,
  retriesPerModel: number = CONFIG.quota.maxRetriesPerCall,
  globalRetries: number = CONFIG.quota.maxGlobalRetries
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY environment variable is required');
  }

  // Check quota before making call
  if (!canMakeApiCall()) {
    throw new Error(`Quota limit approaching (${apiCallCount}/${CONFIG.quota.dailyLimit}). Aborting to preserve quota for next run.`);
  }

  const models = CONFIG.openRouter.models;

  for (let globalAttempt = 1; globalAttempt <= globalRetries; globalAttempt++) {
    const errors: string[] = [];
    let allRateLimited = true;

    // Start from current best model, then try others
    for (let modelOffset = 0; modelOffset < models.length; modelOffset++) {
      const modelIndex = (currentModelIndex + modelOffset) % models.length;
      const model = models[modelIndex];

      for (let attempt = 1; attempt <= retriesPerModel; attempt++) {
        try {
          // Track API call before making request
          trackApiCall();

          const response = await fetch(`${CONFIG.openRouter.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': process.env.SITE_URL || 'https://hafizh.cloudhej.com',
              'X-Title': 'Blog Article Generator',
            },
            body: JSON.stringify({
              model: model,
              messages: [
                {
                  role: 'system',
                  content: `You are a world-class journalist and storyteller with deep domain expertise. Your writing captivates readers from the first sentence. You craft narratives that are insightful, authoritative, and impossible to stop reading. Write with vivid examples, compelling hooks, and expert analysis. Output exactly what is requested - NO thinking tags, NO preamble. Create comprehensive 2500+ word masterpieces.`,
                },
                {
                  role: 'user',
                  content: prompt,
                },
              ],
              max_tokens: maxTokens,
              temperature: CONFIG.openRouter.temperature,
            }),
          });

          if (response.status === 429) {
            console.log(`    ⏳ Rate limited on ${model.split('/')[1]}. Trying next model...`);
            errors.push(`${model}: Rate limited`);
            break; // Try next model immediately
          }

          // Not rate limited - mark this
          allRateLimited = false;

          if (!response.ok) {
            const error = await response.text();
            errors.push(`${model}: ${response.status} - ${error.slice(0, 100)}`);
            throw new Error(`API error: ${response.status}`);
          }

          const data = (await response.json()) as OpenRouterResponse;
          const content = data.choices[0]?.message?.content || '';

          if (!content || content.trim().length < 50) {
            errors.push(`${model}: Empty or too short response`);
            if (attempt < retriesPerModel) {
              await delay(3000);
              continue;
            }
            break; // Try next model
          }

          // Success! Update current best model
          if (modelOffset > 0) {
            console.log(`    ✓ Switched to ${model.split('/')[1]} (was failing on previous)`);
            currentModelIndex = modelIndex;
          }

          await delay(RATE_LIMIT_DELAY);
          return content;
        } catch (error) {
          allRateLimited = false; // Error is not rate limit
          const msg = error instanceof Error ? error.message : 'Unknown error';
          if (!errors.includes(`${model}: ${msg}`)) {
            errors.push(`${model}: ${msg}`);
          }
          if (attempt < retriesPerModel) {
            await delay(3000);
          }
        }
      }
    }

    // If ALL models were rate limited, wait and retry entire chain
    if (allRateLimited && globalAttempt < globalRetries) {
      const waitSeconds = CONFIG.openRouter.rateLimitWaitSeconds;
      console.log(`    ⏳ All models rate limited. Waiting ${waitSeconds}s for reset...`);
      await delay(waitSeconds * 1000);
      console.log(`    🔄 Retrying all models...`);
      continue;
    }

    // Not all rate limited, or last attempt - throw error
    throw new Error(`All models failed:\n${errors.map(e => `  - ${e}`).join('\n')}`);
  }

  throw new Error('All retry attempts exhausted');
}

// Parse JSON from AI response
function parseJsonResponse<T>(response: string): T {
  if (!response || response.trim() === '') {
    throw new Error('Empty response received from API');
  }

  let cleaned = response.trim();

  // Remove thinking/reasoning tags that some models add
  cleaned = cleaned
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
    .replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, '')
    .trim();

  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }

  const jsonMatch = cleaned.match(/[\[{][\s\S]*[\]}]/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  if (!cleaned || cleaned.trim() === '') {
    throw new Error('No JSON content found in response');
  }

  try {
    return JSON.parse(cleaned.trim());
  } catch (e) {
    throw new Error(`Failed to parse JSON: ${cleaned.slice(0, 200)}...`);
  }
}

// Get weighted random category
function getRandomCategory(): Category {
  const totalWeight = CONFIG.categories.reduce((sum, cat) => sum + cat.weight, 0);
  let random = Math.random() * totalWeight;

  for (const category of CONFIG.categories) {
    random -= category.weight;
    if (random <= 0) {
      return category;
    }
  }

  return CONFIG.categories[0];
}

// Get existing article slugs to avoid duplicates
function getExistingArticleSlugs(): string[] {
  const articlesDir = path.join(process.cwd(), CONFIG.paths.articlesDir);

  if (!fs.existsSync(articlesDir)) {
    return [];
  }

  return fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace('.mdx', ''));
}

// Get existing article titles
function getExistingArticleTitles(): string[] {
  const articlesDir = path.join(process.cwd(), CONFIG.paths.articlesDir);

  if (!fs.existsSync(articlesDir)) {
    return [];
  }

  const files = fs.readdirSync(articlesDir);
  const titles: string[] = [];

  for (const file of files) {
    if (file.endsWith('.mdx')) {
      const content = fs.readFileSync(path.join(articlesDir, file), 'utf-8');
      const titleMatch = content.match(/title:\s*["'](.+)["']/);
      if (titleMatch) {
        titles.push(titleMatch[1]);
      }
    }
  }

  return titles;
}

// Get related articles for internal linking
function getRelatedArticles(): string[] {
  const articlesDir = path.join(process.cwd(), CONFIG.paths.articlesDir);

  if (!fs.existsSync(articlesDir)) {
    return [];
  }

  const files = fs.readdirSync(articlesDir);
  const articles: string[] = [];

  for (const file of files.slice(0, 10)) {
    if (file.endsWith('.mdx')) {
      const content = fs.readFileSync(path.join(articlesDir, file), 'utf-8');
      const titleMatch = content.match(/title:\s*["'](.+)["']/);
      if (titleMatch) {
        articles.push(titleMatch[1]);
      }
    }
  }

  return articles;
}

// Generate fresh unique topic using AI
async function generateFreshTopic(category: Category, existingTitles: string[], retries: number = 3): Promise<GeneratedTopic> {
  console.log(`    🎲 Generating fresh topic for: ${category.name}...`);

  const prompt = `You are a trend analyst specializing in ${category.name}. Generate ONE unique article topic.

REQUIREMENTS:
- Must be highly searchable (real keyword people search for)
- Must be timely and relevant for 2025
- Must NOT be similar to any existing topics below
- Must provide real value to readers

EXISTING ARTICLES TO AVOID (do not create similar topics):
${existingTitles.slice(0, 30).map((t) => `- ${t}`).join('\n')}

Content types to choose from:
- "How to" guides (educational)
- "What is" explainers (informational)
- "X vs Y" comparisons (commercial)
- "Best/Top" lists (transactional)
- News analysis, predictions, or trends (timely)

OUTPUT FORMAT (JSON object):
{
  "title": "Compelling Article Title (include keyword, max 60 chars)",
  "targetKeyword": "primary search keyword",
  "searchIntent": "informational|transactional|commercial",
  "difficulty": "low|medium|high",
  "category": "${category.name}"
}

Generate exactly 1 topic. Output ONLY valid JSON, no thinking or reasoning tags.`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await callOpenRouter(prompt, 800);
      const topic = parseJsonResponse<GeneratedTopic>(response);

      console.log(`    ✓ Topic: ${topic.title}`);
      return topic;
    } catch (error) {
      console.log(`    ⚠️ Topic generation attempt ${attempt}/${retries} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      if (attempt < retries) {
        console.log(`    ⏳ Waiting 5 seconds before retry...`);
        await delay(5000);
      } else {
        throw error;
      }
    }
  }

  throw new Error('All topic generation attempts failed');
}

// OPTIMIZED STEP 1: Combined Research + Outline (saves 1 API call)
async function conductResearchAndOutline(topic: GeneratedTopic): Promise<string> {
  console.log('    📚 Step 1/3: Research + Outline (combined)...');
  const prompt = PROMPTS.researchAndOutline(topic.title, topic.category, topic.targetKeyword);
  const researchAndOutline = await callOpenRouter(prompt, 5000);
  console.log('    ✓ Research & outline complete');
  return researchAndOutline;
}

// Legacy functions kept for backwards compatibility
async function conductResearch(topic: GeneratedTopic): Promise<string> {
  return conductResearchAndOutline(topic);
}

async function createOutline(topic: GeneratedTopic, research: string): Promise<string> {
  // When using combined approach, research already includes outline
  return research;
}

// OPTIMIZED STEP 2: Generate Article Content
async function generateArticleContent(
  topic: GeneratedTopic,
  researchAndOutline: string,
  _outline?: string // Optional for backwards compatibility
): Promise<string> {
  console.log('    ✍️  Step 2/3: Writing article...');

  const relatedArticles = getRelatedArticles();
  const prompt = PROMPTS.articleGeneration(
    topic.title,
    topic.targetKeyword,
    topic.category,
    researchAndOutline,
    researchAndOutline, // Use combined research+outline
    relatedArticles
  );

  const content = await callOpenRouter(prompt, 8000);
  console.log('    ✓ Article written');
  return content;
}

// Interface for combined FAQ + Metadata response
interface FAQAndMetadataResponse {
  metadata: ArticleMetadata;
  faqs: FAQ[];
}

// OPTIMIZED STEP 3: Combined FAQ + Metadata (saves 1 API call)
async function generateFAQAndMetadata(
  topic: GeneratedTopic,
  content: string
): Promise<{ faqs: FAQ[]; metadata: ArticleMetadata }> {
  console.log('    🎯 Step 3/3: FAQ + Metadata (combined)...');

  const prompt = PROMPTS.faqAndMetadata(topic.title, topic.targetKeyword, content);
  const response = await callOpenRouter(prompt, 2500);

  try {
    const parsed = parseJsonResponse<FAQAndMetadataResponse>(response);
    console.log(`    ✓ Generated ${parsed.faqs.length} FAQs + metadata`);
    return {
      faqs: parsed.faqs,
      metadata: parsed.metadata,
    };
  } catch {
    console.log('    ⚠️ Combined parsing failed, using defaults');
    return {
      faqs: [
        {
          question: `What is ${topic.targetKeyword}?`,
          answer: `${topic.targetKeyword} refers to the main concept covered in this comprehensive guide.`,
        },
      ],
      metadata: {
        title: topic.title.slice(0, 60),
        description: `Comprehensive guide to ${topic.targetKeyword}. Learn everything you need to know.`,
        slug: topic.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60),
        keywords: [topic.targetKeyword, topic.category.toLowerCase()],
        readTime: '12 min read',
      },
    };
  }
}

// Legacy functions kept for backwards compatibility
async function generateFAQ(topic: GeneratedTopic, content: string): Promise<FAQ[]> {
  const result = await generateFAQAndMetadata(topic, content);
  return result.faqs;
}

async function generateMetadata(content: string, topic: GeneratedTopic): Promise<ArticleMetadata> {
  // This is only called in legacy mode - normally generateFAQAndMetadata is used
  console.log('    🎯 Generating metadata...');
  const prompt = PROMPTS.metadataGeneration(content, topic.title, topic.targetKeyword);
  const response = await callOpenRouter(prompt, 1000);

  try {
    const metadata = parseJsonResponse<ArticleMetadata>(response);
    console.log(`    ✓ Metadata: ${metadata.slug}`);
    return metadata;
  } catch {
    console.log('    ⚠️ Metadata parsing failed, generating from topic');
    return {
      title: topic.title.slice(0, 60),
      description: `Comprehensive guide to ${topic.targetKeyword}. Learn everything you need to know.`,
      slug: topic.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 60),
      keywords: [topic.targetKeyword, topic.category.toLowerCase()],
      readTime: '12 min read',
    };
  }
}

// Get category emoji
function getCategoryEmoji(category: string): string {
  const cat = CONFIG.categories.find(
    (c) => c.name.toLowerCase() === category.toLowerCase()
  );
  return cat?.emoji || '📝';
}

// Format current date
function formatDate(): string {
  const now = new Date();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${months[now.getMonth()]} ${now.getFullYear()}`;
}

// Count words
function countWords(content: string): number {
  return content.split(/\s+/).filter(Boolean).length;
}

// Validation result interface
interface ValidationResult {
  valid: boolean;
  issues: string[];
  warnings: string[];
}

// Validate article content before saving
function validateArticleContent(
  content: string,
  metadata: ArticleMetadata,
  faqs: FAQ[]
): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];

  // 1. Check word count - STRICT: minimum 1500 words for quality
  const wordCount = countWords(content);
  const minAcceptable = 1500; // Hard minimum for quality articles
  if (wordCount < minAcceptable) {
    issues.push(`Content too short: ${wordCount} words (min ${minAcceptable})`);
  } else if (wordCount < CONFIG.content.minWordCount) {
    warnings.push(`Content below target: ${wordCount} words (target ${CONFIG.content.minWordCount})`);
  }

  // 2. Check metadata
  if (!metadata.title || metadata.title.length < 10) {
    issues.push('Title missing or too short');
  }
  if (!metadata.slug || metadata.slug.length < 5) {
    issues.push('Slug missing or too short');
  }
  if (!metadata.description || metadata.description.length < 50) {
    warnings.push('Description missing or too short');
  }
  if (!metadata.keywords || metadata.keywords.length < 2) {
    warnings.push('Not enough keywords');
  }

  // 3. Check FAQs
  if (faqs.length === 0) {
    warnings.push('No FAQs generated');
  }

  // 4. Check for broken markdown
  const unclosedCodeBlocks = (content.match(/```/g) || []).length % 2 !== 0;
  if (unclosedCodeBlocks) {
    warnings.push('Unclosed code block detected');
  }

  // 5. Check for leftover thinking tags (shouldn't happen after sanitization)
  if (/<think|<thinking|<reasoning/i.test(content)) {
    warnings.push('AI thinking tags not fully removed');
  }

  // 6. Check content has actual structure
  const hasHeadings = /^##\s+/m.test(content);
  if (!hasHeadings) {
    issues.push('No H2 headings found in content');
  }

  return {
    valid: issues.length === 0,
    issues,
    warnings,
  };
}

// Verify MDX file can be parsed
function verifyMDXFile(filePath: string): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];

  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Check frontmatter exists
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      issues.push('No valid frontmatter found');
    } else {
      const frontmatter = frontmatterMatch[1];

      // Check required fields
      const requiredFields = ['title', 'description', 'date', 'slug', 'category'];
      for (const field of requiredFields) {
        if (!new RegExp(`^${field}:`, 'm').test(frontmatter)) {
          issues.push(`Missing frontmatter field: ${field}`);
        }
      }

      // Check for YAML syntax errors (common ones)
      if (/: {2,}/.test(frontmatter)) {
        warnings.push('Possible YAML formatting issue (extra spaces after colon)');
      }
    }

    // Check file size (sanity check)
    const stats = fs.statSync(filePath);
    if (stats.size < 1000) {
      warnings.push(`File seems small: ${stats.size} bytes`);
    }

  } catch (error) {
    issues.push(`File read error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }

  return {
    valid: issues.length === 0,
    issues,
    warnings,
  };
}

// Fix tables in lists
function fixTablesInLists(content: string): string {
  const lines = content.split('\n');
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const isListItem = /^(\s*)[-*\d.]+\s/.test(line);
    const nextLineIsTable = lines[i + 1] && /^\s*\|/.test(lines[i + 1]);

    if (isListItem && nextLineIsTable) {
      result.push(line);
      result.push('');

      const tableLines: string[] = [];
      let j = i + 1;
      while (j < lines.length && (lines[j].trim().startsWith('|') || lines[j].trim() === '')) {
        if (lines[j].trim().startsWith('|')) {
          tableLines.push(lines[j].trim());
        }
        j++;
      }

      if (tableLines.length > 0) {
        result.push(...tableLines);
        result.push('');
      }

      i = j;
    } else {
      result.push(line);
      i++;
    }
  }

  return result.join('\n');
}

// Fix markdown tables
function fixMarkdownTables(content: string): string {
  const lines = content.split('\n');
  const result: string[] = [];
  let inTable = false;
  let tableColumnCount = 0;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const prevLine = result[result.length - 1] || '';
    const isSeparator = /^\|?[\s-:|]+\|[\s-:|]+\|?$/.test(line.trim());
    const isTableRow = (line.trim().startsWith('|') || (line.split('|').length > 2)) && !line.startsWith('```');
    const nextLineIsSeparator = lines[i + 1] && /^\|?[\s-:|]+\|[\s-:|]+\|?$/.test(lines[i + 1].trim());

    if (isSeparator) {
      inTable = true;
      const parts = line.split('|').filter(p => p.trim() !== '' || line.startsWith('|'));
      const separatorParts = parts.map(() => '---');

      if (tableColumnCount > 0) {
        while (separatorParts.length < tableColumnCount) {
          separatorParts.push('---');
        }
      }
      line = '| ' + separatorParts.slice(0, tableColumnCount || separatorParts.length).join(' | ') + ' |';
      if (tableColumnCount === 0) tableColumnCount = separatorParts.length;

    } else if (isTableRow && (inTable || nextLineIsSeparator)) {
      if (!inTable && prevLine.trim() !== '' && !prevLine.trim().startsWith('|')) {
        result.push('');
      }

      inTable = true;
      let trimmedLine = line.trim();

      if (trimmedLine.startsWith('|')) trimmedLine = trimmedLine.slice(1);
      if (trimmedLine.endsWith('|')) trimmedLine = trimmedLine.slice(0, -1);

      const cells = trimmedLine.split('|').map(cell => cell.trim());

      if (tableColumnCount === 0) {
        tableColumnCount = cells.length;
      }

      while (cells.length < tableColumnCount) {
        cells.push('');
      }

      line = '| ' + cells.slice(0, tableColumnCount).join(' | ') + ' |';

    } else if (inTable && line.trim() === '') {
      inTable = false;
      tableColumnCount = 0;
    } else if (inTable && !isTableRow) {
      inTable = false;
      tableColumnCount = 0;
      if (prevLine.trim() !== '') {
        result.push('');
      }
    }

    result.push(line);
  }

  return result.join('\n');
}

// Sanitize MDX content
function sanitizeMDXContent(content: string): string {
  let sanitized = content
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
    .replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, '')
    .replace(/<reflection>[\s\S]*?<\/reflection>/gi, '')
    .replace(/<output>[\s\S]*?<\/output>/gi, (match) => {
      return match.replace(/<\/?output>/gi, '');
    });

  const codeBlocks: string[] = [];
  sanitized = sanitized.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  const inlineCode: string[] = [];
  sanitized = sanitized.replace(/`[^`]+`/g, (match) => {
    inlineCode.push(match);
    return `__INLINE_CODE_${inlineCode.length - 1}__`;
  });

  sanitized = sanitized
    .replace(/<(\d+)/g, 'less than $1')
    .replace(/>(\d+)/g, 'greater than $1')
    .replace(/<=\s*(\d+)/g, '≤$1')
    .replace(/>=\s*(\d+)/g, '≥$1')
    .replace(/\|\s*<(\d)/g, '| less than $1')
    .replace(/\|\s*>(\d)/g, '| greater than $1')
    .replace(/(\s)<(\s)/g, '$1&lt;$2')
    .replace(/(\s)>(\s)/g, '$1&gt;$2')
    .replace(/\s->\s/g, ' → ')
    .replace(/\s<-\s/g, ' ← ')
    .replace(/\n{4,}/g, '\n\n\n')
    .replace(/[ \t]+$/gm, '');

  codeBlocks.forEach((block, i) => {
    sanitized = sanitized.replace(`__CODE_BLOCK_${i}__`, block);
  });

  inlineCode.forEach((code, i) => {
    sanitized = sanitized.replace(`__INLINE_CODE_${i}__`, code);
  });

  sanitized = fixTablesInLists(sanitized);
  sanitized = fixMarkdownTables(sanitized);

  return sanitized.trim();
}

// Create MDX file content
function createMDXContent(
  metadata: ArticleMetadata,
  content: string,
  faqs: FAQ[],
  category: string
): string {
  const emoji = getCategoryEmoji(category);
  const date = formatDate();

  const faqsYaml = faqs
    .map((faq) => {
      const question = faq.question
        .replace(/"/g, "'")
        .replace(/\n/g, ' ')
        .replace(/<(\d)/g, 'less than $1')
        .replace(/>(\d)/g, 'greater than $1')
        .trim();
      const answer = faq.answer
        .replace(/"/g, "'")
        .replace(/\n/g, ' ')
        .replace(/<(\d)/g, 'less than $1')
        .replace(/>(\d)/g, 'greater than $1')
        .replace(/:\s*$/g, '.')
        .trim();
      return `  - question: "${question}"\n    answer: "${answer}"`;
    })
    .join('\n');

  return `---
title: "${metadata.title.replace(/"/g, '\\"')}"
description: "${metadata.description.replace(/"/g, '\\"')}"
date: "${date}"
readTime: "${metadata.readTime}"
category: "${category}"
emoji: "${emoji}"
slug: "${metadata.slug}"
keywords: [${metadata.keywords.map((k) => `"${k}"`).join(', ')}]
faqs:
${faqsYaml}
---

${sanitizeMDXContent(content)}
`;
}

// Check if slug already exists
function slugExists(slug: string): boolean {
  const existingSlugs = getExistingArticleSlugs();
  return existingSlugs.includes(slug);
}

// Save article
function saveArticle(slug: string, content: string): string {
  const articlesDir = path.join(process.cwd(), CONFIG.paths.articlesDir);

  if (!fs.existsSync(articlesDir)) {
    fs.mkdirSync(articlesDir, { recursive: true });
  }

  const filePath = path.join(articlesDir, `${slug}.mdx`);
  fs.writeFileSync(filePath, content);

  return filePath;
}

// Article result tracking
interface ArticleResult {
  index: number;
  category: string;
  title: string;
  slug: string;
  status: 'success' | 'failed' | 'invalid';
  wordCount: number;
  filePath?: string;
  error?: string;
  warnings: string[];
  model: string;
}

// Main generation function
async function generateArticles(): Promise<void> {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║       🚀 OPTIMIZED AI ARTICLE GENERATOR v2.0 🚀               ║
║                                                               ║
║  Free-tier optimized (50 req/day limit):                      ║
║  1. Topic generation (1 API call)                             ║
║  2. Research + Outline combined (1 API call)                  ║
║  3. Article writing (1 API call)                              ║
║  4. FAQ + Metadata combined (1 API call)                      ║
║  = Only 4 API calls per article (was 6)                       ║
║  + Smart quota tracking + Model fallback chain                ║
╚═══════════════════════════════════════════════════════════════╝
`);

  console.log(`📅 Date: ${new Date().toISOString()}`);
  console.log(`🤖 Models: ${CONFIG.openRouter.models.length} in fallback chain`);
  console.log(`   Primary: ${CONFIG.openRouter.models[0]}`);
  console.log(`📝 Articles per run: ${CONFIG.content.articlesPerRun}`);
  console.log(`📊 Daily quota: ${CONFIG.quota.dailyLimit} requests (free tier)`);
  console.log(`   Reserved per article: ~${CONFIG.quota.reservedPerArticle} requests\n`);

  const existingTitles = getExistingArticleTitles();
  console.log(`📚 Existing articles: ${existingTitles.length}\n`);

  const results: ArticleResult[] = [];
  const MAX_RETRIES_PER_ARTICLE = 3;

  for (let i = 0; i < CONFIG.content.articlesPerRun; i++) {
    const category = getRandomCategory();
    let articleSuccess = false;
    let lastError = '';

    console.log(`
┌───────────────────────────────────────────────────────────────┐
│ 📝 ARTICLE ${i + 1}/${CONFIG.content.articlesPerRun}: ${category.name.padEnd(43)}│
└───────────────────────────────────────────────────────────────┘
`);

    // Retry loop for each article
    for (let attempt = 1; attempt <= MAX_RETRIES_PER_ARTICLE && !articleSuccess; attempt++) {
      if (attempt > 1) {
        console.log(`\n    🔄 Retry attempt ${attempt}/${MAX_RETRIES_PER_ARTICLE}...`);
        await delay(5000);
      }

      try {
        // Check quota before starting
        if (!canMakeApiCall()) {
          console.log('    ⚠️ Quota limit approaching. Stopping to preserve quota for next run.');
          break;
        }

        // Generate fresh unique topic (1 API call)
        const topic = await generateFreshTopic(category, existingTitles);

        // OPTIMIZED 3-step generation (was 5 steps, now 3)
        // Step 1: Combined Research + Outline (1 API call - saves 1 call)
        const researchAndOutline = await conductResearchAndOutline(topic);

        // Step 2: Article content (1 API call)
        const content = await generateArticleContent(topic, researchAndOutline);

        // Step 3: Combined FAQ + Metadata (1 API call - saves 1 call)
        const { faqs, metadata } = await generateFAQAndMetadata(topic, content);

        console.log(`    📊 API calls used: ${apiCallCount}/${CONFIG.quota.dailyLimit}`);

        // PRE-SAVE VALIDATION
        console.log('\n    🔍 Validating content...');
        const validation = validateArticleContent(content, metadata, faqs);

        if (!validation.valid) {
          console.log(`    ❌ Validation failed:`);
          validation.issues.forEach(issue => console.log(`       - ${issue}`));
          lastError = `Validation: ${validation.issues.join(', ')}`;
          continue; // Try again
        }

        if (validation.warnings.length > 0) {
          console.log(`    ⚠️ Warnings:`);
          validation.warnings.forEach(warn => console.log(`       - ${warn}`));
        }

        // Check for duplicate slug
        if (slugExists(metadata.slug)) {
          console.log(`    ⚠️ Slug "${metadata.slug}" exists, adding timestamp...`);
          metadata.slug = `${metadata.slug}-${Date.now()}`;
        }

        const wordCount = countWords(content);
        console.log(`    📊 Word count: ${wordCount}`);

        // Save article
        const mdxContent = createMDXContent(metadata, content, faqs, topic.category);
        const filePath = saveArticle(metadata.slug, mdxContent);
        console.log(`    💾 Saved: ${filePath}`);

        // POST-SAVE VERIFICATION
        console.log('    🔎 Verifying saved file...');
        const fileVerification = verifyMDXFile(filePath);

        if (!fileVerification.valid) {
          console.log(`    ❌ File verification failed:`);
          fileVerification.issues.forEach(issue => console.log(`       - ${issue}`));
          // Delete invalid file
          fs.unlinkSync(filePath);
          console.log(`    🗑️ Deleted invalid file`);
          lastError = `File verification: ${fileVerification.issues.join(', ')}`;
          continue; // Try again
        }

        // Add to existing titles to avoid duplicates in same run
        existingTitles.push(topic.title);

        // Track result
        results.push({
          index: i + 1,
          category: category.name,
          title: metadata.title,
          slug: metadata.slug,
          status: 'success',
          wordCount,
          filePath,
          warnings: [...validation.warnings, ...fileVerification.warnings],
          model: CONFIG.openRouter.models[currentModelIndex],
        });

        articleSuccess = true;
        console.log(`\n    ✅ SUCCESS! Article verified and saved.`);

      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        console.error(`\n    ❌ Attempt ${attempt} failed: ${lastError}`);
      }
    }

    // If all retries failed, record failure
    if (!articleSuccess) {
      results.push({
        index: i + 1,
        category: category.name,
        title: 'N/A',
        slug: 'N/A',
        status: 'failed',
        wordCount: 0,
        error: lastError,
        warnings: [],
        model: CONFIG.openRouter.models[currentModelIndex],
      });
    }

    // Delay between articles
    if (i < CONFIG.content.articlesPerRun - 1) {
      console.log('\n    ⏳ Waiting 10 seconds...\n');
      await delay(10000);
    }
  }

  // DETAILED RESULTS REPORT
  const successful = results.filter(r => r.status === 'success');
  const failed = results.filter(r => r.status !== 'success');

  const quotaRemaining = CONFIG.quota.dailyLimit - apiCallCount;
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    🏁 GENERATION COMPLETE                     ║
╠═══════════════════════════════════════════════════════════════╣
║  ✅ Successful: ${String(successful.length).padEnd(46)}║
║  ❌ Failed:     ${String(failed.length).padEnd(46)}║
║  📊 API calls:  ${String(`${apiCallCount} used / ${quotaRemaining} remaining`).padEnd(46)}║
╚═══════════════════════════════════════════════════════════════╝
`);

  // Detailed success report
  if (successful.length > 0) {
    console.log('📋 SUCCESSFUL ARTICLES:');
    console.log('─'.repeat(65));
    for (const result of successful) {
      console.log(`  ${result.index}. ${result.title.slice(0, 50)}`);
      console.log(`     📁 ${result.filePath}`);
      console.log(`     📊 ${result.wordCount} words | Model: ${result.model}`);
      if (result.warnings.length > 0) {
        console.log(`     ⚠️ Warnings: ${result.warnings.join(', ')}`);
      }
      console.log('');
    }
  }

  // Detailed failure report
  if (failed.length > 0) {
    console.log('❌ FAILED ARTICLES:');
    console.log('─'.repeat(65));
    for (const result of failed) {
      console.log(`  ${result.index}. Category: ${result.category}`);
      console.log(`     Error: ${result.error}`);
      console.log('');
    }
  }

  // Final verdict
  if (failed.length === 0) {
    console.log('🎉 100% SUCCESS RATE! All articles generated and verified.\n');
  } else {
    console.log(`⚠️ ${successful.length}/${results.length} articles succeeded.\n`);
  }

  if (successful.length > 0) {
    console.log('🚀 Fresh articles ready! Push to trigger deployment.\n');
  }

  // Exit with error code if any failed (for CI/CD)
  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

// Run
generateArticles().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
