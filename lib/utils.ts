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
  const baseUrl = "https://hafizh.cloudhej.com";
  const url = new URL(`/api/og`, baseUrl);

  url.searchParams.set("title", encodeURIComponent(title));
  url.searchParams.set("theme", theme);

  return url.toString();
}
