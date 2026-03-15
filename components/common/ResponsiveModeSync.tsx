'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ResponsiveModeSync() {
  const router = useRouter();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)');

    function syncMode() {
      const nextMode = mediaQuery.matches ? 'desktop' : 'mobile';
      const currentMode = document.cookie
        .split('; ')
        .find((cookieValue) => cookieValue.startsWith('viewport-mode='))
        ?.split('=')[1];

      if (currentMode === nextMode) {
        return;
      }

      document.cookie = `viewport-mode=${nextMode}; path=/; max-age=31536000; samesite=lax`;
      router.refresh();
    }

    syncMode();
    mediaQuery.addEventListener('change', syncMode);

    return function cleanup() {
      mediaQuery.removeEventListener('change', syncMode);
    };
  }, [router]);

  return null;
}
