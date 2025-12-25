/**
 * Topic Queue Management System
 * Manages topics for automated article generation
 */

import * as fs from 'fs';
import * as path from 'path';
import { CONFIG, Category } from './config';

export interface Topic {
  id: string;
  title: string;
  targetKeyword: string;
  searchIntent: 'informational' | 'transactional' | 'navigational';
  difficulty: 'low' | 'medium' | 'high';
  category: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  articleSlug?: string;
}

export interface TopicsQueue {
  topics: Topic[];
  lastUpdated: string;
  totalGenerated: number;
}

const DATA_DIR = path.join(process.cwd(), 'scripts/data');
const QUEUE_FILE = path.join(DATA_DIR, 'topics-queue.json');
const LOG_FILE = path.join(DATA_DIR, 'generated-log.json');

/**
 * Initialize data directory and files
 */
export function initializeDataFiles(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(QUEUE_FILE)) {
    const initialQueue: TopicsQueue = {
      topics: [],
      lastUpdated: new Date().toISOString(),
      totalGenerated: 0,
    };
    fs.writeFileSync(QUEUE_FILE, JSON.stringify(initialQueue, null, 2));
  }

  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, JSON.stringify({ articles: [] }, null, 2));
  }
}

/**
 * Load topics queue
 */
export function loadTopicsQueue(): TopicsQueue {
  initializeDataFiles();
  const data = fs.readFileSync(QUEUE_FILE, 'utf-8');
  return JSON.parse(data);
}

/**
 * Save topics queue
 */
export function saveTopicsQueue(queue: TopicsQueue): void {
  queue.lastUpdated = new Date().toISOString();
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
}

/**
 * Add topics to queue
 */
export function addTopics(newTopics: Omit<Topic, 'id' | 'status' | 'createdAt'>[]): void {
  const queue = loadTopicsQueue();

  for (const topic of newTopics) {
    const id = `topic_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    queue.topics.push({
      ...topic,
      id,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
  }

  saveTopicsQueue(queue);
}

/**
 * Get next pending topics for generation
 */
export function getNextTopics(count: number = CONFIG.content.articlesPerRun): Topic[] {
  const queue = loadTopicsQueue();
  const pending = queue.topics.filter((t) => t.status === 'pending');
  return pending.slice(0, count);
}

/**
 * Update topic status
 */
export function updateTopicStatus(
  topicId: string,
  status: Topic['status'],
  articleSlug?: string
): void {
  const queue = loadTopicsQueue();
  const topic = queue.topics.find((t) => t.id === topicId);

  if (topic) {
    topic.status = status;
    if (status === 'completed') {
      topic.completedAt = new Date().toISOString();
      topic.articleSlug = articleSlug;
      queue.totalGenerated++;
    }
    saveTopicsQueue(queue);
  }
}

/**
 * Get weighted random category
 */
export function getRandomCategory(): Category {
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

/**
 * Get existing article titles to avoid duplicates
 */
export function getExistingArticleTitles(): string[] {
  const articlesDir = path.join(process.cwd(), CONFIG.paths.articlesDir);

  if (!fs.existsSync(articlesDir)) {
    return [];
  }

  const files = fs.readdirSync(articlesDir);
  return files
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace('.mdx', '').replace(/-/g, ' '));
}

/**
 * Log generated article
 */
export function logGeneratedArticle(article: {
  slug: string;
  title: string;
  category: string;
  generatedAt: string;
  wordCount: number;
}): void {
  initializeDataFiles();
  const log = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
  log.articles.push(article);
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
}

/**
 * Check if queue needs refilling
 */
export function needsTopicRefill(minTopics: number = 10): boolean {
  const queue = loadTopicsQueue();
  const pending = queue.topics.filter((t) => t.status === 'pending');
  return pending.length < minTopics;
}

/**
 * Clean up old completed topics (keep last 100)
 */
export function cleanupOldTopics(): void {
  const queue = loadTopicsQueue();
  const completed = queue.topics.filter((t) => t.status === 'completed');

  if (completed.length > 100) {
    const toRemove = completed.slice(0, completed.length - 100);
    const idsToRemove = new Set(toRemove.map((t) => t.id));
    queue.topics = queue.topics.filter((t) => !idsToRemove.has(t.id));
    saveTopicsQueue(queue);
  }
}

/**
 * Seed initial topics for each category
 */
export function seedInitialTopics(): void {
  const queue = loadTopicsQueue();

  if (queue.topics.length > 0) {
    console.log('Topics already exist. Skipping seed.');
    return;
  }

  const seedTopics: Omit<Topic, 'id' | 'status' | 'createdAt'>[] = [
    // AI Topics
    {
      title: 'How to Build AI Agents: A Complete Guide for 2025',
      targetKeyword: 'build AI agents',
      searchIntent: 'informational',
      difficulty: 'medium',
      category: 'Artificial Intelligence',
    },
    {
      title: 'Claude vs GPT-4 vs Gemini: The Ultimate AI Comparison',
      targetKeyword: 'Claude vs GPT-4',
      searchIntent: 'informational',
      difficulty: 'high',
      category: 'Artificial Intelligence',
    },
    {
      title: 'What is RAG (Retrieval-Augmented Generation) and Why It Matters',
      targetKeyword: 'RAG retrieval augmented generation',
      searchIntent: 'informational',
      difficulty: 'medium',
      category: 'Artificial Intelligence',
    },
    // Crypto Topics
    {
      title: 'Bitcoin Halving 2024: What It Means for Crypto Prices',
      targetKeyword: 'Bitcoin halving 2024',
      searchIntent: 'informational',
      difficulty: 'high',
      category: 'Cryptocurrency',
    },
    {
      title: 'Best DeFi Strategies for Passive Income in 2025',
      targetKeyword: 'DeFi passive income',
      searchIntent: 'informational',
      difficulty: 'medium',
      category: 'Cryptocurrency',
    },
    // Tech Topics
    {
      title: 'Next.js 15 Features: Everything You Need to Know',
      targetKeyword: 'Next.js 15 features',
      searchIntent: 'informational',
      difficulty: 'medium',
      category: 'Technology',
    },
    {
      title: 'How to Optimize Website Performance for Core Web Vitals',
      targetKeyword: 'Core Web Vitals optimization',
      searchIntent: 'informational',
      difficulty: 'medium',
      category: 'Technology',
    },
    // Finance Topics
    {
      title: 'How to Start Investing with $100: A Beginner Guide',
      targetKeyword: 'start investing $100',
      searchIntent: 'informational',
      difficulty: 'low',
      category: 'Finance',
    },
    {
      title: 'ETF vs Index Funds: Which Is Better for Long-Term Investing',
      targetKeyword: 'ETF vs index funds',
      searchIntent: 'informational',
      difficulty: 'medium',
      category: 'Finance',
    },
    // Web3 Topics
    {
      title: 'What Are Smart Contracts and How Do They Work',
      targetKeyword: 'smart contracts explained',
      searchIntent: 'informational',
      difficulty: 'low',
      category: 'Web3',
    },
  ];

  addTopics(seedTopics);
  console.log(`Seeded ${seedTopics.length} initial topics.`);
}
