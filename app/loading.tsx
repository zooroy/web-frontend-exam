import { Skeleton } from '@/components/ui/skeleton';

function LoadingCardSkeleton() {
  return (
    <div className="flex min-h-[218px] flex-col gap-[10px] rounded-[6px] border border-[var(--color-gray-500)] bg-background px-4 py-4">
      <Skeleton className="h-8 w-28 rounded sm:h-10 sm:w-36" />
      <div className="grid gap-2">
        <Skeleton className="h-[18px] w-40 rounded" />
        <Skeleton className="h-[18px] w-20 rounded" />
        <Skeleton className="h-[18px] w-32 rounded" />
      </div>
      <div className="mt-1 grid gap-2">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
      </div>
      <div className="mt-auto flex justify-center">
        <Skeleton className="h-5 w-20 rounded" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--color-gray-300)]">
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,var(--color-gray-700)_0%,var(--color-gray-1000)_100%)]">
        <div className="mx-auto flex min-h-[260px] max-w-[1440px] items-end px-3 pt-4 sm:min-h-[823px] sm:px-0 sm:pt-0">
          <div className="relative h-[220px] w-full sm:h-[823px]">
            <Skeleton className="absolute inset-0 rounded-none bg-[var(--color-gray-1000)]/35" />
            <Skeleton className="absolute inset-y-0 left-0 w-[76.18%] rounded-none bg-[var(--color-gray-300)]/25" />
            <Skeleton className="absolute right-[4%] bottom-[13%] h-[92px] w-[42%] max-w-[240px] rounded-[12px] bg-[var(--color-gray-300)]/45 sm:right-[3.4%] sm:bottom-[16.4%] sm:h-[180px] sm:w-[37.5%] sm:max-w-[540px]" />
          </div>
        </div>
      </section>
      <main className="relative z-10 mx-auto max-w-[1440px] px-3 pb-10 sm:-mt-[124px] sm:px-7 sm:pb-16">
        <section className="flex flex-col rounded-[12px] border border-[var(--border-default)] bg-background px-4 py-4 shadow-[2px_2px_3.5px_rgba(0,0,0,0.25)] sm:min-h-[678px] sm:px-6 sm:py-6">
          <div className="flex flex-1 flex-col gap-5 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="h-4 w-1 rounded-[4px] bg-primary" />
              <Skeleton className="h-8 w-48 rounded sm:h-10 sm:w-72" />
            </div>
            <div className="hidden items-end gap-[18px] sm:grid sm:grid-cols-2 lg:grid-cols-[minmax(0,1.33fr)_minmax(0,1fr)_minmax(0,1fr)_104px]">
              <Skeleton className="h-[56px] rounded-[4px] border border-[var(--color-gray-500)] bg-[var(--color-gray-100)]" />
              <Skeleton className="h-[56px] rounded-[4px] border border-[var(--color-gray-500)] bg-[var(--color-gray-100)]" />
              <Skeleton className="h-[56px] rounded-[4px] border border-[var(--color-gray-500)] bg-[var(--color-gray-100)]" />
              <Skeleton className="h-[56px] rounded-[4px] bg-[var(--color-gray-700)]" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[18px]">
              {Array.from({ length: 6 }, (_, index) => (
                <LoadingCardSkeleton key={index + 1} />
              ))}
            </div>
            <div className="mt-auto hidden items-center justify-center gap-[18px] pt-1 sm:flex">
              {Array.from({ length: 7 }, (_, index) => (
                <Skeleton key={index + 1} className="h-8 w-8 rounded-full" />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
