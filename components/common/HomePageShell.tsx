'use client';

import { useQuery } from '@tanstack/react-query';
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

function buildLabelMap(items: Array<EducationItem | SalaryItem>) {
  return new Map(items.map((item) => [item.id, item.label]));
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

  const jobsQuery = useQuery({
    ...jobQueries.list({
      companyName: filters.companyName || undefined,
      educationLevel: filters.educationLevel,
      page,
      perPage,
      salaryLevel: filters.salaryLevel,
    }),
    initialData: initialJobs,
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
  const totalPages = Math.max(1, Math.ceil(jobsQuery.data.total / perPage));
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  return (
    <div className="min-h-screen bg-[var(--color-gray-300)]">
      <HeroSection logoSrc="/hero-section/Logo-01.png" />
      <main className="relative z-10 mx-auto max-w-[1440px] px-3 pb-10 sm:-mt-[124px] sm:px-7 sm:pb-16">
        <section className="rounded-[12px] border border-[var(--border-default)] bg-background px-4 py-4 shadow-[2px_2px_3.5px_rgba(0,0,0,0.25)] sm:min-h-[678px] sm:px-6 sm:py-6">
          <div className="flex flex-col gap-5 sm:gap-6">
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
              {jobsQuery.data.data.map((job) => (
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
              <nav
                aria-label="工作列表分頁"
                className="flex items-center justify-center gap-1.5 pt-1"
              >
                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    aria-current={page === pageNumber ? 'page' : undefined}
                    className={cn(
                      'body2 flex h-8 min-w-8 items-center justify-center rounded-[4px] px-2 font-normal transition-colors',
                      page === pageNumber
                        ? 'bg-primary text-[var(--color-gray-100)]'
                        : 'text-muted-foreground hover:bg-[var(--color-gray-300)] hover:text-foreground',
                    )}
                    onClick={() => {
                      handlePageChange(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </button>
                ))}
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
