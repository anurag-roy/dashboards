import { InsightBadge } from '@workspace/ui/components/insight-badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@workspace/ui/components/chart';
import { getBadgeType } from '@/lib/chart-helpers';
import { overviews } from '@/lib/data/overview-data';
import type { OverviewData } from '@/lib/data/schema';
import { formatters, percentageFormatter } from '@/lib/utils';
import type { PeriodValue } from '@/lib/types/overview';
import { cn } from '@/lib/utils';
import { eachDayOfInterval, formatDate, interval, isWithinInterval, parse } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

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

type TooltipDatum = {
  title?: string;
  evolution?: number;
  formattedDate?: string;
  previousFormattedDate?: string | null;
};

const getTooltipDatum = (value: unknown): TooltipDatum => {
  if (!value || typeof value !== 'object') {
    return {};
  }

  const tooltipPayload = value as Record<string, unknown>;
  return {
    title: typeof tooltipPayload.title === 'string' ? tooltipPayload.title : undefined,
    evolution: typeof tooltipPayload.evolution === 'number' ? tooltipPayload.evolution : undefined,
    formattedDate: typeof tooltipPayload.formattedDate === 'string' ? tooltipPayload.formattedDate : undefined,
    previousFormattedDate:
      typeof tooltipPayload.previousFormattedDate === 'string' ? tooltipPayload.previousFormattedDate : null,
  };
};

export function ChartCard({ title, type, selectedDates, selectedPeriod, isThumbnail }: ChartCardProps) {
  const formatter = formattingMap[type]!;
  const hasComparison = selectedPeriod !== 'no-comparison';
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

  const chartConfig = {
    value: {
      label: 'Current period',
      color: 'var(--chart-1)',
    },
    previousValue: {
      label: 'Comparison period',
      color: 'var(--chart-2)',
    },
  } satisfies ChartConfig;

  const totalValue = chartData?.reduce((acc, item) => acc + (item.value || 0), 0) || 0;
  const previousTotal = chartData?.reduce((acc, item) => acc + (item.previousValue || 0), 0) || 0;
  const evolution = hasComparison ? (totalValue - previousTotal) / previousTotal : 0;

  return (
    <div className={cn('w-full transition')}>
      <div className='flex items-center justify-between gap-x-2'>
        <div className='flex items-center gap-x-2'>
          <dt className='font-bold text-foreground sm:text-sm'>{title}</dt>
          {hasComparison && (
            <InsightBadge variant={getBadgeType(evolution)}>{percentageFormatter(evolution)}</InsightBadge>
          )}
        </div>
      </div>
      <div className='mt-2 flex items-baseline justify-between'>
        <dd className='text-xl text-foreground'>{formatter(totalValue)}</dd>
        {hasComparison && <dd className='text-sm text-muted-foreground'>from {formatter(previousTotal)}</dd>}
      </div>
      <ChartContainer
        config={chartConfig}
        className='mt-6 aspect-auto h-32 w-full'
        initialDimension={{ width: 400, height: 128 }}
      >
        <LineChart
          accessibilityLayer
          data={chartData || []}
          margin={{
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey='formattedDate'
            tickLine={false}
            axisLine={false}
            interval='preserveStartEnd'
            minTickGap={24}
            tickMargin={8}
            tickFormatter={(value) => {
              const parsedDate = parse(String(value), 'dd/MM/yyyy', new Date());
              return Number.isNaN(parsedDate.getTime()) ? String(value) : formatDate(parsedDate, 'd MMM');
            }}
          />
          <YAxis hide />
          {!isThumbnail && (
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator='line'
                  className='min-w-56! gap-0! rounded-2xl border border-border bg-popover p-0! pb-2! text-sm text-popover-foreground shadow-lg ring-0'
                  labelClassName='border-b border-border px-3 py-2.5 !font-medium'
                  labelFormatter={(_, payload) => {
                    const firstPayload = payload?.[0];
                    const tooltipData = getTooltipDatum(firstPayload?.payload);

                    if (!tooltipData.title) {
                      return null;
                    }

                    return (
                      <div className='flex items-start justify-between gap-2'>
                        <span className='text-foreground'>{tooltipData.title}</span>
                        {tooltipData.evolution !== undefined && (
                          <InsightBadge variant={getBadgeType(tooltipData.evolution)}>
                            {percentageFormatter(tooltipData.evolution)}
                          </InsightBadge>
                        )}
                      </div>
                    );
                  }}
                  formatter={(value, name, item) => {
                    const isPreviousValue = String(name) === 'previousValue';
                    const tooltipData = getTooltipDatum(item.payload);
                    const rowLabel = isPreviousValue ? tooltipData.previousFormattedDate : tooltipData.formattedDate;

                    return (
                      <div className='flex w-full items-center justify-between gap-8 px-3 py-0.5'>
                        <div className='flex items-center gap-2'>
                          <span
                            aria-hidden='true'
                            className='h-[3px] w-3.5 shrink-0 rounded-full'
                            style={{
                              backgroundColor:
                                item.color ?? (isPreviousValue ? 'var(--color-previousValue)' : 'var(--color-value)'),
                            }}
                          />
                          <span className='text-muted-foreground'>
                            {rowLabel ?? (isPreviousValue ? 'Comparison period' : 'Current period')}
                          </span>
                        </div>
                        <span className='font-medium text-foreground'>{formatter(Number(value ?? 0))}</span>
                      </div>
                    );
                  }}
                />
              }
            />
          )}
          <Line
            dataKey='value'
            type='monotone'
            stroke='var(--color-value)'
            strokeWidth={2}
            strokeLinecap='round'
            dot={false}
            activeDot={{ r: 4 }}
          />
          {hasComparison && (
            <Line
              dataKey='previousValue'
              type='monotone'
              stroke='var(--color-previousValue)'
              strokeWidth={1.75}
              strokeLinecap='round'
              dot={false}
              activeDot={{ r: 3 }}
            />
          )}
        </LineChart>
      </ChartContainer>
    </div>
  );
}
