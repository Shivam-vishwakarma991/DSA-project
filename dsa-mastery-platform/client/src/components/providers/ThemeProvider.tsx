'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const uiTheme = useSelector((state: RootState) => state.ui.theme);
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Get theme from localStorage or use UI state
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system';
    setThemeState(savedTheme || uiTheme || 'system');
  }, [uiTheme]);

  useEffect(() => {
    const updateTheme = () => {
      let resolved: 'light' | 'dark' = 'light';
      
      if (theme === 'system') {
        // Check system preference
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        resolved = isDark ? 'dark' : 'light';
      } else {
        resolved = theme;
      }

      setResolvedTheme(resolved);
      
      // Apply theme to document
      if (resolved === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateTheme();

    // Listen for system theme changes
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateTheme();
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};