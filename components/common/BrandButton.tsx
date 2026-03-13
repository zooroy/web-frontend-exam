import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BrandButtonProps {
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  form?: string;
  name?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'reset' | 'submit';
  value?: number | readonly string[] | string;
}

export function BrandButton({
  className,
  disabled,
  type = 'button',
  ...props
}: BrandButtonProps) {
  return (
    <Button
      type={type}
      disabled={disabled}
      className={cn(
        'body3 h-[56px] rounded-[4px] px-[22px] font-normal text-[var(--color-gray-100)] shadow-none',
        'bg-[var(--color-gray-700)] hover:bg-[var(--color-gray-1000)]',
        'disabled:bg-[var(--color-gray-700)] disabled:text-[var(--color-gray-100)] disabled:opacity-100',
        className,
      )}
      {...props}
    />
  );
}
