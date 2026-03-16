import { JobCard } from '@/components/home/JobCard';
import { Pagination } from '@/components/home/Pagination';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getJobList } from '@/lib/api/jobs.server';
import { cn } from '@/lib/utils';
import {
  createJobSearchParams,
  type JobSearchState,
} from '@/lib/utils/jobSearchParams';
import type { EducationItem, SalaryItem } from '@/types/api';

interface JobResultsSectionProps {
  educationLevels: EducationItem[];
  headers: Headers;
  initialMode: 'desktop' | 'mobile';
  salaryLevels: SalaryItem[];
  searchState: JobSearchState;
}

function buildLabelMap(items: Array<EducationItem | SalaryItem>) {
  return new Map(items.map((item) => [item.id, item.label]));
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

function getPerPage(initialMode: 'desktop' | 'mobile') {
  return initialMode === 'desktop' ? 6 : 4;
}

export async function JobResultsSection({
  educationLevels,
  headers,
  initialMode,
  salaryLevels,
  searchState,
}: JobResultsSectionProps) {
  const jobs = await getJobList(headers, {
    companyName: searchState.companyName || undefined,
    educationLevel: searchState.educationLevel,
    page: searchState.page,
    perPage: getPerPage(initialMode),
    salaryLevel: searchState.salaryLevel,
  });
  const educationMap = buildLabelMap(educationLevels);
  const salaryMap = buildLabelMap(salaryLevels);
  const totalPages = Math.max(
    1,
    Math.ceil(jobs.total / getPerPage(initialMode)),
  );

  if (jobs.data.length === 0) {
    return <EmptyResultsState initialMode={initialMode} />;
  }

  return (
    <>
      <div
        className={
          initialMode === 'desktop'
            ? 'grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3'
            : 'grid grid-cols-1 gap-4'
        }
      >
        {jobs.data.map((job) => (
          <div key={job.id}>
            <JobCard
              detailHref={buildHref(searchState, {
                detailId: job.id,
              })}
              detailId={job.id}
              job={job}
              educationLabel={educationMap.get(job.educationId) ?? '未提供'}
              salaryLabel={salaryMap.get(job.salaryId) ?? '未提供'}
              selected={searchState.detailId === job.id}
            />
          </div>
        ))}
      </div>
      <div className="mt-3">
        <Pagination
          currentPage={searchState.page}
          pageHrefs={Array.from({ length: totalPages }, (_, index) =>
            buildHref(searchState, {
              detailId: undefined,
              page: index + 1,
            }),
          )}
          totalPages={totalPages}
        />
      </div>
    </>
  );
}

interface EmptyResultsStateProps {
  initialMode: 'desktop' | 'mobile';
}

function EmptyResultsState({ initialMode }: EmptyResultsStateProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-[6px] border border-[var(--border-default)]',
        initialMode === 'desktop' ? 'min-h-[458px]' : 'min-h-[240px]',
      )}
    >
      <p className="body3 font-normal text-muted-foreground">無資料</p>
    </div>
  );
}

function LoadingCardSkeleton() {
  return (
    <Card className="!ring-0 gap-[10px] rounded-[6px] border border-[var(--color-gray-500)] bg-background px-4 !py-4 shadow-none min-h-[220px] max-h-[220px]">
      <CardContent className="flex min-h-[148px] flex-col gap-[10px] px-0 py-0">
        <Skeleton className="h-5 w-28 rounded sm:h-[30px] sm:w-36" />
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <Skeleton className="mt-px size-[18px] shrink-0 rounded-full" />
            <Skeleton className="h-[18px] w-40 rounded" />
          </div>
          <div className="flex items-start gap-2">
            <Skeleton className="mt-px size-[18px] shrink-0 rounded-full" />
            <Skeleton className="h-[18px] w-20 rounded" />
          </div>
          <div className="flex items-start gap-2">
            <Skeleton className="mt-px size-[18px] shrink-0 rounded-full" />
            <Skeleton className="h-[18px] w-32 rounded" />
          </div>
        </div>
        <div className="grid h-[35px] gap-2 overflow-hidden">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
        </div>
      </CardContent>
      <CardFooter className="justify-center rounded-none border-0 bg-background px-0 py-0">
        <Skeleton className="h-5 w-20 rounded" />
      </CardFooter>
    </Card>
  );
}

interface JobResultsSectionSkeletonProps {
  initialMode: 'desktop' | 'mobile';
}

export function JobResultsSectionSkeleton({
  initialMode,
}: JobResultsSectionSkeletonProps) {
  const skeletonCount = initialMode === 'desktop' ? 6 : 4;

  return (
    <>
      <div
        className={
          initialMode === 'desktop'
            ? 'grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3'
            : 'grid grid-cols-1 gap-4'
        }
      >
        {Array.from({ length: skeletonCount }, (_, index) => (
          <div key={index + 1}>
            <LoadingCardSkeleton />
          </div>
        ))}
      </div>
      <div className="mt-auto hidden items-center justify-center gap-[18px] pt-1 sm:flex">
        {Array.from({ length: 7 }, (_, index) => (
          <Skeleton key={index + 1} className="h-8 w-8 rounded-full" />
        ))}
      </div>
    </>
  );
}
