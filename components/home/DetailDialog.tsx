'use client';

import dynamic from 'next/dynamic';
import { Dialog as DialogPrimitive } from 'radix-ui';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { JobDetail } from '@/types/api';

const DetailCarousel = dynamic(
  () =>
    import('@/components/home/DetailCarousel').then((module) => ({
      default: module.DetailCarousel,
    })),
  {
    loading: () => <DetailCarouselFallback />,
    ssr: false,
  },
);

const JobDescription = dynamic(
  () =>
    import('@/components/home/JobDescription').then((module) => ({
      default: module.JobDescription,
    })),
  {
    loading: () => <JobDescriptionFallback />,
    ssr: false,
  },
);

interface DetailDialogProps {
  job: JobDetail | null;
  onClose: () => void;
  open: boolean;
  pending?: boolean;
}

function DetailCarouselFallback() {
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

function JobDescriptionFallback() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-full rounded-none bg-[var(--color-gray-300)]" />
      <Skeleton className="h-4 w-11/12 rounded-none bg-[var(--color-gray-300)]" />
      <Skeleton className="h-4 w-10/12 rounded-none bg-[var(--color-gray-300)]" />
      <Skeleton className="h-4 w-4/5 rounded-none bg-[var(--color-gray-300)]" />
    </div>
  );
}

function JobHeaderFallback() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-6 w-40 rounded bg-[var(--color-gray-300)] sm:h-7 sm:w-52" />
      <Skeleton className="h-4 w-32 rounded bg-[var(--color-gray-300)] sm:h-5 sm:w-40" />
    </div>
  );
}

export function DetailDialog({
  job,
  onClose,
  open,
  pending = false,
}: DetailDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogPortal>
        <DialogOverlay className="!bg-overlay backdrop-blur-none supports-backdrop-filter:backdrop-blur-none" />
        <DialogPrimitive.Content
          className={cn(
            'fixed top-1/2 left-1/2 z-50 flex max-h-[min(768px,calc(100vh-44px))] w-[min(750px,calc(100vw-44px))] max-w-none -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[4px] bg-background shadow-[var(--shadow-modal)] outline-none',
            'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          )}
        >
          <DialogHeader className="flex justify-center border-b border-[var(--border-default)] px-4 h-[57px] sm:px-6 sm:h-[62px]">
            <DialogTitle className="!body4 font-bold text-foreground sm:!body5">
              詳細資訊
            </DialogTitle>
          </DialogHeader>
          <div
            aria-busy={pending}
            className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 sm:gap-[18px] sm:px-6 sm:py-5"
          >
            {job ? (
              <div className="flex flex-wrap flex-col gap-x-2 gap-y-1 sm:flex-row sm:items-center">
                <span className="body4 font-bold text-foreground sm:body5">
                  {job.companyName}
                </span>
                <span className="body2 font-normal text-foreground sm:body4">
                  {job.jobTitle}
                </span>
              </div>
            ) : (
              <JobHeaderFallback />
            )}
            {open && job ? (
              <DetailCarousel images={job.companyPhoto} />
            ) : (
              <DetailCarouselFallback />
            )}
            <div className="flex flex-col gap-2 sm:gap-2">
              <h3 className="body3 font-bold text-foreground sm:body4">
                工作內容
              </h3>
              <div className="body3 font-normal leading-[1.25] text-[var(--color-gray-800)] [&_a]:font-bold [&_a]:text-primary [&_a]:underline [&_h1]:body4 [&_h1]:font-bold [&_h2]:body3 [&_h2]:mt-5 [&_h2]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-4">
                {open && job ? (
                  <JobDescription description={job.description} />
                ) : (
                  <JobDescriptionFallback />
                )}
              </div>
            </div>
          </div>
          <div className="flex h-[50px] items-center justify-end gap-2 border-t border-[var(--border-default)] bg-background px-2 py-2 sm:h-[52px]">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="body2 rounded-[4px] h-7 font-normal text-foreground sm:h-9"
              >
                關閉
              </Button>
            </DialogClose>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
