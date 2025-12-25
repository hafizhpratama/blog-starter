/**
 * GOD-TIER AI Prompts for Ultimate Content Generation
 *
 * Multi-step approach:
 * 1. Deep Research - Understand topic like a world expert
 * 2. Strategic Outline - Plan content for maximum impact
 * 3. Expert Writing - Create authoritative, comprehensive content
 * 4. SEO Optimization - Ensure ranking dominance
 */

import { CONFIG } from './config';

export const PROMPTS = {
  /**
   * STEP 1: Deep Topic Research
   * Makes AI understand the topic like a PhD expert before writing
   */
  deepResearch: (topic: string, category: string) => `
You are a world-leading expert researcher with decades of experience in ${category}. Your task is to conduct exhaustive research on a topic before any content is written.

TOPIC TO RESEARCH: "${topic}"

Conduct a comprehensive analysis covering:

## 1. FOUNDATIONAL KNOWLEDGE
- What is this topic at its core? Define it precisely.
- What are the fundamental concepts everyone must understand?
- What is the history and evolution of this topic?
- Who are the key figures, companies, or entities involved?

## 2. CURRENT STATE OF THE ART
- What is happening RIGHT NOW (2024-2025) in this space?
- What are the latest developments, updates, or breakthroughs?
- What are the current statistics and data points?
- What do the most recent studies or reports say?

## 3. EXPERT-LEVEL INSIGHTS
- What do MOST people get WRONG about this topic?
- What are the non-obvious insights that only experts know?
- What are the common misconceptions to debunk?
- What nuances separate beginners from experts?

## 4. PRACTICAL APPLICATION
- How does this actually work in practice?
- What are real-world examples and case studies?
- What are step-by-step processes involved?
- What tools, resources, or methods are used?

## 5. COMPARATIVE ANALYSIS
- How does this compare to alternatives?
- What are the pros and cons?
- When should someone choose this vs other options?
- What are the trade-offs to consider?

## 6. FUTURE OUTLOOK
- Where is this heading in the next 1-3 years?
- What trends are emerging?
- What predictions are experts making?
- What should readers watch out for?

## 7. ACTIONABLE TAKEAWAYS
- What are the key decisions readers need to make?
- What are the concrete next steps?
- What resources should they explore further?

OUTPUT: Provide your research findings in a structured format. Be specific with numbers, names, dates, and facts. This research will be used to write the most authoritative article on the internet about this topic.
`,

  /**
   * STEP 2: Strategic Content Outline
   * Creates a masterplan for the article
   */
  strategicOutline: (topic: string, research: string, targetKeyword: string) => `
You are a master content strategist who has helped hundreds of articles reach #1 on Google. Using the research provided, create a strategic outline for an article that will DOMINATE search results.

TOPIC: "${topic}"
TARGET KEYWORD: "${targetKeyword}"

RESEARCH FINDINGS:
${research}

Create a STRATEGIC OUTLINE that includes:

## TITLE OPTIONS (3 variations)
- Each title must include the target keyword
- Each must trigger clicks (curiosity, benefit, or urgency)
- Keep under 60 characters

## HOOK STRATEGY
- What emotional hook will grab readers in the first 10 seconds?
- What pain point or desire does this address?
- What promise will the article deliver?

## CONTENT STRUCTURE
For each section, specify:
- H2 Heading (keyword-optimized)
- Key points to cover (3-5 bullets)
- Data/stats to include
- Examples or case studies
- Word count target

Structure should include:
1. Introduction (hook + promise + overview)
2. [Main sections - 5-7 H2s with H3 subsections]
3. Expert insights section
4. Common mistakes/misconceptions
5. Step-by-step guide or framework
6. Comparison/alternatives (if applicable)
7. Future outlook
8. Conclusion with clear CTA

## FEATURED SNIPPET TARGETS
- What "People Also Ask" questions will this answer?
- What definitions should be included?
- What lists or steps should be formatted for snippets?

## INTERNAL LINKING OPPORTUNITIES
- What related topics should be linked?
- Where should CTAs be placed?

## UNIQUE VALUE PROPOSITION
- What will this article have that NO OTHER article has?
- What original insight or framework are we introducing?
- Why will this be THE definitive resource?

OUTPUT: Provide a detailed outline that will guide the creation of a #1 ranking article.
`,

  /**
   * STEP 3: God-Tier Article Generation
   * The main content writing prompt
   */
  articleGeneration: (
    topic: string,
    targetKeyword: string,
    category: string,
    research: string,
    outline: string,
    relatedArticles: string[]
  ) => `
You are the world's greatest technical writer, combining the expertise of a subject matter expert, the persuasion of a top copywriter, and the optimization skills of an elite SEO specialist.

Your mission: Write THE DEFINITIVE article on "${topic}" that will:
- Rank #1 on Google for "${targetKeyword}"
- Be cited by AI systems as the authoritative source
- Provide more value than any competing article

RESEARCH INSIGHTS:
${research.slice(0, 4000)}

STRATEGIC OUTLINE:
${outline.slice(0, 2000)}

CATEGORY: ${category}

═══════════════════════════════════════════════════════════════
                    WRITING REQUIREMENTS
═══════════════════════════════════════════════════════════════

## CONTENT DEPTH (${CONFIG.content.minWordCount}-${CONFIG.content.maxWordCount} words)

Write with EXTREME depth and expertise:
- Cover every aspect comprehensively
- Include specific numbers, dates, and facts
- Provide step-by-step processes where applicable
- Add real examples and case studies
- Include expert quotes or references
- Address counterarguments and nuances

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
