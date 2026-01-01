/**
 * OPTIMIZED AI Prompts for God-Level Content Generation
 *
 * OPTIMIZED 4-step approach (reduced from 6 for quota efficiency):
 * 1. Topic Generation - Fresh unique topic
 * 2. Research + Outline (combined) - Deep research with strategic structure
 * 3. Article Writing - Comprehensive expert content
 * 4. FAQ + Metadata (combined) - SEO optimization in one call
 *
 * Saves 33% API calls while maintaining god-level quality
 */

import { CONFIG } from './config';

export const PROMPTS = {
  /**
   * COMBINED STEP: Deep Research + Strategic Outline
   * Saves 1 API call by combining research and outline into one prompt
   */
  researchAndOutline: (topic: string, category: string, targetKeyword: string) => `
You are a world-leading expert in ${category} AND a master content strategist.

TOPIC: "${topic}"
TARGET KEYWORD: "${targetKeyword}"

Provide a COMBINED research and outline in TWO SECTIONS:

=== SECTION 1: DEEP RESEARCH ===

Cover these areas concisely but thoroughly:

1. CORE CONCEPTS: What is this? Key definitions. History if relevant.
2. CURRENT STATE (2024-2025): Latest developments, statistics, trends.
3. EXPERT INSIGHTS: What most people get wrong. Non-obvious knowledge.
4. PRACTICAL APPLICATION: How it works. Real examples. Step-by-step processes.
5. COMPARISONS: Alternatives, pros/cons, trade-offs.
6. FUTURE: Where it's heading. Emerging trends.

=== SECTION 2: STRATEGIC OUTLINE ===

Create a winning article structure:

1. TITLE: One compelling title (include keyword, under 60 chars)
2. HOOK: Opening strategy to grab readers immediately
3. STRUCTURE: 5-7 H2 sections with key points for each:
   - Introduction with hook
   - Core explanation sections
   - Expert insights/misconceptions
   - Step-by-step guide or framework
   - Comparison/alternatives
   - Future outlook
   - Strong conclusion with CTA

4. FEATURED SNIPPETS: 3 "People Also Ask" questions to answer
5. UNIQUE VALUE: What makes this THE definitive resource?

Be specific with facts, numbers, and actionable insights.
`,

  // Legacy support - redirects to combined prompt
  deepResearch: (topic: string, category: string) => `
You are a world-leading expert in ${category}. Research "${topic}" covering:

1. CORE: Definition, key concepts, history
2. CURRENT (2024-2025): Latest developments, stats, trends
3. INSIGHTS: Common misconceptions, expert-only knowledge
4. PRACTICAL: Real examples, step-by-step processes
5. COMPARISONS: Alternatives, pros/cons
6. FUTURE: Emerging trends, predictions

Be specific with numbers, names, dates. Provide actionable takeaways.
`,

  // Legacy support - kept for backwards compatibility
  strategicOutline: (topic: string, research: string, targetKeyword: string) => `
Create a strategic outline for "${topic}" targeting "${targetKeyword}".

RESEARCH:
${research.slice(0, 3000)}

Provide:
1. TITLE: Compelling, keyword-front, under 60 chars
2. HOOK: Opening strategy
3. STRUCTURE: 5-7 H2 sections with key points
4. SNIPPETS: 3 "People Also Ask" to answer
5. UNIQUE VALUE: What makes this definitive?
`,

  /**
   * STEP 3: God-Tier Article Generation
   * The main content writing prompt - optimized for STORYTELLING
   */
  articleGeneration: (
    topic: string,
    targetKeyword: string,
    category: string,
    research: string,
    outline: string,
    relatedArticles: string[]
  ) => `
You are a Pulitzer-caliber journalist and master storyteller. You write like the best of The New York Times, Wired, and The Atlantic combined. Every article you create is a masterpiece that readers can't stop reading.

Your mission: Write THE DEFINITIVE article on "${topic}" that will:
- Hook readers from the FIRST SENTENCE and never let go
- Rank #1 on Google for "${targetKeyword}"
- Be shared widely because it's genuinely fascinating
- Make complex topics accessible yet profound

RESEARCH INSIGHTS:
${research.slice(0, 4000)}

STRATEGIC OUTLINE:
${outline.slice(0, 2000)}

CATEGORY: ${category}

═══════════════════════════════════════════════════════════════
                    GOD-LEVEL WRITING STYLE
═══════════════════════════════════════════════════════════════

## STORYTELLING MASTERY

Write like a master storyteller:
- Open with a HOOK that creates immediate curiosity or tension
- Use vivid, specific details that paint pictures in the reader's mind
- Include real stories, case studies, or scenarios that bring concepts to life
- Create narrative flow - each section should pull readers to the next
- Use analogies and metaphors to explain complex ideas simply
- Build to insights that feel like revelations
- End with a memorable conclusion that resonates

## CONTENT DEPTH (${CONFIG.content.minWordCount}-${CONFIG.content.maxWordCount} words)

Write with journalistic excellence:
- Lead with the most compelling angle, not generic introductions
- Include specific numbers, dates, names, and facts that add credibility
- Quote experts or reference authoritative sources
- Address the "so what?" - why this matters to the reader
- Anticipate and answer reader questions before they ask them
- Provide actionable insights, not just information

## STRUCTURE & FORMATTING

Use proper Markdown hierarchy:
- ## for main sections (H2)
- ### for subsections (H3)
- **bold** for key terms and important points
- \`code\` for technical terms, commands, values
- \`\`\`language for code blocks (python, javascript, etc.)
- > for important quotes or callouts
- Tables for comparing data
- Numbered lists for steps/processes
- Bullet lists for features/points

**CRITICAL FORMATTING RULES:**
- Tables MUST have a blank line before AND after them
- NEVER put tables inside list items - end the list first, add blank line, then table
- Mermaid diagrams ARE supported - use \`\`\`mermaid for flowcharts
- NEVER use HTML tags except basic ones
- Tables MUST follow this exact format:

\`\`\`
Text before table.

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |

Text after table.
\`\`\`

## SEO MASTERY

Optimize for both Google AND AI systems:
- Include target keyword "${targetKeyword}" naturally 4-6 times
- Use semantic variations and LSI keywords throughout
- Front-load important information in each section
- Include a clear definition/answer in the first 100 words
- Structure content for featured snippets
- Add "Key Takeaway" boxes for important points

## E-E-A-T SIGNALS (Experience, Expertise, Authority, Trust)

Demonstrate deep expertise:
- Show first-hand experience and insights
- Reference authoritative sources and data
- Provide nuanced analysis, not surface-level content
- Address common mistakes and misconceptions
- Include practical, actionable advice

## ENGAGEMENT & READABILITY

Keep readers hooked:
- Short paragraphs (2-4 sentences max)
- Use transition words between sections
- Ask rhetorical questions to engage
- Include surprising facts or statistics
- Add personality without sacrificing authority

## INTERNAL LINKING

Naturally reference these related topics where relevant:
${relatedArticles.map((a) => `- ${a}`).join('\n')}
Use format: [relevant anchor text](/articles/slug-here)

═══════════════════════════════════════════════════════════════

Write the complete article now in Markdown format.
Start directly with the content - NO frontmatter, NO "Here's the article" intro.
Begin with an attention-grabbing opening paragraph.
`,

  /**
   * Generate trending topic ideas
   */
  topicGeneration: (category: string, existingTopics: string[]) => `
You are a trend analyst and content strategist specializing in ${category}. Your job is to identify topics that will:
1. Get massive search traffic (high volume keywords)
2. Have achievable competition (not dominated by huge sites)
3. Be trending upward (growing interest)
4. Provide real value to readers

Generate 10 unique article topics for ${category}.

REQUIREMENTS:
- Each topic must target a specific, searchable keyword
- Mix of content types:
  * "How to" guides (educational)
  * "What is" explainers (informational)
  * "X vs Y" comparisons (commercial)
  * "Best/Top" lists (transactional)
  * News analysis and predictions (timely)
- Focus on 2024-2025 trends and developments
- Each topic should solve a real problem or answer a real question

AVOID DUPLICATING:
${existingTopics.slice(0, 20).join('\n')}

OUTPUT FORMAT (JSON array):
[
  {
    "title": "Compelling Article Title (include keyword)",
    "targetKeyword": "primary search keyword",
    "searchIntent": "informational|transactional|navigational|commercial",
    "difficulty": "low|medium|high",
    "category": "${category}",
    "whyItWillRank": "Brief explanation of ranking potential"
  }
]

Generate exactly 10 topics. Output ONLY valid JSON.
`,

  /**
   * Generate SEO metadata
   */
  metadataGeneration: (articleContent: string, topic: string, targetKeyword: string) => `
You are an SEO specialist who has optimized thousands of articles for top Google rankings. Generate perfect metadata for this article.

TOPIC: ${topic}
TARGET KEYWORD: ${targetKeyword}

ARTICLE CONTENT (excerpt):
${articleContent.slice(0, 4000)}

Generate metadata in this exact JSON format:
{
  "title": "SEO title - max 60 chars, keyword at start, compelling",
  "description": "Meta description - max 155 chars, keyword included, benefit + CTA",
  "slug": "url-slug-with-keyword",
  "keywords": ["primary keyword", "variation 1", "variation 2", "LSI term 1", "LSI term 2", "long-tail 1", "long-tail 2", "related term"],
  "readTime": "X min read"
}

RULES:
- Title: Front-load keyword, add power word (Ultimate, Complete, Essential)
- Description: Include keyword, state benefit, end with soft CTA
- Slug: Short, keyword-focused, hyphens only
- Keywords: 8 keywords mixing head terms and long-tail
- ReadTime: Calculate based on ~200 words/minute

Output ONLY valid JSON, no explanation.
`,

  /**
   * Generate comprehensive FAQ section
   */
  faqGeneration: (topic: string, targetKeyword: string, articleContent: string) => `
You are an SEO expert specializing in featured snippets and "People Also Ask" optimization.

Generate ${CONFIG.content.faqCount} FAQ questions that:
1. Match real "People Also Ask" queries on Google
2. Target featured snippet opportunities
3. Cover the topic comprehensively
4. Include the keyword naturally

TOPIC: ${topic}
KEYWORD: ${targetKeyword}

ARTICLE CONTEXT:
${articleContent.slice(0, 3000)}

REQUIREMENTS:
- Questions should start with: What, How, Why, When, Is, Can, Does, Which
- Each answer must be:
  * Self-contained (makes sense without reading the article)
  * Concise but complete (40-60 words ideal for snippets)
  * Include specific facts, numbers, or steps
  * Written to win the featured snippet
- Cover different aspects:
  * Definition/explanation question
  * "How to" process question
  * Comparison question
  * Best practice question
  * Common problem/mistake question

OUTPUT FORMAT (JSON array):
[
  {
    "question": "Question that matches real search queries?",
    "answer": "Concise, authoritative answer optimized for featured snippets. Include specific details and actionable information."
  }
]

Generate exactly ${CONFIG.content.faqCount} FAQs. Output ONLY valid JSON.
`,

  /**
   * COMBINED STEP: FAQ + Metadata Generation
   * Saves 1 API call by combining FAQ and metadata into one prompt
   */
  faqAndMetadata: (topic: string, targetKeyword: string, articleContent: string) => `
You are an SEO expert. Generate both FAQ and metadata for this article in ONE response.

TOPIC: ${topic}
KEYWORD: ${targetKeyword}

ARTICLE (excerpt):
${articleContent.slice(0, 3500)}

OUTPUT FORMAT (JSON object with both sections):
{
  "metadata": {
    "title": "SEO title - max 60 chars, keyword at start",
    "description": "Meta description - max 155 chars, keyword + benefit + CTA",
    "slug": "url-slug-with-keyword",
    "keywords": ["8 keywords: primary, variations, LSI terms, long-tail"],
    "readTime": "X min read"
  },
  "faqs": [
    {
      "question": "What/How/Why question matching People Also Ask?",
      "answer": "Concise answer 40-60 words for featured snippet."
    }
  ]
}

REQUIREMENTS:
- Metadata: Title front-load keyword, description with CTA, short slug
- FAQs: Generate exactly ${CONFIG.content.faqCount} questions covering:
  * Definition question
  * How-to question
  * Comparison question
  * Best practice question
  * Common problem question

Output ONLY valid JSON, no explanation.
`,

  /**
   * Content Enhancement Pass
   * Final polish for maximum impact
   */
  contentEnhancement: (content: string, targetKeyword: string) => `
You are a senior editor at a top publication. Review and enhance this article for maximum impact.

TARGET KEYWORD: ${targetKeyword}

CONTENT TO ENHANCE:
${content}

ENHANCEMENT CHECKLIST:

1. OPENING HOOK
- Is the first sentence attention-grabbing?
- Does it create curiosity or address a pain point?
- Is the keyword included naturally in first 100 words?

2. STRUCTURE
- Are transitions between sections smooth?
- Is there a logical flow of ideas?
- Are paragraphs short enough (2-4 sentences)?

3. VALUE DENSITY
- Does every paragraph provide value?
- Are there any fluffy or redundant sentences to cut?
- Can we add more specific data or examples?

4. ENGAGEMENT
- Are there enough subheadings for scannability?
- Are key points highlighted with bold or lists?
- Are there calls-to-action or engagement prompts?

5. SEO FINE-TUNING
- Is keyword density optimal (1-2%)?
- Are semantic variations used throughout?
- Is content structured for featured snippets?

6. ADD IF MISSING:
- "Key Takeaway" or "TL;DR" box at top
- Summary section at the end
- Clear next steps for readers

Return the enhanced article in Markdown format. Make meaningful improvements while preserving the author's voice and all factual content.
`,
};

export type PromptType = keyof typeof PROMPTS;
