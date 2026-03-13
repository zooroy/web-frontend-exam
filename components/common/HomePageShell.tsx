'use client';

import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { startTransition, useMemo, useState } from 'react';

import { BrandButton } from '@/components/common/BrandButton';
import { DetailDialog } from '@/components/common/DetailDialog';
import { FilterSelect } from '@/components/common/FilterSelect';
import { FilterTextField } from '@/components/common/FilterTextField';
import { HeroSection } from '@/components/common/HeroSection';
import { JobCard } from '@/components/common/JobCard';
import { useResponsiveMode } from '@/hooks/useResponsiveMode';
import { jobQueries } from '@/lib/queries/jobs';
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
  const [selectedEducation, setSelectedEducation] = useState<string>('');
  const [selectedSalary, setSelectedSalary] = useState<string>('');
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  const jobsQuery = useQuery({
    ...jobQueries.list({
      companyName: filters.companyName || undefined,
      educationLevel: filters.educationLevel,
      page: 1,
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

  return (
    <div className="min-h-screen bg-[var(--color-gray-300)]">
      <HeroSection logoSrc="/next.svg" />
      <main className="relative z-10 mx-auto -mt-3 max-w-[1440px] px-3 pb-10 sm:-mt-10 sm:px-6 sm:pb-16 lg:px-7">
        <section className="rounded-[12px] bg-background px-4 py-5 shadow-[var(--shadow-card)] sm:px-6 sm:py-6">
          <div className="flex flex-col gap-5">
            <header className="space-y-2">
              <h1 className="body4 font-bold text-foreground sm:body7">
                適合前端工程師的好工作
              </h1>
              <p className="body2 font-normal text-muted-foreground">
                依教育程度、薪資範圍與公司名稱快速縮小範圍，找到值得點開詳細資訊的職缺。
              </p>
            </header>
            {isDesktop ? (
              <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1.15fr_auto] lg:items-end">
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
                <FilterTextField
                  label="公司名稱"
                  placeholder="輸入公司名稱"
                  value={draftCompanyName}
                  onChange={(event) => {
                    setDraftCompanyName(event.target.value);
                  }}
                />
                <BrandButton
                  className="w-full lg:w-[172px]"
                  onClick={handleSearch}
                >
                  <Search className="size-4" />
                  條件搜尋
                </BrandButton>
              </div>
            ) : null}
            <div
              className={
                isDesktop
                  ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
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
