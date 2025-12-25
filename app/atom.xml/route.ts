import { getAllArticles } from "../lib/mdx";

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://hafizh.cloudhej.com";
const SITE_TITLE = "Hafizh Pratama - Software Engineer";
const SITE_DESCRIPTION =
  "A software engineer who enjoys solving problems, building efficient systems, and continuously learning.";
const AUTHOR_NAME = "Hafizh Pratama";
const AUTHOR_EMAIL = "hafizhpratama99@email.com";

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

  const latestUpdate =
    articles.length > 0
      ? parseDate(articles[0].date).toISOString()
      : new Date().toISOString();

  const entries = articles
    .map((article) => {
      const articleUrl = `${SITE_URL}/articles/${article.slug}`;
      const published = parseDate(article.date).toISOString();

      return `
  <entry>
    <id>${articleUrl}</id>
    <title type="html"><![CDATA[${article.title}]]></title>
    <link href="${articleUrl}" rel="alternate" type="text/html"/>
    <published>${published}</published>
    <updated>${published}</updated>
    <author>
      <name>${AUTHOR_NAME}</name>
      <email>${AUTHOR_EMAIL}</email>
    </author>
    <summary type="html"><![CDATA[${article.description}]]></summary>
    <category term="${article.category}"/>
  </entry>`;
    })
    .join("");

  const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en-US">
  <id>${SITE_URL}/</id>
  <title>${SITE_TITLE}</title>
  <subtitle>${SITE_DESCRIPTION}</subtitle>
  <link href="${SITE_URL}" rel="alternate" type="text/html"/>
  <link href="${SITE_URL}/atom.xml" rel="self" type="application/atom+xml"/>
  <updated>${latestUpdate}</updated>
  <icon>${SITE_URL}/favicon.ico</icon>
  <logo>${SITE_URL}/thumbnail.png</logo>
  <author>
    <name>${AUTHOR_NAME}</name>
    <email>${AUTHOR_EMAIL}</email>
    <uri>${SITE_URL}</uri>
  </author>
  <rights>Copyright ${new Date().getFullYear()} ${AUTHOR_NAME}</rights>
  ${entries}
</feed>`;

  return new Response(atom.trim(), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
