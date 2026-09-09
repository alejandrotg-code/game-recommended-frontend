import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[#0f1520] text-slate-300 border border-[#1b2434]',
        blue: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
        emerald: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
        amber: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
        rose: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
        violet: 'bg-violet-500/15 text-violet-300 border border-violet-500/30',
        outline: 'text-slate-400 border border-[#1b2434]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge };
