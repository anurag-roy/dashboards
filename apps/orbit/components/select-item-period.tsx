'use client';

import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import * as React from 'react';

import { SelectItem } from '@workspace/ui/components/select';
import { cn } from '@workspace/ui/lib/utils';

type SelectItemPeriodProps = React.ComponentProps<typeof SelectItem> & {
  period?: DateRange | undefined;
};

export function SelectItemPeriod({ className, children, period, ...props }: SelectItemPeriodProps) {
  const itemLabel =
    typeof children === 'string' ? children : typeof children === 'number' ? String(children) : undefined;

  return (
    <SelectItem className={cn(className)} label={itemLabel} {...props}>
      <div className='flex w-full max-w-[min(100vw,28rem)] min-w-0 items-center justify-between gap-2'>
        <span className='w-40 shrink-0 sm:w-32'>{children}</span>
        {period?.from && period?.to ? (
          <span className='truncate text-xs font-normal text-muted-foreground sm:text-sm'>
            {format(period.from, 'MMM d, yyyy')} – {format(period.to, 'MMM d, yyyy')}
          </span>
        ) : null}
      </div>
    </SelectItem>
  );
}
