'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Theme = 'light' | 'dark';
const storageKey = 'amiral-theme';
const systemTheme = (): Theme =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

function savedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(storageKey);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const explicitChoice = useRef(false);
  const stopSystemSync = useRef<() => void>(() => undefined);

  useEffect(() => {
    const saved = savedTheme();
    if (saved) {
      explicitChoice.current = true;
      applyTheme(saved);
      setTheme(saved);
      return;
    }

    const query =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;
    const updateFromSystem = (event?: MediaQueryListEvent) => {
      if (explicitChoice.current) return;
      const next = (event?.matches ?? query?.matches) ? 'dark' : 'light';
      applyTheme(next);
      setTheme(next);
    };
    updateFromSystem();
    query?.addEventListener?.('change', updateFromSystem);
    let listening = true;
    const cleanup = () => {
      if (!listening) return;
      query?.removeEventListener?.('change', updateFromSystem);
      listening = false;
    };
    stopSystemSync.current = cleanup;
    return cleanup;
  }, []);

  function toggle() {
    const next = (theme ?? systemTheme()) === 'dark' ? 'light' : 'dark';
    explicitChoice.current = true;
    stopSystemSync.current();
    stopSystemSync.current = () => undefined;
    applyTheme(next);
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      // The active theme still works when storage is unavailable.
    }
    setTheme(next);
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </Button>
  );
}
