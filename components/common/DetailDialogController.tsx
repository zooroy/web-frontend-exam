'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { DetailDialog } from '@/components/common/DetailDialog';
import { createJobSearchParams } from '@/lib/utils/jobSearchParams';
import type { JobDetail } from '@/types/api';

interface DetailDialogControllerProps {
  companyName: string;
  educationLevel?: number;
  job: JobDetail | null;
  mode?: 'desktop' | 'mobile';
  open: boolean;
  page: number;
  salaryLevel?: number;
}

export function DetailDialogController({
  companyName,
  educationLevel,
  job,
  mode,
  open,
  page,
  salaryLevel,
}: DetailDialogControllerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [displayJob, setDisplayJob] = useState<JobDetail | null>(job);

  useEffect(() => {
    if (!open || !job) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setDisplayJob(job);
    }, 0);

    return function cleanup() {
      window.clearTimeout(timeoutId);
    };
  }, [job, open]);

  function handleClose() {
    const searchParams = createJobSearchParams({
      companyName,
      educationLevel,
      mode,
      page,
      salaryLevel,
    });
    const search = searchParams.toString();

    router.replace(search ? `${pathname}?${search}` : pathname, {
      scroll: false,
    });
  }

  return <DetailDialog job={displayJob} open={open} onClose={handleClose} />;
}
