'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { Info } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@workspace/ui/components/chart';

import { formatters } from '@/lib/utils';
import type { Transaction } from '@/lib/data/schema';

type ChartDataItem = {
  key: string;
  value: number;
};

type ChartType = 'amount' | 'count' | 'category' | 'merchant';

type TransactionChartProps = {
  type: ChartType;
  transactions: Transaction[];
  yAxisWidth?: number;
  showYAxis?: boolean;
  className?: string;
};

const chartConfig = {
  value: {
    label: 'Value',
    color: 'var(--chart-1)',
  },
};

const chartByType = {
  amount: {
    title: 'Total Transaction Amount',
    tooltip: 'Total amount of transactions for the selected period, status, amount range, and location filters.',
    valueFormatter: (value: number) => formatters.currency(value),
    aggregate(rows: Transaction[]): ChartDataItem[] {
      const map = new Map<string, number>();
      for (const transaction of rows) {
        const key = format(transaction.transaction_date, 'yyyy-MM-dd');
        map.set(key, (map.get(key) ?? 0) + transaction.amount);
      }
      return Array.from(map.entries())
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, value]) => ({ key, value }));
    },
  },
  count: {
    title: 'Transaction Count',
    tooltip: 'Total number of transactions matching the selected filters.',
    valueFormatter: (value: number) => formatters.number(value),
    aggregate(rows: Transaction[]): ChartDataItem[] {
      const map = new Map<string, number>();
      for (const transaction of rows) {
        const key = format(transaction.transaction_date, 'yyyy-MM-dd');
        map.set(key, (map.get(key) ?? 0) + 1);
      }
      return Array.from(map.entries())
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, value]) => ({ key, value }));
    },
  },
  category: {
    title: 'Top 5 Categories by Amount',
    tooltip: 'Top categories by total transaction amount after applying the selected filters.',
    valueFormatter: (value: number) => formatters.currency(value),
    aggregate(rows: Transaction[]): ChartDataItem[] {
      const map = new Map<string, number>();
      for (const transaction of rows) {
        map.set(transaction.category, (map.get(transaction.category) ?? 0) + transaction.amount);
      }
      return Array.from(map.entries())
        .sort(([, left], [, right]) => right - left)
        .slice(0, 5)
        .map(([key, value]) => ({ key, value }));
    },
  },
  merchant: {
    title: 'Top 5 Merchants by Amount',
    tooltip: 'Top merchants by total transaction amount after applying the selected filters.',
    valueFormatter: (value: number) => formatters.currency(value),
    aggregate(rows: Transaction[]): ChartDataItem[] {
      const map = new Map<string, number>();
      for (const transaction of rows) {
        map.set(transaction.merchant, (map.get(transaction.merchant) ?? 0) + transaction.amount);
      }
      return Array.from(map.entries())
        .sort(([, left], [, right]) => right - left)
        .slice(0, 5)
        .map(([key, value]) => ({ key, value }));
    },
  },
} as const;

export function TransactionChart({
  type,
  transactions,
  yAxisWidth = 70,
  showYAxis = true,
  className,
}: TransactionChartProps) {
  const definition = chartByType[type];

  const data = useMemo(() => definition.aggregate(transactions), [definition, transactions]);

  const total = useMemo(() => data.reduce((accumulator, current) => accumulator + current.value, 0), [data]);

  const isVertical = type === 'category' || type === 'merchant';

  return (
    <Card className={className}>
      <CardHeader className='gap-2'>
        <div className='flex items-start justify-between gap-3'>
          <CardTitle className='text-sm font-medium text-muted-foreground'>{definition.title}</CardTitle>
          <div className='hidden shrink-0 md:block'>
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type='button'
                    aria-label={`${definition.title} info`}
                    className='rounded-full p-1 text-muted-foreground'
                  >
                    <Info className='size-4' />
                  </button>
                }
              />
              <TooltipContent className='max-w-xs'>{definition.tooltip}</TooltipContent>
            </Tooltip>
          </div>
        </div>
        <p className='text-xs leading-relaxed text-muted-foreground md:hidden'>{definition.tooltip}</p>
        <p className='text-2xl font-semibold text-foreground'>{definition.valueFormatter(total)}</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='h-64 min-h-64 w-full min-w-0'>
          <BarChart data={data} layout={isVertical ? 'vertical' : 'horizontal'}>
            <CartesianGrid vertical={false} />
            {isVertical ? (
              <>
                <XAxis type='number' hide={!showYAxis} />
                <YAxis dataKey='key' type='category' width={yAxisWidth} tickLine={false} axisLine={false} />
              </>
            ) : (
              <>
                <XAxis
                  dataKey='key'
                  tickLine={false}
                  axisLine={false}
                  minTickGap={20}
                  tickFormatter={(value) => format(value, 'dd MMM')}
                />
                <YAxis width={showYAxis ? yAxisWidth : 0} hide={!showYAxis} tickLine={false} axisLine={false} />
              </>
            )}
            <ChartTooltip
              cursor={{ fill: 'hsl(var(--muted))', opacity: 0.25 }}
              content={<ChartTooltipContent valueFormatter={(value) => definition.valueFormatter(Number(value))} />}
            />
            <Bar dataKey='value' fill='var(--color-value)' radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
