'use client';

import Link from 'next/link';

import { preloadJobDetail } from '@/lib/api/jobs.client';

interface DetailTriggerLinkProps {
  children: React.ReactNode;
  className?: string;
  detailId: number;
  href: string;
}

const DETAIL_DIALOG_OPEN_EVENT = 'job-detail:open-pending';

export function DetailTriggerLink({
  children,
  className,
  detailId,
  href,
}: DetailTriggerLinkProps) {
  return (
    <Link
      href={href}
      scroll={false}
      className={className}
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent(DETAIL_DIALOG_OPEN_EVENT, {
            detail: { detailId },
          }),
        );
        void preloadJobDetail(detailId);
      }}
    >
      {children}
    </Link>
  );
}

export { DETAIL_DIALOG_OPEN_EVENT };
