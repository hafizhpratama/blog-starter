import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function generateOGImageUrl({
  title,
  description,
  type = "website",
  theme = "light",
}: {
  title: string;
  description: string;
  type?: string;
  theme?: "light" | "dark";
}) {
  const url = new URL(
    `/api/og`,
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://hafizh.pages.dev"
  );

  url.searchParams.set("title", title);
  url.searchParams.set("description", description);
  url.searchParams.set("type", type);
  url.searchParams.set("theme", theme);

  return url.toString();
}
