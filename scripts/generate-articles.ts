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
const RATE_LIMIT_DELAY = 3000;

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// OpenRouter API call with retry logic
async function callOpenRouter(
  prompt: string,
  maxTokens: number = CONFIG.openRouter.maxTokens,
  retries: number = 3
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY environment variable is required');
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${CONFIG.openRouter.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.SITE_URL || 'https://hafizh.cloudhej.com',
          'X-Title': 'Blog Article Generator',
        },
        body: JSON.stringify({
          model: CONFIG.openRouter.model,
          messages: [
            {
              role: 'system',
              content: `You are a world-class expert combining deep domain knowledge, exceptional writing skills, and elite SEO expertise. You create content that:
- Demonstrates genuine expertise and authority
- Provides unique insights not found elsewhere
- Ranks #1 on Google through superior quality
- Gets cited by AI systems as authoritative sources
Always output exactly what is requested. Be comprehensive, specific, and valuable.`,
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
        console.log(`    ⏳ Rate limited. Waiting 60 seconds... (attempt ${attempt}/${retries})`);
        await delay(60000);
        continue;
      }

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
      }

      const data = (await response.json()) as OpenRouterResponse;
      await delay(RATE_LIMIT_DELAY);
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      if (attempt === retries) throw error;
      console.log(`    ⚠️ Attempt ${attempt} failed. Retrying...`);
      await delay(5000);
    }
  }

  throw new Error('All retry attempts failed');
}

// Parse JSON from AI response
function parseJsonResponse<T>(response: string): T {
  let cleaned = response.trim();

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

  return JSON.parse(cleaned.trim());
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
async function generateFreshTopic(category: Category, existingTitles: string[]): Promise<GeneratedTopic> {
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

Generate exactly 1 topic. Output ONLY valid JSON.`;

  const response = await callOpenRouter(prompt, 500);
  const topic = parseJsonResponse<GeneratedTopic>(response);

  console.log(`    ✓ Topic: ${topic.title}`);
  return topic;
}

// STEP 1: Deep Research
async function conductResearch(topic: GeneratedTopic): Promise<string> {
  console.log('    📚 Step 1/5: Conducting deep research...');
  const prompt = PROMPTS.deepResearch(topic.title, topic.category);
  const research = await callOpenRouter(prompt, 4000);
  console.log('    ✓ Research complete');
  return research;
}

// STEP 2: Strategic Outline
async function createOutline(topic: GeneratedTopic, research: string): Promise<string> {
  console.log('    📋 Step 2/5: Creating strategic outline...');
  const prompt = PROMPTS.strategicOutline(topic.title, research, topic.targetKeyword);
  const outline = await callOpenRouter(prompt, 3000);
  console.log('    ✓ Outline complete');
  return outline;
}

// STEP 3: Generate Article Content
async function generateArticleContent(
  topic: GeneratedTopic,
  research: string,
  outline: string
): Promise<string> {
  console.log('    ✍️  Step 3/5: Writing article...');

  const relatedArticles = getRelatedArticles();
  const prompt = PROMPTS.articleGeneration(
    topic.title,
    topic.targetKeyword,
    topic.category,
    research,
    outline,
    relatedArticles
  );

  const content = await callOpenRouter(prompt, 8000);
  console.log('    ✓ Article written');
  return content;
}

// STEP 4: Generate FAQ
async function generateFAQ(topic: GeneratedTopic, content: string): Promise<FAQ[]> {
  console.log('    ❓ Step 4/5: Generating FAQ...');

  const prompt = PROMPTS.faqGeneration(topic.title, topic.targetKeyword, content);
  const response = await callOpenRouter(prompt, 2000);

  try {
    const faqs = parseJsonResponse<FAQ[]>(response);
    console.log(`    ✓ Generated ${faqs.length} FAQs`);
    return faqs;
  } catch {
    console.log('    ⚠️ FAQ parsing failed, using defaults');
    return [
      {
        question: `What is ${topic.targetKeyword}?`,
        answer: `${topic.targetKeyword} refers to the main concept covered in this comprehensive guide.`,
      },
    ];
  }
}

// STEP 5: Generate SEO Metadata
async function generateMetadata(content: string, topic: GeneratedTopic): Promise<ArticleMetadata> {
  console.log('    🎯 Step 5/5: Optimizing SEO metadata...');

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

// Main generation function
async function generateArticles(): Promise<void> {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║       🚀 FULLY AUTOMATED AI ARTICLE GENERATOR 🚀              ║
║                                                               ║
║  Every run generates FRESH unique content:                    ║
║  1. Random category selection (weighted)                      ║
║  2. AI generates unique topic (avoids duplicates)             ║
║  3. Deep research → Outline → Write → FAQ → SEO               ║
╚═══════════════════════════════════════════════════════════════╝
`);

  console.log(`📅 Date: ${new Date().toISOString()}`);
  console.log(`🤖 Model: ${CONFIG.openRouter.model}`);
  console.log(`📝 Articles per run: ${CONFIG.content.articlesPerRun}\n`);

  const existingTitles = getExistingArticleTitles();
  console.log(`📚 Existing articles: ${existingTitles.length}\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < CONFIG.content.articlesPerRun; i++) {
    const category = getRandomCategory();

    console.log(`
┌───────────────────────────────────────────────────────────────┐
│ 📝 ARTICLE ${i + 1}/${CONFIG.content.articlesPerRun}: ${category.name.padEnd(43)}│
└───────────────────────────────────────────────────────────────┘
`);

    try {
      // Generate fresh unique topic
      const topic = await generateFreshTopic(category, existingTitles);

      // Multi-step generation
      const research = await conductResearch(topic);
      const outline = await createOutline(topic, research);
      const content = await generateArticleContent(topic, research, outline);
      const faqs = await generateFAQ(topic, content);
      const metadata = await generateMetadata(content, topic);

      // Check for duplicate slug
      if (slugExists(metadata.slug)) {
        console.log(`    ⚠️ Slug "${metadata.slug}" exists, adding timestamp...`);
        metadata.slug = `${metadata.slug}-${Date.now()}`;
      }

      const wordCount = countWords(content);
      console.log(`\n    📊 Word count: ${wordCount}`);

      // Save article
      const mdxContent = createMDXContent(metadata, content, faqs, topic.category);
      const filePath = saveArticle(metadata.slug, mdxContent);
      console.log(`    💾 Saved: ${filePath}`);

      // Add to existing titles to avoid duplicates in same run
      existingTitles.push(topic.title);

      successCount++;
      console.log(`
    ✅ SUCCESS! Fresh article generated.
`);
    } catch (error) {
      console.error(`\n    ❌ ERROR:`, error);
      failCount++;
    }

    // Delay between articles
    if (i < CONFIG.content.articlesPerRun - 1) {
      console.log('    ⏳ Waiting 10 seconds...\n');
      await delay(10000);
    }
  }

  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    🏁 GENERATION COMPLETE                     ║
╠═══════════════════════════════════════════════════════════════╣
║  ✅ Successful: ${String(successCount).padEnd(46)}║
║  ❌ Failed:     ${String(failCount).padEnd(46)}║
╚═══════════════════════════════════════════════════════════════╝
`);

  if (successCount > 0) {
    console.log('🚀 Fresh articles ready! Push to trigger deployment.\n');
  }
}

// Run
generateArticles().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
