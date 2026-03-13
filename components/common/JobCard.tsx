import { BookOpenText, CircleDollarSign } from 'lucide-react';

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
  icon: typeof BookOpenText;
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
        'gap-0 rounded-[8px] border border-[var(--border-default)] bg-background py-0 shadow-[var(--shadow-card)] transition-[border-color,box-shadow,transform] duration-200',
        'sm:hover:-translate-y-0.5 sm:hover:border-primary sm:hover:shadow-[0_10px_24px_rgb(0_0_0_/_0.12)]',
        selected &&
          'border-primary shadow-[0_10px_24px_rgb(238_137_39_/_0.18)]',
      )}
    >
      <CardContent className="flex flex-col gap-4 px-5 py-5">
        <h3 className="body3 font-bold text-foreground sm:body5">
          {job.companyName}
        </h3>
        <div className="flex flex-col gap-2">
          <InformationRow icon={BookOpenText}>{educationLabel}</InformationRow>
          <InformationRow icon={CircleDollarSign}>{salaryLabel}</InformationRow>
        </div>
        <p className="body2 line-clamp-2 min-h-[2.5rem] font-normal text-foreground">
          {job.preview}
        </p>
      </CardContent>
      <CardFooter className="justify-center border-t border-[var(--border-default)] bg-background px-5 py-4">
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
