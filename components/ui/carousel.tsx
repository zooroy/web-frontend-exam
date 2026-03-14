'use client';

import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CarouselApi = NonNullable<UseEmblaCarouselType[1]>;

interface CarouselProps {
  api?: CarouselApi;
  className?: string;
  opts?: Parameters<typeof useEmblaCarousel>[0];
  orientation?: 'horizontal' | 'vertical';
  plugins?: Parameters<typeof useEmblaCarousel>[1];
  setApi?: (api: CarouselApi) => void;
}

interface CarouselContextProps extends CarouselProps {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  canScrollNext: boolean;
  canScrollPrev: boolean;
  scrollNext: () => void;
  scrollPrev: () => void;
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}

function Carousel({
  api,
  className,
  children,
  opts,
  orientation = 'horizontal',
  plugins,
  setApi,
}: React.PropsWithChildren<CarouselProps>) {
  const [carouselRef, carouselApi] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === 'horizontal' ? 'x' : 'y',
    },
    plugins,
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((currentApi: CarouselApi) => {
    setCanScrollPrev(currentApi.canScrollPrev());
    setCanScrollNext(currentApi.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    carouselApi?.scrollPrev();
  }, [carouselApi]);

  const scrollNext = React.useCallback(() => {
    carouselApi?.scrollNext();
  }, [carouselApi]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollPrev();
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollNext, scrollPrev],
  );

  React.useEffect(() => {
    if (!carouselApi || !setApi) {
      return undefined;
    }

    setApi(carouselApi);

    return undefined;
  }, [carouselApi, setApi]);

  React.useEffect(() => {
    if (!carouselApi) {
      return undefined;
    }

    onSelect(carouselApi);
    carouselApi.on('reInit', onSelect);
    carouselApi.on('select', onSelect);

    return () => {
      carouselApi.off('reInit', onSelect);
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        api,
        canScrollNext,
        canScrollPrev,
        carouselRef,
        className,
        opts,
        orientation,
        plugins,
        scrollNext,
        scrollPrev,
        setApi,
      }}
    >
      <div
        aria-roledescription="carousel"
        className={cn('relative', className)}
        onKeyDownCapture={handleKeyDown}
        role="region"
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: React.ComponentProps<'div'>) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        className={cn(
          'flex',
          orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.ComponentProps<'div'>) {
  const { orientation } = useCarousel();

  return (
    <div
      aria-roledescription="slide"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal' ? 'pl-4' : 'pt-4',
        className,
      )}
      role="group"
      {...props}
    />
  );
}

function CarouselPrevious({
  className,
  variant = 'outline',
  ...props
}: React.ComponentProps<typeof Button>) {
  const { canScrollPrev, orientation, scrollPrev } = useCarousel();

  return (
    <Button
      className={cn(
        'size-8 rounded-full',
        orientation === 'horizontal'
          ? '-left-12 top-1/2 -translate-y-1/2'
          : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
        'absolute',
        className,
      )}
      disabled={!canScrollPrev}
      type="button"
      variant={variant}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="size-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}

function CarouselNext({
  className,
  variant = 'outline',
  ...props
}: React.ComponentProps<typeof Button>) {
  const { canScrollNext, orientation, scrollNext } = useCarousel();

  return (
    <Button
      className={cn(
        'size-8 rounded-full',
        orientation === 'horizontal'
          ? '-right-12 top-1/2 -translate-y-1/2'
          : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
        'absolute',
        className,
      )}
      disabled={!canScrollNext}
      type="button"
      variant={variant}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="size-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
};
