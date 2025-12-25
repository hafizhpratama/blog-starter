/**
 * GOD-TIER AI Article Generator
 *
 * Multi-step generation process:
 * 1. Deep Research - Understand topic like a PhD expert
 * 2. Strategic Outline - Plan for maximum SEO impact
 * 3. Expert Writing - Create authoritative content
 * 4. FAQ Generation - Target featured snippets
 * 5. SEO Optimization - Perfect metadata
 *
 * Uses DeepSeek V3 FREE via OpenRouter
 *
 * Usage:
 *   npx ts-node scripts/generate-articles.ts
 *   npm run generate:articles
 */

import * as fs from 'fs';
import * as path from 'path';
import { CONFIG } from './config';
import { PROMPTS } from './prompts';
import {
  Topic,
  getNextTopics,
  updateTopicStatus,
  getExistingArticleTitles,
  logGeneratedArticle,
  seedInitialTopics,
  needsTopicRefill,
  getRandomCategory,
  addTopics,
  initializeDataFiles,
} from './topics';

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

// Rate limiting for free tier
const RATE_LIMIT_DELAY = 3000; // 3 seconds between calls

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
      await delay(RATE_LIMIT_DELAY); // Rate limiting delay
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      if (attempt === retries) throw error;
      console.log(`    ⚠️ Attempt ${attempt} failed. Retrying...`);
      await delay(5000);
    }
  }

  throw new Error('All retry attempts failed');
}

// Parse JSON from AI response (handles markdown code blocks)
function parseJsonResponse<T>(response: string): T {
  let cleaned = response.trim();

  // Remove markdown code blocks
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }

  // Find JSON array or object
  const jsonMatch = cleaned.match(/[\[{][\s\S]*[\]}]/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  return JSON.parse(cleaned.trim());
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

// STEP 1: Deep Research
async function conductResearch(topic: Topic): Promise<string> {
  console.log('    📚 Step 1/5: Conducting deep research...');
  const prompt = PROMPTS.deepResearch(topic.title, topic.category);
  const research = await callOpenRouter(prompt, 4000);
  console.log('    ✓ Research complete');
  return research;
}

// STEP 2: Strategic Outline
async function createOutline(topic: Topic, research: string): Promise<string> {
  console.log('    📋 Step 2/5: Creating strategic outline...');
  const prompt = PROMPTS.strategicOutline(topic.title, research, topic.targetKeyword);
  const outline = await callOpenRouter(prompt, 3000);
  console.log('    ✓ Outline complete');
  return outline;
}

// STEP 3: Generate Article Content
async function generateArticleContent(
  topic: Topic,
  research: string,
  outline: string
): Promise<string> {
  console.log('    ✍️  Step 3/5: Writing god-tier article...');

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
async function generateFAQ(topic: Topic, content: string): Promise<FAQ[]> {
  console.log('    ❓ Step 4/5: Generating FAQ for rich snippets...');

  const prompt = PROMPTS.faqGeneration(topic.title, topic.targetKeyword, content);
  const response = await callOpenRouter(prompt, 2000);

  try {
    const faqs = parseJsonResponse<FAQ[]>(response);
    console.log(`    ✓ Generated ${faqs.length} FAQs`);
    return faqs;
  } catch (error) {
    console.log('    ⚠️ FAQ parsing failed, using defaults');
    return [
      {
        question: `What is ${topic.targetKeyword}?`,
        answer: `${topic.targetKeyword} refers to the main concept covered in this comprehensive guide. Read the full article for detailed information.`,
      },
    ];
  }
}

// STEP 5: Generate SEO Metadata
async function generateMetadata(
  content: string,
  topic: Topic
): Promise<ArticleMetadata> {
  console.log('    🎯 Step 5/5: Optimizing SEO metadata...');

  const prompt = PROMPTS.metadataGeneration(content, topic.title, topic.targetKeyword);
  const response = await callOpenRouter(prompt, 1000);

  try {
    const metadata = parseJsonResponse<ArticleMetadata>(response);
    console.log(`    ✓ Metadata: ${metadata.slug}`);
    return metadata;
  } catch (error) {
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

// Count words in content
function countWords(content: string): number {
  return content.split(/\s+/).filter(Boolean).length;
}

// Fix tables that are inside list items (breaks MDX rendering)
function fixTablesInLists(content: string): string {
  const lines = content.split('\n');
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Check if this is a list item followed by a table
    const isListItem = /^(\s*)[-*\d.]+\s/.test(line);
    const nextLineIsTable = lines[i + 1] && /^\s*\|/.test(lines[i + 1]);

    if (isListItem && nextLineIsTable) {
      // Extract the list item text without the table
      result.push(line);
      result.push(''); // Add blank line

      // Find and extract the table
      const tableLines: string[] = [];
      let j = i + 1;
      while (j < lines.length && (lines[j].trim().startsWith('|') || lines[j].trim() === '')) {
        if (lines[j].trim().startsWith('|')) {
          // Remove leading whitespace from table lines
          tableLines.push(lines[j].trim());
        }
        j++;
      }

      // Add the table without indentation
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

// Fix malformed markdown tables and ensure proper spacing
function fixMarkdownTables(content: string): string {
  const lines = content.split('\n');
  const result: string[] = [];
  let inTable = false;
  let tableColumnCount = 0;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const prevLine = result[result.length - 1] || '';

    // Detect table separator row (e.g., |---|---|---|)
    const isSeparator = /^\|?[\s-:|]+\|[\s-:|]+\|?$/.test(line.trim());

    // Detect table row (starts with | or has multiple |)
    const isTableRow = (line.trim().startsWith('|') || (line.split('|').length > 2)) && !line.startsWith('```');

    // Detect if next line is a separator (means current line is table header)
    const nextLineIsSeparator = lines[i + 1] && /^\|?[\s-:|]+\|[\s-:|]+\|?$/.test(lines[i + 1].trim());

    if (isSeparator) {
      inTable = true;
      // Fix separator: ensure it starts and ends with |
      const parts = line.split('|').filter(p => p.trim() !== '' || line.startsWith('|'));
      const separatorParts = parts.map(() => '---');

      // Ensure proper column count
      if (tableColumnCount > 0) {
        while (separatorParts.length < tableColumnCount) {
          separatorParts.push('---');
        }
      }
      line = '| ' + separatorParts.slice(0, tableColumnCount || separatorParts.length).join(' | ') + ' |';
      if (tableColumnCount === 0) tableColumnCount = separatorParts.length;

    } else if (isTableRow && (inTable || nextLineIsSeparator)) {
      // This is a table row - ensure blank line before table starts
      if (!inTable && prevLine.trim() !== '' && !prevLine.trim().startsWith('|')) {
        // Add blank line before table
        result.push('');
      }

      inTable = true;
      // Fix table row: ensure it starts and ends with |
      let trimmedLine = line.trim();

      // Remove leading/trailing | and split
      if (trimmedLine.startsWith('|')) trimmedLine = trimmedLine.slice(1);
      if (trimmedLine.endsWith('|')) trimmedLine = trimmedLine.slice(0, -1);

      const cells = trimmedLine.split('|').map(cell => cell.trim());

      // Track column count from header row
      if (tableColumnCount === 0) {
        tableColumnCount = cells.length;
      }

      // Ensure consistent column count
      while (cells.length < tableColumnCount) {
        cells.push('');
      }

      line = '| ' + cells.slice(0, tableColumnCount).join(' | ') + ' |';

    } else if (inTable && line.trim() === '') {
      // End of table
      inTable = false;
      tableColumnCount = 0;
    } else if (inTable && !isTableRow) {
      // Non-table line after table - end table and add blank line
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

// Sanitize MDX content to prevent parsing errors
function sanitizeMDXContent(content: string): string {
  // First, remove AI reasoning blocks (DeepSeek R1 outputs these)
  let sanitized = content
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
    .replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, '')
    .replace(/<reflection>[\s\S]*?<\/reflection>/gi, '')
    .replace(/<output>[\s\S]*?<\/output>/gi, (match) => {
      // Keep content inside output tags, just remove the tags
      return match.replace(/<\/?output>/gi, '');
    });

  // Extract and preserve code blocks
  const codeBlocks: string[] = [];
  sanitized = sanitized.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  // Extract and preserve inline code
  const inlineCode: string[] = [];
  sanitized = sanitized.replace(/`[^`]+`/g, (match) => {
    inlineCode.push(match);
    return `__INLINE_CODE_${inlineCode.length - 1}__`;
  });

  // Now sanitize the non-code content
  sanitized = sanitized
    // Fix < followed by numbers (e.g., <1%, <10, <100)
    .replace(/<(\d+)/g, 'less than $1')
    // Fix > followed by numbers (e.g., >50%, >100)
    .replace(/>(\d+)/g, 'greater than $1')
    // Fix <= and >= patterns
    .replace(/<=\s*(\d+)/g, '≤$1')
    .replace(/>=\s*(\d+)/g, '≥$1')
    // Fix < at start of table cells
    .replace(/\|\s*<(\d)/g, '| less than $1')
    .replace(/\|\s*>(\d)/g, '| greater than $1')
    // Fix standalone < and > in text
    .replace(/(\s)<(\s)/g, '$1&lt;$2')
    .replace(/(\s)>(\s)/g, '$1&gt;$2')
    // Fix arrow patterns
    .replace(/\s->\s/g, ' → ')
    .replace(/\s<-\s/g, ' ← ')
    // Clean up whitespace
    .replace(/\n{4,}/g, '\n\n\n')
    .replace(/[ \t]+$/gm, '');

  // Restore code blocks
  codeBlocks.forEach((block, i) => {
    sanitized = sanitized.replace(`__CODE_BLOCK_${i}__`, block);
  });

  // Restore inline code
  inlineCode.forEach((code, i) => {
    sanitized = sanitized.replace(`__INLINE_CODE_${i}__`, code);
  });

  // Note: Mermaid diagrams are now supported, no need to remove them
  // sanitized = removeMermaidDiagrams(sanitized);

  // Fix tables inside list items
  sanitized = fixTablesInLists(sanitized);

  // Fix malformed tables
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
        .replace(/:\s*$/g, '.') // Fix trailing colons that break YAML
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

// Save article to file
function saveArticle(slug: string, content: string): string {
  const articlesDir = path.join(process.cwd(), CONFIG.paths.articlesDir);

  if (!fs.existsSync(articlesDir)) {
    fs.mkdirSync(articlesDir, { recursive: true });
  }

  const filePath = path.join(articlesDir, `${slug}.mdx`);
  fs.writeFileSync(filePath, content);

  return filePath;
}

// Generate new topics if queue is low
async function refillTopicsIfNeeded(): Promise<void> {
  if (!needsTopicRefill()) {
    return;
  }

  console.log('📝 Refilling topics queue...');
  const category = getRandomCategory();
  const existingTopics = getExistingArticleTitles();

  const prompt = PROMPTS.topicGeneration(category.name, existingTopics);
  const response = await callOpenRouter(prompt, 2000);

  try {
    const topics = parseJsonResponse<
      Array<{
        title: string;
        targetKeyword: string;
        searchIntent: string;
        difficulty: string;
        category: string;
      }>
    >(response);

    addTopics(
      topics.map((t) => ({
        title: t.title,
        targetKeyword: t.targetKeyword,
        searchIntent: t.searchIntent as Topic['searchIntent'],
        difficulty: t.difficulty as Topic['difficulty'],
        category: t.category || category.name,
      }))
    );

    console.log(`   ✓ Added ${topics.length} new topics to queue`);
  } catch (error) {
    console.error('   ⚠️ Failed to parse topics:', error);
  }
}

// Main generation function
async function generateArticles(): Promise<void> {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║          🚀 GOD-TIER AI ARTICLE GENERATOR 🚀                  ║
║                                                               ║
║  Multi-step process for #1 Google rankings:                   ║
║  1. Deep Research → Expert-level understanding                ║
║  2. Strategic Outline → Maximum SEO impact                    ║
║  3. Expert Writing → Authoritative content                    ║
║  4. FAQ Generation → Rich snippets                            ║
║  5. SEO Optimization → Perfect metadata                       ║
╚═══════════════════════════════════════════════════════════════╝
`);

  console.log(`📅 Date: ${new Date().toISOString()}`);
  console.log(`🤖 Model: ${CONFIG.openRouter.model} (FREE)`);
  console.log(`📝 Articles per run: ${CONFIG.content.articlesPerRun}`);
  console.log(`📊 Target word count: ${CONFIG.content.minWordCount}-${CONFIG.content.maxWordCount}\n`);

  // Initialize
  initializeDataFiles();
  seedInitialTopics();

  // Refill topics if needed
  await refillTopicsIfNeeded();

  // Get topics to generate
  const topics = getNextTopics();

  if (topics.length === 0) {
    console.log('⚠️  No pending topics found. Run: npm run generate:topics');
    return;
  }

  console.log(`📋 Found ${topics.length} topics to generate\n`);

  let successCount = 0;
  let failCount = 0;

  for (const topic of topics) {
    console.log(`
┌───────────────────────────────────────────────────────────────┐
│ 📝 GENERATING: ${topic.title.slice(0, 47).padEnd(47)}│
├───────────────────────────────────────────────────────────────┤
│ Category: ${topic.category.padEnd(51)}│
│ Keyword:  ${topic.targetKeyword.padEnd(51)}│
│ Intent:   ${topic.searchIntent.padEnd(51)}│
└───────────────────────────────────────────────────────────────┘
`);

    try {
      updateTopicStatus(topic.id, 'generating');

      // Multi-step generation process
      const research = await conductResearch(topic);
      const outline = await createOutline(topic, research);
      const content = await generateArticleContent(topic, research, outline);
      const faqs = await generateFAQ(topic, content);
      const metadata = await generateMetadata(content, topic);

      const wordCount = countWords(content);
      console.log(`\n    📊 Word count: ${wordCount}`);

      // Create and save MDX file
      const mdxContent = createMDXContent(metadata, content, faqs, topic.category);
      const filePath = saveArticle(metadata.slug, mdxContent);
      console.log(`    💾 Saved: ${filePath}`);

      // Update status and log
      updateTopicStatus(topic.id, 'completed', metadata.slug);
      logGeneratedArticle({
        slug: metadata.slug,
        title: metadata.title,
        category: topic.category,
        generatedAt: new Date().toISOString(),
        wordCount,
      });

      successCount++;
      console.log(`
    ✅ SUCCESS! Article generated with god-tier quality.
`);
    } catch (error) {
      console.error(`\n    ❌ ERROR:`, error);
      updateTopicStatus(topic.id, 'failed');
      failCount++;
    }

    // Longer delay between articles for free tier
    if (topics.indexOf(topic) < topics.length - 1) {
      console.log('    ⏳ Waiting 10 seconds before next article...\n');
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
    console.log('🚀 Articles ready! Push to GitHub to trigger deployment.\n');
  }
}

// Run if executed directly
generateArticles().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
