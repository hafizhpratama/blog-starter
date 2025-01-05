import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function generateOGImageUrl({
  title,
  theme = "light",
}: {
  title: string;
  theme?: "light" | "dark";
}) {
  const url = new URL(
    `/api/og`,
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://hafizh.pages.dev"
  );

  url.searchParams.set("title", title);
  url.searchParams.set("theme", theme);

  return url.toString();
}
