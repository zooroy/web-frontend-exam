'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface FilterSelectOption {
  label: string;
  value: string;
}

interface FilterSelectProps {
  disabled?: boolean;
  label: string;
  onValueChange: (value: string) => void;
  options: FilterSelectOption[];
  placeholder: string;
  value?: string;
}

export function FilterSelect({
  disabled = false,
  label,
  onValueChange,
  options,
  placeholder,
  value,
}: FilterSelectProps) {
  return (
    <div className="relative h-[56px] w-full min-w-0">
      <label className="body1 absolute top-0 left-3 z-10 -translate-y-1/2 bg-[var(--color-gray-100)] px-1 font-normal leading-none text-foreground">
        {label}
      </label>
      <Select disabled={disabled} value={value} onValueChange={onValueChange}>
        <SelectTrigger
          className={cn(
            'body3 !h-[56px] w-full rounded-[4px] border-[var(--color-gray-500)] bg-[var(--color-gray-100)] px-4 text-left font-normal text-foreground shadow-none',
            'data-[placeholder]:text-foreground',
            'disabled:bg-[var(--color-gray-100)] disabled:text-muted-foreground disabled:opacity-100',
          )}
          aria-label={label}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-[4px] border-[var(--color-gray-500)] bg-[var(--color-gray-100)]">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
