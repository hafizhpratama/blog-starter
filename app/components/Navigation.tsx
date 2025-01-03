"use client";

import { memo, useCallback, useState, useEffect } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Section } from "../types";
import { useTheme } from "../context/ThemeContext";

const SECTIONS: Section[] = ["home", "projects", "articles", "games"];

interface NavLinkProps {
  section: Section;
  pathname: string;
  isMobile?: boolean;
}

const NavLink = memo(function NavLink({
  section,
  pathname,
  isMobile = false,
}: NavLinkProps) {
  const href = section === "home" ? "/" : `/${section}`;
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        ${isMobile ? "block w-full rounded-lg px-4 py-2 capitalize" : "relative text-sm font-medium capitalize"}
        ${
          isActive
            ? isMobile
              ? "bg-primary text-primary-foreground"
              : "text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary"
            : "text-muted-foreground hover:text-foreground"
        }
      `}
    >
      {section}
    </Link>
  );
});
NavLink.displayName = "NavLink";

const ThemeToggle = memo(function ThemeToggle({
  theme,
  toggleTheme,
}: {
  theme: string;
  toggleTheme: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <button className="h-10 w-10" aria-hidden="true" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full p-2 hover:bg-accent"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
});
ThemeToggle.displayName = "ThemeToggle";

function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };

    if (isMenuOpen) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Desktop navigation */}
          <div className="hidden md:flex md:space-x-6">
            {SECTIONS.map((section) => (
              <NavLink key={section} section={section} pathname={pathname} />
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={handleToggleMenu}
            className="rounded-lg p-2 hover:bg-accent md:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="border-t border-border px-4 py-2">
          {SECTIONS.map((section) => (
            <NavLink
              key={section}
              section={section}
              pathname={pathname}
              isMobile
            />
          ))}
        </div>
      </div>
    </nav>
  );
}

export default memo(Navigation);
