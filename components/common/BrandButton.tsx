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
        'body3 h-14 rounded-[4px] px-5 font-normal text-white shadow-none',
        'bg-[var(--primary)] hover:bg-[var(--primary)]',
        'disabled:bg-[var(--color-gray-700)] disabled:text-white disabled:opacity-100',
        className,
      )}
      {...props}
    />
  );
}
