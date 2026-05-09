import { eachDayOfInterval, interval, subDays, subYears } from 'date-fns';
import type { DateRange } from 'react-day-picker';

import type { PeriodValue } from '@/lib/types/overview';

export const getPeriod = (dateRange: DateRange | undefined, value: PeriodValue): DateRange | undefined => {
  if (!dateRange) {
    return undefined;
  }
  const from = dateRange.from;
  const to = dateRange.to;
  switch (value) {
    case 'previous-period': {
      let previousPeriodFrom: Date | undefined;
      let previousPeriodTo: Date | undefined;
      if (from && to) {
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
