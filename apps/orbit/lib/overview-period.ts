import { eachDayOfInterval, interval, isAfter, isValid, subDays, subYears } from 'date-fns';
import type { DateRange } from 'react-day-picker';

import type { PeriodValue } from '@/lib/types/overview';

type CompleteDateRange = {
  from: Date;
  to: Date;
};

const isValidRangeDate = (date: Date | undefined): date is Date => date instanceof Date && isValid(date);

export const getCompleteDateRange = (dateRange: DateRange | undefined): CompleteDateRange | null => {
  const from = dateRange?.from;
  const to = dateRange?.to;

  if (!isValidRangeDate(from) || !isValidRangeDate(to) || isAfter(from, to)) {
    return null;
  }

  return { from, to };
};

export const getPeriod = (dateRange: DateRange | undefined, value: PeriodValue): DateRange | undefined => {
  if (!dateRange) {
    return undefined;
  }
  const from = isValidRangeDate(dateRange.from) ? dateRange.from : undefined;
  const to = isValidRangeDate(dateRange.to) ? dateRange.to : undefined;

  switch (value) {
    case 'previous-period': {
      let previousPeriodFrom: Date | undefined;
      let previousPeriodTo: Date | undefined;
      if (from && to && !isAfter(from, to)) {
        const datesInterval = interval(from, to);
        const numberOfDaysBetween = eachDayOfInterval(datesInterval).length;
        previousPeriodTo = subDays(from, 1);
        previousPeriodFrom = subDays(previousPeriodTo, numberOfDaysBetween);
      }
      return { from: previousPeriodFrom, to: previousPeriodTo };
    }
    case 'last-year': {
      let lastYearFrom: Date | undefined;
      let lastYearTo: Date | undefined;
      if (from) {
        lastYearFrom = subYears(from, 1);
      }
      if (to) {
        lastYearTo = subYears(to, 1);
      }
      return { from: lastYearFrom, to: lastYearTo };
    }
    case 'no-comparison':
      return undefined;
  }
};
