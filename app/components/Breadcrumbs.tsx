"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 text-sm text-muted-foreground"
    >
      <ol
        className="flex flex-wrap items-center gap-1"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((item, index) => (
          <li
            key={item.href}
            className="flex items-center"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            {index > 0 && (
              <ChevronRight className="mx-1 h-4 w-4" aria-hidden="true" />
            )}
            {index === items.length - 1 ? (
              <span
                itemProp="name"
                className="truncate max-w-[200px] sm:max-w-none"
                aria-current="page"
              >
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                itemProp="item"
                className="flex items-center hover:text-foreground transition-colors"
              >
                {index === 0 && <Home className="mr-1 h-4 w-4" />}
                <span itemProp="name">{item.name}</span>
              </Link>
            )}
            <meta itemProp="position" content={String(index + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function createBreadcrumbItems(articleTitle: string): BreadcrumbItem[] {
  return [
    { name: "Home", href: "/" },
    { name: "Articles", href: "/articles" },
    { name: articleTitle, href: "#" },
  ];
}
