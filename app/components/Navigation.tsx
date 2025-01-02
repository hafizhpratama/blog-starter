'use client';

import { memo, useCallback, useState, useEffect } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Section } from '../types';
import { useTheme } from '../context/ThemeContext';

// Pre-define sections to avoid recreation on each render
const SECTIONS: Section[] = ['about', 'projects', 'articles', 'games'];

// Memoize the NavLink component
const NavLink = memo(function NavLink({ 
  section, 
  pathname,
  isMobile = false 
}: { 
  section: Section; 
  pathname: string;
  isMobile?: boolean;
}) {
  const href = section === 'about' ? '/' : `/${section}`;
  const isActive = pathname === href;

  if (isMobile) {
    return (
      <Link
        rel="preload"
        href={href}
        className={`block w-full text-left px-4 py-2 rounded-lg transition capitalize
          ${isActive 
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent'
          }
        `}
      >
        {section}
      </Link>
    );
  }

  return (
    <Link
      rel="preload"
      href={href}
      className={`relative text-sm font-medium transition capitalize
        ${isActive ? 'text-blue-500' : 'text-muted-foreground hover:text-foreground'}
        ${isActive ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-500' : ''}
      `}
    >
      {section}
    </Link>
  );
});

// Memoize the ThemeToggle component
const ThemeToggle = memo(function ThemeToggle({ 
  theme, 
  toggleTheme 
}: { 
  theme: string;
  toggleTheme: () => void;
}) {
  // Use useEffect to handle client-side only rendering of theme icon
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-full transition-colors hover:bg-accent"
        aria-label="Toggle theme"
      >
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
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
  );
});

const MobileMenu = memo(function MobileMenu({ 
  isOpen, 
  pathname 
}: { 
  isOpen: boolean;
  pathname: string;
}) {
  return (
    <div
      className={`md:hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-52' : 'max-h-0'
      } overflow-hidden`}
    >
      <div className="px-4 py-2 space-y-2 border-t border-border">
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
  );
});

function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 border-b border-border backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Desktop navigation */}
          <div className="hidden md:flex md:space-x-8">
            {SECTIONS.map((section) => (
              <NavLink 
                key={section} 
                section={section} 
                pathname={pathname} 
              />
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={handleToggleMenu}
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
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu isOpen={isMenuOpen} pathname={pathname} />
    </nav>
  );
}

export default memo(Navigation);