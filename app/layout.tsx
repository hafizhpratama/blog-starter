import { Inter, Crimson_Text } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const inter = Inter({
  weight: ["400"],
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

export const metadata: Metadata = {
  metadataBase: new URL("https://hafizh.pages.dev"),
  title: {
    template: "%s | Hafizh Pratama",
    default: "Hafizh Pratama - Software Engineer",
  },
  description: "Software engineer focused on creating elegant solutions.",
  openGraph: {
    title: "Hafizh Pratama - Software Engineer",
    description: "Software engineer focused on creating elegant solutions.",
    url: "https://hafizh.pages.dev",
    siteName: "Hafizh Pratama",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Hafizh Pratama",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: "https://hafizh.pages.dev",
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
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${crimson.variable}`}
    >
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
