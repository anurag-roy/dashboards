import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@workspace/ui/lib/utils';

const progressBarVariants = tv({
  slots: { background: '', bar: '' },
  variants: {
    variant: {
      default: {
        background: 'bg-primary/15 dark:bg-primary/25',
        bar: 'bg-primary',
      },
      neutral: {
        background: 'bg-muted',
        bar: 'bg-muted-foreground/60',
      },
      warning: {
        background: 'bg-amber-200/80 dark:bg-amber-500/30',
        bar: 'bg-amber-500',
      },
      error: {
        background: 'bg-destructive/15 dark:bg-destructive/25',
        bar: 'bg-destructive',
      },
      success: {
        background: 'bg-emerald-200/80 dark:bg-emerald-500/30',
        bar: 'bg-emerald-500',
      },
    },
  },
  defaultVariants: { variant: 'default' },
});

export type ProgressBarProps = React.HTMLProps<HTMLDivElement> &
  VariantProps<typeof progressBarVariants> & {
    value?: number;
    max?: number;
    showAnimation?: boolean;
    label?: string;
  };

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ value = 0, max = 100, label, showAnimation = false, variant, className, ...props }, forwardedRef) => {
    const safeValue = Math.min(max, Math.max(value, 0));
    const { background, bar } = progressBarVariants({ variant });
    return (
      <div ref={forwardedRef} className={cn('flex w-full items-center', className)} {...props}>
        <div
          className={cn('relative flex h-2 w-full items-center rounded-full', background())}
          aria-label='progress bar'
          aria-valuenow={value}
          aria-valuemax={max}
        >
          <div
            className={cn(
              'h-full flex-col rounded-full',
              bar(),
              showAnimation && 'transform-gpu transition-all duration-300 ease-in-out'
            )}
            style={{ width: max ? `${(safeValue / max) * 100}%` : `${safeValue}%` }}
          />
        </div>
        {label ? <span className='ml-2 text-sm font-medium whitespace-nowrap text-foreground'>{label}</span> : null}
      </div>
    );
  }
);
ProgressBar.displayName = 'ProgressBar';
