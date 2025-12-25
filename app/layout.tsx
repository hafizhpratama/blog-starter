import { Inter, Crimson_Text } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { SOCIAL_LINKS, EXPERIENCES, SKILLS } from "./constants";

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "arial"],
});

const crimson = Crimson_Text({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-crimson",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";
const SITE_NAME = "Hafizh Pratama";
const SITE_TITLE = "Hafizh Pratama - Software Engineer";
const SITE_DESCRIPTION =
  "A software engineer who enjoys solving problems, building efficient systems, and continuously learning. Focused on delivering practical solutions while staying humble and grounded.";

export const metadata: Metadata = {
  metadataBase: BASE_URL ? new URL(BASE_URL) : null,
  title: {
    template: "%s | Hafizh Pratama",
    default: SITE_TITLE,
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    google: "4mGhEUL69WT3KTSgYPKIIbJcAvGL0YrsEptQBr981nk",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: BASE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [`${BASE_URL}/thumbnail.png`],
  },
  alternates: {
    canonical: BASE_URL,
    types: {
      "application/rss+xml": `${BASE_URL}/feed.xml`,
      "application/atom+xml": `${BASE_URL}/atom.xml`,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [`${BASE_URL}/thumbnail.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const LoadingNavigation = () => <div className="h-14 animate-pulse bg-muted" />;

const LoadingFooter = () => <div className="h-12 animate-pulse bg-muted" />;

const Navigation = dynamic(() => import("./components/Navigation"), {
  ssr: true,
  loading: LoadingNavigation,
});

const Footer = dynamic(() => import("./components/Footer"), {
  ssr: true,
  loading: LoadingFooter,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentJob = EXPERIENCES[0];
  const knowsAbout = SKILLS.map((skill) => skill.name);

  // WebSite schema for sitelinks searchbox
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/articles?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en-US",
  };

  // Person schema for author information
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${BASE_URL}/#person`,
    name: "Hafizh Pratama",
    jobTitle: "Software Engineer",
    description: SITE_DESCRIPTION,
    url: BASE_URL,
    image: `${BASE_URL}/profile.jpeg`,
    sameAs: [SOCIAL_LINKS.github, SOCIAL_LINKS.linkedin, SOCIAL_LINKS.twitter],
    knowsAbout,
    worksFor: {
      "@type": "Organization",
      name: currentJob.company,
    },
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${crimson.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <ThemeProvider>
          <Suspense fallback={<LoadingNavigation />}>
            <Navigation />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Suspense fallback={<LoadingFooter />}>
            <Footer />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
