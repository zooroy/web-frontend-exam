'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface ResponsiveModeSyncProps {
  initialMode: 'desktop' | 'mobile';
}

export function ResponsiveModeSync({ initialMode }: ResponsiveModeSyncProps) {
  const router = useRouter();
  const previousModeRef = useRef(initialMode);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)');

    function syncMode() {
      const nextMode = mediaQuery.matches ? 'desktop' : 'mobile';
      const currentCookieMode = document.cookie
        .split('; ')
        .find((cookieValue) => cookieValue.startsWith('viewport-mode='))
        ?.split('=')[1];
      const previousMode = previousModeRef.current;

      document.cookie = `viewport-mode=${nextMode}; path=/; max-age=31536000; samesite=lax`;

      if (nextMode === previousMode && currentCookieMode === nextMode) {
        return;
      }

      previousModeRef.current = nextMode;
      router.refresh();
    }

    syncMode();
    mediaQuery.addEventListener('change', syncMode);

    return function cleanup() {
      mediaQuery.removeEventListener('change', syncMode);
    };
  }, [initialMode, router]);

  return null;
}
