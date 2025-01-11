import { Metadata } from "next";

const defaultKeywords = [
  "Hafizh Pratama",
  "Software Engineer",
  "Web Developer",
  "Frontend Developer",
  "Backend Developer",
];

const defaultDescription =
  "A software engineer who enjoys solving problems, building efficient systems, and continuously learning. Focused on delivering practical solutions while staying humble and grounded.";

export const defaultMetadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_BASE_URL
    ? new URL(process.env.NEXT_PUBLIC_BASE_URL)
    : undefined,
  title: {
    default: "Hafizh Pratama - Software Engineer",
    template: "%s | Hafizh Pratama",
  },
  description: defaultDescription,
  keywords: defaultKeywords,
  authors: [{ name: "Hafizh Pratama" }],
  creator: "Hafizh Pratama",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "Hafizh Pratama",
    title: "Hafizh Pratama - Software Engineer",
    description: defaultDescription,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/thumbnail.png`,
        width: 1200,
        height: 630,
        alt: "Hafizh Pratama",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hafizh Pratama - Software Engineer",
    description: defaultDescription,
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/thumbnail.png`],
  },
};

export const rpsMetadata: Metadata = {
  metadataBase: new URL(
    `${process.env.NEXT_PUBLIC_BASE_URL}/games/rock-paper-scissors`
  ),
  title: "Rock Paper Scissors Game | Interactive Browser Game",
  description:
    "Play an exciting game of Rock Paper Scissors against an AI opponent. Features lives system, scoring, and winning streaks. Perfect for quick entertainment!",
  keywords: [
    "rock paper scissors",
    "browser game",
    "AI game",
    "interactive game",
    "casual game",
  ],
  authors: [{ name: "Hafizh Pratama" }],
  creator: "Hafizh Pratama",
  openGraph: {
    title: "Rock Paper Scissors Game",
    description: "Challenge the AI in this modern take on Rock Paper Scissors!",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/thumbnail.png`],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rock Paper Scissors Game",
    description: "Challenge the AI in this modern take on Rock Paper Scissors!",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/thumbnail.png`],
  },
};

export const smMetadata: Metadata = {
  metadataBase: new URL(
    `${process.env.NEXT_PUBLIC_BASE_URL}/games/slot-machine`
  ),
  title: "Classic Slot Machine Game | Interactive Casino Game",
  description:
    "Play our exciting slot machine game featuring classic fruit symbols and lucky sevens. Win big with multiple winning combinations and enjoy smooth animations!",
  keywords: [
    "slot machine",
    "casino game",
    "online slots",
    "fruit machine",
    "gambling game",
  ],
  authors: [{ name: "Hafizh Pratama" }],
  creator: "Hafizh Pratama",
  openGraph: {
    title: "Classic Slot Machine Game",
    description:
      "Try your luck with our beautifully designed slot machine game!",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/thumbnail.png`],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Classic Slot Machine Game",
    description:
      "Try your luck with our beautifully designed slot machine game!",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/thumbnail.png`],
  },
};
