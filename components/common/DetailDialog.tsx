'use client';

import { Dialog as DialogPrimitive } from 'radix-ui';

import { DetailCarousel } from '@/components/common/DetailCarousel';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { JobDetail } from '@/types/api';

interface DetailDialogProps {
  job: JobDetail | null;
  onClose: () => void;
  open: boolean;
}

export function DetailDialog({ job, onClose, open }: DetailDialogProps) {
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
        <DialogOverlay className="bg-overlay backdrop-blur-none" />
        <DialogPrimitive.Content
          className={cn(
            'fixed top-1/2 left-1/2 z-50 flex w-[min(750px,calc(100vw-44px))] max-w-none -translate-x-1/2 -translate-y-1/2 flex-col gap-6 rounded-[12px] border border-[var(--border-default)] bg-background px-5 py-6 shadow-[var(--shadow-modal)] outline-none sm:px-8',
            'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          )}
        >
          <DialogHeader className="gap-2">
            <DialogTitle className="body3 font-bold text-foreground sm:body5">
              {job?.jobTitle ?? '工作詳細資訊'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex min-h-[420px] flex-col gap-6 sm:min-h-[460px]">
            <DetailCarousel images={job?.companyPhoto ?? []} />
            <div
              className="body2 max-h-[42vh] overflow-y-auto font-normal leading-7 text-foreground [&_a]:font-bold [&_a]:text-primary [&_a]:underline [&_h1]:body4 [&_h1]:font-bold [&_h2]:body3 [&_h2]:mt-5 [&_h2]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-4"
              dangerouslySetInnerHTML={{ __html: job?.description ?? '' }}
            />
          </div>
          <DialogFooter className="-mx-5 -mb-6 border-[var(--border-default)] bg-background px-5 py-4 sm:-mx-8 sm:px-8">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="body2 rounded-[4px] border-[var(--border-default)]"
              >
                關閉
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
