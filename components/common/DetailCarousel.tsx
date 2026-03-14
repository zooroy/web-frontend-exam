'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

interface DetailCarouselProps {
  desktopSlidesPerView?: number;
  images: string[];
  mobileSlidesPerView?: number;
}

type ResponsiveMode = 'desktop' | 'mobile';

const AUTO_PLAY_DELAY = 4000;

function getSlideClass(mode: ResponsiveMode, slidesPerView: number) {
  if (mode === 'mobile') {
    return 'basis-full';
  }

  if (slidesPerView === 1) {
    return 'sm:basis-full';
  }

  if (slidesPerView === 2) {
    return 'sm:basis-[calc((100%-8px)/2)]';
  }

  if (slidesPerView === 3) {
    return 'sm:basis-[calc((100%-16px)/3)]';
  }

  return 'sm:basis-[calc((100%-24px)/4)]';
}

function getPageCount(imageCount: number, slidesPerView: number) {
  return Math.max(imageCount - slidesPerView + 1, 1);
}

export function DetailCarousel({
  desktopSlidesPerView = 3,
  images,
  mobileSlidesPerView = 1,
}: DetailCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [mode, setMode] = useState<ResponsiveMode>('mobile');
  const [activePage, setActivePage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)');

    function handleChange() {
      setMode(mediaQuery.matches ? 'desktop' : 'mobile');
    }

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return function cleanup() {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const slidesPerView =
    mode === 'desktop' ? desktopSlidesPerView : mobileSlidesPerView;
  const pageCount = getPageCount(images.length, slidesPerView);
  const dotIndexes = Array.from({ length: pageCount }, (_, index) => index);

  useEffect(() => {
    if (!api) {
      return undefined;
    }

    const currentApi = api;

    function handleSelect() {
      setActivePage(currentApi.selectedScrollSnap());
    }

    handleSelect();
    currentApi.on('select', handleSelect);
    currentApi.on('reInit', handleSelect);

    return function cleanup() {
      currentApi.off('select', handleSelect);
      currentApi.off('reInit', handleSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) {
      return undefined;
    }

    const nextPage = Math.min(api.selectedScrollSnap(), pageCount - 1);

    api.reInit({
      align: 'start',
      containScroll: 'trimSnaps',
      dragFree: false,
      loop: false,
      skipSnaps: false,
    });
    api.scrollTo(nextPage, true);

    return undefined;
  }, [api, pageCount, slidesPerView]);

  useEffect(() => {
    if (!api || pageCount <= 1 || isHovered || isInteracting) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      const nextIndex = activePage >= pageCount - 1 ? 0 : activePage + 1;

      api.scrollTo(nextIndex);
    }, AUTO_PLAY_DELAY);

    return function cleanup() {
      window.clearInterval(intervalId);
    };
  }, [activePage, api, isHovered, isInteracting, pageCount]);

  useEffect(() => {
    if (!api) {
      return undefined;
    }

    const currentApi = api;

    function handlePointerDown() {
      setIsInteracting(true);
    }

    function handleSettle() {
      setIsInteracting(false);
    }

    currentApi.on('pointerDown', handlePointerDown);
    currentApi.on('settle', handleSettle);

    return function cleanup() {
      currentApi.off('pointerDown', handlePointerDown);
      currentApi.off('settle', handleSettle);
    };
  }, [api]);

  return (
    <div
      className="flex flex-col gap-[10px]"
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <Carousel
        className="w-full cursor-grab active:cursor-grabbing"
        opts={{
          align: 'start',
          containScroll: 'trimSnaps',
          dragFree: false,
          loop: false,
          skipSnaps: false,
        }}
        setApi={setApi}
      >
        <CarouselContent className="-ml-2">
          {images.map((image, index) => (
            <CarouselItem
              key={`${image}-${index + 1}`}
              className={cn('pl-2', getSlideClass(mode, slidesPerView))}
            >
              <div
                className={cn(
                  'overflow-hidden bg-[var(--color-gray-300)]',
                  mode === 'desktop' ? 'h-[150px]' : 'aspect-[250/150]',
                )}
              >
                <Image
                  alt={`工作圖片 ${index + 1}`}
                  className="h-full w-full object-cover"
                  draggable={false}
                  height={150}
                  src={image}
                  unoptimized
                  width={250}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="flex justify-center gap-2">
        {dotIndexes.map((dotIndex) => (
          <button
            key={dotIndex}
            aria-label={`前往第 ${dotIndex + 1} 組圖片`}
            aria-pressed={dotIndex === activePage}
            className={cn(
              'rounded-full bg-[var(--color-gray-500)] transition-all duration-200',
              dotIndex === activePage ? 'h-[6px] w-6 bg-primary' : 'size-[6px]',
            )}
            type="button"
            onClick={() => {
              setIsInteracting(true);
              api?.scrollTo(dotIndex);
            }}
          />
        ))}
      </div>
    </div>
  );
}
