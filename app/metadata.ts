import { Metadata } from 'next';

const defaultKeywords = [
  'Hafizh Pratama',
  'Software Engineer',
  'Web Developer',
  'Frontend Developer',
  'Backend Developer',
];

const defaultDescription =
  'Hafizh Pratama is a passionate software engineer focused on creating elegant solutions through clean code and thoughtful design.';

export const defaultMetadata: Metadata = {
  metadataBase: new URL('https://hafizh.pages.dev'),
  title: {
    default: 'Hafizh Pratama - Software Engineer',
    template: '%s | Hafizh Pratama',
  },
  description: defaultDescription,
  keywords: defaultKeywords,
  authors: [{ name: 'Hafizh Pratama' }],
  creator: 'Hafizh Pratama',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hafizh.pages.dev',
    siteName: 'Hafizh Pratama',
    title: 'Hafizh Pratama - Software Engineer',
    description: defaultDescription,
    images: [
      {
        url: 'https://hafizh.pages.dev/og-image.png', // Make sure to add this image to your public folder
        width: 1200,
        height: 630,
        alt: 'Hafizh Pratama',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hafizh Pratama - Software Engineer',
    description: defaultDescription,
    images: ['https://hafizh.pages.dev/og-image.png'],
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
