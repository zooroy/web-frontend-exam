'use client';

import parse from 'html-react-parser';
import { Dialog as DialogPrimitive } from 'radix-ui';

import { DetailCarousel } from '@/components/common/DetailCarousel';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
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
        <DialogOverlay className="!bg-overlay backdrop-blur-none supports-backdrop-filter:backdrop-blur-none" />
        <DialogPrimitive.Content
          className={cn(
            'fixed top-1/2 left-1/2 z-50 flex w-[min(750px,calc(100vw-44px))] max-w-none -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[4px] bg-background shadow-[var(--shadow-modal)] outline-none',
            'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          )}
        >
          <DialogHeader className="flex justify-center border-b border-[var(--border-default)] px-4 h-[57px] sm:px-6 sm:h-[62px]">
            <DialogTitle className="!body4 font-bold text-foreground sm:!body5">
              詳細資訊
            </DialogTitle>
          </DialogHeader>
          <div className="flex max-h-[min(768px,calc(100vh-120px))] flex-col gap-3 overflow-y-auto px-4 py-4 sm:gap-[18px] sm:px-6 sm:py-5">
            <div className="flex flex-col body4 font-bold text-foreground sm:body5">
              {job?.companyName ?? '未提供公司名稱'}
            </div>
            <DetailCarousel images={job?.companyPhoto ?? []} />
            <div className="flex flex-col gap-2 sm:gap-2">
              <h3 className="body3 font-bold text-foreground sm:body4">
                工作內容
              </h3>
              <div className="body3 font-normal leading-[1.25] text-muted-foreground [&_a]:font-bold [&_a]:text-primary [&_a]:underline [&_h1]:body4 [&_h1]:font-bold [&_h2]:body3 [&_h2]:mt-5 [&_h2]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-4">
                {parse(job?.description ?? '')}
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
