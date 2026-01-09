import { useEffect, useState } from 'react';

export default function useDarkMode(key = 'theme') {
  // Detect OS preference (single line, no operator line breaks)
  const prefersDark = typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Initial state: respect localStorage, then OS preference
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = window.localStorage.getItem(key);
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
    } catch (_) {
      // ignore storage errors
    }
    return prefersDark;
  });

  // Apply/remove 'dark' class on <html> and persist
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const el = document.documentElement;
    if (isDark) {
      el.classList.add('dark');
      try {
        window.localStorage.setItem(key, 'dark');
      } catch (_) { /* ignore */ }
    } else {
      el.classList.remove('dark');
      try {
        window.localStorage.setItem(key, 'light');
      } catch (_) { /* ignore */ }
    }
    return undefined;
  }, [isDark, key]);

  // Follow OS changes only if user hasn't explicitly set a theme
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      try {
        const stored = window.localStorage.getItem(key);
        if (!stored) setIsDark(e.matches);
      } catch (_) { /* ignore */ }
    };

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handler);
      return () => {
        mq.removeEventListener('change', handler);
      };
    }

    if (typeof mq.addListener === 'function') {
      mq.addListener(handler);
      return () => {
        mq.removeListener(handler);
      };
    }

    return undefined;
  }, [key]);

  const toggle = () => setIsDark((v) => !v);
  const setDark = () => setIsDark(true);
  const setLight = () => setIsDark(false);

  return {
    isDark,
    toggle,
    setDark,
    setLight,
  };
}
