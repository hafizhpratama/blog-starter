const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

/**
 * Generates a canonical URL for a given path
 * Ensures consistent trailing slash behavior
 */
export function getCanonicalUrl(path: string): string {
  // Remove trailing slash for consistency
  const cleanPath = path.replace(/\/$/, "");

  // Handle root path
  if (cleanPath === "" || cleanPath === "/") {
    return SITE_URL;
  }

  // Ensure path starts with /
  const normalizedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

  return `${SITE_URL}${normalizedPath}`;
}

/**
 * Generates article metadata with proper canonical handling
 */
export function getArticleMetadata(
  slug: string,
  title: string,
  description: string
) {
  const canonicalUrl = getCanonicalUrl(`/articles/${slug}`);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
    },
  };
}

/**
 * Default SEO configuration for reuse
 */
export const seoConfig = {
  siteName: "Hafizh Pratama",
  defaultTitle: "Hafizh Pratama - Software Engineer",
  titleTemplate: "%s | Hafizh Pratama",
  defaultDescription:
    "A software engineer who enjoys solving problems, building efficient systems, and continuously learning.",
  locale: "en_US",
  siteUrl: SITE_URL,
  author: {
    name: "Hafizh Pratama",
    jobTitle: "Software Engineer",
    email: "hafizhpratama99@email.com",
  },
  social: {
    twitter: "https://twitter.com/hfzhpratama",
    linkedin: "https://linkedin.com/in/hafizhpratama",
    github: "https://github.com/hafizhpratama",
  },
};

/**
 * Parse date string to ISO format
 */
export function parseToISODate(dateStr: string): string {
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date.toISOString();
  }

  // Try to parse "Month Year" format
  const parts = dateStr.split(" ");
  if (parts.length === 2) {
    const monthYear = new Date(`${parts[0]} 1, ${parts[1]}`);
    if (!isNaN(monthYear.getTime())) {
      return monthYear.toISOString();
    }
  }

  return new Date().toISOString();
}

/**
 * Generate OG image URL for an article
 */
export function generateArticleOGImageUrl(
  title: string,
  theme: "light" | "dark" = "light"
): string {
  return `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&theme=${theme}`;
}
