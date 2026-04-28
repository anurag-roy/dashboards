'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { isAfter, isBefore, startOfDay } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { Button } from '@workspace/ui/components/button';
import { Calendar } from '@workspace/ui/components/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover';
import { cn } from '@workspace/ui/lib/utils';

import { useMediaQuery } from '@/lib/use-media-query';

type DateRangePickerProps = {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  fromDate?: Date;
  toDate?: Date;
  disabled?: boolean;
  className?: string;
  align?: 'start' | 'center' | 'end';
  placeholder?: string;
};

export function DateRangePicker({
  value,
  onChange,
  fromDate,
  toDate,
  disabled,
  className,
  align = 'center',
  placeholder = 'Select date range',
}: DateRangePickerProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<DateRange | undefined>(value);

  React.useEffect(() => {
    setDraft(value);
  }, [value]);

  const display =
    value?.from && value?.to ? `${format(value.from, 'dd MMM, yyyy')} - ${format(value.to, 'dd MMM, yyyy')}` : null;

  const onCancel = () => {
    setDraft(value);
    setOpen(false);
  };

  const onApply = () => {
    onChange?.(draft);
    setOpen(false);
  };

  const disabledDays = React.useCallback(
    (date: Date) => {
      const d = startOfDay(date);
      if (fromDate && isBefore(d, startOfDay(fromDate))) {
        return true;
      }
      if (toDate && isAfter(d, startOfDay(toDate))) {
        return true;
      }
      return false;
    },
    [fromDate, toDate]
  );

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          onCancel();
        } else {
          setDraft(value);
        }
        setOpen(o);
      }}
    >
      <PopoverTrigger
        render={
          <Button
            type='button'
            variant='outline'
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal sm:w-fit',
              !display && 'text-muted-foreground',
              className
            )}
          >
            <CalendarIcon className='mr-2 size-4' />
            {display ?? <span>{placeholder}</span>}
          </Button>
        }
      />
      <PopoverContent className='w-auto p-0' align={align} sideOffset={10}>
        <div className='flex max-w-[100vw] flex-col'>
          <div className='overflow-x-auto'>
            <Calendar
              mode='range'
              numberOfMonths={isDesktop ? 2 : 1}
              selected={draft}
              onSelect={setDraft}
              disabled={disabledDays}
              defaultMonth={draft?.from}
            />
          </div>
          <div className='border-t border-border p-3'>
            <p className='text-sm text-foreground tabular-nums'>
              <span className='text-muted-foreground'>Range: </span>
              <span className='font-medium'>
                {draft?.from && draft?.to
                  ? `${format(draft.from, 'dd MMM, yyyy')} - ${format(draft.to, 'dd MMM, yyyy')}`
                  : '—'}
              </span>
            </p>
            <div className='mt-3 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
              <Button type='button' variant='secondary' className='w-full sm:w-auto' onClick={onCancel}>
                Cancel
              </Button>
              <Button
                type='button'
                className='w-full sm:w-auto'
                onClick={onApply}
                disabled={!draft?.from || !draft?.to}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
