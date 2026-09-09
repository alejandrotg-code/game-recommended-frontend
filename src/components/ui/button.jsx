import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-900/20',
        tactical: 'bg-[#0f1520] hover:bg-[#151d2c] text-slate-200 border border-[#1b2434] hover:border-blue-500/40',
        outline: 'border border-[#1b2434] hover:border-slate-600 bg-transparent text-slate-300 hover:text-white',
        ghost: 'hover:bg-[#151d2c] text-slate-400 hover:text-slate-100',
        emerald: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm',
        amber: 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm',
        rose: 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm',
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

export { Button, buttonVariants };
