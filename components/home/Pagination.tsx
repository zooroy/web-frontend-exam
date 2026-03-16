'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useTransition } from 'react';

import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  pageHrefs: string[];
  totalPages: number;
}

type PaginationItem = number | 'ellipsis';

function buildPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      'ellipsis',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    'ellipsis',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis',
    totalPages,
  ];
}

function getPageHref(pageHrefs: string[], page: number) {
  return pageHrefs[page - 1] ?? '/';
}

function PaginationPageLink({
  disabled,
  href,
  isCurrent,
  label,
  onNavigate,
}: {
  disabled: boolean;
  href: string;
  isCurrent: boolean;
  label: number;
  onNavigate: (href: string) => void;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={isCurrent ? 'page' : undefined}
      aria-disabled={disabled}
      onClick={
        disabled
          ? undefined
          : (event) => {
              event.preventDefault();
              onNavigate(href);
            }
      }
      className={cn(
        'body2 flex h-8 min-w-8 items-center justify-center rounded-full px-2 font-normal transition-colors',
        isCurrent
          ? 'bg-[var(--color-gray-300)] text-foreground'
          : 'text-foreground hover:text-[var(--color-gray-700)]',
        disabled && 'pointer-events-none',
      )}
    >
      {label}
    </Link>
  );
}

function PaginationArrowLink({
  direction,
  disabled,
  href,
  onNavigate,
}: {
  direction: 'next' | 'prev';
  disabled: boolean;
  href: string;
  onNavigate: (href: string) => void;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-label={direction === 'prev' ? '上一頁' : '下一頁'}
      aria-disabled={disabled}
      onClick={
        disabled
          ? undefined
          : (event) => {
              event.preventDefault();
              onNavigate(href);
            }
      }
      className={cn(
        'flex h-8 w-8 items-center justify-center text-[var(--color-gray-700)] transition-colors hover:text-foreground',
        disabled &&
          'pointer-events-none text-[var(--color-gray-500)] opacity-60',
      )}
    >
      {direction === 'prev' ? (
        <ChevronLeft className="size-5" />
      ) : (
        <ChevronRight className="size-5" />
      )}
    </Link>
  );
}

function PaginationEllipsis() {
  return (
    <span className="body2 flex h-8 min-w-6 items-center justify-center text-foreground">
      ...
    </span>
  );
}

function renderPaginationItems(
  items: PaginationItem[],
  currentPage: number,
  isPending: boolean,
  onNavigate: (href: string) => void,
  pageHrefs: string[],
) {
  return items.map((item, index) => {
    if (item === 'ellipsis') {
      return <PaginationEllipsis key={`pagination-slot-${index + 1}`} />;
    }

    return (
      <PaginationPageLink
        key={`pagination-slot-${index + 1}`}
        disabled={isPending || currentPage === item}
        href={getPageHref(pageHrefs, item)}
        isCurrent={currentPage === item}
        label={item}
        onNavigate={onNavigate}
      />
    );
  });
}

export function Pagination({
  currentPage,
  pageHrefs,
  totalPages,
}: PaginationProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const desktopItems = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages],
  );
  const mobileItems = useMemo(
    () => buildPaginationItems(currentPage, totalPages),
    [currentPage, totalPages],
  );

  function handleNavigate(href: string) {
    startTransition(() => {
      router.push(href, { scroll: false });
    });
  }

  return (
    <nav aria-busy={isPending} aria-label="工作列表分頁" className="mt-auto">
      <div className="hidden items-center justify-center gap-[18px] sm:flex">
        <PaginationArrowLink
          direction="prev"
          disabled={isPending || currentPage === 1}
          href={getPageHref(pageHrefs, Math.max(currentPage - 1, 1))}
          onNavigate={handleNavigate}
        />
        {renderPaginationItems(
          desktopItems,
          currentPage,
          isPending,
          handleNavigate,
          pageHrefs,
        )}
        <PaginationArrowLink
          direction="next"
          disabled={isPending || currentPage === totalPages}
          href={getPageHref(pageHrefs, Math.min(currentPage + 1, totalPages))}
          onNavigate={handleNavigate}
        />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 sm:hidden">
        <PaginationArrowLink
          direction="prev"
          disabled={isPending || currentPage === 1}
          href={getPageHref(pageHrefs, Math.max(currentPage - 1, 1))}
          onNavigate={handleNavigate}
        />
        {renderPaginationItems(
          mobileItems,
          currentPage,
          isPending,
          handleNavigate,
          pageHrefs,
        )}
        <PaginationArrowLink
          direction="next"
          disabled={isPending || currentPage === totalPages}
          href={getPageHref(pageHrefs, Math.min(currentPage + 1, totalPages))}
          onNavigate={handleNavigate}
        />
      </div>
    </nav>
  );
}
