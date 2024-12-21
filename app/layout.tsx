import { Inter, Crimson_Text } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from './context/ThemeContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const crimson = Crimson_Text({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-crimson',
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
  verification: {
    google: 'your-google-verification-code', // Add this if you have Google Search Console verification
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${crimson.variable} font-sans antialiased min-h-screen`}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}