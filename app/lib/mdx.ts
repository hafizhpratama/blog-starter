import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";
import { MermaidPre } from "../components/Mermaid";

const articlesDirectory = path.join(process.cwd(), "content/articles");

try {
  if (!fs.existsSync(articlesDirectory)) {
    fs.mkdirSync(articlesDirectory, { recursive: true });
  }
} catch (error) {
  console.error("Error creating articles directory:", error);
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ArticleMeta {
  title: string;
  description: string;
  date: string;
  dateModified?: string;
  readTime: string;
  category: string;
  emoji: string;
  slug: string;
  keywords: string[];
  faqs?: FAQItem[];
}

export type { ArticleMeta, FAQItem };

export async function getArticleBySlug(slug: string) {
  try {
    const realSlug = slug.replace(/\.mdx$/, "");
    const filePath = path.join(articlesDirectory, `${realSlug}.mdx`);

    if (!fs.existsSync(filePath)) {
      return notFound();
    }

    const fileContent = fs.readFileSync(filePath, "utf8");

    const { content, frontmatter } = await compileMDX<ArticleMeta>({
      source: fileContent,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      },
      components: {
        pre: MermaidPre,
      },
    });

    return {
      meta: {
        ...frontmatter,
        slug: realSlug,
      },
      content,
    };
  } catch (error) {
    console.error("Error reading article:", error);
    return notFound();
  }
}

export async function getAllArticles() {
  try {
    if (!fs.existsSync(articlesDirectory)) {
      return [];
    }

    const files = fs.readdirSync(articlesDirectory);
    const articles = await Promise.all(
      files
        .filter((file) => file.endsWith(".mdx"))
        .map(async (file) => {
          const { meta } = await getArticleBySlug(file);
          return meta;
        })
    );

    return articles.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error("Error getting all articles:", error);
    return [];
  }
}
