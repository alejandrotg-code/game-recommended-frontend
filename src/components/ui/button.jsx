import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-accent hover:bg-accent-2 text-white shadow-sm',
        tactical: 'bg-surface hover:bg-surface-2 text-ink border border-line hover:border-accent/40',
        outline: 'border border-line hover:border-line-strong bg-transparent text-ink-soft hover:text-ink',
        ghost: 'hover:bg-surface-2 text-ink-faint hover:text-ink',
        emerald: 'bg-positive hover:bg-positive/90 text-white shadow-sm',
        amber: 'bg-warn hover:bg-warn/90 text-white shadow-sm',
        rose: 'bg-negative hover:bg-negative/90 text-white shadow-sm',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-7 px-3 text-[11px]',
        lg: 'h-11 px-6 text-sm',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';

export { Button };