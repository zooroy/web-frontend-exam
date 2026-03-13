'use client';

import { useEffect, useState } from 'react';

type ResponsiveMode = 'desktop' | 'mobile';

export function useResponsiveMode(initialMode: ResponsiveMode) {
  const [mode, setMode] = useState<ResponsiveMode>(initialMode);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)');

    function handleChange() {
      setMode(mediaQuery.matches ? 'desktop' : 'mobile');
    }

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return mode;
}
