import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@workspace/ui/lib/utils';

const insightBadgeVariants = tv({
  base: 'inline-flex items-center gap-x-1 whitespace-nowrap rounded-full px-1.5 py-0.5 text-xs font-semibold ring-1',
  variants: {
    variant: {
      default: 'bg-primary/10 text-primary ring-primary/20 dark:bg-primary/20 dark:ring-primary/30',
      neutral: 'bg-muted text-muted-foreground ring-border dark:bg-muted/60',
      success:
        'bg-emerald-500/10 text-emerald-800 ring-emerald-600/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30',
      error: 'bg-red-500/10 text-red-800 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20',
      warning:
        'bg-amber-500/10 text-amber-800 ring-amber-600/30 dark:bg-amber-500/10 dark:text-amber-500 dark:ring-amber-500/20',
    },
  },
  defaultVariants: { variant: 'default' },
});

export type InsightBadgeProps = React.ComponentPropsWithoutRef<'span'> & VariantProps<typeof insightBadgeVariants>;

export const InsightBadge = React.forwardRef<HTMLSpanElement, InsightBadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(insightBadgeVariants({ variant }), className)} {...props} />
  )
);
InsightBadge.displayName = 'InsightBadge';
