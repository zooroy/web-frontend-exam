'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { startTransition, useMemo, useState } from 'react';

import { BrandButton } from '@/components/common/BrandButton';
import { DetailDialog } from '@/components/common/DetailDialog';
import { FilterSelect } from '@/components/common/FilterSelect';
import { FilterTextField } from '@/components/common/FilterTextField';
import { HeroSection } from '@/components/common/HeroSection';
import { JobCard } from '@/components/common/JobCard';
import { useResponsiveMode } from '@/hooks/useResponsiveMode';
import { jobQueries } from '@/lib/queries/jobs';
import { cn } from '@/lib/utils';
import type { EducationItem, JobListResponse, SalaryItem } from '@/types/api';

interface HomePageShellProps {
  initialEducationLevels: EducationItem[];
  initialMode: 'desktop' | 'mobile';
  initialJobs: JobListResponse;
  initialSalaryLevels: SalaryItem[];
}

interface FiltersState {
  companyName: string;
  educationLevel?: number;
  salaryLevel?: number;
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

export function HomePageShell({
  initialEducationLevels,
  initialMode,
  initialJobs,
  initialSalaryLevels,
}: HomePageShellProps) {
  const mode = useResponsiveMode(initialMode);
  const isDesktop = mode === 'desktop';
  const perPage = isDesktop ? 6 : 4;

  const [filters, setFilters] = useState<FiltersState>({ companyName: '' });
  const [draftCompanyName, setDraftCompanyName] = useState('');
  const [page, setPage] = useState(1);
  const [selectedEducation, setSelectedEducation] = useState<string>('');
  const [selectedSalary, setSelectedSalary] = useState<string>('');
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const shouldUseInitialJobs =
    page === 1 &&
    !filters.companyName &&
    typeof filters.educationLevel === 'undefined' &&
    typeof filters.salaryLevel === 'undefined' &&
    initialJobs.data.length === perPage;

  const jobsQuery = useQuery({
    ...jobQueries.list({
      companyName: filters.companyName || undefined,
      educationLevel: filters.educationLevel,
      page,
      perPage,
      salaryLevel: filters.salaryLevel,
    }),
    initialData: shouldUseInitialJobs ? initialJobs : undefined,
    placeholderData: (previousData) => previousData,
  });

  const educationLevelsQuery = useQuery({
    ...jobQueries.educationLevels(),
    initialData: initialEducationLevels,
  });
  const salaryLevelsQuery = useQuery({
    ...jobQueries.salaryLevels(),
    initialData: initialSalaryLevels,
  });
  const detailQuery = useQuery({
    ...jobQueries.detail(selectedJobId ?? 1),
    enabled: selectedJobId !== null,
  });

  const educationMap = useMemo(
    () => buildLabelMap(educationLevelsQuery.data),
    [educationLevelsQuery.data],
  );
  const salaryMap = useMemo(
    () => buildLabelMap(salaryLevelsQuery.data),
    [salaryLevelsQuery.data],
  );

  function handleSearch() {
    startTransition(() => {
      setPage(1);
      setFilters({
        companyName: draftCompanyName.trim(),
        educationLevel: selectedEducation
          ? Number(selectedEducation)
          : undefined,
        salaryLevel: selectedSalary ? Number(selectedSalary) : undefined,
      });
    });
  }

  function handleCloseDetail() {
    setSelectedJobId(null);
  }

  function handlePageChange(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) {
      return;
    }

    startTransition(() => {
      setPage(nextPage);
    });
  }

  const desktopFilterOptionsEducation = educationLevelsQuery.data.map(
    (item) => ({
      value: String(item.id),
      label: item.label,
    }),
  );
  const desktopFilterOptionsSalary = salaryLevelsQuery.data.map((item) => ({
    value: String(item.id),
    label: item.label,
  }));
  const totalPages = Math.max(
    1,
    Math.ceil((jobsQuery.data?.total ?? 0) / perPage),
  );
  const condensedPaginationItems = buildPaginationItems(page, totalPages);
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
            {isDesktop ? (
              <div className="grid items-end gap-[18px] lg:grid-cols-[minmax(0,1.33fr)_minmax(0,1fr)_minmax(0,1fr)_104px]">
                <FilterTextField
                  label="公司名稱"
                  placeholder="輸入公司名稱"
                  value={draftCompanyName}
                  onChange={(event) => {
                    setDraftCompanyName(event.target.value);
                  }}
                />
                <FilterSelect
                  label="學歷"
                  placeholder="請選擇學歷"
                  value={selectedEducation}
                  onValueChange={setSelectedEducation}
                  options={desktopFilterOptionsEducation}
                />
                <FilterSelect
                  label="薪資範圍"
                  placeholder="請選擇薪資條件"
                  value={selectedSalary}
                  onValueChange={setSelectedSalary}
                  options={desktopFilterOptionsSalary}
                />
                <BrandButton className="w-full px-0" onClick={handleSearch}>
                  條件搜尋
                </BrandButton>
              </div>
            ) : null}
            <div
              className={
                isDesktop
                  ? 'grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid grid-cols-1 gap-4'
              }
            >
              {jobsQuery.data?.data.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  educationLabel={educationMap.get(job.educationId) ?? '未提供'}
                  salaryLabel={salaryMap.get(job.salaryId) ?? '未提供'}
                  selected={selectedJobId === job.id}
                  onDetailClick={() => {
                    setSelectedJobId(job.id);
                  }}
                />
              ))}
            </div>
            {totalPages > 1 ? (
              <nav aria-label="工作列表分頁" className="mt-auto pt-1">
                <div className="hidden items-center justify-center gap-[18px] sm:flex">
                  <button
                    type="button"
                    aria-label="上一頁"
                    disabled={page === 1}
                    className="flex h-8 w-8 items-center justify-center text-[var(--color-gray-700)] transition-colors hover:text-foreground disabled:text-[var(--color-gray-500)]"
                    onClick={() => {
                      handlePageChange(page - 1);
                    }}
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  {fullPaginationItems.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      aria-current={page === pageNumber ? 'page' : undefined}
                      className={cn(
                        'body2 flex h-8 min-w-8 items-center justify-center rounded-full px-2 font-normal transition-colors',
                        page === pageNumber
                          ? 'bg-[var(--color-gray-300)] text-foreground'
                          : 'text-foreground hover:text-[var(--color-gray-700)]',
                      )}
                      onClick={() => {
                        handlePageChange(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  <button
                    type="button"
                    aria-label="下一頁"
                    disabled={page === totalPages}
                    className="flex h-8 w-8 items-center justify-center text-[var(--color-gray-700)] transition-colors hover:text-foreground disabled:text-[var(--color-gray-500)]"
                    onClick={() => {
                      handlePageChange(page + 1);
                    }}
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 sm:hidden">
                  <button
                    type="button"
                    aria-label="上一頁"
                    disabled={page === 1}
                    className="flex h-8 w-8 items-center justify-center text-[var(--color-gray-700)] transition-colors hover:text-foreground disabled:text-[var(--color-gray-500)]"
                    onClick={() => {
                      handlePageChange(page - 1);
                    }}
                  >
                    <ChevronLeft className="size-5" />
                  </button>
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
                      <button
                        key={`pagination-slot-${index + 1}`}
                        type="button"
                        aria-current={page === item ? 'page' : undefined}
                        className={cn(
                          'body2 flex h-8 min-w-8 items-center justify-center rounded-full px-2 font-normal transition-colors',
                          page === item
                            ? 'bg-[var(--color-gray-300)] text-foreground'
                            : 'text-foreground hover:text-[var(--color-gray-700)]',
                        )}
                        onClick={() => {
                          handlePageChange(item);
                        }}
                      >
                        {item}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    aria-label="下一頁"
                    disabled={page === totalPages}
                    className="flex h-8 w-8 items-center justify-center text-[var(--color-gray-700)] transition-colors hover:text-foreground disabled:text-[var(--color-gray-500)]"
                    onClick={() => {
                      handlePageChange(page + 1);
                    }}
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </div>
              </nav>
            ) : null}
          </div>
        </section>
      </main>
      <DetailDialog
        open={selectedJobId !== null}
        onClose={handleCloseDetail}
        job={detailQuery.data ?? null}
      />
    </div>
  );
}
