import { Suspense } from 'react';

import { DetailDialogController } from '@/components/common/DetailDialogController';
import { HeroSection } from '@/components/common/HeroSection';
import { JobFilters } from '@/components/common/JobFilters';
import {
  JobResultsSection,
  JobResultsSectionSkeleton,
} from '@/components/common/JobResultsSection';
import { type JobSearchState } from '@/lib/utils/jobSearchParams';
import type { EducationItem, JobDetail, SalaryItem } from '@/types/api';

interface HomePageShellProps {
  detailJob: JobDetail | null;
  educationLevels: EducationItem[];
  headers: Headers;
  initialMode: 'desktop' | 'mobile';
  salaryLevels: SalaryItem[];
  searchState: JobSearchState;
}

export function HomePageShell({
  detailJob,
  educationLevels,
  headers,
  initialMode,
  salaryLevels,
  searchState,
}: HomePageShellProps) {
  const jobResultsSuspenseKey = [
    initialMode,
    searchState.companyName,
    searchState.educationLevel,
    searchState.salaryLevel,
    searchState.page,
  ].join(':');

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
            <Suspense
              key={jobResultsSuspenseKey}
              fallback={<JobResultsSectionSkeleton initialMode={initialMode} />}
            >
              {/* <JobResultsSectionSkeleton initialMode={initialMode} /> */}
              <JobResultsSection
                educationLevels={educationLevels}
                headers={headers}
                initialMode={initialMode}
                salaryLevels={salaryLevels}
                searchState={searchState}
              />
            </Suspense>
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
