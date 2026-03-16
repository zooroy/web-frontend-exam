'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import { DetailDialog } from '@/components/home/DetailDialog';
import { DETAIL_DIALOG_OPEN_EVENT } from '@/components/home/DetailTriggerLink';
import { createJobSearchParams } from '@/lib/utils/jobSearchParams';
import type { JobDetail } from '@/types/api';

interface DetailDialogControllerProps {
  companyName: string;
  educationLevel?: number;
  detailId?: number;
  job: JobDetail | null;
  open: boolean;
  page: number;
  salaryLevel?: number;
}

export function DetailDialogController({
  companyName,
  educationLevel,
  detailId,
  job,
  open,
  page,
  salaryLevel,
}: DetailDialogControllerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingDetailId, setPendingDetailId] = useState<number | undefined>(
    detailId,
  );
  const activeDetailId = detailId ?? pendingDetailId;
  const isDialogOpen = typeof activeDetailId === 'number';
  const displayJob =
    isDialogOpen && job?.id === activeDetailId && typeof detailId === 'number'
      ? job
      : null;

  useEffect(() => {
    function handlePendingOpen(event: Event) {
      const customEvent = event as CustomEvent<{ detailId?: number }>;

      if (typeof customEvent.detail?.detailId === 'number') {
        setPendingDetailId(customEvent.detail.detailId);
      }
    }

    window.addEventListener(DETAIL_DIALOG_OPEN_EVENT, handlePendingOpen);

    return function cleanup() {
      window.removeEventListener(DETAIL_DIALOG_OPEN_EVENT, handlePendingOpen);
    };
  }, []);

  useEffect(() => {
    if (typeof detailId === 'number' || open) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setPendingDetailId(undefined);
    }, 0);

    return function cleanup() {
      window.clearTimeout(timeoutId);
    };
  }, [detailId, open]);

  function handleClose() {
    const searchParams = createJobSearchParams({
      companyName,
      educationLevel,
      page,
      salaryLevel,
    });
    const search = searchParams.toString();

    setPendingDetailId(undefined);

    startTransition(() => {
      router.replace(search ? `${pathname}?${search}` : pathname, {
        scroll: false,
      });
    });
  }

  return (
    <DetailDialog
      job={displayJob}
      open={isDialogOpen}
      pending={isPending || (isDialogOpen && displayJob === null)}
      onClose={handleClose}
    />
  );
}
