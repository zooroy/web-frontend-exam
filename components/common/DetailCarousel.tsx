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

import type { SyntheticEvent } from 'react';

interface DetailCarouselProps {
  images: string[];
}

interface ImageDimensions {
  height: number;
  width: number;
}

const AUTO_PLAY_DELAY = 4000;
const IMAGE_FALLBACK_HEIGHT = 150;
const IMAGE_FALLBACK_WIDTH = 250;

export function DetailCarousel({ images }: DetailCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [activePage, setActivePage] = useState(0);
  const [imageDimensions, setImageDimensions] = useState<
    Record<string, ImageDimensions>
  >({});
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [snapCount, setSnapCount] = useState(1);
  const dotIndexes = Array.from({ length: snapCount }, (_, index) => index);

  useEffect(() => {
    if (!api) {
      return undefined;
    }

    const currentApi = api;

    function handleSelect() {
      setActivePage(currentApi.selectedScrollSnap());
      setSnapCount(currentApi.scrollSnapList().length);
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

    api.reInit({
      align: 'start',
      containScroll: 'trimSnaps',
      dragFree: false,
      loop: false,
      skipSnaps: false,
    });

    return undefined;
  }, [api, imageDimensions, images.length]);

  useEffect(() => {
    if (!api || snapCount <= 1 || isHovered || isInteracting) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      api.scrollNext();
    }, AUTO_PLAY_DELAY);

    return function cleanup() {
      window.clearInterval(intervalId);
    };
  }, [api, isHovered, isInteracting, snapCount]);

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

  function handleImageLoad(
    imageKey: string,
    event: SyntheticEvent<HTMLImageElement>,
  ) {
    const target = event.currentTarget;
    const nextDimensions = {
      height: target.naturalHeight,
      width: target.naturalWidth,
    };

    setImageDimensions((previousDimensions) => {
      const currentDimensions = previousDimensions[imageKey];

      if (
        currentDimensions?.width === nextDimensions.width &&
        currentDimensions?.height === nextDimensions.height
      ) {
        return previousDimensions;
      }

      return {
        ...previousDimensions,
        [imageKey]: nextDimensions,
      };
    });
  }

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
              className="basis-auto pl-2"
            >
              <div className="relative overflow-hidden bg-[var(--color-gray-300)]">
                {!loadedImages[image] ? (
                  <div
                    aria-hidden="true"
                    className="animate-pulse bg-[var(--color-gray-300)]"
                    style={{
                      height:
                        imageDimensions[image]?.height ?? IMAGE_FALLBACK_HEIGHT,
                      width:
                        imageDimensions[image]?.width ?? IMAGE_FALLBACK_WIDTH,
                    }}
                  />
                ) : null}
                <Image
                  alt={`工作圖片 ${index + 1}`}
                  className={cn(
                    'h-auto w-auto max-w-none transition-opacity duration-200',
                    loadedImages[image]
                      ? 'opacity-100'
                      : 'absolute inset-0 opacity-0',
                  )}
                  draggable={false}
                  height={
                    imageDimensions[image]?.height ?? IMAGE_FALLBACK_HEIGHT
                  }
                  src={image}
                  unoptimized
                  width={imageDimensions[image]?.width ?? IMAGE_FALLBACK_WIDTH}
                  onLoad={(event) => {
                    handleImageLoad(image, event);
                    setLoadedImages((previousImages) => ({
                      ...previousImages,
                      [image]: true,
                    }));
                  }}
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
