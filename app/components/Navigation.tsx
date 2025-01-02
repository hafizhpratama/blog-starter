'use client';

import { memo, useCallback, useState, useEffect } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { Section } from '../types';
import { useTheme } from '../context/ThemeContext';

const SECTIONS: Section[] = ['home', 'projects', 'articles', 'games'];

interface NavLinkProps {
  section: Section;
  pathname: string;
  isMobile?: boolean;
}

interface ThemeToggleProps {
  theme: string;
  toggleTheme: () => void;
}

interface MobileMenuProps {
  isOpen: boolean;
  pathname: string;
}

const NavLink = memo(function NavLink({ section, pathname, isMobile = false }: NavLinkProps) {
  const href = section === 'home' ? '/' : `/${section}`;
  const isActive = pathname === href;

  const baseClasses = isMobile
    ? 'block w-full text-left px-4 py-2 rounded-lg transition capitalize'
    : 'relative text-sm font-medium transition capitalize';

  const activeClasses = isMobile
    ? 'bg-primary text-primary-foreground'
    : 'text-blue-500 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-500';

  const inactiveClasses = isMobile
    ? 'text-muted-foreground hover:bg-accent'
    : 'text-muted-foreground hover:text-foreground';

  return (
    <Link
      href={href}
      prefetch={true}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {section}
    </Link>
  );
});

const ThemeToggle = memo(function ThemeToggle({ theme, toggleTheme }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const buttonClasses = "p-2 rounded-full transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-blue-500";

  if (!mounted) {
    return (
      <button className={buttonClasses} aria-label="Toggle theme">
        <span className="w-5 h-5 block" />
      </button>
    );
  }

  const Icon = theme === 'dark' ? Sun : Moon;
  
  return (
    <button
      onClick={toggleTheme}
      className={buttonClasses}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <Icon className="w-5 h-5" aria-hidden="true" />
    </button>
  );
});

const MobileMenu = memo(function MobileMenu({ isOpen, pathname }: MobileMenuProps) {
  return (
    <div
      className={`md:hidden transform transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-52 opacity-100' : 'max-h-0 opacity-0'
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

  useEffect(() => {
    setIsMenuOpen(false);

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
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
            className="md:hidden p-2 rounded-lg hover:bg-accent focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>

          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>

      <MobileMenu isOpen={isMenuOpen} pathname={pathname} />
    </nav>
  );
}

export default memo(Navigation);