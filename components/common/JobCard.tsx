import { BookOpenText, CircleDollarSign, UserRound } from 'lucide-react';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { JobListItem } from '@/types/api';

interface JobCardProps {
  educationLabel: string;
  job: JobListItem;
  onDetailClick: () => void;
  salaryLabel: string;
  selected?: boolean;
}

interface InformationRowProps {
  children: React.ReactNode;
  icon: typeof BookOpenText | typeof CircleDollarSign | typeof UserRound;
}

function InformationRow({ children, icon: Icon }: InformationRowProps) {
  return (
    <div className="body2 flex items-start gap-2 font-normal text-muted-foreground">
      <Icon className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export function JobCard({
  educationLabel,
  job,
  onDetailClick,
  salaryLabel,
  selected = false,
}: JobCardProps) {
  return (
    <Card
      className={cn(
        'gap-[10px] rounded-[6px] border border-[var(--color-gray-500)] bg-background px-4 py-4 shadow-none transition-shadow duration-200',
        'sm:hover:shadow-[0_0_7px_rgba(0,0,0,0.35)]',
        selected && 'shadow-[0_0_7px_rgba(0,0,0,0.35)]',
      )}
    >
      <CardContent className="flex min-h-[148px] flex-col gap-[10px] px-0 py-0">
        <h3 className="body3 font-bold text-foreground sm:body5">
          {job.companyName}
        </h3>
        <div className="flex flex-col gap-2">
          <InformationRow icon={UserRound}>{job.jobTitle}</InformationRow>
          <InformationRow icon={BookOpenText}>{educationLabel}</InformationRow>
          <InformationRow icon={CircleDollarSign}>{salaryLabel}</InformationRow>
        </div>
        <p className="body2 line-clamp-2 min-h-[40px] font-normal text-foreground">
          {job.preview}
        </p>
      </CardContent>
      <CardFooter className="justify-center bg-background px-0 py-0">
        <button
          type="button"
          className="body2 font-bold text-primary transition-colors hover:text-accent"
          onClick={onDetailClick}
        >
          查看細節
        </button>
      </CardFooter>
    </Card>
  );
}
