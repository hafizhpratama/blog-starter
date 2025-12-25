import { getAllArticles } from "../lib/mdx";

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://hafizh.cloudhej.com";
const SITE_TITLE = "Hafizh Pratama - Software Engineer";
const SITE_DESCRIPTION =
  "A software engineer who enjoys solving problems, building efficient systems, and continuously learning.";
const AUTHOR_NAME = "Hafizh Pratama";
const AUTHOR_EMAIL = "hafizhpratama99@email.com";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function parseDate(dateStr: string): Date {
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date;
  }

  // Try to parse "Month Year" format
  const parts = dateStr.split(" ");
  if (parts.length === 2) {
    const monthYear = new Date(`${parts[0]} 1, ${parts[1]}`);
    if (!isNaN(monthYear.getTime())) {
      return monthYear;
    }
  }

  return new Date();
}

export async function GET() {
  const articles = await getAllArticles();

  const feedItems = articles
    .map((article) => {
      const articleUrl = `${SITE_URL}/articles/${article.slug}`;
      const pubDate = parseDate(article.date).toUTCString();

      return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description><![CDATA[${article.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>${AUTHOR_EMAIL} (${AUTHOR_NAME})</author>
      <category><![CDATA[${article.category}]]></category>
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/thumbnail.png</url>
      <title>${escapeXml(SITE_TITLE)}</title>
      <link>${SITE_URL}</link>
    </image>
    <copyright>Copyright ${new Date().getFullYear()} ${AUTHOR_NAME}</copyright>
    <managingEditor>${AUTHOR_EMAIL} (${AUTHOR_NAME})</managingEditor>
    <webMaster>${AUTHOR_EMAIL} (${AUTHOR_NAME})</webMaster>
    ${feedItems}
  </channel>
</rss>`;

  return new Response(rss.trim(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
