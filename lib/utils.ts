import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateOpenMojiUrl = (emoji: string): string => {
  if (!emoji || emoji.length === 0) {
    throw new Error("Invalid emoji input.");
  }

  const unicode = Array.from(emoji)
    .map((char) => char.codePointAt(0)?.toString(16).toUpperCase())
    .join("-");

  return `https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/color/svg/${unicode}.svg`;
};
