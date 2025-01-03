import { Inter, Crimson_Text } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from './context/ThemeContext';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'optional',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

const crimson = Crimson_Text({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-crimson',
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: true,
});


export const metadata: Metadata = {
  metadataBase: new URL('https://hafizh.pages.dev'),
  title: {
    template: '%s | Hafizh Pratama',
    default: 'Hafizh Pratama - Software Engineer',
  },
  description: 'A passionate software engineer focused on creating elegant solutions through clean code and thoughtful design.',
  openGraph: {
    title: 'Hafizh Pratama - Software Engineer',
    description: 'A passionate software engineer focused on creating elegant solutions through clean code and thoughtful design.',
    url: 'https://hafizh.pages.dev',
    siteName: 'Hafizh Pratama',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Hafizh Pratama',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://hafizh.pages.dev',
  },
};

const criticalStyles = `
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
  }
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --border: 217.2 32.6% 17.5%;
  }
  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
  }
`;

const Navigation = dynamic(() => import('./components/Navigation'), {
  ssr: true,
  loading: () => <div className="h-16 bg-gray-100 animate-pulse" />
});

const Footer = dynamic(() => import('./components/Footer'), {
  ssr: true,
  loading: () => <div className="h-12 bg-gray-100 animate-pulse" />
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
      <head>
        <style 
          rel='stylesheet'
          id="critical-css" 
          dangerouslySetInnerHTML={{ __html: criticalStyles }} 
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <Suspense fallback={<div className="h-16 bg-gray-100 animate-pulse" />}>
            <Navigation />
          </Suspense>
          <main className="flex-1">
            {children}
          </main>
          <Suspense fallback={<div className="h-12 bg-gray-100 animate-pulse" />}>
            <Footer />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}