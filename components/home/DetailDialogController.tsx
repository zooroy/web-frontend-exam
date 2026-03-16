'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';

import { DetailDialog } from '@/components/home/DetailDialog';
import { DETAIL_DIALOG_OPEN_EVENT } from '@/components/home/DetailTriggerLink';
import {
  preloadJobDetail,
  setCachedJobDetail,
} from '@/lib/api/jobs.client';
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
  const [clientJob, setClientJob] = useState<JobDetail | null>(job);
  const [closingJob, setClosingJob] = useState<JobDetail | null>(null);
  const [pendingDetailId, setPendingDetailId] = useState<number | undefined>(
    detailId,
  );
  const closeTimerRef = useRef<number | null>(null);
  const latestDisplayJobRef = useRef<JobDetail | null>(job);
  const activeDetailId = detailId ?? pendingDetailId;
  const isDialogOpen = typeof activeDetailId === 'number';
  const serverJob =
    typeof detailId === 'number' && job?.id === detailId ? job : null;
  const displayJob =
    (isDialogOpen && serverJob?.id === activeDetailId && serverJob) ||
    (isDialogOpen && clientJob?.id === activeDetailId && clientJob) ||
    null;
  const renderedJob = displayJob ?? closingJob;

  useEffect(() => {
    if (!job) {
      return;
    }

    setCachedJobDetail(job);
  }, [job]);

  useEffect(() => {
    if (displayJob) {
      latestDisplayJobRef.current = displayJob;
    }
  }, [displayJob]);

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    },
    [],
  );

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

  useEffect(() => {
    if (typeof activeDetailId !== 'number') {
      return undefined;
    }

    if (serverJob?.id === activeDetailId || clientJob?.id === activeDetailId) {
      return undefined;
    }

    let isCancelled = false;

    void preloadJobDetail(activeDetailId)
      .then((resolvedJob) => {
        if (!isCancelled) {
          setClientJob(resolvedJob);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setClientJob(null);
        }
      });

    return function cleanup() {
      isCancelled = true;
    };
  }, [activeDetailId, clientJob, serverJob]);

  function handleClose() {
    const searchParams = createJobSearchParams({
      companyName,
      educationLevel,
      page,
      salaryLevel,
    });
    const search = searchParams.toString();

    if (latestDisplayJobRef.current) {
      setClosingJob(latestDisplayJobRef.current);
    }

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      setClosingJob(null);
      closeTimerRef.current = null;
    }, 100);

    setPendingDetailId(undefined);

    startTransition(() => {
      router.replace(search ? `${pathname}?${search}` : pathname, {
        scroll: false,
      });
    });
  }

  return (
    <DetailDialog
      job={renderedJob}
      open={isDialogOpen}
      pending={isPending || (isDialogOpen && displayJob === null)}
      onClose={handleClose}
    />
  );
}
