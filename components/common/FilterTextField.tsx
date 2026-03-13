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
    <label className="flex w-full min-w-0 flex-col gap-2">
      <span className="body1 font-bold text-muted-foreground">{label}</span>
      <Input
        disabled={disabled}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          'body2 h-14 rounded-[4px] border-[var(--border-default)] bg-white px-4 text-foreground shadow-none',
          'placeholder:text-muted-foreground disabled:bg-white disabled:text-muted-foreground disabled:opacity-100',
        )}
        aria-label={label}
      />
    </label>
  );
}
