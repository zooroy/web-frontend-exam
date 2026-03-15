'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function ResponsiveModeSync() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)');

    function syncMode() {
      const nextMode = mediaQuery.matches ? 'desktop' : 'mobile';
      const currentMode = searchParams.get('mode');

      if (currentMode === nextMode) {
        return;
      }

      const nextSearchParams = new URLSearchParams(searchParams.toString());

      nextSearchParams.set('mode', nextMode);

      const search = nextSearchParams.toString();

      router.replace(search ? `${pathname}?${search}` : pathname, {
        scroll: false,
      });
    }

    syncMode();
    mediaQuery.addEventListener('change', syncMode);

    return function cleanup() {
      mediaQuery.removeEventListener('change', syncMode);
    };
  }, [pathname, router, searchParams]);

  return null;
}
