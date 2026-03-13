import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { DetailDialogController } from '@/components/common/DetailDialogController';
import { HeroSection } from '@/components/common/HeroSection';
import { JobCard } from '@/components/common/JobCard';
import { JobFilters } from '@/components/common/JobFilters';
import { cn } from '@/lib/utils';
import {
  createJobSearchParams,
  type JobSearchState,
} from '@/lib/utils/jobSearchParams';
import type {
  EducationItem,
  JobDetail,
  JobListResponse,
  SalaryItem,
} from '@/types/api';

interface HomePageShellProps {
  detailJob: JobDetail | null;
  educationLevels: EducationItem[];
  initialMode: 'desktop' | 'mobile';
  jobs: JobListResponse;
  salaryLevels: SalaryItem[];
  searchState: JobSearchState;
}

type PaginationItem = number | 'ellipsis';

function buildLabelMap(items: Array<EducationItem | SalaryItem>) {
  return new Map(items.map((item) => [item.id, item.label]));
}

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

function buildHref(
  searchState: JobSearchState,
  overrides: Partial<JobSearchState>,
) {
  const searchParams = createJobSearchParams({
    companyName: searchState.companyName,
    detailId: searchState.detailId,
    educationLevel: searchState.educationLevel,
    page: searchState.page,
    salaryLevel: searchState.salaryLevel,
    ...overrides,
  });
  const search = searchParams.toString();

  return search ? `/?${search}` : '/';
}

export function HomePageShell({
  detailJob,
  educationLevels,
  initialMode,
  jobs,
  salaryLevels,
  searchState,
}: HomePageShellProps) {
  const isDesktop = initialMode === 'desktop';
  const educationMap = buildLabelMap(educationLevels);
  const salaryMap = buildLabelMap(salaryLevels);
  const totalPages = Math.max(1, Math.ceil(jobs.total / (isDesktop ? 6 : 4)));
  const condensedPaginationItems = buildPaginationItems(
    searchState.page,
    totalPages,
  );
  const fullPaginationItems = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  return (
    <div className="min-h-screen bg-[var(--color-gray-300)]">
      <HeroSection logoSrc="/hero-section/Logo-01.png" />
      <main className="relative z-10 mx-auto max-w-[1440px] px-3 pb-10 sm:-mt-[124px] sm:px-7 sm:pb-16">
        <section className="flex flex-col rounded-[12px] border border-[var(--border-default)] bg-background px-4 py-4 shadow-[2px_2px_3.5px_rgba(0,0,0,0.25)] sm:min-h-[678px] sm:px-6 sm:py-6">
          <div className="flex flex-1 flex-col gap-5 sm:gap-6">
            <header>
              <div className="flex items-center gap-3">
                <span className="h-4 w-1 rounded-[4px] bg-primary" />
                <h1 className="body3 font-bold text-foreground sm:body5">
                  適合前端工程師的好工作
                </h1>
              </div>
            </header>
            <JobFilters
              educationLevels={educationLevels}
              initialCompanyName={searchState.companyName}
              initialEducationLevel={searchState.educationLevel}
              initialSalaryLevel={searchState.salaryLevel}
              salaryLevels={salaryLevels}
            />
            <div
              className={
                isDesktop
                  ? 'grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid grid-cols-1 gap-4'
              }
            >
              {jobs.data.map((job) => (
                <JobCard
                  key={job.id}
                  detailHref={buildHref(searchState, {
                    detailId: job.id,
                  })}
                  job={job}
                  educationLabel={educationMap.get(job.educationId) ?? '未提供'}
                  salaryLabel={salaryMap.get(job.salaryId) ?? '未提供'}
                  selected={searchState.detailId === job.id}
                />
              ))}
            </div>
            {totalPages > 1 ? (
              <nav aria-label="工作列表分頁" className="mt-auto pt-1">
                <div className="hidden items-center justify-center gap-[18px] sm:flex">
                  <Link
                    href={buildHref(searchState, {
                      detailId: undefined,
                      page: Math.max(searchState.page - 1, 1),
                    })}
                    aria-label="上一頁"
                    className={cn(
                      'flex h-8 w-8 items-center justify-center text-[var(--color-gray-700)] transition-colors hover:text-foreground',
                      searchState.page === 1 &&
                        'pointer-events-none text-[var(--color-gray-500)]',
                    )}
                  >
                    <ChevronLeft className="size-5" />
                  </Link>
                  {fullPaginationItems.map((pageNumber) => (
                    <Link
                      key={pageNumber}
                      href={buildHref(searchState, {
                        detailId: undefined,
                        page: pageNumber,
                      })}
                      aria-current={
                        searchState.page === pageNumber ? 'page' : undefined
                      }
                      className={cn(
                        'body2 flex h-8 min-w-8 items-center justify-center rounded-full px-2 font-normal transition-colors',
                        searchState.page === pageNumber
                          ? 'bg-[var(--color-gray-300)] text-foreground'
                          : 'text-foreground hover:text-[var(--color-gray-700)]',
                      )}
                    >
                      {pageNumber}
                    </Link>
                  ))}
                  <Link
                    href={buildHref(searchState, {
                      detailId: undefined,
                      page: Math.min(searchState.page + 1, totalPages),
                    })}
                    aria-label="下一頁"
                    className={cn(
                      'flex h-8 w-8 items-center justify-center text-[var(--color-gray-700)] transition-colors hover:text-foreground',
                      searchState.page === totalPages &&
                        'pointer-events-none text-[var(--color-gray-500)]',
                    )}
                  >
                    <ChevronRight className="size-5" />
                  </Link>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 sm:hidden">
                  <Link
                    href={buildHref(searchState, {
                      detailId: undefined,
                      page: Math.max(searchState.page - 1, 1),
                    })}
                    aria-label="上一頁"
                    className={cn(
                      'flex h-8 w-8 items-center justify-center text-[var(--color-gray-700)] transition-colors hover:text-foreground',
                      searchState.page === 1 &&
                        'pointer-events-none text-[var(--color-gray-500)]',
                    )}
                  >
                    <ChevronLeft className="size-5" />
                  </Link>
                  {condensedPaginationItems.map((item, index) => {
                    if (item === 'ellipsis') {
                      return (
                        <span
                          key={`pagination-slot-${index + 1}`}
                          className="body2 flex h-8 min-w-6 items-center justify-center text-foreground"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <Link
                        key={`pagination-slot-${index + 1}`}
                        href={buildHref(searchState, {
                          detailId: undefined,
                          page: item,
                        })}
                        aria-current={
                          searchState.page === item ? 'page' : undefined
                        }
                        className={cn(
                          'body2 flex h-8 min-w-8 items-center justify-center rounded-full px-2 font-normal transition-colors',
                          searchState.page === item
                            ? 'bg-[var(--color-gray-300)] text-foreground'
                            : 'text-foreground hover:text-[var(--color-gray-700)]',
                        )}
                      >
                        {item}
                      </Link>
                    );
                  })}
                  <Link
                    href={buildHref(searchState, {
                      detailId: undefined,
                      page: Math.min(searchState.page + 1, totalPages),
                    })}
                    aria-label="下一頁"
                    className={cn(
                      'flex h-8 w-8 items-center justify-center text-[var(--color-gray-700)] transition-colors hover:text-foreground',
                      searchState.page === totalPages &&
                        'pointer-events-none text-[var(--color-gray-500)]',
                    )}
                  >
                    <ChevronRight className="size-5" />
                  </Link>
                </div>
              </nav>
            ) : null}
          </div>
        </section>
      </main>
      <DetailDialogController
        companyName={searchState.companyName}
        educationLevel={searchState.educationLevel}
        job={detailJob}
        open={Boolean(searchState.detailId && detailJob)}
        page={searchState.page}
        salaryLevel={searchState.salaryLevel}
      />
    </div>
  );
}
