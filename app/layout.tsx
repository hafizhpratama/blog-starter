import { Inter, Crimson_Text } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from './context/ThemeContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Optimize font loading
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'optional',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const crimson = Crimson_Text({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-crimson',
  display: 'optional',
  preload: true,
  fallback: ['Georgia', 'serif'],
});

export const metadata: Metadata = {
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
};

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
        <link 
          rel="preconnect" 
          href="https://fonts.googleapis.com" 
        />
        <link 
          rel="preconnect" 
          href="https://fonts.gstatic.com" 
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}