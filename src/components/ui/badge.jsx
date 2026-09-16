import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-surface text-ink-soft border border-line',
        blue: 'bg-accent/15 text-accent border border-accent/30',
        emerald: 'bg-positive/15 text-positive border border-positive/30',
        amber: 'bg-warn/15 text-warn border border-warn/30',
        rose: 'bg-negative/15 text-negative border border-negative/30',
        violet: 'bg-violet-500/15 text-violet-300 border border-violet-500/30',
        outline: 'text-ink-faint border border-line',
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