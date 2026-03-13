import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FilterTextFieldProps {
  disabled?: boolean;
  label: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
  value: string;
}

export function FilterTextField({
  disabled = false,
  label,
  onChange,
  placeholder,
  value,
}: FilterTextFieldProps) {
  return (
    <label className="relative flex w-full min-w-0">
      <span className="body1 absolute top-0 left-3 z-10 -translate-y-1/2 bg-[var(--color-gray-100)] px-1 font-normal text-foreground">
        {label}
      </span>
      <Input
        disabled={disabled}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          'body3 h-[56px] rounded-[4px] border-[var(--color-gray-500)] bg-[var(--color-gray-100)] px-4 font-normal text-foreground shadow-none',
          'placeholder:text-foreground disabled:bg-[var(--color-gray-100)] disabled:text-muted-foreground disabled:opacity-100',
        )}
        aria-label={label}
      />
    </label>
  );
}
