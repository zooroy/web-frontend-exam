'use client';

import { BrandButton } from '@/components/common/BrandButton';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-gray-300)] px-4 py-10">
      <div className="flex w-full max-w-[560px] flex-col gap-6 rounded-[12px] border border-[var(--border-default)] bg-background px-6 py-8 shadow-[var(--shadow-card)]">
        <div className="flex flex-col gap-3">
          <p className="body2 font-bold text-primary">Something went wrong</p>
          <h1 className="body4 font-bold text-foreground">頁面載入失敗</h1>
          <p className="body2 font-normal text-muted-foreground">
            目前無法完成資料載入，請重新嘗試。
          </p>
          {error.message ? (
            <p className="body2 rounded-[6px] bg-[var(--color-gray-300)] px-4 py-3 font-normal text-foreground">
              {error.message}
            </p>
          ) : null}
        </div>
        <div className="flex justify-end">
          <BrandButton onClick={reset}>重新整理</BrandButton>
        </div>
      </div>
    </div>
  );
}
