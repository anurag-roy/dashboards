import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

const progressCircleVariants = tv({
  slots: { background: '', circle: '' },
  variants: {
    variant: {
      default: {
        background: 'stroke-primary/20 dark:stroke-primary/30',
        circle: 'stroke-primary',
      },
      neutral: {
        background: 'stroke-muted',
        circle: 'stroke-muted-foreground/70',
      },
      warning: {
        background: 'stroke-amber-200 dark:stroke-amber-500/30',
        circle: 'stroke-amber-500',
      },
      error: {
        background: 'stroke-destructive/15 dark:stroke-destructive/25',
        circle: 'stroke-destructive',
      },
      success: {
        background: 'stroke-emerald-200 dark:stroke-emerald-500/30',
        circle: 'stroke-emerald-500',
      },
    },
  },
  defaultVariants: { variant: 'default' },
});

export type ProgressCircleProps = Omit<React.SVGProps<SVGSVGElement>, 'value'> &
  VariantProps<typeof progressCircleVariants> & {
    value?: number;
    max?: number;
    showAnimation?: boolean;
    radius?: number;
    strokeWidth?: number;
  };

export const ProgressCircle = React.forwardRef<SVGSVGElement, ProgressCircleProps>(
  (
    {
      value = 0,
      max = 100,
      radius = 32,
      strokeWidth = 6,
      showAnimation = true,
      variant,
      className,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const safeValue = Math.min(max, Math.max(value, 0));
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const offset = circumference - (safeValue / max) * circumference;
    const { background, circle } = progressCircleVariants({ variant });
    return (
      <div className='relative'>
        <svg
          ref={forwardedRef}
          width={radius * 2}
          height={radius * 2}
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
          className={cn('-rotate-90 transform', className)}
          role='progressbar'
          aria-label='progress'
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          {...props}
        >
          <circle
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeWidth={strokeWidth}
            fill='transparent'
            className={cn('transition-colors ease-linear', background())}
          />
          {safeValue >= 0 ? (
            <circle
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={offset}
              fill='transparent'
              className={cn(
                'transition-colors ease-linear',
                circle(),
                showAnimation && 'transform-gpu transition-all duration-300 ease-in-out'
              )}
            />
          ) : null}
        </svg>
        <div className='absolute inset-0 flex items-center justify-center'>{children}</div>
      </div>
    );
  }
);
ProgressCircle.displayName = 'ProgressCircle';
