'use client';

import { usePathname, useRouter } from 'next/navigation';

import { DetailDialog } from '@/components/common/DetailDialog';
import { createJobSearchParams } from '@/lib/utils/jobSearchParams';
import type { JobDetail } from '@/types/api';

interface DetailDialogControllerProps {
  companyName: string;
  educationLevel?: number;
  job: JobDetail | null;
  open: boolean;
  page: number;
  salaryLevel?: number;
}

export function DetailDialogController({
  companyName,
  educationLevel,
  job,
  open,
  page,
  salaryLevel,
}: DetailDialogControllerProps) {
  const pathname = usePathname();
  const router = useRouter();

  function handleClose() {
    const searchParams = createJobSearchParams({
      companyName,
      educationLevel,
      page,
      salaryLevel,
    });
    const search = searchParams.toString();

    router.replace(search ? `${pathname}?${search}` : pathname, {
      scroll: false,
    });
  }

  return <DetailDialog job={job} open={open} onClose={handleClose} />;
}
