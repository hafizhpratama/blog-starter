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

const NavLink = memo(function NavLink({ section, pathname, isMobile = false }: NavLinkProps) {
  const href = section === 'home' ? '/' : `/${section}`;
  const isActive = pathname === href;
  
  return (
    <Link
      href={href}
      className={`
        ${isMobile ? 'block w-full px-4 py-2 rounded-lg capitalize' : 'relative text-sm font-medium capitalize'}
        ${isActive 
          ? (isMobile 
              ? 'bg-primary text-primary-foreground' 
              : 'text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary'
            )
          : 'text-muted-foreground hover:text-foreground'
        }
      `}
    >
      {section}
    </Link>
  );
});
NavLink.displayName = 'NavLink';

const ThemeToggle = memo(function ThemeToggle({ 
  theme, 
  toggleTheme 
}: { 
  theme: string; 
  toggleTheme: () => void; 
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <button className="w-10 h-10" aria-hidden="true" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-accent"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' 
        ? <Sun className="w-5 h-5" /> 
        : <Moon className="w-5 h-5" />
      }
    </button>
  );
});
ThemeToggle.displayName = 'ThemeToggle';

function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };

    if (isMenuOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 border-b border-border backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Desktop navigation */}
          <div className="hidden md:flex md:space-x-6">
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
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen 
              ? <X className="w-5 h-5" /> 
              : <Menu className="w-5 h-5" />
            }
          </button>

          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
      >
        <div className="px-4 py-2 border-t border-border">
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