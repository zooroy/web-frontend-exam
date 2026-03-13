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
    <label className="flex w-full min-w-0 flex-col gap-2">
      <span className="body1 font-bold text-muted-foreground">{label}</span>
      <Select disabled={disabled} value={value} onValueChange={onValueChange}>
        <SelectTrigger
          className={cn(
            'body2 h-14 w-full rounded-[4px] border-[var(--border-default)] bg-white px-4 text-left text-foreground shadow-none',
            'disabled:bg-white disabled:text-muted-foreground disabled:opacity-100',
          )}
          aria-label={label}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-[4px] border-[var(--border-default)] bg-white">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
