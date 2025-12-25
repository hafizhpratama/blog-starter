/**
 * Add Topic CLI Tool
 *
 * Usage:
 *   npx ts-node scripts/add-topic.ts "Topic Title" "keyword" "category"
 *   npm run topics:add -- "Topic Title" "keyword" "category"
 *
 * Example:
 *   npx ts-node scripts/add-topic.ts "How to Build AI Agents" "AI agents" "Artificial Intelligence"
 */

import { addTopics, initializeDataFiles, loadTopicsQueue } from './topics';
import { CONFIG } from './config';

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log(`
📝 Add Topic to Generation Queue

Usage:
  npx ts-node scripts/add-topic.ts "Topic Title" "keyword" [category]

Arguments:
  - Topic Title: The full article title (required)
  - keyword: Target SEO keyword (required)
  - category: One of the following (optional, defaults to first match):
    ${CONFIG.categories.map((c) => `• ${c.name}`).join('\n    ')}

Examples:
  npx ts-node scripts/add-topic.ts "How to Build AI Agents in 2025" "build AI agents"
  npx ts-node scripts/add-topic.ts "Bitcoin Price Prediction" "bitcoin price" "Cryptocurrency"
  `);
  process.exit(1);
}

const [title, keyword, category] = args;

// Validate category if provided
const validCategory = category
  ? CONFIG.categories.find(
      (c) => c.name.toLowerCase() === category.toLowerCase()
    )?.name
  : CONFIG.categories[0].name;

if (category && !validCategory) {
  console.error(`❌ Invalid category: ${category}`);
  console.log(`Valid categories: ${CONFIG.categories.map((c) => c.name).join(', ')}`);
  process.exit(1);
}

// Initialize and add topic
initializeDataFiles();

addTopics([
  {
    title,
    targetKeyword: keyword,
    searchIntent: 'informational',
    difficulty: 'medium',
    category: validCategory || CONFIG.categories[0].name,
  },
]);

const queue = loadTopicsQueue();
const pendingCount = queue.topics.filter((t) => t.status === 'pending').length;

console.log(`
✅ Topic added successfully!

📝 Title: ${title}
🎯 Keyword: ${keyword}
📂 Category: ${validCategory}
📋 Pending topics in queue: ${pendingCount}

Run 'npm run generate:articles' to generate articles.
`);
