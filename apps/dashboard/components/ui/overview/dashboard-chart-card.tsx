import { LineChart } from '@/components/line-chart';
import { InsightBadge } from '@workspace/ui/components/insight-badge';
import { getBadgeType } from '@/lib/chart-helpers';
import { overviews } from '@/lib/data/overview-data';
import type { OverviewData } from '@/lib/data/schema';
import { formatters, percentageFormatter } from '@/lib/utils';
import type { PeriodValue } from '@/lib/types/overview';
import { cn } from '@/lib/utils';
import { eachDayOfInterval, formatDate, interval, isWithinInterval } from 'date-fns';
import type { DateRange } from 'react-day-picker';

import { getPeriod } from '@/lib/overview-period';

export type ChartCardProps = {
  title: keyof OverviewData;
  type: 'currency' | 'unit';
  selectedDates: DateRange | undefined;
  selectedPeriod: PeriodValue;
  isThumbnail?: boolean;
};

const formattingMap = {
  currency: formatters.currency,
  unit: formatters.unit,
};

export function ChartCard({ title, type, selectedDates, selectedPeriod, isThumbnail }: ChartCardProps) {
  const formatter = formattingMap[type]!;
  const selectedDatesInterval =
    selectedDates?.from && selectedDates?.to ? interval(selectedDates.from, selectedDates.to) : null;
  const allDatesInInterval =
    selectedDates?.from && selectedDates?.to ? eachDayOfInterval(interval(selectedDates.from, selectedDates.to)) : null;
  const prevDates = getPeriod(selectedDates, selectedPeriod);

  const prevDatesInterval = prevDates?.from && prevDates?.to ? interval(prevDates.from, prevDates.to) : null;

  const data = overviews
    .filter((overview) => {
      if (selectedDatesInterval) {
        return isWithinInterval(new Date(overview.date), selectedDatesInterval);
      }
      return true;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const prevData = overviews
    .filter((overview) => {
      if (prevDatesInterval) {
        return isWithinInterval(new Date(overview.date), prevDatesInterval);
      }
      return false;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const chartData = allDatesInInterval
    ?.map((date, index) => {
      const overview = data[index];
      const prevOverview = prevData[index];
      const rowValue = (overview?.[title] as number) || null;
      const previousValue = (prevOverview?.[title] as number) || null;

      return {
        title,
        date,
        formattedDate: formatDate(date, 'dd/MM/yyyy'),
        value: rowValue,
        previousDate: prevOverview?.date,
        previousFormattedDate: prevOverview ? formatDate(prevOverview.date, 'dd/MM/yyyy') : null,
        previousValue: selectedPeriod !== 'no-comparison' ? previousValue : null,
        evolution:
          selectedPeriod !== 'no-comparison' && rowValue && previousValue
            ? (rowValue - previousValue) / previousValue
            : undefined,
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const categories = selectedPeriod === 'no-comparison' ? ['value'] : ['value', 'previousValue'];
  const totalValue = chartData?.reduce((acc, item) => acc + (item.value || 0), 0) || 0;
  const previousTotal = chartData?.reduce((acc, item) => acc + (item.previousValue || 0), 0) || 0;
  const evolution = selectedPeriod !== 'no-comparison' ? (totalValue - previousTotal) / previousTotal : 0;

  return (
    <div className={cn('w-full transition')}>
      <div className='flex items-center justify-between gap-x-2'>
        <div className='flex items-center gap-x-2'>
          <dt className='font-bold text-foreground sm:text-sm'>{title}</dt>
          {selectedPeriod !== 'no-comparison' && (
            <InsightBadge variant={getBadgeType(evolution)}>{percentageFormatter(evolution)}</InsightBadge>
          )}
        </div>
      </div>
      <div className='mt-2 flex items-baseline justify-between'>
        <dd className='text-xl text-foreground'>{formatter(totalValue)}</dd>
        {selectedPeriod !== 'no-comparison' && (
          <dd className='text-sm text-muted-foreground'>from {formatter(previousTotal)}</dd>
        )}
      </div>
      <LineChart
        className='mt-6 h-32 w-full'
        data={chartData || []}
        index='formattedDate'
        colors={['indigo', 'gray']}
        startEndOnly
        valueFormatter={(v) => formatter(v as number)}
        showYAxis={false}
        showLegend={false}
        categories={categories}
        showTooltip={!isThumbnail}
        autoMinValue
      />
    </div>
  );
}
