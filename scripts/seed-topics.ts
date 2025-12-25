/**
 * Seed Topics Script
 *
 * Populates the topic queue with initial trending topics.
 * Run this once to get started, then the system auto-generates new topics.
 *
 * Usage:
 *   npx ts-node scripts/seed-topics.ts
 *   npm run generate:topics
 */

import { addTopics, initializeDataFiles, loadTopicsQueue, Topic } from './topics';

console.log('🌱 Seeding topic queue with trending topics...\n');

initializeDataFiles();

const queue = loadTopicsQueue();
const existingCount = queue.topics.filter((t) => t.status === 'pending').length;

if (existingCount >= 20) {
  console.log(`✅ Queue already has ${existingCount} pending topics. No seeding needed.`);
  process.exit(0);
}

// Comprehensive seed topics for all categories
const seedTopics: Omit<Topic, 'id' | 'status' | 'createdAt'>[] = [
  // AI Topics (High priority)
  {
    title: 'How to Build AI Agents: A Complete Guide for 2025',
    targetKeyword: 'build AI agents',
    searchIntent: 'informational',
    difficulty: 'medium',
    category: 'Artificial Intelligence',
  },
  {
    title: 'Claude vs GPT-4 vs Gemini: The Ultimate AI Comparison',
    targetKeyword: 'Claude vs GPT-4 vs Gemini',
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
  {
    title: 'How to Fine-Tune LLMs: A Step-by-Step Guide',
    targetKeyword: 'fine-tune LLM',
    searchIntent: 'informational',
    difficulty: 'high',
    category: 'Artificial Intelligence',
  },
  {
    title: 'Best AI Coding Assistants in 2025: Complete Comparison',
    targetKeyword: 'best AI coding assistant',
    searchIntent: 'informational',
    difficulty: 'high',
    category: 'Artificial Intelligence',
  },
  {
    title: 'OpenAI o1 vs Claude 3.5: Which Reasoning Model is Better?',
    targetKeyword: 'OpenAI o1 vs Claude',
    searchIntent: 'informational',
    difficulty: 'high',
    category: 'Artificial Intelligence',
  },
  {
    title: 'How to Use AI for Content Creation: Complete Guide',
    targetKeyword: 'AI content creation',
    searchIntent: 'informational',
    difficulty: 'medium',
    category: 'Artificial Intelligence',
  },

  // Cryptocurrency Topics
  {
    title: 'Bitcoin ETF Explained: What Investors Need to Know',
    targetKeyword: 'Bitcoin ETF explained',
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
  {
    title: 'Ethereum vs Solana: Which Blockchain is Better for Developers?',
    targetKeyword: 'Ethereum vs Solana',
    searchIntent: 'informational',
    difficulty: 'medium',
    category: 'Cryptocurrency',
  },
  {
    title: 'How to Stake Cryptocurrency: A Beginner Guide to Earning Rewards',
    targetKeyword: 'stake cryptocurrency',
    searchIntent: 'informational',
    difficulty: 'low',
    category: 'Cryptocurrency',
  },
  {
    title: 'Layer 2 Solutions Explained: Arbitrum, Optimism, and Base',
    targetKeyword: 'Layer 2 blockchain',
    searchIntent: 'informational',
    difficulty: 'medium',
    category: 'Cryptocurrency',
  },
  {
    title: 'Crypto Tax Guide 2025: How to Report Your Gains',
    targetKeyword: 'crypto tax guide',
    searchIntent: 'informational',
    difficulty: 'medium',
    category: 'Cryptocurrency',
  },

  // Technology Topics
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
  {
    title: 'Best VS Code Extensions for Developers in 2025',
    targetKeyword: 'best VS Code extensions',
    searchIntent: 'informational',
    difficulty: 'medium',
    category: 'Technology',
  },
  {
    title: 'Docker vs Kubernetes: When to Use Each',
    targetKeyword: 'Docker vs Kubernetes',
    searchIntent: 'informational',
    difficulty: 'medium',
    category: 'Technology',
  },
  {
    title: 'How to Build a REST API with Node.js and Express',
    targetKeyword: 'REST API Node.js',
    searchIntent: 'informational',
    difficulty: 'low',
    category: 'Technology',
  },
  {
    title: 'PostgreSQL vs MongoDB: Choosing the Right Database',
    targetKeyword: 'PostgreSQL vs MongoDB',
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
  {
    title: 'How to Build an Emergency Fund: Step-by-Step Guide',
    targetKeyword: 'build emergency fund',
    searchIntent: 'informational',
    difficulty: 'low',
    category: 'Finance',
  },
  {
    title: 'Compound Interest Explained: How to Grow Your Money',
    targetKeyword: 'compound interest explained',
    searchIntent: 'informational',
    difficulty: 'low',
    category: 'Finance',
  },
  {
    title: 'Best Budgeting Apps 2025: Complete Comparison',
    targetKeyword: 'best budgeting apps',
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
  {
    title: 'How to Create an NFT: Complete Guide for Beginners',
    targetKeyword: 'create NFT',
    searchIntent: 'informational',
    difficulty: 'low',
    category: 'Web3',
  },
  {
    title: 'Web3 Development: Getting Started with Solidity',
    targetKeyword: 'Web3 development Solidity',
    searchIntent: 'informational',
    difficulty: 'medium',
    category: 'Web3',
  },
  {
    title: 'DAOs Explained: How Decentralized Organizations Work',
    targetKeyword: 'DAO explained',
    searchIntent: 'informational',
    difficulty: 'medium',
    category: 'Web3',
  },
];

addTopics(seedTopics);

const newQueue = loadTopicsQueue();
const newPendingCount = newQueue.topics.filter((t) => t.status === 'pending').length;

console.log(`✅ Seeded ${seedTopics.length} topics!`);
console.log(`📋 Total pending topics: ${newPendingCount}`);
console.log(`\n🚀 Run 'npm run generate:articles' to start generating!`);
