'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import { Section } from '../types';

export default function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const sections: Section[] = ['about', 'projects', 'articles', 'games'];

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 border-b border-border backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Desktop navigation */}
          <div className="hidden md:flex md:space-x-8">
            {sections.map((section) => (
              <Link
                key={section}
                href={section === 'about' ? '/' : `/${section}`}
                className={`relative text-sm font-medium transition capitalize
                  ${
                    pathname === (section === 'about' ? '/' : `/${section}`)
                      ? 'text-blue-500'
                      : 'text-muted-foreground hover:text-foreground'
                  }
                  ${
                    pathname === (section === 'about' ? '/' : `/${section}`)
                      ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-500'
                      : ''
                  }
                `}
              >
                {section}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors hover:bg-accent"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-52' : 'max-h-0'
        } overflow-hidden`}
      >
        <div className="px-4 py-2 space-y-2 border-t border-border">
          {sections.map((section) => (
            <Link
              key={section}
              href={section === 'about' ? '/' : `/${section}`}
              className={`block w-full text-left px-4 py-2 rounded-lg transition capitalize
                ${
                  pathname === (section === 'about' ? '/' : `/${section}`)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent'
                }
              `}
            >
              {section}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
