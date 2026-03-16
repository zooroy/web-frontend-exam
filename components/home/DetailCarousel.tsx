'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import type { SyntheticEvent } from 'react';

interface DetailCarouselProps {
  images?: string[];
  loading?: boolean;
}

interface ImageDimensions {
  height: number;
  width: number;
}

const AUTO_PLAY_DELAY = 4000;
const IMAGE_FALLBACK_HEIGHT = 150;
const IMAGE_FALLBACK_WIDTH = 250;
const VISIBLE_IMAGE_RADIUS = 2;

export function DetailCarousel({
  images = [],
  loading = false,
}: DetailCarouselProps) {
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
  const isLoading = loading || images.length === 0;

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
    isLoading ? (
      <DetailCarouselLoading />
    ) : (
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
              <CarouselSlide
                image={image}
                imageDimensions={imageDimensions[image]}
                index={index}
                isLoaded={loadedImages[image]}
                isVisible={Math.abs(index - activePage) <= VISIBLE_IMAGE_RADIUS}
                onImageLoad={handleImageLoad}
                onLoadStateChange={(nextLoaded) => {
                  if (!nextLoaded) {
                    return;
                  }

                  setLoadedImages((previousImages) => ({
                    ...previousImages,
                    [image]: true,
                  }));
                }}
              />
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
    )
  );
}

function DetailCarouselLoading() {
  return (
    <div className="flex flex-col gap-[10px]">
      <Skeleton className="h-[150px] w-full rounded-none bg-[var(--color-gray-300)]" />
      <div className="flex justify-center gap-2">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton
            key={index + 1}
            className={cn(
              'rounded-full bg-[var(--color-gray-500)]',
              index === 0 ? 'h-[6px] w-6 bg-primary' : 'size-[6px]',
            )}
          />
        ))}
      </div>
    </div>
  );
}

interface CarouselSlideProps {
  image: string;
  imageDimensions?: ImageDimensions;
  index: number;
  isLoaded?: boolean;
  isVisible: boolean;
  onImageLoad: (
    imageKey: string,
    event: SyntheticEvent<HTMLImageElement>,
  ) => void;
  onLoadStateChange: (nextLoaded: boolean) => void;
}

function CarouselSlide({
  image,
  imageDimensions,
  index,
  isLoaded = false,
  isVisible,
  onImageLoad,
  onLoadStateChange,
}: CarouselSlideProps) {
  const fallbackHeight = imageDimensions?.height ?? IMAGE_FALLBACK_HEIGHT;
  const fallbackWidth = imageDimensions?.width ?? IMAGE_FALLBACK_WIDTH;

  if (!isVisible && !isLoaded) {
    return (
      <div
        aria-hidden="true"
        className="bg-[var(--color-gray-200)]"
        style={{
          height: fallbackHeight,
          width: fallbackWidth,
        }}
      />
    );
  }

  return (
    <div className="relative overflow-hidden">
      {!isLoaded ? (
        <Skeleton
          aria-hidden="true"
          className="rounded-none"
          style={{
            height: fallbackHeight,
            width: fallbackWidth,
          }}
        />
      ) : null}
      <Image
        alt={`工作圖片 ${index + 1}`}
        className={cn(
          'h-auto w-auto max-w-none transition-opacity duration-200',
          isLoaded ? 'opacity-100' : 'absolute inset-0 opacity-0',
        )}
        draggable={false}
        height={fallbackHeight}
        src={image}
        unoptimized
        width={fallbackWidth}
        onLoad={(event) => {
          onImageLoad(image, event);
          onLoadStateChange(true);
        }}
      />
    </div>
  );
}
