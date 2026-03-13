'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DetailCarouselProps {
  desktopSlidesPerView?: number;
  images: string[];
  mobileSlidesPerView?: number;
}

type ResponsiveMode = 'desktop' | 'mobile';

function getGridClass(slidesPerView: number) {
  if (slidesPerView <= 1) {
    return 'grid-cols-1';
  }

  if (slidesPerView === 2) {
    return 'grid-cols-2';
  }

  if (slidesPerView === 3) {
    return 'grid-cols-3';
  }

  return 'grid-cols-4';
}

export function DetailCarousel({
  desktopSlidesPerView = 3,
  images,
  mobileSlidesPerView = 1,
}: DetailCarouselProps) {
  const [mode, setMode] = useState<ResponsiveMode>('mobile');
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const slidesPerView =
    mode === 'desktop' ? desktopSlidesPerView : mobileSlidesPerView;
  const safeSlidesPerView = Math.max(1, slidesPerView);
  const maxIndex = Math.max(images.length - safeSlidesPerView, 0);
  const safeCurrentIndex = Math.min(currentIndex, maxIndex);
  const visibleImages = images.slice(
    safeCurrentIndex,
    safeCurrentIndex + safeSlidesPerView,
  );
  const dotIndexes = useMemo(
    () => Array.from({ length: maxIndex + 1 }, (_, index) => index),
    [maxIndex],
  );

  function handlePrevious() {
    setCurrentIndex((previousIndex) => Math.max(previousIndex - 1, 0));
  }

  function handleNext() {
    setCurrentIndex((previousIndex) => Math.min(previousIndex + 1, maxIndex));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      handlePrevious();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      handleNext();
    }
  }

  return (
    <div className="flex flex-col gap-4" onKeyDown={handleKeyDown}>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 rounded-full border-[var(--border-default)] bg-background"
          onClick={handlePrevious}
          disabled={safeCurrentIndex === 0}
          aria-label="上一張圖片"
        >
          <ChevronLeft />
        </Button>
        <div
          className={cn('grid flex-1 gap-3', getGridClass(safeSlidesPerView))}
        >
          {visibleImages.map((image, index) => (
            <div
              key={`${image}-${safeCurrentIndex + index + 1}`}
              className="overflow-hidden rounded-[8px] bg-[var(--color-gray-300)]"
            >
              <Image
                src={image}
                alt={`工作圖片 ${safeCurrentIndex + index + 1}`}
                width={640}
                height={384}
                className="h-auto w-full object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 rounded-full border-[var(--border-default)] bg-background"
          onClick={handleNext}
          disabled={safeCurrentIndex === maxIndex}
          aria-label="下一張圖片"
        >
          <ChevronRight />
        </Button>
      </div>
      <div className="flex justify-center gap-2">
        {dotIndexes.map((dotIndex) => (
          <button
            key={dotIndex}
            type="button"
            className={cn(
              'size-2 rounded-full bg-[var(--color-gray-500)] transition-colors',
              dotIndex === safeCurrentIndex && 'bg-primary',
            )}
            onClick={() => {
              setCurrentIndex(dotIndex);
            }}
            aria-label={`前往第 ${dotIndex + 1} 組圖片`}
            aria-pressed={dotIndex === safeCurrentIndex}
          />
        ))}
      </div>
    </div>
  );
}
